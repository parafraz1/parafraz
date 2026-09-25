"use client";
import React, { useState } from 'react';

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultLink, setResultLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  return (
    <div className="bg-white p-6 rounded shadow border border-gray-100 mb-8">
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
          <p className="text-sm text-gray-700 mb-1">Aşağıdakı linki kopyalayıb istədiyiniz yerdə (məsələn Kataloq səhifəsində) istifadə edə bilərsiniz:</p>
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
  );
}
