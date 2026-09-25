export interface Category {
  id?: number;
  name: string;
  slug: string;
  type?: string;
  active?: boolean;
}

export const fetchCategories = async (includeInactive = false): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
  if (error || !data || data.length === 0) {
    return [
      { id: 1, name: "Bütün kitablar", slug: "butun-kitablar" },
      { id: 2, name: "Naringi Nəşrləri", slug: "naringi-neshrleri" },
      { id: 3, name: "Sandıq seriyası", slug: "sandiq-seriyasi" },
      { id: 4, name: "Klassiklər", slug: "klassikler" },
      { id: 5, name: "Yeni kitablar", slug: "yeni-kitablar" },
      { id: 6, name: "Tarixi romanlar", slug: "tarixi-romanlar" },
      { id: 7, name: "Detektiv", slug: "detektiv" },
      { id: 8, name: "Şəxsi inkişaf", slug: "sexsi-inkisaf" },
      { id: 9, name: "Elmi-kütləvi", slug: "elmi-kutlevi" },
      { id: 10, name: "Gələcək nəşrlər", slug: "gelecek-neshrler" },
    ];
  }
  let cats = data.map(c => ({ id: c.id, name: c.slug === "gelecek-neshrler" ? "Gələcək nəşrlər" : c.name, slug: c.slug, type: c.type, active: c.active !== false }));
  if (!cats.find(c => c.slug === 'gelecek-neshrler')) {
    cats.push({ id: 9999, name: "Gələcək nəşrlər", slug: "gelecek-neshrler", type: "kitab", active: true });
  }
  if (!includeInactive) {
    cats = cats.filter(c => c.active);
  }
  return cats;
};

export interface NavItem {
  id?: number;
  name: string;
  href: string;
  position: number;
}

export const fetchNavItems = async (): Promise<NavItem[]> => {
  const { data, error } = await supabase.from('nav_items').select('*').order('position', { ascending: true });
  if (error || !data || data.length === 0) {
    return [
      { id: 1, name: "Əsas səhifə", href: "/", position: 1 },
      { id: 2, name: "Bütün kitablar", href: "/butun-kitablar", position: 2 },
      { id: 3, name: "Naringi Nəşrləri", href: "/naringi-neshrleri", position: 3 },
      { id: 4, name: "Gələcək nəşrlər", href: "/gelecek-neshrler", position: 4 },
      { id: 5, name: "Xəbərlər", href: "/xeberler", position: 5 },
      { id: 6, name: "Haqqımızda", href: "/haqqimizda", position: 6 },
      { id: 7, name: "Əlaqə", href: "/elaqe", position: 7 },
    ];
  }
  return data.map(n => ({ id: n.id, name: n.name, href: n.href, position: n.position }));
};

export interface FooterLink {
  id?: number;
  name: string;
  href: string;
  position: number;
}

export const fetchFooterLinks = async (): Promise<FooterLink[]> => {
  const { data, error } = await supabase.from('footer_links').select('*').order('position', { ascending: true });
  if (error || !data || data.length === 0) {
    return [
      { id: 1, name: "Haqqımızda", href: "/haqqimizda", position: 1 },
      { id: 2, name: "Məxfilik siyasəti", href: "/mexfilik", position: 2 },
      { id: 3, name: "İstifadə qaydaları", href: "/qaydalar", position: 3 },
      { id: 4, name: "Əlaqə səhifəsi", href: "/elaqe", position: 4 },
    ];
  }
  return data.map(f => ({ id: f.id, name: f.name, href: f.href, position: f.position }));
};

export interface PageContent {
  slug: string;
  title: string;
  content: string;
}

