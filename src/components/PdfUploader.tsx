"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const IMGBB_API_KEY = "47aba2afb9a71d5c948bbd0af36a55f6";

interface CatalogBook {
  id: string;
  title: string;
  image: string;
  description: string;
  pdfAz: string;
  pdfEn: string;
}

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultLink, setResultLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [catalogs, setCatalogs] = useState<CatalogBook[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [pdfAz, setPdfAz] = useState('');
  const [pdfEn, setPdfEn] = useState('');

  useEffect(() => {
    const fetchCatalogs = async () => {
      const { data } = await supabase.from('pages').select('content').eq('slug', 'catalogs_data').maybeSingle();
      if (data?.content) {
        try {
          setCatalogs(JSON.parse(data.content));
        } catch (e) {}
      }
    };
    fetchCatalogs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    setErrorMsg('');
    setResultLink('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-pdf', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xəta baş verdi');
      setResultLink(data.url || data.downloadUrl);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setImage(data.data.url);
      }
    } catch (error) {
      alert("Şəkil yüklənərkən xəta baş verdi.");
    }
  };

  const saveToDb = async (newCatalogs: CatalogBook[]) => {
    const { data: exist } = await supabase.from('pages').select('id').eq('slug', 'catalogs_data').maybeSingle();
    let err = null;
    if (exist) {
      const { error } = await supabase.from('pages').update({ content: JSON.stringify(newCatalogs) }).eq('slug', 'catalogs_data');
      err = error;
    } else {
      // Use a random large ID to avoid sequence conflicts (pages_pkey violation)
      const randomId = Math.floor(Math.random() * 900000) + 100000;
      const { error } = await supabase.from('pages').insert({ id: randomId, slug: 'catalogs_data', title: 'Catalogs List', content: JSON.stringify(newCatalogs) });
      err = error;
    }
    if (err) {
      console.error(err);
      alert("Bazada yadda saxlamaq mümkün olmadı: " + err.message);
      throw err;
    }
  };

  const handleAddOrUpdate = async () => {
    if (!title || !image) {
      alert("Kataloqun adı və şəkli mütləqdir!");
      return;
    }
    
    setIsSaving(true);
    let newCatalogs = [...catalogs];

    if (editingCatId) {
      newCatalogs = newCatalogs.map(c => c.id === editingCatId ? { id: c.id, title, image, description, pdfAz, pdfEn } : c);
    } else {
      const newCat: CatalogBook = {
        id: Date.now().toString(),
        title, image, description, pdfAz, pdfEn
      };
      newCatalogs.push(newCat);
    }

    try {
      await saveToDb(newCatalogs);
      setCatalogs(newCatalogs);
      setEditingCatId(null);
      setTitle(''); setImage(''); setDescription(''); setPdfAz(''); setPdfEn('');
    } catch (e) {
      // alert handled
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (cat: CatalogBook) => {
    setEditingCatId(cat.id);
    setTitle(cat.title);
    setImage(cat.image);
    setDescription(cat.description);
    setPdfAz(cat.pdfAz);
    setPdfEn(cat.pdfEn);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    const newCatalogs = catalogs.filter(c => c.id !== id);
    try {
      await saveToDb(newCatalogs);
      setCatalogs(newCatalogs);
    } catch (e) {
      // alert is handled in saveToDb
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Utility: Upload PDF to get link */}
      <div className="bg-white p-6 rounded shadow border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2">1. Google Drive-a PDF Yüklə (Link almaq üçün)</h3>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fayl seçin (PDF)</label>
            <input 
              type="file" accept="application/pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#f97316] hover:file:bg-orange-100"
            />
          </div>
          <button type="submit" disabled={!file || isUploading} className="w-max px-6 py-2 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded disabled:opacity-50 transition-colors">
            {isUploading ? 'Yüklənir...' : 'Yüklə & Link Al'}
          </button>
        </form>
        {errorMsg && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">{errorMsg}</div>}
        {resultLink && (
          <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
            <p className="text-green-800 font-bold mb-2">✅ Uğurla yükləndi!</p>
            <div className="flex items-center gap-2 mt-2">
              <input type="text" readOnly value={resultLink} className="flex-1 p-2 text-sm border border-green-300 rounded bg-white outline-none" />
              <button onClick={() => { navigator.clipboard.writeText(resultLink); alert("Link kopyalandı!"); }} className="px-3 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition-colors">Kopyala</button>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Manager */}
      <div className="bg-white p-6 rounded shadow border border-gray-100 mb-10">
        <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2">2. Kataloq Kitablarını İdarə Et</h3>
        
        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-200 rounded mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kitabın Adı</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="Məs: Xüsusi Nəşrlər Kataloqu 2024" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Şəkil (Üz qabığı)</label>
            <div className="flex items-center gap-4">
              {image && <div className="relative w-12 h-16 border bg-white"><Image src={image} alt="Cover" fill className="object-cover" /></div>}
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="text-sm" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Haqqında Məlumat</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm h-20" placeholder="Qısa məlumat..." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">AZ PDF Linki</label>
            <input type="text" value={pdfAz} onChange={e => setPdfAz(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="Drive linki (AZ)..." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">EN PDF Linki</label>
            <input type="text" value={pdfEn} onChange={e => setPdfEn(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="Drive linki (EN)..." />
          </div>

          <div className="md:col-span-2 flex gap-3 mt-2">
            <button onClick={handleAddOrUpdate} disabled={isSaving} className="px-6 py-2 bg-gray-800 hover:bg-black text-white font-bold rounded text-sm disabled:opacity-50 transition-colors">
              {isSaving ? 'Gözləyin...' : (editingCatId ? 'Yenilə' : 'Kataloqa Əlavə Et')}
            </button>
            {editingCatId && (
              <button onClick={() => { setEditingCatId(null); setTitle(''); setImage(''); setDescription(''); setPdfAz(''); setPdfEn(''); }} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded text-sm transition-colors">
                Ləğv Et
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div>
          <h4 className="font-bold text-gray-700 mb-3">Mövcud Kataloqlar ({catalogs.length})</h4>
          <div className="flex flex-col gap-3">
            {catalogs.length === 0 && <p className="text-sm text-gray-500">Heç bir kataloq əlavə edilməyib.</p>}
            {catalogs.map(cat => (
              <div key={cat.id} className="flex gap-4 items-center p-3 border border-gray-100 rounded bg-white shadow-sm">
                <div className="relative w-12 h-16 flex-shrink-0 bg-gray-100 border border-gray-200">
                  <Image src={cat.image} alt={cat.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-gray-800 truncate">{cat.title}</h5>
                  <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(cat)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded font-bold text-xs hover:bg-blue-100">Düzənlə</button>
                  <button onClick={() => handleDelete(cat.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded font-bold text-xs hover:bg-red-100">Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
