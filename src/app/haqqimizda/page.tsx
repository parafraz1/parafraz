import { fetchPage } from "@/lib/data";

export default async function Haqqimizda() {
  const page = await fetchPage('haqqimizda');
  
  return (
    <div className="w-full bg-white animate-fade-in py-8">
      <div className="max-w-[800px] mx-auto px-4">
        
        <div className="border-b border-gray-300 mb-8 pb-3 flex items-center justify-between group">
          <h1 className="text-gray-800 text-2xl uppercase font-bold tracking-wide">{page?.title || 'Haqqımızda'}</h1>
          <div className="h-[2px] w-24 bg-[#f97316] relative top-[15px]"></div>
        </div>

        <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
          <div dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
                 </div>

      </div>
    </div>
  );
}
