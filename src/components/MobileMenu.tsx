"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ScrollLink from "./ScrollLink";
import SearchBar from "./SearchBar";

interface MobileMenuProps {
  topNavigation: { name: string; href: string }[];
  socials: { name: string; href: string }[];
}

export default function MobileMenu({ topNavigation, socials }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const SocialIcon = ({ name }: { name: string }) => {
    if (name === "Instagram") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
    if (name === "Facebook") return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
    if (name === "Tiktok") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
    if (name === "Linkedin") return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
    if (name === "Telegram") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
    return null;
  };

  return (
    <>
      <div className="flex items-center gap-3 w-full relative z-[60]">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 bg-gray-100 rounded text-gray-700 hover:bg-orange-100 hover:text-[#f97316] transition-colors flex-shrink-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Mobile Search */}
        <SearchBar className="flex-1" isMobile={true} />
      </div>

      {/* FULL SCREEN MENU */}
      <div 
        className={`fixed inset-0 bg-white z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-5 bg-[#f97316] text-white flex justify-between items-center shadow-md">
          <span className="font-bold text-2xl tracking-wider">Parafr.az</span>
          <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform duration-300 p-1">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col pb-10">
          
          {/* Navigation Links */}
          <div className="flex flex-col py-6 items-center border-b border-gray-100 w-full">
            {topNavigation.map((item) => (
              <div key={item.name} className="w-full text-center">
                {item.name === "Ana səhifə" ? (
                  <ScrollLink 
                    href="/" 
                    className="block py-4 text-xl font-bold text-gray-800 hover:text-[#f97316] uppercase transition-colors"
                  >
                    <span onClick={() => setIsOpen(false)}>{item.name}</span>
                  </ScrollLink>
                ) : (
                  <Link 
                    href={item.href} 
                    className="block py-4 text-xl font-bold text-gray-800 hover:text-[#f97316] uppercase transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="px-6 py-8 border-b border-gray-100 flex flex-col items-center text-center">
            <h3 className="text-gray-400 text-sm font-bold uppercase mb-6 tracking-widest">Əlaqə</h3>
            <ul className="flex flex-col gap-6 items-center w-full">
              <li className="flex flex-col items-center gap-2">
                <span className="text-[#f97316] mb-1">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <a href="tel:+994709201855" className="text-xl font-semibold text-gray-700">+994 70 920 18 55</a>
                <a href="tel:+994554791602" className="text-xl font-semibold text-gray-700">+994 55 479 16 02</a>
              </li>
              <li className="flex flex-col items-center gap-2 mt-4">
                <span className="text-[#f97316] mb-1">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <a href="mailto:info@parafraz.site" className="text-lg font-semibold text-gray-700 break-all">info@parafraz.site</a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="px-6 py-8 flex flex-col items-center text-center">
            <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 tracking-widest">Sosial Şəbəkələr</h3>
            <div className="flex gap-3 justify-center flex-nowrap w-full overflow-x-auto pb-2 px-2">
              {socials.map((item) => {
                let colorClass = "text-gray-500";
                if(item.name === "Instagram") colorClass = "text-[#E1306C]";
                if(item.name === "Facebook") colorClass = "text-[#1877F2]";
                if(item.name === "Tiktok") colorClass = "text-black";
                if(item.name === "Linkedin") colorClass = "text-[#0077B5]";
                if(item.name === "Telegram") colorClass = "text-[#229ED9]";
                
                return (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${colorClass} hover:scale-110 transform transition-all bg-gray-50 p-2.5 rounded-full shadow-sm flex-shrink-0`}
                    title={item.name}
                  >
                    <SocialIcon name={item.name} />
                  </a>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
