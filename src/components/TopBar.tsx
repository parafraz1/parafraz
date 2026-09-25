import React from 'react';
import SearchBar from './SearchBar';

interface TopBarProps {
  socials: { name: string; href: string }[];
  SocialIcon: React.FC<{ name: string }>;
}

export default function TopBar({ socials, SocialIcon }: TopBarProps) {
  return (
    <div className="w-full bg-[#f97316] text-white py-1">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 flex justify-between items-center h-10">
        
        {/* Left: Socials */}
        <div className="flex items-center gap-3">
          {socials.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 transition-colors"
              title={item.name}
            >
              <SocialIcon name={item.name} />
            </a>
          ))}
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <SearchBar placeholder="Kitab, müəllif, yaxud mövzu axtarın..." className="w-full text-black h-8" inputClassName="py-1 px-3 text-sm" />
        </div>

        {/* Right: Contact Info */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <a href="mailto:info@parafraz.site" className="flex items-center gap-1.5 hover:text-gray-200 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span className="hidden sm:inline">info@parafraz.site</span>
          </a>
          <div className="hidden sm:block border-l border-white/30 h-4"></div>
          <a href="tel:+994709201855" className="flex items-center gap-1.5 hover:text-gray-200 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="hidden sm:inline">+994 70 920 18 55</span>
          </a>
        </div>

      </div>
    </div>
  );
}
