import React from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 0;

interface CatalogBook {
  id: string;
  title: string;
  image: string;
  description: string;
  pdfAz: string;
  pdfEn: string;
}

export default async function KataloqListPage() {
  const { data } = await supabase.from('pages').select('content').eq('slug', 'catalogs_data').maybeSingle();
  
  let catalogs: CatalogBook[] = [];
  try {
    if (data?.content) {
      catalogs = JSON.parse(data.content);
    }
  } catch(e){}

  if (catalogs.length === 0) {
    return (
      <div className="py-12 px-4 md:px-8 animate-fade-in w-full max-w-[1250px] mx-auto text-center h-[50vh] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider mb-2">Kataloq</h1>
        <p className="text-gray-500">Hal-hazırda heç bir kataloq yüklənməyib.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 animate-fade-in w-full max-w-[1250px] mx-auto">
      <div className="border-b-2 border-[#f97316] mb-8 pb-3 flex justify-between items-end">
        <h1 className="text-[12px] xl:text-[13px] font-bold text-gray-800 uppercase tracking-wider">Kataloq</h1>
        <p className="text-gray-500 text-sm">Ümumi: <span className="font-bold text-[#f97316]">{catalogs.length}</span></p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {catalogs.map(cat => (
          <Link href={`/kataloq/${cat.id}`} key={cat.id} className="group flex flex-col">
            <div className="relative w-full pt-[140%] bg-gray-100 rounded-md overflow-hidden mb-3 border border-gray-200">
              {cat.image ? (
                <Image src={cat.image} alt={cat.title} fill priority sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Şəkil yoxdur</div>
              )}
            </div>
            <h3 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-[#f97316] transition-colors">{cat.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
