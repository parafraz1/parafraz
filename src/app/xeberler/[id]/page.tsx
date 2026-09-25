import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';

async function getNewsItem(id: number) {
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
  if (error || !data) return null;
  return { id: data.id, title: data.title, content: data.content, image: data.image, date: data.date };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const news = await getNewsItem(parseInt(resolvedParams.id));
  if (!news) return { title: 'Xəbər tapılmadı' };
  const optimizedOgImage = `https://wsrv.nl/?url=${encodeURIComponent(news.image)}&w=800&output=jpg&q=70`;

  return {
    title: `${news.title} — Parafr.az`,
    description: news.content?.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: news.title,
      description: news.content?.replace(/<[^>]*>/g, '').slice(0, 160),
      images: [{ url: optimizedOgImage }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.content?.replace(/<[^>]*>/g, '').slice(0, 160),
      images: [optimizedOgImage],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const news = await getNewsItem(parseInt(resolvedParams.id));
  if (!news) notFound();

  return (
    <div className="py-10 px-5 md:px-8 animate-fade-in w-full max-w-[900px] mx-auto bg-white overflow-hidden">
      <Link href="/xeberler" className="text-gray-500 hover:text-[#f97316] transition-colors text-sm font-semibold mb-8 inline-flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        Bütün xəbərlərə qayıt
      </Link>
      
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-orange-100 text-[#f97316] text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Xəbər</span>
        <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {news.date}
        </span>
      </div>
      
      <NewsTitle title={news.title} className="text-lg md:text-xl font-black mb-6 leading-snug tracking-tight" />
      
      <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-8 shadow-sm border border-gray-100">
        <Image src={news.image} alt={news.title} fill className="object-cover" />
      </div>
      
      <div 
        className="prose prose-sm prose-p:!m-0 max-w-none mb-10 text-justify text-gray-700 leading-relaxed break-normal w-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: (news.content || '').replace(/&nbsp;/g, ' ') }}
      />
      
      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-auto md:min-w-[220px]">
          <ShareButton text="Xəbəri paylaş" />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-600 text-sm">Bizi izləyin:</span>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/parafraz_neshrleri/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#E1306C] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm" title="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://www.facebook.com/parafrazneshrleri1/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm" title="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@parafrazneshrleri" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm" title="Tiktok">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/parafraz-neshrleri" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm" title="Linkedin">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://t.me/parafraz_neshrleri" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#229ED9] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm" title="Telegram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
