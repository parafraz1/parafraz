import Image from "next/image";
import Link from "next/link";
import NewsTitle from "@/components/NewsTitle";
import BookGrid from "@/components/BookGrid";
import HomeSlider from "@/components/HomeSlider";
import { fetchBooks, fetchBanners, fetchCategories, fetchNews } from "@/lib/data";

export const revalidate = 3600; // Revalidate every 1 hour

function getRotatedItems<T>(items: T[], limit: number): T[] {
  if (items.length <= limit) return items;
  const hourIndex = Math.floor(Date.now() / (1000 * 60 * 60));
  const shift = hourIndex % items.length;
  const rotated = [...items.slice(shift), ...items.slice(0, shift)];
  return rotated.slice(0, limit);
}

export default async function Home() {
  const [allBooks, banners, categories, news] = await Promise.all([
    fetchBooks(),
    fetchBanners(),
    fetchCategories(),
    fetchNews()
  ]);
  
  const latestBooks = getRotatedItems(allBooks.filter(b => b.categorySlugs.includes("yeni-kitablar")), 8); // Used for "Yeni kitablar"
  const sandiqBooks = getRotatedItems(allBooks.filter(b => b.categorySlugs.includes("sandiq-seriyasi")), 8);
  const klassiklerBooks = getRotatedItems(allBooks.filter(b => b.categorySlugs.includes("klassikler")), 8);
  const shexsiInkisafBooks = getRotatedItems(allBooks.filter(b => b.categorySlugs.includes("sexsi-inkisaf")), 8);
  const elmiKutleviBooks = getRotatedItems(allBooks.filter(b => b.categorySlugs.includes("elmi-kutlevi")), 8);
  const gelecekNeshrler = getRotatedItems(allBooks.filter(b => b.categorySlugs.includes("gelecek-neshrler")), 8);
  const latestNews = getRotatedItems(news, 4);

  const headingClass = "text-[12px] xl:text-[13px] font-bold text-gray-800 uppercase tracking-wider";
  const viewAllClass = "text-sm font-semibold text-[#f97316] hover:underline flex items-center gap-1";

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 mt-2 md:mt-4">
      
      {/* Left Sidebar (Categories) */}
      <div className="w-full md:w-[260px] flex-shrink-0 animate-fade-in">
        <div className="border border-[#f97316] mb-6 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
          {/* Mobile Collapsible Accordion */}
          <details className="md:hidden group">
            <summary className="py-4 px-5 bg-[#f97316] text-white font-bold uppercase text-[15px] tracking-wide cursor-pointer list-none flex justify-between items-center rounded">
              <span>KATEQORİYALAR</span>
              <svg className="transform group-open:rotate-180 transition-transform duration-200" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <ul className="flex flex-col border-t border-orange-200">
              {categories.map((cat, idx) => (
                <li key={idx} className="border-b border-gray-100 last:border-0">
                  <Link href={`/${cat.slug}`} className="block py-3 px-5 text-gray-700 text-[13px] hover:text-[#f97316] hover:bg-orange-50 transition-colors uppercase">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          {/* Desktop Static List */}
          <div className="hidden md:block">
            <h2 className="py-4 px-5 bg-[#f97316] text-white font-bold uppercase text-[15px] tracking-wide rounded-t">
              KATEQORİYALAR
            </h2>
            <ul className="flex flex-col">
              {categories.map((cat, idx) => (
                <li key={idx} className="border-b border-gray-100 last:border-0 group-hover:block">
                  <Link href={`/${cat.slug}`} className="block py-3 px-5 text-gray-700 text-[13px] hover:text-[#f97316] hover:bg-orange-50 hover:pl-6 transition-all duration-300 uppercase">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 animate-fade-in-delay-1 min-w-0">
        <HomeSlider banners={banners.filter(b => b.position < 10)} />
        
        {/* Sandıq Seriyası */}
        {sandiqBooks.length > 0 && (
          <div className="mb-10 mt-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-2">
              <h2 className={headingClass}>Sandıq seriyası</h2>
              <Link href="/sandiq-seriyasi" className={viewAllClass}>Hamısına bax <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></Link>
            </div>
            <BookGrid books={sandiqBooks} />
          </div>
        )}

        {/* Klassiklər */}
        {klassiklerBooks.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-2">
              <h2 className={headingClass}>Klassiklər</h2>
              <Link href="/klassikler" className={viewAllClass}>Hamısına bax <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></Link>
            </div>
            <BookGrid books={klassiklerBooks} />
          </div>
        )}

        {/* Yeni Kitablar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-2">
            <h2 className={headingClass}>Yeni Kitablar</h2>
            <Link href="/yeni-kitablar" className={viewAllClass}>Hamısına bax <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></Link>
          </div>
          <BookGrid books={latestBooks} />
        </div>

        {/* Şəxsi İnkişaf */}
        {shexsiInkisafBooks.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-2">
              <h2 className={headingClass}>Şəxsi inkişaf</h2>
              <Link href="/sexsi-inkisaf" className={viewAllClass}>Hamısına bax <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></Link>
            </div>
            <BookGrid books={shexsiInkisafBooks} />
          </div>
        )}

        {/* Elmi-Kütləvi */}
        {elmiKutleviBooks.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-2">
              <h2 className={headingClass}>Elmi-kütləvi</h2>
              <Link href="/elmi-kutlevi" className={viewAllClass}>Hamısına bax <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></Link>
            </div>
            <BookGrid books={elmiKutleviBooks} />
          </div>
        )}

        {/* Gələcək nəşrlər */}
        {gelecekNeshrler.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-2">
              <h2 className={headingClass}>Gələcək nəşrlər</h2>
              <Link href="/gelecek-neshrler" className={viewAllClass}>Hamısına bax <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></Link>
            </div>
            <BookGrid books={gelecekNeshrler} />
          </div>
        )}

        {/* Xəbərlər */}
        {latestNews.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-[#f97316] pb-2">
              <h2 className={headingClass}>Xəbərlər</h2>
              <Link href="/xeberler" className={viewAllClass}>Hamısına bax <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestNews.map(n => (
                <Link key={n.id} href={`/xeberler/${n.id}`} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="relative w-full aspect-video bg-gray-100">
                    <Image src={n.image} alt={n.title} fill className="object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[#f97316] text-xs font-bold mb-2">{n.date}</span>
                    <NewsTitle title={n.title} className="text-[15px] font-bold mb-2 leading-snug line-clamp-2" />
                    <div className="text-gray-600 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: n.content }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
