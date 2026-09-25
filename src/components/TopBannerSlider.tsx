"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/lib/data";

export default function TopBannerSlider({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="w-full h-[150px] lg:h-[220px] bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg border border-orange-200 flex flex-col items-center justify-center shadow-inner overflow-hidden relative group">
        <span className="text-orange-400 font-bold tracking-widest uppercase text-sm z-10 relative">Reklam / Banner sahəsi</span>
        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/40 transition-colors z-0"></div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="w-full h-[150px] lg:h-[220px] relative rounded-lg overflow-hidden shadow-sm group border border-gray-100">
      <Link href={currentBanner.link || "#"} className={`block w-full h-full ${!currentBanner.link && 'pointer-events-none'}`}>
        <Image 
          key={currentBanner.id}
          src={currentBanner.image} 
          alt={`Banner ${currentIndex + 1}`} 
          fill 
          className="object-cover transition-transform duration-700 animate-fade-in" 
        />
      </Link>
      
      {/* Small dots at the bottom if multiple banners */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1.5 z-20">
          {banners.map((_, i) => (
            <div 
              key={i} 
              onClick={(e) => { e.preventDefault(); setCurrentIndex(i); }}
              className={`h-1.5 rounded-full cursor-pointer transition-all shadow-sm ${i === currentIndex ? 'bg-[#f97316] w-4' : 'bg-white/80 hover:bg-white w-1.5'}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
