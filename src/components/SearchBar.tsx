"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Book } from "@/lib/data";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
  inputClassName?: string;
}

export default function SearchBar({ placeholder = "Kitab, müəllif, yaxud mövzu axtarın...", className = "", isMobile = false, inputClassName = "py-2.5 px-4" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch books on mount
  useEffect(() => {
    const loadBooks = async () => {
      const { data } = await supabase.from('books').select('*');
      if (data) {
        setBooks(data.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          translator: book.translator,
          isbn: book.isbn,
          price: book.price.toString(),
          categorySlugs: book.category_slugs,
          pageCount: book.page_count,
          publishDate: book.publish_date,
          ageCategory: book.age_category,
          coverType: book.cover_type,
          dimensions: book.dimensions,
          description: book.description,
          image: book.image,
          stars: Number(book.stars),
          reviewCount: book.review_count,
          reviews: []
        })));
      }
    };
    loadBooks();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter results from the REAL global books array based on title, author, translator, AND description
  const filteredResults = books.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) || 
      item.author.toLowerCase().includes(q) ||
      (item.translator && item.translator.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  }).slice(0, 10); // Show max 10 results in dropdown

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(val.length > 0);
  };

  const handleSelect = (result: typeof books[0]) => {
    setIsOpen(false);
    setQuery(""); // Clear search after selection
    router.push(`/kitab/${result.id}`);
  };

  return (
    <div ref={wrapperRef} className={`relative flex flex-col ${className}`}>
      
      {/* Search Input Container */}
      <div className={`flex border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-[#f97316] transition-colors bg-white shadow-sm w-full z-10 ${isOpen ? 'rounded-b-none border-b-0' : ''}`}>
        <input 
          type="text" 
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if(query.length > 0) setIsOpen(true) }}
          className={`w-full px-4 focus:outline-none text-gray-700 ${isMobile ? 'py-1.5 text-sm' : 'py-2.5 text-base'}`}
        />
        <button className="bg-[#f97316] px-4 md:px-5 text-white hover:bg-orange-600 transition-colors flex items-center justify-center">
          <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </button>
      </div>

      {/* Dropdown Autocomplete */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-2 border-[#f97316] border-t-0 rounded-b-xl shadow-lg z-50 max-h-[350px] overflow-y-auto">
          {filteredResults.length > 0 ? (
            <ul className="flex flex-col py-2">
              {filteredResults.map((item) => (
                <li 
                  key={item.id} 
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                >
                  {/* Thumbnail Image */}
                  <div className="flex-shrink-0 relative overflow-hidden bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      width={40} 
                      height={60} 
                      className={`object-cover w-[40px] h-[60px]`} 
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#f97316] mb-0.5">Kitab</span>
                    <span className="text-sm font-bold text-gray-800 truncate">{item.title}</span>
                    <span className="text-xs text-gray-500 truncate">{item.author} {item.translator && `(Tərcümə: ${item.translator})`}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500 italic">
              Axtarışınıza uyğun kitab və ya məzmun (açar söz) tapılmadı...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
