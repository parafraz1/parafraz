"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultLink, setResultLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [azLink, setAzLink] = useState('');
  const [enLink, setEnLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data: azData } = await supabase.from('pages').select('content').eq('slug', 'kataloq_az_pdf').single();
      const { data: enData } = await supabase.from('pages').select('content').eq('slug', 'kataloq_en_pdf').single();
      if (azData) setAzLink(azData.content);
      if (enData) setEnLink(enData.content);
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
      
      if (!res.ok) {
        throw new Error(data.error || 'Xəta baş verdi');
      }

      setResultLink(data.url || data.downloadUrl);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const saveCatalogLinks = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Upsert AZ
      const { data: azExist } = await supabase.from('pages').select('id').eq('slug', 'kataloq_az_pdf').single();
      if (azExist) {
        await supabase.from('pages').update({ content: azLink }).eq('slug', 'kataloq_az_pdf');
      } else {
        await supabase.from('pages').insert({ slug: 'kataloq_az_pdf', title: 'Kataloq AZ', content: azLink });
      }

      // Upsert EN
      const { data: enExist } = await supabase.from('pages').select('id').eq('slug', 'kataloq_en_pdf').single();
      if (enExist) {
        await supabase.from('pages').update({ content: enLink }).eq('slug', 'kataloq_en_pdf');
      } else {
        await supabase.from('pages').insert({ slug: 'kataloq_en_pdf', title: 'Kataloq EN', content: enLink });
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
              type="file" 
              accept="application/pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#f97316] hover:file:bg-orange-100"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!file || isUploading}
            className="w-max px-6 py-2 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded disabled:opacity-50 transition-colors"
          >
            {isUploading ? 'Yüklənir...' : 'Yüklə'}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {errorMsg}
          </div>
        )}

        {resultLink && (
          <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
            <p className="text-green-800 font-bold mb-2">✅ Uğurla yükləndi!</p>
            <p className="text-sm text-gray-700 mb-1">Aşağıdakı linki kopyalayıb istədiyiniz yerdə istifadə edə bilərsiniz:</p>
            <div className="flex items-center gap-2 mt-2">
              <input type="text" readOnly value={resultLink} className="flex-1 p-2 text-sm border border-green-300 rounded bg-white outline-none" />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(resultLink);
                  alert("Link kopyalandı!");
                }}
                className="px-3 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition-colors"
              >
                Kopyala
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Links Section */}
      <div className="bg-white p-6 rounded shadow border border-gray-100 mb-10">
        <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2">Kataloq Səhifəsini Yenilə</h3>
        <p className="text-sm text-gray-500 mb-6">Yuxarıda yüklədiyiniz PDF-lərin linkini bura yapışdırın ki, saytın "Kataloq" bölməsində həmin PDF-lər görünsün.</p>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Azərbaycan dili (Link)</label>
            <input 
              type="text" 
              value={azLink} 
              onChange={e => setAzLink(e.target.value)} 
              placeholder="Google Drive linki..." 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">İngilis dili (Link)</label>
            <input 
              type="text" 
              value={enLink} 
              onChange={e => setEnLink(e.target.value)} 
              placeholder="Google Drive linki..." 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316]"
            />
          </div>
          <button 
            onClick={saveCatalogLinks}
            disabled={isSaving}
            className="w-max px-6 py-2 bg-gray-800 hover:bg-black text-white font-bold rounded disabled:opacity-50 transition-colors mt-2"
          >
            {isSaving ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
          </button>
          
          {saveSuccess && <p className="text-green-600 font-bold text-sm mt-2">✅ Uğurla yadda saxlanıldı!</p>}
        </div>
      </div>
    </div>
  );
}
