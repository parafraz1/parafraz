import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchBookById, fetchBooks, fetchCategories } from "@/lib/data";
import StarRating from "@/components/StarRating";
import BookReviews from "@/components/BookReviews";

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const book = await fetchBookById(parseInt(resolvedParams.id));
  if (!book) return { title: 'Kitab tapılmadı' };
  const optimizedOgImage = `https://wsrv.nl/?url=${encodeURIComponent(book.image)}&w=800&output=jpg&q=70`;

  return {
    title: `${book.title} — Parafr.az`,
    description: book.description?.slice(0, 160),
    openGraph: {
      title: `${book.title} — ${book.author}`,
      description: book.description?.slice(0, 160),
      images: [{ url: optimizedOgImage }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} — ${book.author}`,
      description: book.description?.slice(0, 160),
      images: [optimizedOgImage],
    },
  };
}
import ShareButton from "@/components/ShareButton";
import BookGrid from "@/components/BookGrid";
import Link from "next/link";

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [book, allBooks, categories] = await Promise.all([
    fetchBookById(parseInt(resolvedParams.id)),
    fetchBooks(),
    fetchCategories()
  ]);

  
  if (!book) {
    notFound();
  }
  const recommendedBooks = allBooks
    .filter(b => b.id !== book.id && b.categorySlugs.some(c => book.categorySlugs.includes(c)))
    .slice(0, 5);

  return (
    <div className="py-8 px-4 md:px-8 animate-fade-in w-full max-w-[1100px] mx-auto overflow-hidden">
      
      {/* Top Section: Image & Details */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        
        {/* Left: Image & Share */}
        <div className="w-full md:w-[350px] flex-shrink-0">
          <div className="relative w-full pt-[145%] bg-gray-100 rounded-lg shadow-md overflow-hidden border border-gray-200">
            <Image 
              src={book.image} 
              alt={book.title} 
              fill
              className="object-cover" 
            />
          </div>
          <ShareButton />
        </div>

        {/* Right: Info & Specs */}
        <div className="flex-1 flex flex-col min-w-0">
          <h1 className="text-base md:text-lg font-black text-gray-900 leading-snug mb-3">
            {book.title}
          </h1>
          <p className="text-sm md:text-base font-semibold text-gray-600 mb-5">{book.author}</p>
          
          <div className="flex flex-wrap gap-2 mb-5">
            {book.categorySlugs.filter(slug => slug !== "butun-kitablar" && slug !== "yeni-kitablar").map(slug => {
              const catName = categories.find(c => c.slug === slug)?.name || slug;
              return (
                <Link key={slug} href={`/${slug}`} className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold px-3 py-1 rounded hover:bg-[#f97316] hover:text-white hover:border-[#f97316] transition-colors">
                  {catName}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <StarRating rating={book.stars} count={book.reviewCount} />
            <div className="h-5 w-px bg-gray-300"></div>
            
            {book.discountPrice ? (
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-black text-[#f97316]">{book.discountPrice} ₼</span>
                <span className="text-sm md:text-base font-bold text-gray-400 line-through">{book.price} ₼</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">ENDİRİM</span>
              </div>
            ) : (
              <span className="text-xl md:text-2xl font-black text-[#f97316]">{book.price} ₼</span>
            )}
          </div>

          <div className="mb-10 w-full">
            <h3 className="font-bold text-gray-900 text-[12px] xl:text-[13px] uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              Kitab haqqında
            </h3>
            <div className="prose prose-sm prose-p:!m-0 max-w-none text-justify text-gray-700 leading-relaxed break-normal w-full overflow-hidden" dangerouslySetInnerHTML={{ __html: (book.description || '').replace(/&nbsp;/g, ' ') }} />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-5 mb-8">
            <h3 className="font-bold text-gray-800 uppercase tracking-wide mb-4 border-b border-gray-200 pb-2">Xüsusiyyətləri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">Səhifə sayı:</span>
                <span className="font-semibold text-gray-800">{book.pageCount}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">Nəşr ili:</span>
                <span className="font-semibold text-gray-800">{book.publishDate}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">Yaş kateqoriyası:</span>
                <span className="font-semibold text-gray-800">{book.ageCategory}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">Cildin növü:</span>
                <span className="font-semibold text-gray-800">{book.coverType}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">Ölçüsü:</span>
                <span className="font-semibold text-gray-800">{book.dimensions}{book.dimensions?.includes('sm') ? '' : ' sm'}</span>
              </div>
              {book.translator && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Tərcüməçi:</span>
                  <span className="font-semibold text-gray-800">{book.translator}</span>
                </div>
              )}
              {book.isbn && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">ISBN:</span>
                  <span className="font-semibold text-gray-800">{book.isbn}</span>
                </div>
              )}
              {book.originalName && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Orijinal ad:</span>
                  <span className="font-semibold text-gray-800">{book.originalName}</span>
                </div>
              )}
              {book.editionCount && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Nəşr sayı:</span>
                  <span className="font-semibold text-gray-800">{book.editionCount}</span>
                </div>
              )}
              {book.editionYear1 && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">I nəşr ili:</span>
                  <span className="font-semibold text-gray-800">{book.editionYear1}</span>
                </div>
              )}
              {book.editionYear2 && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">II nəşr ili:</span>
                  <span className="font-semibold text-gray-800">{book.editionYear2}</span>
                </div>
              )}
              {book.editionYear3 && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">III nəşr ili:</span>
                  <span className="font-semibold text-gray-800">{book.editionYear3}</span>
                </div>
              )}
              {book.editionYear4 && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">IV nəşr ili:</span>
                  <span className="font-semibold text-gray-800">{book.editionYear4}</span>
                </div>
              )}
              {book.coverIllustrator && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Cild illüstratoru:</span>
                  <span className="font-semibold text-gray-800">{book.coverIllustrator}</span>
                </div>
              )}
              {book.illustrator && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">İllüstrator:</span>
                  <span className="font-semibold text-gray-800">{book.illustrator}</span>
                </div>
              )}
              {book.artist && (
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Rəssam:</span>
                  <span className="font-semibold text-gray-800">{book.artist}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Block */}
          <div className="flex items-center gap-4 mt-auto">
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

      {/* Reviews Section */}
      <BookReviews initialReviews={book.reviews} bookId={book.id} />

      {/* Recommended Books */}
      {recommendedBooks.length > 0 && (
        <div className="mt-20">
          <h2 className="text-[12px] xl:text-[13px] font-bold tracking-wider text-gray-800 uppercase border-b-2 border-[#f97316] pb-2 mb-6 inline-block">
            Tövsiyə olunan nəşrlər
          </h2>
          <BookGrid books={recommendedBooks} />
        </div>
      )}

    </div>
  );
}