export const fetchPage = async (slug: string): Promise<PageContent | null> => {
  const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();
  
  if (error || !data) {
    // Fallbacks
    if (slug === 'haqqimizda') return { slug: 'haqqimizda', title: 'Haqqımızda', content: '“Parafraz Nəşrləri” 2018-ci ildən fəaliyyət göstərsə də, rəsmi şəkildə 2025-ci ildə qeydiyyatdan keçib.\n\nƏsasən bədii və elmi-kütləvi əsərlərin çapı ilə məşğul olan nəşriyyatdır.' };
    if (slug === 'mexfilik') return { slug: 'mexfilik', title: 'Məxfilik Siyasəti', content: `Hörmətli istifadəçilər, "Parafraz Nəşrləri" olaraq sizin şəxsi məlumatlarınızın toxunulmazlığı və məxfiliyi bizim üçün prioritetdir. Bu Məxfilik Siyasəti saytımızdan istifadə edərkən şəxsi məlumatlarınızın necə toplandığını, istifadə edildiyini və qorunduğunu izah edir.

1. Toplanan məlumatlar
Saytımız əsasən nəşrlərimizin kataloqu kimi fəaliyyət göstərir və onlayn alış-veriş sistemi mövcud deyil. Bizimlə əlaqə saxladığınız, sifariş və ya müraciət etdiyiniz zaman adınız, telefon nömrəniz, e-poçt ünvanınız kimi məlumatlar tələb oluna bilər.

2. Məlumatların istifadəsi
Təqdim etdiyiniz şəxsi məlumatlar yalnız aşağıdakı məqsədlər üçün istifadə olunur:
- Sizinlə əlaqə saxlamaq və suallarınızı cavablandırmaq
- Sifarişlərinizi (varsa) qəbul etmək və fərdi qaydada emal etmək
- Xidmət keyfiyyətimizi artırmaq

3. Məlumatların qorunması
Sizə aid olan heç bir şəxsi məlumat üçüncü tərəflərə (şirkət və ya şəxslərə) satılmır və qanunvericiliklə tələb olunan hallar istisna olmaqla paylaşılmır. Məlumatlarınız təhlükəsiz məlumat bazalarında qorunur.

4. Məxfilik Siyasətində dəyişikliklər
“Parafraz Nəşrləri” zərurət yarandıqda bu Məxfilik Siyasətinə dəyişiklik etmək hüququnu özündə saxlayır. Dəyişikliklər saytda dərc edildiyi andan etibarən qüvvəyə minir.` };
    if (slug === 'qaydalar') return { slug: 'qaydalar', title: 'İstifadə Qaydaları', content: `Hörmətli ziyarətçilər, "Parafraz Nəşrləri"nin rəsmi saytına (parafr.az) daxil olduğunuz üçün təşəkkür edirik. Saytdan istifadə etməzdən əvvəl aşağıdakı qaydalarla tanış olmağınız xahiş olunur.

1. Saytın məqsədi və məzmunu
Bu sayt "Parafraz Nəşrləri"nin çap etdiyi, redaktə və tərtibatını həyata keçirdiyi kitabların kataloqunu oxuculara təqdim etmək məqsədi daşıyır. Sayt onlayn mağaza deyil. Burada göstərilən məlumatlar, qiymətlər və məzmun yalnız məlumatlandırma xarakteri daşıyır.

2. Sifariş və Ödəniş
- Saytımızda onlayn ödəniş (kartla alış-veriş) sistemi aktiv deyil.
- Nəşrlərimizi əldə etmək üçün qeyd olunan əlaqə nömrələri və ya sosial şəbəkələr vasitəsilə fərdi qaydada müraciət etməlisiniz.
- Ödənişlər tərəflər arasında razılaşdırılmış şəkildə nağd və ya digər ənənəvi üsullarla qəbul edilir.

3. Müəllif hüquqları
Saytda yerləşdirilən bütün kitab qapaqları, mətnlər, qrafik elementlər və loqolar müəllif hüquqları ilə qorunur. Bu materialların "Parafraz Nəşrləri"nin yazılı icazəsi olmadan kommersiya məqsədilə kopyalanması və ya yayılması qəti qadağandır.

4. Məlumatların düzgünlüyü
Biz saytda təqdim olunan məlumatların və kitab qiymətlərinin dəqiqliyinə nəzarət edirik. Lakin, bəzi hallarda məlumatlarda qeyri-dəqiqlik və ya dəyişikliklər ola bilər. Belə hallarda nəşriyyatımız məlumatları əvvəlcədən xəbərdarlıq etmədən yeniləmək hüququna malikdir.` };
    if (slug === 'elaqe') return { slug: 'elaqe', title: 'Əlaqə', content: `` };
    return null;
  }
  return data;
};

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  adminReply?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  translator?: string;
  originalName?: string;
  price: string;
  discountPrice?: string;
  isbn?: string;
  image: string;
  categorySlugs: string[];
  stars: number;
  reviewCount: number;
  pageCount: number;
  publishDate: string;
  ageCategory: string;
  coverType: string;
  dimensions: string;
  description: string;
  reviews: Review[];
  editionCount?: string;
  editionYear1?: string;
  editionYear2?: string;
  editionYear3?: string;
  editionYear4?: string;
  coverIllustrator?: string;
  illustrator?: string;
  artist?: string;
  position?: number;
}

