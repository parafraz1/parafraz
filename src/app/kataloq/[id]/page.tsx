import React from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface CatalogBook {
  id: string;
  title: string;
  image: string;
  description: string;
  pdfAz: string;
  pdfEn: string;
}

export default async function KataloqDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { data } = await supabase.from('pages').select('content').eq('slug', 'catalogs_data').maybeSingle();
  
  let catalogs: CatalogBook[] = [];
  try {
    if (data?.content) {
      catalogs = JSON.parse(data.content);
    }
  } catch(e){}

  const catalog = catalogs.find(c => c.id === resolvedParams.id);

  if (!catalog) {
    notFound();
  }

  return (
    <div className="py-8 px-4 md:px-8 animate-fade-in w-full max-w-[1250px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-8 pb-3 border-b border-gray-100">
        <Link href="/" className="hover:text-[#f97316] transition-colors uppercase font-bold">ƏSAS SƏHİFƏ</Link>
        <span>/</span>
        <Link href="/kataloq" className="hover:text-[#f97316] transition-colors uppercase font-bold">KATALOQ</Link>
        <span>/</span>
        <span className="text-gray-800 uppercase font-bold truncate">{catalog.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left: Cover */}
        <div className="w-full md:w-[300px] lg:w-[400px] flex-shrink-0">
          <div className="relative w-full pt-[140%] bg-gray-100 rounded-md overflow-hidden border border-gray-200 shadow-md">
            {catalog.image ? (
              <Image src={catalog.image} alt={catalog.title} fill priority sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">Şəkil yoxdur</div>
            )}
          </div>
        </div>

        {/* Right: Info and Buttons */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-6 uppercase tracking-wider leading-tight">
            {catalog.title}
          </h1>

          <div className="prose prose-sm text-gray-700 max-w-none mb-10 leading-relaxed text-justify">
            {catalog.description.split('\n').map((para, idx) => (
              <p key={idx} className="mb-2">{para}</p>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* AZ Block */}
            <div className="flex flex-col gap-3 p-5 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm border-b border-gray-200 pb-2">Azərbaycan dilində</h3>
              <div className="flex flex-col gap-2">
                {catalog.pdfAz ? (
                  <>
                    <a href={catalog.pdfAz} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-gray-800 text-white font-bold text-sm rounded hover:bg-black transition-colors text-center">
                      Burada Oxu
                    </a>
                    <a href={catalog.pdfAz} download target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-[#f97316] text-white font-bold text-sm rounded hover:bg-orange-600 transition-colors text-center flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Endir
                    </a>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm italic py-2">Fayl yüklənməyib</p>
                )}
              </div>
            </div>

            {/* EN Block */}
            <div className="flex flex-col gap-3 p-5 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm border-b border-gray-200 pb-2">İngilis dilində</h3>
              <div className="flex flex-col gap-2">
                {catalog.pdfEn ? (
                  <>
                    <a href={catalog.pdfEn} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-gray-800 text-white font-bold text-sm rounded hover:bg-black transition-colors text-center">
                      Burada Oxu
                    </a>
                    <a href={catalog.pdfEn} download target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-[#f97316] text-white font-bold text-sm rounded hover:bg-orange-600 transition-colors text-center flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Endir
                    </a>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm italic py-2">Fayl yüklənməyib</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
