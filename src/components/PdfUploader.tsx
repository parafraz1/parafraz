"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const IMGBB_API_KEY = "47aba2afb9a71d5c948bbd0af36a55f6";

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultLink, setResultLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [azData, setAzData] = useState({ url: '', image: '', description: '' });
  const [enData, setEnData] = useState({ url: '', image: '', description: '' });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data: azRes } = await supabase.from('pages').select('content').eq('slug', 'kataloq_az_pdf').maybeSingle();
      const { data: enRes } = await supabase.from('pages').select('content').eq('slug', 'kataloq_en_pdf').maybeSingle();
      
      try {
        if (azRes?.content) {
          if (azRes.content.startsWith('{')) setAzData(JSON.parse(azRes.content));
          else setAzData({ url: azRes.content, image: '', description: '' });
        }
        if (enRes?.content) {
          if (enRes.content.startsWith('{')) setEnData(JSON.parse(enRes.content));
          else setEnData({ url: enRes.content, image: '', description: '' });
        }
      } catch (e) {}
    };
    fetchLinks();
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
      const res = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xəta baş verdi');
      setResultLink(data.url || data.downloadUrl);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (file: File, lang: 'az' | 'en') => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        if (lang === 'az') setAzData(p => ({ ...p, image: data.data.url }));
        else setEnData(p => ({ ...p, image: data.data.url }));
      }
    } catch (error) {
      alert("Şəkil yüklənərkən xəta baş verdi.");
    }
  };

  const saveCatalogLinks = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Upsert AZ
      const { data: azExist } = await supabase.from('pages').select('id').eq('slug', 'kataloq_az_pdf').maybeSingle();
      if (azExist) {
        await supabase.from('pages').update({ content: JSON.stringify(azData) }).eq('slug', 'kataloq_az_pdf');
      } else {
        await supabase.from('pages').insert({ slug: 'kataloq_az_pdf', title: 'Kataloq AZ', content: JSON.stringify(azData) });
      }

      // Upsert EN
      const { data: enExist } = await supabase.from('pages').select('id').eq('slug', 'kataloq_en_pdf').maybeSingle();
      if (enExist) {
        await supabase.from('pages').update({ content: JSON.stringify(enData) }).eq('slug', 'kataloq_en_pdf');
      } else {
        await supabase.from('pages').insert({ slug: 'kataloq_en_pdf', title: 'Kataloq EN', content: JSON.stringify(enData) });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Xəta baş verdi!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded shadow border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2">Google Drive-a PDF Yüklə</h3>
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
            {isUploading ? 'Yüklənir...' : 'Yüklə'}
          </button>
        </form>
        {errorMsg && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">{errorMsg}</div>}
        {resultLink && (
          <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
            <p className="text-green-800 font-bold mb-2">✅ Uğurla yükləndi!</p>
            <p className="text-sm text-gray-700 mb-1">Aşağıdakı linki kopyalayıb istədiyiniz yerdə istifadə edə bilərsiniz:</p>
            <div className="flex items-center gap-2 mt-2">
              <input type="text" readOnly value={resultLink} className="flex-1 p-2 text-sm border border-green-300 rounded bg-white outline-none" />
              <button onClick={() => { navigator.clipboard.writeText(resultLink); alert("Link kopyalandı!"); }} className="px-3 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition-colors">Kopyala</button>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Info Section */}
      <div className="bg-white p-6 rounded shadow border border-gray-100 mb-10">
        <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2">Kataloq Səhifəsini Yenilə</h3>
        <p className="text-sm text-gray-500 mb-6">Hər kataloq üçün şəkil, qısa məzmun və PDF linkini təyin edin. Bu məlumatlar saytda kitab kartı kimi görünəcək.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AZ */}
          <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded bg-gray-50">
            <h4 className="font-bold text-[#f97316]">Azərbaycan dilində Kataloq</h4>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kataloq Üz Qabığı (Şəkil)</label>
              <div className="flex items-center gap-4">
                {azData.image && <div className="relative w-16 h-24 border bg-white"><Image src={azData.image} alt="AZ Cover" fill className="object-cover" /></div>}
                <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'az')} className="text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Qısa məlumat</label>
              <textarea value={azData.description} onChange={e => setAzData(p => ({...p, description: e.target.value}))} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316] text-sm h-20" placeholder="Kataloq haqqında qısa məlumat..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">PDF Linki (Drive)</label>
              <input type="text" value={azData.url} onChange={e => setAzData(p => ({...p, url: e.target.value}))} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316] text-sm" placeholder="https://drive.google.com/..." />
            </div>
          </div>

          {/* EN */}
          <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded bg-gray-50">
            <h4 className="font-bold text-[#f97316]">İngilis dilində Kataloq</h4>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kataloq Üz Qabığı (Şəkil)</label>
              <div className="flex items-center gap-4">
                {enData.image && <div className="relative w-16 h-24 border bg-white"><Image src={enData.image} alt="EN Cover" fill className="object-cover" /></div>}
                <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'en')} className="text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Qısa məlumat</label>
              <textarea value={enData.description} onChange={e => setEnData(p => ({...p, description: e.target.value}))} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316] text-sm h-20" placeholder="Kataloq haqqında qısa məlumat..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">PDF Linki (Drive)</label>
              <input type="text" value={enData.url} onChange={e => setEnData(p => ({...p, url: e.target.value}))} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316] text-sm" placeholder="https://drive.google.com/..." />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button onClick={saveCatalogLinks} disabled={isSaving} className="px-6 py-2 bg-gray-800 hover:bg-black text-white font-bold rounded disabled:opacity-50 transition-colors">
            {isSaving ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
          </button>
          {saveSuccess && <p className="text-green-600 font-bold text-sm">✅ Uğurla yadda saxlanıldı!</p>}
        </div>
      </div>
    </div>
  );
}
