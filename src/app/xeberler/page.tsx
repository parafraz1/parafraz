import React from "react";
import Image from "next/image";
import Link from "next/link";
import NewsTitle from "@/components/NewsTitle";
import { fetchNews } from "@/lib/data";

export default async function XeberlerPage() {
  const news = await fetchNews();

  return (
    <div className="py-8 px-4 md:px-8 animate-fade-in w-full max-w-[1250px] mx-auto overflow-hidden">
      <div className="border-b-2 border-[#f97316] mb-8 pb-3">
        <h1 className="text-[12px] xl:text-[13px] font-bold text-gray-800 uppercase tracking-wider">Xəbərlər və Məqalələr</h1>
      </div>

      {news.length === 0 ? (
        <p className="text-gray-500 italic">Hazırda heç bir xəbər yoxdur.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map(n => (
            <Link key={n.id} href={`/xeberler/${n.id}`} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className="relative w-full aspect-video bg-gray-100">
                <Image src={n.image} alt={n.title} fill className="object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[#f97316] text-xs font-bold mb-2">{n.date}</span>
                <NewsTitle title={n.title} className="text-[12px] xl:text-[13px] uppercase font-bold mb-3 leading-snug line-clamp-2" />
                <div className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1" dangerouslySetInnerHTML={{ __html: n.content }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
