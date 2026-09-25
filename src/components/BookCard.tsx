import React from "react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import { Book } from "@/lib/data";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link 
      href={`/kitab/${book.id}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer relative"
    >
      <div className="relative w-full pt-[140%] bg-gray-100 overflow-hidden">
        <Image 
          src={book.image} 
          alt={book.title} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700" 
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {book.discountPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
            ENDİRİM
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-[15px] leading-tight mb-1 group-hover:text-[#f97316] transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-500 text-xs mb-2 truncate">{book.author}</p>
        
        <div className="mt-auto flex flex-col gap-2">
          <StarRating rating={book.stars} count={book.reviewCount} />
          <div className="flex items-end justify-between mt-1">
            {book.discountPrice ? (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#f97316] text-lg">{book.discountPrice} ₼</span>
                <span className="text-xs text-gray-400 line-through">{book.price} ₼</span>
              </div>
            ) : (
              <span className="font-bold text-[#f97316] text-lg">{book.price} ₼</span>
            )}
            <div className="bg-orange-50 p-1.5 rounded-full text-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