import { supabase } from "./supabase";

export const fetchBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }
  
  return data?.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    translator: book.translator,
    originalName: book.original_name,
    isbn: book.isbn,
    price: book.price.toString(),
    discountPrice: book.discount_price ? book.discount_price.toString() : undefined,
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
    reviews: [],
    editionCount: book.edition_count,
    editionYear1: book.edition_year_1,
    editionYear2: book.edition_year_2,
    editionYear3: book.edition_year_3,
    editionYear4: book.edition_year_4,
    coverIllustrator: book.cover_illustrator,
    illustrator: book.illustrator,
    artist: book.artist,
    position: book.position
  })) || [];
};

export const fetchBookById = async (id: number): Promise<Book | null> => {
  const { data: bookData, error: bookError } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();
    
  if (bookError || !bookData) return null;
  
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('book_id', id)
    .order('created_at', { ascending: false });
  
  const reviews = reviewsData?.map(r => ({
    id: r.id,
    name: r.name,
    rating: r.rating,
    comment: r.comment,
    date: r.date,
    adminReply: r.admin_reply
  })) || [];
  
  return {
    id: bookData.id,
    title: bookData.title,
    author: bookData.author,
    translator: bookData.translator,
    originalName: bookData.original_name,
    isbn: bookData.isbn,
    price: bookData.price.toString(),
    discountPrice: bookData.discount_price ? bookData.discount_price.toString() : undefined,
    categorySlugs: bookData.category_slugs,
    pageCount: bookData.page_count,
    publishDate: bookData.publish_date,
    ageCategory: bookData.age_category,
    coverType: bookData.cover_type,
    dimensions: bookData.dimensions,
    description: bookData.description,
    image: bookData.image,
    stars: Number(bookData.stars),
    reviewCount: bookData.review_count,
    reviews,
    editionCount: bookData.edition_count,
    editionYear1: bookData.edition_year_1,
    editionYear2: bookData.edition_year_2,
    editionYear3: bookData.edition_year_3,
    editionYear4: bookData.edition_year_4,
    coverIllustrator: bookData.cover_illustrator,
    illustrator: bookData.illustrator,
    artist: bookData.artist,
    position: bookData.position
  };
};
export interface Banner {
  id: number;
  position: number;
  image: string;
  link: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  date: string;
}

export const fetchBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('position', { ascending: true });
    
  if (error || !data) return [];
  
  return data.map(b => ({
    id: b.id,
    position: b.position,
    image: b.image,
    link: b.link || ''
  }));
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error || !data) return [];
  
  return data.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content,
    image: n.image,
    date: n.date
  }));
};
export const fetchReviewsByBookId = async (bookId: number): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false });
    
  if (error) return [];
  
  return data.map(r => ({
    id: r.id,
    name: r.name,
    rating: r.rating,
    comment: r.comment,
    date: r.date,
    adminReply: r.admin_reply
  }));
};
