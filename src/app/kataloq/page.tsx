import React from 'react';

export default function KataloqPage() {
  return (
    <div className="py-8 px-4 md:px-8 animate-fade-in w-full max-w-[1250px] mx-auto">
      <div className="border-b-2 border-[#f97316] mb-8 pb-3 flex justify-between items-end">
        <h1 className="text-[12px] xl:text-[13px] font-bold text-gray-800 uppercase tracking-wider">Kataloq</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[800px]">
        {/* AZ PDF */}
        <div className="flex flex-col h-full bg-white p-4 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Azərbaycan dilində</h2>
            <a href="/Kataloq_AZ.pdf" download className="bg-[#f97316] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Yüklə
            </a>
          </div>
          <div className="flex-1 rounded border border-gray-200 overflow-hidden bg-gray-50">
            <object data="/Kataloq_AZ.pdf" type="application/pdf" className="w-full h-full">
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
                <p>PDF faylını göstərmək mümkün olmadı.</p>
                <a href="/Kataloq_AZ.pdf" download className="text-[#f97316] underline">Birbaşa yükləyin</a>
              </div>
            </object>
          </div>
        </div>

        {/* EN PDF */}
        <div className="flex flex-col h-full bg-white p-4 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">English</h2>
            <a href="/Kataloq_EN.pdf" download className="bg-[#f97316] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </a>
          </div>
          <div className="flex-1 rounded border border-gray-200 overflow-hidden bg-gray-50">
            <object data="/Kataloq_EN.pdf" type="application/pdf" className="w-full h-full">
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
                <p>PDF could not be displayed.</p>
                <a href="/Kataloq_EN.pdf" download className="text-[#f97316] underline">Download directly</a>
              </div>
            </object>
          </div>
        </div>
      </div>
    </div>
  );
}
