"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/lib/data";

export default function HomeSlider({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="w-full aspect-[16/9] md:h-[450px] lg:h-[500px] md:aspect-auto bg-gray-100 border border-gray-200 mb-8 rounded-lg flex flex-col items-center justify-center shadow-sm overflow-hidden group cursor-pointer relative">
        <span className="text-gray-400 font-bold tracking-widest uppercase text-sm md:text-lg text-center px-4">
          Admin paneldən Slayder (Banner) əlavə edin
        </span>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="mb-8">
      {/* Banner Display */}
      <Link href={currentBanner.link || "#"} className={`block w-full aspect-[16/9] md:h-[450px] lg:h-[500px] md:aspect-auto bg-gray-100 mb-2 rounded-lg flex flex-col items-center justify-center shadow-sm overflow-hidden group cursor-pointer relative ${!currentBanner.link && 'pointer-events-none'}`}>
        <Image 
          key={currentBanner.id}
          src={currentBanner.image} 
          alt={`Banner ${currentIndex + 1}`} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700 animate-fade-in" 
        />
      </Link>

      {/* Pagination Bars */}
      {banners.length > 1 && (
        <div className="w-full flex gap-2 overflow-hidden mt-3">
          {banners.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 md:h-2 flex-1 rounded cursor-pointer transition-colors ${i === currentIndex ? 'bg-[#f97316]' : 'bg-gray-200 hover:bg-gray-300'}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
