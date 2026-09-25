import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import ScrollLink from "@/components/ScrollLink";
import MobileMenu from "@/components/MobileMenu";
import SearchBar from "@/components/SearchBar";
import { fetchNavItems, fetchFooterLinks, fetchBanners } from "@/lib/data";
import TopBannerSlider from "@/components/TopBannerSlider";
import TopBar from "@/components/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL("https://parafraz.vercel.app"),
  title: "Parafraz Nəşrləri",
  description: "Parafraz Nəşrləri - Rəsmi Veb Səhifəsi",
  verification: {
    google: "Q6Nx0mDR7d8TiwVMXD3G6qF9xyRSj_BX1MiKk7KKSKs",
  },
  openGraph: {
    title: "Parafraz Nəşrləri",
    description: "Parafraz Nəşrləri - Rəsmi Veb Səhifəsi",
    url: "https://parafraz.vercel.app",
    siteName: "Parafraz Nəşrləri",
    images: [{ url: "https://parafraz.vercel.app/Logo.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export const categories = [
  "Sandıq seriyası",
  "Klassiklər",
  "Yeni kitablar",
  "Detektiv",
  "Şəxsi inkişaf",
  "Elmi-kütləvi",
];

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/parafraz_neshrleri/" },
  { name: "Facebook", href: "https://www.facebook.com/parafrazneshrleri1/" },
  { name: "Tiktok", href: "https://www.tiktok.com/@parafrazneshrleri" },
  { name: "Linkedin", href: "https://www.linkedin.com/company/parafraz-neshrleri" },
  { name: "Telegram", href: "https://t.me/parafraz_neshrleri" },
];

function SocialIcon({ name }: { name: string }) {
  if (name === "Instagram") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
  if (name === "Facebook") return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
  if (name === "Tiktok") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
  if (name === "Linkedin") return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
  if (name === "Telegram") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [topNavigation, footerLinks, banners] = await Promise.all([
    fetchNavItems(),
    fetchFooterLinks(),
    fetchBanners()
  ]);
  
  return (
    <html lang="az">
      <body className={`${inter.className} bg-white text-black min-h-screen flex flex-col antialiased relative overflow-x-hidden`}>
        
        {/* Header Container */}
        <div className="relative z-50 w-full shadow-sm bg-white border-b border-gray-200">
          <TopBar socials={socials} SocialIcon={SocialIcon} />

          
          {/* MOBILE HEADER - Slimmed down padding and logo height */}
          <div className="md:hidden flex flex-col w-full px-4 pt-3 pb-2">
            <div className="flex justify-between items-center w-full mb-3 relative">
              <div className="flex items-center gap-1 z-10">
                <ScrollLink href="/">
                  <Image src="/Logo.png" alt="Parafraz" width={100} height={100} className="h-[40px] w-auto object-contain" priority />
                </ScrollLink>
                <span className="text-[#f97316] font-extrabold text-[8px] sm:text-[10px] leading-[1.15] uppercase">Sözlərin<br/>sirrini<br/>aç!</span>
              </div>
              
              {/* Centered Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <ScrollLink href="/" className="pointer-events-auto">
                  <h1 className="text-xl sm:text-2xl font-black text-[#f97316]">Parafr.az</h1>
                </ScrollLink>
              </div>

              <div className="flex items-center gap-1 z-10">
                <span className="text-[#f97316] font-extrabold text-[8px] sm:text-[10px] leading-[1.15] uppercase text-right hidden sm:block">Mütaliənin<br/>şirin<br/>dadı</span>
                <Link href="/naringi-neshrleri">
                  <Image src="/Logo2.png" alt="Naringi" width={100} height={100} className="h-[40px] w-auto object-contain" />
                </Link>
              </div>
            </div>
            {/* Bottom row: Hamburger Menu + Search Center */}
            <MobileMenu topNavigation={topNavigation} socials={socials} />
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden md:flex flex-col w-full">
            <div className="max-w-[1450px] mx-auto w-full px-4 lg:px-6 py-3 flex justify-between items-center gap-2">
              
              {/* Left Logo + Text */}
              <div className="flex flex-shrink-0 items-center gap-1 lg:gap-2">
                <ScrollLink href="/">
                  <Image src="/Logo.png" alt="Parafraz Nəşrləri" width={140} height={140} className="h-[75px] lg:h-[95px] w-auto object-contain transition-transform duration-300 hover:scale-105" priority />
                </ScrollLink>
                <span className="text-[#f97316] font-extrabold text-[10px] lg:text-[12px] leading-[1.15] uppercase hidden lg:block">Sözlərin<br/>sirrini<br/>aç!</span>
              </div>

              {/* Center Banner Placeholder */}
              <div className="flex-1 w-full hidden md:flex items-center justify-center mx-8 lg:mx-16">
                <TopBannerSlider banners={banners.filter(b => b.position >= 10)} />
              </div>

              {/* Right Logo + Text */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0 justify-center">
                <div className="flex items-center gap-1 lg:gap-2">
                  <span className="text-[#f97316] font-extrabold text-[10px] lg:text-[12px] leading-[1.15] uppercase text-right hidden xl:block">Mütaliənin<br/>şirin<br/>dadı</span>
                  <Link href="/naringi-neshrleri">
                    <Image src="/Logo2.png" alt="Naringi Nəşrləri" width={150} height={150} className="h-[75px] lg:h-[95px] w-auto object-contain transition-transform duration-300 hover:scale-105" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Desktop Navigation - Thinner line */}
            <div className="border-t border-gray-100 bg-gray-50/50">
              <div className="max-w-[1250px] mx-auto px-4 flex items-center justify-center py-1">
                <nav className="flex items-center justify-center gap-3 lg:gap-6 xl:gap-8 flex-none">
                  {topNavigation.map((item) => {
                    if (item.name === "Əsas səhifə") {
                      return (
                        <ScrollLink key={item.name} href="/" className="py-2.5 px-1 text-[11px] lg:text-[12px] xl:text-[13px] font-bold text-gray-700 hover:text-[#f97316] transition-colors uppercase tracking-wider relative group whitespace-nowrap">
                          {item.name}
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f97316] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                        </ScrollLink>
                      )
                    }
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        className="py-2.5 px-1 text-[11px] lg:text-[12px] xl:text-[13px] font-bold text-gray-700 hover:text-[#f97316] transition-colors uppercase tracking-wider relative group whitespace-nowrap"
                      >
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f97316] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
          
        </div>

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-[1250px] mx-auto px-4 py-8 animate-fade-in-delay-2">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 text-gray-700 pt-12 pb-4 mt-auto">
          <div className="max-w-[1250px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Socials */}
            <div className="flex flex-col items-start">
              <h3 className="text-[#f97316] text-lg font-bold mb-5 uppercase tracking-wider">Sosial Şəbəkələr</h3>
              <div className="flex gap-4">
                {socials.map((item) => {
                  let colorClass = "text-gray-400";
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
                      className={`${colorClass} hover:scale-110 transform transition-all bg-gray-50 p-2 rounded-full shadow-sm`}
                      title={item.name}
                    >
                      <SocialIcon name={item.name} />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Quick Links - Pulled to the Right */}
            <div className="md:flex md:flex-col md:items-end text-left md:text-right">
              <h3 className="text-[#f97316] text-lg font-bold mb-5 uppercase tracking-wider">
                Sürətli Keçid
              </h3>
              <ul className="flex flex-col gap-3 text-[15px] font-medium">
                {footerLinks.map((link) => (
                  <li key={link.id || link.href}>
                    <Link href={link.href} className="hover:text-[#f97316] transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright */}
          <div className="max-w-[1250px] mx-auto px-4 mt-12 pt-6 border-t border-gray-100 flex justify-center md:justify-between items-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Parafraz Nəşrləri. Bütün hüquqlar qorunur.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
