import React from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export const revalidate = 0;

export default async function KataloqPage() {
  const { data: azDataRes } = await supabase.from('pages').select('content').eq('slug', 'kataloq_az_pdf').maybeSingle();
  const { data: enDataRes } = await supabase.from('pages').select('content').eq('slug', 'kataloq_en_pdf').maybeSingle();

  let azData = { url: '/Kataloq_AZ.pdf', image: '/Logo.png', description: 'Azərbaycan dilində nəşrlərimizin tam siyahısı ilə tanış olun.' };
  let enData = { url: '/Kataloq_EN.pdf', image: '/Logo.png', description: 'Explore the full list of our publications in English.' };

  try {
    if (azDataRes?.content) {
      if (azDataRes.content.startsWith('{')) azData = { ...azData, ...JSON.parse(azDataRes.content) };
      else azData.url = azDataRes.content;
    }
    if (enDataRes?.content) {
      if (enDataRes.content.startsWith('{')) enData = { ...enData, ...JSON.parse(enDataRes.content) };
      else enData.url = enDataRes.content;
    }
  } catch(e){}

  const renderCatalogCard = (title: string, data: typeof azData) => (
    <div className="group flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Cover Image */}
      <div className="relative w-full pt-[140%] bg-gray-50 border-b border-gray-100">
        <Image 
          src={data.image || '/Logo.png'} 
          alt={title} 
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" 
        />
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h2 className="font-black text-gray-800 text-xl md:text-2xl mb-3 uppercase tracking-wider">{title}</h2>
        <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">
          {data.description}
        </p>
        
        {/* Actions */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-800 text-white px-4 py-2.5 rounded font-bold text-center hover:bg-black transition-colors text-sm">
            Onlayn Oxu
          </a>
          <a href={data.url} target="_blank" rel="noopener noreferrer" download className="flex-1 bg-[#f97316] text-white px-4 py-2.5 rounded font-bold text-center hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Yüklə
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-12 px-4 md:px-8 animate-fade-in w-full max-w-[1000px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-wider mb-4">Nəşriyyat Kataloqlarımız</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Yeni nəşrlərimiz və bütün kitablarımızın siyahısı ilə ətraflı tanış olmaq üçün kataloqlarımızı onlayn oxuya və ya yükləyə bilərsiniz.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
        {renderCatalogCard("Azərbaycan", azData)}
        {renderCatalogCard("English", enData)}
      </div>
    </div>
  );
}
