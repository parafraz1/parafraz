import React from 'react';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable caching so it always gets the latest URLs

export default async function KataloqPage() {
  // Fetch URLs from Supabase 'pages' table (using content field to store URL)
  // We use slugs 'kataloq_az_pdf' and 'kataloq_en_pdf'
  const { data: azData } = await supabase.from('pages').select('content').eq('slug', 'kataloq_az_pdf').maybeSingle();
  const { data: enData } = await supabase.from('pages').select('content').eq('slug', 'kataloq_en_pdf').maybeSingle();

  const azUrl = azData?.content || '/Kataloq_AZ.pdf';
  const enUrl = enData?.content || '/Kataloq_EN.pdf';

  return (
    <div className="py-8 px-4 md:px-8 animate-fade-in w-full max-w-[1250px] mx-auto">
      <div className="border-b-2 border-[#f97316] mb-8 pb-3 flex justify-between items-end">
        <h1 className="text-[12px] xl:text-[13px] font-bold text-gray-800 uppercase tracking-wider">Kataloq</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[800px]">
        {/* AZ PDF */}
        <div className="flex flex-col h-full bg-white p-4 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[12px] xl:text-[13px] uppercase tracking-wider font-bold text-gray-800">Azərbaycan dilində</h2>
            <a href={azUrl} target="_blank" rel="noopener noreferrer" className="bg-[#f97316] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Yüklə
            </a>
          </div>
          <div className="flex-1 rounded border border-gray-200 overflow-hidden bg-gray-50">
            <iframe src={azUrl} className="w-full h-full border-none"></iframe>
          </div>
        </div>

        {/* EN PDF */}
        <div className="flex flex-col h-full bg-white p-4 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[12px] xl:text-[13px] uppercase tracking-wider font-bold text-gray-800">English</h2>
            <a href={enUrl} target="_blank" rel="noopener noreferrer" className="bg-[#f97316] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </a>
          </div>
          <div className="flex-1 rounded border border-gray-200 overflow-hidden bg-gray-50">
            <iframe src={enUrl} className="w-full h-full border-none"></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
