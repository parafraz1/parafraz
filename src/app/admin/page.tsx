"use client";
import PdfUploader from "@/components/PdfUploader";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(
  async () => {
    const { default: RQ, Quill } = await import("react-quill-new");
    if (Quill) {
      const SizeStyle = Quill.import("attributors/style/size") as any;
      if (SizeStyle) {
        SizeStyle.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px", "48px", "64px", "80px", "96px"];
        Quill.register(SizeStyle, true);
      }
      const FontStyle = Quill.import("attributors/style/font") as any;
      if (FontStyle) {
        FontStyle.whitelist = ["arial", "comic-sans", "courier-new", "georgia", "helvetica", "lucida", "tahoma", "times-new-roman", "trebuchet", "verdana", "inter"];
        Quill.register(FontStyle, true);
      }
    }
    return function ForwardedQuill(props: any) {
      return <RQ {...props} />;
    };
  },
  { ssr: false }
);
import { fetchCategories, fetchNavItems, fetchFooterLinks, Category, NavItem, FooterLink, PageContent, Book, Review } from "@/lib/data";
import { supabase } from "@/lib/supabase";

const IMGBB_API_KEY = "47aba2afb9a71d5c948bbd0af36a55f6";
const ADMIN_EMAIL = "parafrazneshrleri@gmail.com";
const ADMIN_PASS = "parafraz20250826";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuth] = useState(false);
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Form State
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"books" | "reviews" | "banners" | "news" | "categories" | "menus" | "pages" | "files">("books");
  
  const [adminBooks, setAdminBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [bookSearch, setBookSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "", author: "", translator: "", originalName: "", isbn: "",
    price: "", discountPrice: "", category: [] as string[],
    pageCount: "", publishDate: "", ageCategory: "12+",
    coverType: "Yumşaq", dimensions: "", dimWidth: "", dimLength: "", description: "",
    editionCount: "", editionYear1: "", editionYear2: "", editionYear3: "", editionYear4: "",
    coverIllustrator: "", illustrator: "", artist: "", position: "0"
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reviews Admin State
  const [adminReviews, setAdminReviews] = useState<{ id: number; bookTitle: string; name: string; comment: string; adminReply?: string }[]>([]);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

  // Banners & News State
  const [adminBanners, setAdminBanners] = useState<any[]>([]);
  const [adminNews, setAdminNews] = useState<any[]>([]);
  const [adminCategories, setAdminCategories] = useState<Category[]>([]);
  
  const [bannerFormData, setBannerFormData] = useState({ position: "1", link: "" });
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catType, setCatType] = useState("kitab");
  const [editingCatId, setEditingCatId] = useState<number | null>(null);

  // Menu management states
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [footerLinksState, setFooterLinksState] = useState<FooterLink[]>([]);
  const [navName, setNavName] = useState("");
  const [navHref, setNavHref] = useState("");
  const [navPosition, setNavPosition] = useState("");
  const [editingNavId, setEditingNavId] = useState<number | null>(null);
  const [footerName, setFooterName] = useState("");
  const [footerHref, setFooterHref] = useState("");
  const [footerPosition, setFooterPosition] = useState("");
  const [editingFooterId, setEditingFooterId] = useState<number | null>(null);

  // Pages state
  const [adminPages, setAdminPages] = useState<PageContent[]>([]);
  const [pageSlug, setPageSlug] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [editingPage, setEditingPage] = useState<string | null>(null);

  const handleSavePage = async () => {
    if (!pageSlug || !pageTitle) return alert("Slug və Başlıq boş ola bilməz!");
    
    const { data, error } = await supabase.from('pages').upsert({ slug: pageSlug, title: pageTitle, content: pageContent }, { onConflict: 'slug' }).select();
    if (error) { 
      alert("Xəta baş verdi: " + error.message); 
      return; 
    }
    
    if (data && data[0]) {
      setAdminPages(prev => {
        const exists = prev.find(p => p.slug === pageSlug);
        if (exists) {
          return prev.map(p => p.slug === pageSlug ? data[0] : p);
        }
        return [...prev, data[0]];
      });
    }
    setEditingPage(null);
    setPageSlug(""); setPageTitle(""); setPageContent("");
  };

  const handleDeletePage = (slug: string) => {
    customConfirm("Bu səhifəni bazadan silmək istəyirsiniz? (Silinərsə standart mətn görünəcək)", async () => {
      const { error } = await supabase.from('pages').delete().eq('slug', slug);
      if (error) { alert("Xəta baş verdi: " + error.message); return; }
      
      // Update local state by removing it and reverting to fallback if it's a default page
      const defaultPages = [
        { slug: 'haqqimizda', title: 'Haqqımızda', content: '“Parafraz Nəşrləri” 2018-ci ildən fəaliyyət göstərsə də, rəsmi şəkildə 2025-ci ildə qeydiyyatdan keçib.\n\nƏsasən bədii və elmi-kütləvi əsərlərin çapı ilə məşğul olan nəşriyyatdır.' },
        { slug: 'mexfilik', title: 'Məxfilik Siyasəti', content: `Hörmətli istifadəçilər, "Parafraz Nəşrləri" olaraq sizin şəxsi məlumatlarınızın toxunulmazlığı və məxfiliyi bizim üçün prioritetdir. Bu Məxfilik Siyasəti saytımızdan istifadə edərkən şəxsi məlumatlarınızın necə toplandığını, istifadə edildiyini və qorunduğunu izah edir.

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
“Parafraz Nəşrləri” zərurət yarandıqda bu Məxfilik Siyasətinə dəyişiklik etmək hüququnu özündə saxlayır. Dəyişikliklər saytda dərc edildiyi andan etibarən qüvvəyə minir.` },
        { slug: 'qaydalar', title: 'İstifadə Qaydaları', content: `Hörmətli ziyarətçilər, "Parafraz Nəşrləri"nin rəsmi saytına (parafr.az) daxil olduğunuz üçün təşəkkür edirik. Saytdan istifadə etməzdən əvvəl aşağıdakı qaydalarla tanış olmağınız xahiş olunur.

1. Saytın məqsədi və məzmunu
Bu sayt "Parafraz Nəşrləri"nin çap etdiyi, redaktə və tərtibatını həyata keçirdiyi kitabların kataloqunu oxuculara təqdim etmək məqsədi daşıyır. Sayt onlayn mağaza deyil. Burada göstərilən məlumatlar, qiymətlər və məzmun yalnız məlumatlandırma xarakteri daşıyır.

2. Sifariş və Ödəniş
- Saytımızda onlayn ödəniş (kartla alış-veriş) sistemi aktiv deyil.
- Nəşrlərimizi əldə etmək üçün qeyd olunan əlaqə nömrələri və ya sosial şəbəkələr vasitəsilə fərdi qaydada müraciət etməlisiniz.
- Ödənişlər tərəflər arasında razılaşdırılmış şəkildə nağd və ya digər ənənəvi üsullarla qəbul edilir.

3. Müəllif hüquqları
Saytda yerləşdirilən bütün kitab qapaqları, mətnlər, qrafik elementlər və loqolar müəllif hüquqları ilə qorunur. Bu materialların "Parafraz Nəşrləri"nin yazılı icazəsi olmadan kommersiya məqsədilə kopyalanması və ya yayılması qəti qadağandır.

4. Məlumatların düzgünlüyü
Biz saytda təqdim olunan məlumatların və kitab qiymətlərinin dəqiqliyinə nəzarət edirik. Lakin, bəzi hallarda məlumatlarda qeyri-dəqiqlik və ya dəyişikliklər ola bilər. Belə hallarda nəşriyyatımız məlumatları əvvəlcədən xəbərdarlıq etmədən yeniləmək hüququna malikdir.` },
        { slug: 'elaqe', title: 'Əlaqə', content: `Bizimlə əlaqə saxlamaq üçün aşağıdakı vasitələrdən istifadə edə bilərsiniz. Hər hansı bir sualınız, rəyiniz və ya əməkdaşlıq təklifiniz varsa, sizi dinləməyə məmnuniyyətlə hazırıq.

Əlaqə Məlumatları

Mobil nömrələr:
+994 70 920 18 55
+994 55 479 16 02

E-poçt ünvanı:
info@parafraz.site` }
      ];
      
      setAdminPages(prev => {
        const fallback = defaultPages.find(p => p.slug === slug);
        if (fallback) return prev.map(p => p.slug === slug ? fallback : p);
        return prev.filter(p => p.slug !== slug);
      });
    });
  };

  const handleEditPage = (p: PageContent) => {
    setEditingPage(p.slug);
    setPageSlug(p.slug);
    setPageTitle(p.title);
    setPageContent(p.content);
  };


  const handleAddNav = async () => {
    if (!navName || !navHref) return alert("Ad və Link sahələrini doldurun");
    const pos = parseInt(navPosition) || navItems.length + 1;
    if (editingNavId) {
      const { error } = await supabase.from('nav_items').update({ name: navName, href: navHref, position: pos }).eq('id', editingNavId);
      if (error) { alert("Xəta: " + error.message); return; }
      setNavItems(prev => prev.map(n => n.id === editingNavId ? { ...n, name: navName, href: navHref, position: pos } : n).sort((a,b) => a.position - b.position));
      setEditingNavId(null);
    } else {
      const { data, error } = await supabase.from('nav_items').insert([{ name: navName, href: navHref, position: pos }]).select();
      if (error) { alert("Xəta: " + error.message); return; }
      if (data && data[0]) setNavItems(prev => [...prev, data[0]].sort((a,b) => a.position - b.position));
    }
    setNavName(""); setNavHref(""); setNavPosition("");
  };

  const handleDeleteNav = (id: number) => {
    customConfirm("Bu menyu elementini silmək istəyirsiniz?", async () => {
      await supabase.from('nav_items').delete().eq('id', id);
      setNavItems(prev => prev.filter(n => n.id !== id));
    });
  };

  const handleAddFooter = async () => {
    if (!footerName || !footerHref) return alert("Ad və Link sahələrini doldurun");
    const pos = parseInt(footerPosition) || footerLinksState.length + 1;
    if (editingFooterId) {
      const { error } = await supabase.from('footer_links').update({ name: footerName, href: footerHref, position: pos }).eq('id', editingFooterId);
      if (error) { alert("Xəta: " + error.message); return; }
      setFooterLinksState(prev => prev.map(f => f.id === editingFooterId ? { ...f, name: footerName, href: footerHref, position: pos } : f).sort((a,b) => a.position - b.position));
      setEditingFooterId(null);
    } else {
      const { data, error } = await supabase.from('footer_links').insert([{ name: footerName, href: footerHref, position: pos }]).select();
      if (error) { alert("Xəta: " + error.message); return; }
      if (data && data[0]) setFooterLinksState(prev => [...prev, data[0]].sort((a,b) => a.position - b.position));
    }
    setFooterName(""); setFooterHref(""); setFooterPosition("");
  };

  const handleDeleteFooter = (id: number) => {
    customConfirm("Bu alt menyu elementini silmək istəyirsiniz?", async () => {
      await supabase.from('footer_links').delete().eq('id', id);
      setFooterLinksState(prev => prev.filter(f => f.id !== id));
    });
  };

  const handleAddCategory = async () => {
    if (!catName || !catSlug) return alert("Bütün sahələri doldurun");
    
    if (editingCatId) {
      // Update existing
      const { error } = await supabase.from('categories').update({ name: catName, slug: catSlug, type: catType }).eq('id', editingCatId);
      if (error) {
        alert("Yeniləmə zamanı xəta baş verdi");
        return;
      }
      setAdminCategories(prev => prev.map(c => c.id === editingCatId ? { ...c, name: catName, slug: catSlug, type: catType } : c));
      setEditingCatId(null);
    } else {
      // Insert new
      const { data, error } = await supabase.from('categories').insert([{ name: catName, slug: catSlug, type: catType }]).select();
      if (error) {
        alert("Xəta baş verdi. Əvvəlcə bazada categories cədvəli yaradın.");
        return;
      }
      if (data && data[0]) {
        setAdminCategories(prev => [...prev, data[0]]);
      }
    }
    setCatName("");
    setCatSlug("");
    setCatType("kitab");
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCatId(cat.id!);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatType(cat.type || "kitab");
  };

  const handleToggleCategoryActive = async (id: number, currentActive: boolean) => {
    try {
      const { error } = await supabase.from('categories').update({ active: !currentActive }).eq('id', id);
      if (error) throw error;
      setAdminCategories(prev => prev.map(c => c.id === id ? { ...c, active: !currentActive } : c));
    } catch (err) {
      alert("Xəta baş verdi");
    }
  };

  const handleDeleteCategory = (id: number) => {
    customConfirm("Kateqoriyanı silmək istəyirsiniz?", async () => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        alert("Xəta baş verdi");
        return;
      }
      setAdminCategories(prev => prev.filter(c => c.id !== id));
    });
  };
  const [newsFormData, setNewsFormData] = useState({ title: "", content: "", date: new Date().toISOString().split('T')[0] });

  const customConfirm = (message: string, onConfirm: () => void) => {
    if (window.confirm(message)) {
      onConfirm();
    }
  };

  const handleReplyChange = (id: number, text: string) => {
  };

  const submitReply = async (id: number) => {
    if (!replyText[id]) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ admin_reply: replyText[id] })
        .eq('id', id);
        
      if (error) throw error;
      
      setAdminReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: replyText[id] } : r));
      alert("Cavab uğurla əlavə edildi!");
    } catch (err) {
      alert("Xəta baş verdi");
    }
  };

  const deleteReview = async (id: number) => {
    customConfirm("İstifadəçinin bu rəyini tamamilə silmək istədiyinizə əminsiniz?", async () => {
      try {
        await supabase.from('reviews').delete().eq('id', id);
        setAdminReviews(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        alert("Xəta baş verdi");
      }
    });
  };

  const deleteReply = async (id: number) => {
    customConfirm("Cavabınızı silmək istədiyinizə əminsiniz?", async () => {
      try {
        await supabase.from('reviews').update({ admin_reply: null }).eq('id', id);
        setAdminReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: undefined } : r));
      } catch (err) {
        alert("Xəta baş verdi");
      }
    });
  };

  // Check auth and load data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("adminAuth");
      if (auth === "true") {
        setIsAuth(true);
        loadData();
      }
    }
  }, []);

  const loadData = async () => {
    // Run everything in parallel
    const [cats, navs, flinks, pagesRes, booksRes, reviewsRes, bannersRes, newsRes] = await Promise.all([
      fetchCategories(true),
      fetchNavItems(),
      fetchFooterLinks(),
      supabase.from('pages').select('*'),
      supabase.from('books').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('banners').select('*').order('position', { ascending: true }),
      supabase.from('news').select('*').order('created_at', { ascending: false })
    ]);

    setAdminCategories(cats);
    setNavItems(navs);
    setFooterLinksState(flinks);
    
    const pagesData = pagesRes.data;
    const defaultPages = [
      { slug: 'haqqimizda', title: 'Haqqımızda', content: '“Parafraz Nəşrləri” 2018-ci ildən fəaliyyət göstərsə də, rəsmi şəkildə 2025-ci ildə qeydiyyatdan keçib.\n\nƏsasən bədii və elmi-kütləvi əsərlərin çapı ilə məşğul olan nəşriyyatdır.' },
      { slug: 'mexfilik', title: 'Məxfilik Siyasəti', content: `Hörmətli istifadəçilər, "Parafraz Nəşrləri" olaraq sizin şəxsi məlumatlarınızın toxunulmazlığı və məxfiliyi bizim üçün prioritetdir. Bu Məxfilik Siyasəti saytımızdan istifadə edərkən şəxsi məlumatlarınızın necə toplandığını, istifadə edildiyini və qorunduğunu izah edir.

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
“Parafraz Nəşrləri” zərurət yarandıqda bu Məxfilik Siyasətinə dəyişiklik etmək hüququnu özündə saxlayır. Dəyişikliklər saytda dərc edildiyi andan etibarən qüvvəyə minir.` },
      { slug: 'qaydalar', title: 'İstifadə Qaydaları', content: `Hörmətli ziyarətçilər, "Parafraz Nəşrləri"nin rəsmi saytına (parafr.az) daxil olduğunuz üçün təşəkkür edirik. Saytdan istifadə etməzdən əvvəl aşağıdakı qaydalarla tanış olmağınız xahiş olunur.

1. Saytın məqsədi və məzmunu
Bu sayt "Parafraz Nəşrləri"nin çap etdiyi, redaktə və tərtibatını həyata keçirdiyi kitabların kataloqunu oxuculara təqdim etmək məqsədi daşıyır. Sayt onlayn mağaza deyil. Burada göstərilən məlumatlar, qiymətlər və məzmun yalnız məlumatlandırma xarakteri daşıyır.

2. Sifariş və Ödəniş
- Saytımızda onlayn ödəniş (kartla alış-veriş) sistemi aktiv deyil.
- Nəşrlərimizi əldə etmək üçün qeyd olunan əlaqə nömrələri və ya sosial şəbəkələr vasitəsilə fərdi qaydada müraciət etməlisiniz.
- Ödənişlər tərəflər arasında razılaşdırılmış şəkildə nağd və ya digər ənənəvi üsullarla qəbul edilir.

3. Müəllif hüquqları
Saytda yerləşdirilən bütün kitab qapaqları, mətnlər, qrafik elementlər və loqolar müəllif hüquqları ilə qorunur. Bu materialların "Parafraz Nəşrləri"nin yazılı icazəsi olmadan kommersiya məqsədilə kopyalanması və ya yayılması qəti qadağandır.

4. Məlumatların düzgünlüyü
Biz saytda təqdim olunan məlumatların və kitab qiymətlərinin dəqiqliyinə nəzarət edirik. Lakin, bəzi hallarda məlumatlarda qeyri-dəqiqlik və ya dəyişikliklər ola bilər. Belə hallarda nəşriyyatımız məlumatları əvvəlcədən xəbərdarlıq etmədən yeniləmək hüququna malikdir.` },
      { slug: 'elaqe', title: 'Əlaqə', content: `Bizimlə əlaqə saxlamaq üçün aşağıdakı vasitələrdən istifadə edə bilərsiniz. Hər hansı bir sualınız, rəyiniz və ya əməkdaşlıq təklifiniz varsa, sizi dinləməyə məmnuniyyətlə hazırıq.

Əlaqə Məlumatları

Mobil nömrələr:
+994 70 920 18 55
+994 55 479 16 02

E-poçt ünvanı:
info@parafraz.site` }
    ];
    
    if (pagesData && pagesData.length > 0) {
      // Merge DB pages with default pages (DB pages override defaults)
      const merged = [...defaultPages];
      pagesData.forEach(dbPage => {
        const index = merged.findIndex(p => p.slug === dbPage.slug);
        if (index >= 0) merged[index] = dbPage;
        else merged.push(dbPage);
      });
      setAdminPages(merged);
    } else {
      setAdminPages(defaultPages);
    }
    
    const booksData = booksRes.data;
    if (booksData) {
      const parsedBooks = booksData.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        translator: book.translator,
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
        editionCount: book.edition_count,
        editionYear1: book.edition_year_1,
        editionYear2: book.edition_year_2,
        editionYear3: book.edition_year_3,
        editionYear4: book.edition_year_4,
        coverIllustrator: book.cover_illustrator,
        illustrator: book.illustrator,
        artist: book.artist,
        position: book.position,
        originalName: book.original_name,
        reviews: []
      }));
      setAdminBooks(parsedBooks);
      
      const reviewsData = reviewsRes.data;
      if (reviewsData) {
        setAdminReviews(reviewsData.map(r => {
          const bookTitle = parsedBooks.find(b => b.id === r.book_id)?.title || "Bilinmir";
          return {
            id: r.id,
            bookTitle,
            name: r.name,
            comment: r.comment,
            adminReply: r.admin_reply
          };
        }));
      }

      const bannersData = bannersRes.data;
      if (bannersData) setAdminBanners(bannersData);

      const newsData = newsRes.data;
      if (newsData) setAdminNews(newsData);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === ADMIN_EMAIL && password.trim() === ADMIN_PASS) {
      localStorage.setItem("adminAuth", "true");
      setIsAuth(true);
      setLoginError("");
    } else {
      setLoginError("E-poçt və ya şifrə yanlışdır.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuth(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    
    if (target.type === 'select-multiple') {
      const selectTarget = target as HTMLSelectElement;
      const values: string[] = [];
      for (let i = 0; i < selectTarget.options.length; i++) {
        if (selectTarget.options[i].selected) {
          values.push(selectTarget.options[i].value);
        }
      }
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title, author: book.author, translator: book.translator || "", originalName: book.originalName || "",
      isbn: book.isbn || "", price: book.price, discountPrice: book.discountPrice || "",
      category: book.categorySlugs || [], pageCount: book.pageCount.toString(),
      publishDate: book.publishDate, ageCategory: book.ageCategory,
      coverType: book.coverType, dimensions: book.dimensions, dimWidth: book.dimensions ? book.dimensions.split("x")[0] : "", dimLength: book.dimensions && book.dimensions.includes("x") ? book.dimensions.split("x")[1].replace(" sm", "").trim() : "", description: book.description,
      editionCount: book.editionCount || "", editionYear1: book.editionYear1 || "", editionYear2: book.editionYear2 || "",
      editionYear3: book.editionYear3 || "", editionYear4: book.editionYear4 || "",
      coverIllustrator: book.coverIllustrator || "", illustrator: book.illustrator || "", artist: book.artist || "",
      position: book.position ? book.position.toString() : "0"
    });
    setPreviewUrl(book.image);
    setFile(null); // No new file selected yet
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "", author: "", translator: "", originalName: "", isbn: "", price: "", discountPrice: "", category: [] as string[], pageCount: "", editionCount: "", editionYear1: "", editionYear2: "", editionYear3: "", editionYear4: "", coverIllustrator: "", illustrator: "", artist: "", position: "0",
      publishDate: "", ageCategory: "12+", coverType: "Yumşaq", dimensions: "", dimWidth: "", dimLength: "", description: ""
    });
    setPreviewUrl(null);
    setFile(null);
  };



  const quillModules = {
    toolbar: [
      [{ 'font': ["arial", "comic-sans", "courier-new", "georgia", "helvetica", "lucida", "tahoma", "times-new-roman", "trebuchet", "verdana", "inter"] }],
      [{ 'size': ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px", "48px", "64px", "80px", "96px"] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsFormData.title) return alert("Xəbərin başlığını daxil edin");
    if (!newsFormData.content) return alert("Xəbərin mətnini daxil edin");
    
    if (!file && !editingId) {
      alert("Zəhmət olmasa xəbərin şəklini yükləyin!");
      return;
    }
    setIsUploading(true);
    try {
      let imageUrl = previewUrl;
      if (file) {
        const imgFormData = new FormData();
        imgFormData.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: imgFormData });
        const data = await res.json();
        if (!data.success) throw new Error("Şəkil yüklənmədi");
        imageUrl = data.data.url;
      }
      
      const payload = {
        title: newsFormData.title,
        content: newsFormData.content,
        date: newsFormData.date || new Date().toISOString().split('T')[0],
        image: imageUrl as string
      };
      
      if (editingId) {
        const { error } = await supabase.from('news').update(payload).eq('id', editingId);
        if (error) throw error;
        setSuccessMsg("Xəbər yeniləndi!");
      } else {
        const { error } = await supabase.from('news').insert(payload);
        if (error) throw error;
        setSuccessMsg("Xəbər əlavə edildi!");
      }
      cancelEdit();
      loadData();
    } catch(err: any) {
      alert(err.message || "Xəta");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteNews = (id: number) => {
    customConfirm("Bu xəbəri silmək istədiyinizə əminsiniz?", async () => {
      try {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (error) throw error;
        setAdminNews(prev => prev.filter(n => n.id !== id));
      } catch(err) {
        alert("Xəta baş verdi");
      }
    });
  };
  
  const handleEditNews = (news: any) => {
    setEditingId(news.id);
    setNewsFormData({ title: news.title, content: news.content, date: news.date });
    setPreviewUrl(news.image);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !editingId) {
      alert("Zəhmət olmasa banner şəklini yükləyin!");
      return;
    }
    setIsUploading(true);
    try {
      let imageUrl = previewUrl;
      if (file) {
        const imgFormData = new FormData();
        imgFormData.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: imgFormData });
        const data = await res.json();
        if (!data.success) throw new Error("Şəkil yüklənmədi");
        imageUrl = data.data.url;
      }
      
      const payload = {
        position: parseInt(bannerFormData.position),
        link: bannerFormData.link,
        image: imageUrl as string
      };
      
      if (editingId) {
        const { error } = await supabase.from('banners').update(payload).eq('id', editingId);
        if (error) throw error;
        setSuccessMsg("Banner yeniləndi!");
      } else {
        const { error } = await supabase.from('banners').insert(payload);
        if (error) throw error;
        setSuccessMsg("Banner əlavə edildi!");
      }
      cancelEdit();
      loadData();
    } catch(err: any) {
      alert(err.message || "Xəta");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = (id: number) => {
    customConfirm("Bu banneri silmək istədiyinizə əminsiniz?", async () => {
      try {
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) throw error;
        setAdminBanners(prev => prev.filter(b => b.id !== id));
      } catch(err) {
        alert("Xəta baş verdi");
      }
    });
  };
  
  const handleEditBanner = (banner: any) => {
    setEditingId(banner.id);
    setBannerFormData({ position: banner.position.toString(), link: banner.link || "" });
    setPreviewUrl(banner.image);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBook = async (id: number) => {
    customConfirm("Bu nəşri tamamilə silmək istədiyinizə əminsiniz?", async () => {
      try {
        const { error } = await supabase.from('books').delete().eq('id', id);
        if (error) throw error;
        setAdminBooks(prev => prev.filter(b => b.id !== id));
      } catch(err) {
        alert("Xəta baş verdi");
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("Başlıq daxil edin");
    if (!formData.author) return alert("Müəllif daxil edin");
    if (!formData.price) return alert("Qiymət daxil edin");
    if (!formData.pageCount) return alert("Səhifə sayı daxil edin");
    if (!formData.dimensions) return alert("Ölçünü daxil edin");
    if (!formData.description) return alert("Məzmun daxil edin");
    
    if (!file && !editingId) {
      alert("Zəhmət olmasa kitabın şəklini yükləyin!");
      return;
    }

    setIsUploading(true);
    setSuccessMsg("");

    try {
      let imageUrl = previewUrl; // Use existing if editing and no new file

      // 1. Upload image to Imgbb if a new file is selected
      if (file) {
        const imgFormData = new FormData();
        imgFormData.append("image", file);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: imgFormData
        });
        const imgbbData = await imgbbRes.json();
        
        if (!imgbbData.success) {
          throw new Error("Şəkil yüklənərkən xəta baş verdi");
        }
        imageUrl = imgbbData.data.url;
      }

      // 2. Determine category slugs (Only use user selected categories)
      const categorySlugs = Array.isArray(formData.category) ? formData.category : [formData.category].filter(Boolean) as string[];

      // 3. Prepare payload for Supabase
      const payload = {
        title: formData.title,
        author: formData.author,
        translator: formData.translator,
        original_name: formData.originalName,
        isbn: formData.isbn,
        price: parseFloat(formData.price),
        discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        category_slugs: categorySlugs,
        page_count: parseInt(formData.pageCount),
        publish_date: formData.publishDate,
        age_category: formData.ageCategory,
        cover_type: formData.coverType,
        dimensions: formData.dimensions,
        description: formData.description,
        image: imageUrl as string,
        edition_count: formData.editionCount,
        edition_year_1: formData.editionYear1,
        edition_year_2: formData.editionYear2,
        edition_year_3: formData.editionYear3,
        edition_year_4: formData.editionYear4,
        cover_illustrator: formData.coverIllustrator,
        illustrator: formData.illustrator,
        artist: formData.artist,
        position: parseInt(formData.position) || 0
      };

      if (editingId) {
        // Update in Supabase
        const { data, error } = await supabase
          .from('books')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single();
          
        if (error) throw error;
        
        // Update local state
        setAdminBooks(prev => prev.map(b => b.id === editingId ? { ...b, ...data, price: data.price.toString(), discountPrice: data.discount_price?.toString() } as any : b));
        setSuccessMsg(`"${formData.title}" uğurla yeniləndi!`);
      } else {
        // Insert to Supabase
        const { data, error } = await supabase
          .from('books')
          .insert(payload)
          .select()
          .single();
          
        if (error) throw error;
        
        // Add to local state
        const newBook: Book = {
          ...payload,
          id: data.id,
          price: payload.price.toString(),
          discountPrice: payload.discount_price?.toString(),
          categorySlugs: payload.category_slugs,
          pageCount: payload.page_count,
          publishDate: payload.publish_date,
          ageCategory: payload.age_category,
          coverType: payload.cover_type,
          stars: 5,
          reviewCount: 0,
          reviews: []
        };
        
        setAdminBooks(prev => [newBook, ...prev]);
        setSuccessMsg(`"${formData.title}" uğurla əlavə edildi və 'Yeni Kitablar' bölümünə salındı!`);
      }
      
      // Formu avtomatik təmizləmirik
      // Refetch data to ensure sync
      loadData();

    } catch (err: any) {
      alert(err.message || "Xəta baş verdi.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider mb-2">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Giriş etmək üçün məlumatları yazın</p>
          </div>
          
          {loginError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium border border-red-200">{loginError}</div>}
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-poçt ünvanı</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316]" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Şifrə</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316]" required />
            </div>
            <button type="submit" className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 rounded transition-colors mt-2">
              Daxil Ol
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#f97316] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 uppercase">İdarəetmə Paneli</h1>
          <p className="text-gray-500 mt-1">Yeni nəşr əlavə edin və rəyləri idarə edin</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded transition-colors">
          Çıxış et
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-8 flex items-center gap-3 font-medium shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {successMsg}
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-gray-200" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        {["books", "reviews", "banners", "news", "categories", "menus", "pages", "files"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2.5 font-bold rounded-t-md whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#f97316] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab === 'books' && '📚 Nəşrlər'}
            {tab === 'reviews' && '💬 Rəylər'}
            {tab === 'banners' && '🖼️ Bannerlər'}
            {tab === 'news' && '📰 Xəbərlər'}
            {tab === 'categories' && '📑 Kateqoriyalar'}
            {tab === 'menus' && '🔗 Menyular'}
            {tab === 'pages' && '📄 Səhifələr'}
            {tab === 'files' && '📁 Fayllar (PDF)'}
          </button>
        ))}
      </div>

      {activeTab === "books" && (
      <div className="mb-12 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 uppercase border-b border-gray-200 pb-2">{editingId ? "Nəşri Redaktə Et" : "Yeni Nəşr Yüklə"}</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
          
          {/* Main Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kitabın Adı *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: Qraf Monte Kristo" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Müəllif *</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: Aleksandr Düma" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tərcüməçi</label>
              <input type="text" name="translator" value={formData.translator} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: Əli Əliyev" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ISBN</label>
              <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: 978-9952-..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Orijinal ad</label>
              <input type="text" name="originalName" value={formData.originalName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Orijinal ad (Məs: The Count of Monte Cristo)" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nəşr sayı</label>
              <input type="text" name="editionCount" value={formData.editionCount} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: 3" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Janrlar və Kateqoriyalar *</label>
              <div className="max-h-48 overflow-y-auto p-2 border border-gray-300 rounded grid grid-cols-2 gap-2 bg-white">
                {adminCategories.map(cat => (
                  <label key={cat.slug} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      name="category"
                      value={cat.slug}
                      checked={formData.category.includes(cat.slug)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          category: checked 
                            ? [...prev.category, cat.slug]
                            : prev.category.filter(c => c !== cat.slug)
                        }));
                      }}
                      className="accent-[#f97316] w-4 h-4"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Qiymət (AZN) *</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: 12.50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Endirimli Qiymət</label>
                <input type="number" step="0.01" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: 9.99" />
              </div>
            </div>
          </div>

          {/* Specs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-5 rounded border border-gray-100 mt-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Səhifə Sayı *</label>
              <input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Çap Tarixi *</label>
              <input type="text" name="publishDate" value={formData.publishDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: 2026-cı il" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Yaş Kateqoriyası</label>
              <input type="text" name="ageCategory" value={formData.ageCategory} onChange={handleChange} placeholder="Məs: 12+, 0-25" className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cildin Növü</label>
              <select name="coverType" value={formData.coverType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none bg-white">
                <option value="Yumşaq">Yumşaq</option>
                <option value="Sərt">Sərt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ölçüsü (sm) *</label>
              <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: 12x19" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">I Nəşr İli</label>
              <input type="text" name="editionYear1" value={formData.editionYear1} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">II Nəşr İli</label>
              <input type="text" name="editionYear2" value={formData.editionYear2} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">III Nəşr İli</label>
              <input type="text" name="editionYear3" value={formData.editionYear3} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">IV Nəşr İli</label>
              <input type="text" name="editionYear4" value={formData.editionYear4} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cild İllüstratoru</label>
              <input type="text" name="coverIllustrator" value={formData.coverIllustrator} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">İllüstrator</label>
              <input type="text" name="illustrator" value={formData.illustrator} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Rəssam</label>
              <input type="text" name="artist" value={formData.artist} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sıra nömrəsi (Saytda düzülüş)</label>
              <input type="number" name="position" value={formData.position} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: 15" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kitab haqqında (Məzmun) *</label>
            <div className="bg-white h-80 mb-12"><ReactQuill theme="snow" modules={quillModules} value={formData.description} onChange={(val: string) => setFormData(prev => ({ ...prev, description: val }))} className="h-full" placeholder="Nəşr haqqında məlumat yazın..." /></div>
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 relative hover:bg-gray-100 transition-colors">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-48 rounded shadow-md overflow-hidden mb-3">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
                <span className="text-sm font-bold text-[#f97316]">Başqa şəkil seçmək üçün klikləyin</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="font-semibold text-gray-700">Kitabın şəklini yükləmək üçün bura klikləyin və ya şəkli bura sürükləyin</span>
                <span className="text-xs mt-1">Imgbb API vasitəsilə avtomatik optimizə ediləcək</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200 mt-2 flex items-center gap-4">
            <button 
              type="submit" 
              disabled={isUploading}
              className={`flex-1 md:flex-none px-10 py-3 text-white font-bold rounded flex items-center justify-center gap-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f97316] hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg'}`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Yüklənir (Imgbb)...
                </>
              ) : (
                <>
                  {editingId ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  )}
                  {editingId ? "Dəyişiklikləri Yadda Saxla" : "Nəşri Əlavə Et"}
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={cancelEdit}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded transition-colors"
            >
              {editingId ? "Redaktəni Ləğv Et" : "Formu Təmizlə (Yeni)"}
            </button>
          </div>

        </form>
      </div>
      )}

      {/* REVIEWS ADMIN SECTION */}
      {activeTab === 'reviews' && (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 animate-fade-in">
        <h2 className="text-xl font-bold text-gray-700 mb-6 uppercase border-b border-gray-200 pb-2">Rəylərin İdarə Edilməsi</h2>
        
        {adminReviews.length === 0 ? (
          <p className="text-gray-500 italic">Heç bir rəy tapılmadı.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {adminReviews.map(review => (
              <div key={review.id} className="bg-gray-50 border border-gray-200 p-4 rounded flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">{review.name}</span>
                  <span className="text-xs bg-orange-100 text-[#f97316] font-bold px-2 py-1 rounded">Kitab: {review.bookTitle}</span>
                </div>
                <p className="text-gray-600 italic">"{review.comment}"</p>
                
                {review.adminReply ? (
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded mt-2 relative group">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-bold text-[#f97316] text-sm">Parafr.az (Siz)</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <p className="text-gray-700 text-sm">{review.adminReply}</p>
                    <button 
                      onClick={() => deleteReply(review.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold underline transition-opacity"
                    >
                      Cavabı sil
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="İstifadəçiyə cavab yazın..." 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none text-sm"
                      value={replyText[review.id] || ""}
                      onChange={(e) => handleReplyChange(review.id, e.target.value)}
                    />
                    <button 
                      onClick={() => submitReply(review.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded text-sm transition-colors"
                    >
                      Cavabla
                    </button>
                  </div>
                )}
                
                {/* Delete Entire Review Button - Always Visible */}
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
                  <button 
                    onClick={() => deleteReview(review.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-bold transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Rəyi tamamilə sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* BOOKS LIST SECTION (PART OF BOOKS TAB) */}
      {activeTab === 'books' && (
      <div className="mt-12">
        
        {/* Filter Row */}
        <div className="bg-white border border-gray-200 mb-6 rounded-md shadow-sm">
          <div className="p-4 border-b border-gray-100">
             <h2 className="text-xl font-bold text-gray-700 uppercase">Bütün məqalələr (Kitablar)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50/50">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Məqalənin (Kitabın) adı</label>
              <input type="text" placeholder="Axtar..." value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Məqalənin şəkli</label>
              <input type="text" placeholder="Məs: var, yoxdur, şəkil adı..." className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Məqalənin kateqoriyası</label>
              <input type="text" placeholder="Kateqoriya adı ilə axtar..." className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Departamnet (Müəllif)</label>
              <input type="text" placeholder="Müəllif adı ilə axtar..." className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex items-end gap-2">
              <button className="px-4 py-1.5 bg-[#007bff] hover:bg-blue-600 text-white text-sm font-bold rounded shadow-sm flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Axtar
              </button>
              <button onClick={() => setBookSearch("")} className="px-4 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold rounded shadow-sm">
                Sıfırla
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-x-auto">
          {adminBooks.length === 0 ? (
            <p className="text-gray-500 italic p-6">Hələ heç bir nəşr əlavə edilməyib.</p>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead className="border-b-2 border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-bold text-gray-800">Məqalənin adı</th>
                  <th className="py-3 px-4 text-center text-sm font-bold text-gray-800 w-24">Məqalənin şəkli</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-gray-800">Məqalənin kateqoriyası</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-gray-800">Departamnet</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-gray-800">Tarix</th>
                  <th className="py-3 px-4 text-center text-sm font-bold text-gray-800 w-24">Dəyiş</th>
                  <th className="py-3 px-4 text-center text-sm font-bold text-gray-800 w-24">Sil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {adminBooks.filter(b => b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()) || (b.isbn && b.isbn.includes(bookSearch))).map((b, i) => (
                  <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700">{b.title}</div>
                      {b.discountPrice && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold mt-1 inline-block">ENDİRİM</span>}
                    </td>
                    <td className="py-4 px-4 flex justify-center">
                      <div className="relative w-12 h-16 bg-gray-100 overflow-hidden border border-gray-200">
                        <Image src={b.image} alt="Cover" fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {b.categorySlugs && b.categorySlugs.length > 0 ? b.categorySlugs.join(", ") : "—"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{b.author}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{b.publishDate}</td>
                    <td className="py-4 px-4 text-center">
                      <button onClick={() => handleEditBook(b)} className="px-4 py-1.5 bg-[#ffc107] hover:bg-yellow-500 text-gray-900 rounded text-sm font-bold flex items-center justify-center gap-1 mx-auto shadow-sm transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                        Dəyiş
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button onClick={() => handleDeleteBook(b.id)} className="px-3 py-1.5 text-gray-500 hover:text-red-500 font-bold transition-colors">
                        -
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      )}

            {/* BANNERS TAB */}
      {activeTab === 'banners' && (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 uppercase border-b border-gray-200 pb-2">{editingId ? "Banneri Redaktə Et" : "Yeni Banner Yüklə (Maks 5)"}</h2>
        
        <form onSubmit={handleBannerSubmit} className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Yeri və Sırası *</label>
              <select value={bannerFormData.position} onChange={e => setBannerFormData({...bannerFormData, position: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none">
                <optgroup label="Əsas Slayder (Orta Hissə)">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>Əsas Slayder - Şəkil {n}</option>)}
                </optgroup>
                <optgroup label="Üst Banner (Logoların Arası)">
                  {[11,12,13,14,15].map(n => <option key={n} value={n}>Üst Banner - Şəkil {n - 10}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Keçid Linki (İstəyə bağlı)</label>
              <input type="text" value={bannerFormData.link} onChange={e => setBannerFormData({...bannerFormData, link: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: /yeni-kitablar" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Şəkli *</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-[300px] h-[100px] md:h-[150px] rounded shadow-md overflow-hidden mb-3">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                  <span className="text-sm font-bold text-[#f97316]">Dəyişmək üçün klikləyin</span>
                </div>
              ) : (
                <span className="font-semibold text-gray-500">Şəkli yükləmək üçün bura klikləyin (16:9 format)</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" disabled={isUploading} className="flex-1 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded transition-colors flex items-center justify-center gap-2">
              {isUploading ? "Yüklənir..." : (editingId ? "Yadda Saxla" : "Banner Əlavə Et")}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded transition-colors">
                Ləğv Et
              </button>
            )}
          </div>
        </form>

        <h2 className="text-xl font-bold text-gray-700 mb-6 uppercase border-b border-gray-200 pb-2">Mövcud Bannerlər</h2>
        {adminBanners.length === 0 ? (
          <p className="text-gray-500 italic bg-white p-6 rounded shadow-md">Heç bir banner yoxdur.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminBanners.map(b => (
              <div key={b.id} className="bg-white border border-gray-200 p-4 rounded shadow-sm">
                <div className="relative w-full aspect-[16/9] bg-gray-100 rounded mb-3">
                  <Image src={b.image} alt="Banner" fill className="object-cover rounded" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      {b.position >= 10 ? `Üst Banner (Şəkil ${b.position - 10})` : `Əsas Slayder (Şəkil ${b.position})`}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{b.link || "Link yoxdur"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditBanner(b)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-bold border border-blue-200">Redaktə</button>
                    <button onClick={() => handleDeleteBanner(b.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm font-bold border border-red-200">Sil</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

            {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editingCatId ? "Kateqoriyanı Düzənlə" : "Yeni Kateqoriya"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <input type="text" placeholder="Kateqoriya adı (məs: Romanlar)" value={catName} onChange={e => setCatName(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              <input type="text" placeholder="Slug (məs: romanlar)" value={catSlug} onChange={e => setCatSlug(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={catType} onChange={e => setCatType(e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white">
                <option value="kitab">📚 Kitab</option>
                <option value="xeber">📰 Xəbər</option>
                <option value="neshr">📖 Nəşr</option>
                <option value="diger">📁 Digər</option>
              </select>
              <div className="flex gap-2">
                <button onClick={handleAddCategory} className="flex-1 bg-[#f97316] text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                  {editingCatId ? "Yadda saxla" : "Əlavə et"}
                </button>
                {editingCatId && (
                  <button onClick={() => { setEditingCatId(null); setCatName(""); setCatSlug(""); setCatType("kitab"); }} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 transition-colors">
                    Ləğv et
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Slug — İngiliscə, boşluqsuz və kiçik hərflərlə (məs: tarixi-romanlar). Tip — bu kateqoriyada hansı növ məzmun olacağını göstərir.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mövcud Kateqoriyalar</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b border-gray-200">ID</th>
                    <th className="p-3 border-b border-gray-200">Ad</th>
                    <th className="p-3 border-b border-gray-200">Slug</th>
                    <th className="p-3 border-b border-gray-200">Tip</th>
                    <th className="p-3 border-b border-gray-200">Status</th>
                    <th className="p-3 border-b border-gray-200 text-right">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody>
                  {adminCategories.map(cat => (
                    <tr key={cat.slug} className={`border-b border-gray-100 hover:bg-gray-50 ${editingCatId === cat.id ? 'bg-orange-50' : ''}`}>
                      <td className="p-3">{cat.id || '-'}</td>
                      <td className="p-3 font-semibold">{cat.name}</td>
                      <td className="p-3 text-gray-500">{cat.slug}</td>
                      <td className="p-3 text-gray-500">{cat.type === 'xeber' ? '📰 Xəbər' : cat.type === 'neshr' ? '📖 Nəşr' : cat.type === 'diger' ? '📁 Digər' : '📚 Kitab'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${cat.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {cat.active !== false ? 'Aktiv' : 'Deaktiv'}
                        </span>
                      </td>
                      <td className="p-3 text-right flex gap-2 justify-end">
                        <button onClick={() => handleToggleCategoryActive(cat.id!, cat.active !== false)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                          {cat.active !== false ? 'Gizlət' : 'Göstər'}
                        </button>
                        <button onClick={() => handleEditCategory(cat)} className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">Düzənlə</button>
                        <button onClick={() => handleDeleteCategory(cat.id!)} className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200">Sil</button>
                      </td>
                    </tr>
                  ))}
                  {adminCategories.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">Heç bir kateqoriya yoxdur.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MENUS TAB */}
      {activeTab === 'menus' && (
        <div className="space-y-8">
          {/* TOP NAV MANAGEMENT */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🔝 Üst Menyu</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <input type="text" placeholder="Menyu adı" value={navName} onChange={e => setNavName(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              <input type="text" placeholder="Link (məs: /haqqimizda)" value={navHref} onChange={e => setNavHref(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              <input type="number" placeholder="Sıra (1, 2, 3...)" value={navPosition} onChange={e => setNavPosition(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              <div className="flex gap-2">
                <button onClick={handleAddNav} className="flex-1 bg-[#f97316] text-white font-bold py-2 px-3 rounded hover:bg-orange-600 transition-colors text-sm">
                  {editingNavId ? "Yadda saxla" : "Əlavə et"}
                </button>
                {editingNavId && (
                  <button onClick={() => { setEditingNavId(null); setNavName(""); setNavHref(""); setNavPosition(""); }} className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">Ləğv</button>
                )}
              </div>
            </div>
            <table className="w-full text-left border-collapse mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b text-sm">Sıra</th>
                  <th className="p-2 border-b text-sm">Ad</th>
                  <th className="p-2 border-b text-sm">Link</th>
                  <th className="p-2 border-b text-sm text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {navItems.map(n => (
                  <tr key={n.id} className={`border-b border-gray-100 hover:bg-gray-50 ${editingNavId === n.id ? 'bg-orange-50' : ''}`}>
                    <td className="p-2">{n.position}</td>
                    <td className="p-2 font-semibold">{n.name}</td>
                    <td className="p-2 text-gray-500 text-sm">{n.href}</td>
                    <td className="p-2 text-right flex gap-2 justify-end">
                      <button onClick={() => { setEditingNavId(n.id!); setNavName(n.name); setNavHref(n.href); setNavPosition(String(n.position)); }} className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200">Düzənlə</button>
                      <button onClick={() => handleDeleteNav(n.id!)} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER LINKS MANAGEMENT */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⬇️ Alt Menyu (Footer)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <input type="text" placeholder="Menyu adı" value={footerName} onChange={e => setFooterName(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              <input type="text" placeholder="Link (məs: /elaqe)" value={footerHref} onChange={e => setFooterHref(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              <input type="number" placeholder="Sıra (1, 2, 3...)" value={footerPosition} onChange={e => setFooterPosition(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              <div className="flex gap-2">
                <button onClick={handleAddFooter} className="flex-1 bg-[#f97316] text-white font-bold py-2 px-3 rounded hover:bg-orange-600 transition-colors text-sm">
                  {editingFooterId ? "Yadda saxla" : "Əlavə et"}
                </button>
                {editingFooterId && (
                  <button onClick={() => { setEditingFooterId(null); setFooterName(""); setFooterHref(""); setFooterPosition(""); }} className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">Ləğv</button>
                )}
              </div>
            </div>
            <table className="w-full text-left border-collapse mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b text-sm">Sıra</th>
                  <th className="p-2 border-b text-sm">Ad</th>
                  <th className="p-2 border-b text-sm">Link</th>
                  <th className="p-2 border-b text-sm text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {footerLinksState.map(f => (
                  <tr key={f.id} className={`border-b border-gray-100 hover:bg-gray-50 ${editingFooterId === f.id ? 'bg-orange-50' : ''}`}>
                    <td className="p-2">{f.position}</td>
                    <td className="p-2 font-semibold">{f.name}</td>
                    <td className="p-2 text-gray-500 text-sm">{f.href}</td>
                    <td className="p-2 text-right flex gap-2 justify-end">
                      <button onClick={() => { setEditingFooterId(f.id!); setFooterName(f.name); setFooterHref(f.href); setFooterPosition(String(f.position)); }} className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200">Düzənlə</button>
                      <button onClick={() => handleDeleteFooter(f.id!)} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGES TAB */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editingPage ? "Səhifəni Düzənlə" : "Yeni Səhifə Yarat"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Slug (məs: haqqimizda)</label>
                <input type="text" value={pageSlug} onChange={e => setPageSlug(e.target.value)} disabled={!!editingPage} className="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Səhifə Başlığı</label>
                <input type="text" value={pageTitle} onChange={e => setPageTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Məzmun</label>
              <div className="bg-white h-96 mb-12"><ReactQuill theme="snow" modules={quillModules} value={pageContent} onChange={setPageContent} className="h-full" placeholder="Mətn buraya yazılır..." /></div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSavePage} className="bg-[#f97316] text-white font-bold py-2 px-6 rounded hover:bg-orange-600">Yadda saxla</button>
              {editingPage && (
                <button onClick={() => { setEditingPage(null); setPageSlug(""); setPageTitle(""); setPageContent(""); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Ləğv et</button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mövcud Səhifələr (Bazada olanlar)</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border-b">Slug</th>
                  <th className="p-3 border-b">Başlıq</th>
                  <th className="p-3 border-b text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {adminPages.map(p => (
                  <tr key={p.slug} className={`border-b hover:bg-gray-50 ${editingPage === p.slug ? 'bg-orange-50' : ''}`}>
                    <td className="p-3 font-semibold">{p.slug}</td>
                    <td className="p-3">{p.title}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleEditPage(p)} className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">Düzənlə</button>
                      <button onClick={() => handleDeletePage(p.slug)} className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 ml-2">Sil</button>
                    </td>
                  </tr>
                ))}
                {adminPages.length === 0 && (
                  <tr><td colSpan={3} className="p-4 text-center text-gray-500">Heç bir səhifə tapılmadı.</td></tr>
                )}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-gray-500">* Məsələn: Əgər 'haqqimizda' üçün mətn dəyişmək istəyirsinizsə, yuxarıda yeni səhifə yaradıb Slug yerinə 'haqqimizda' yazın. Bazaya düşəndən sonra standart mətni əvəz edəcək.</p>
          </div>
        </div>
      )}

      {/* NEWS TAB */}
      {activeTab === 'news' && (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 uppercase border-b border-gray-200 pb-2">{editingId ? "Xəbəri Redaktə Et" : "Yeni Xəbər (Məqalə) Yüklə"}</h2>
        
        <form onSubmit={handleNewsSubmit} className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 mb-12">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Xəbərin Başlığı *</label>
            <input type="text" value={newsFormData.title} onChange={e => setNewsFormData(prev => ({...prev, title: e.target.value}))} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" placeholder="Məs: Parafraza yeni kitablar əlavə edildi" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tarix</label>
            <input type="date" value={newsFormData.date} onChange={e => setNewsFormData(prev => ({...prev, date: e.target.value}))} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#f97316] focus:outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Xəbərin Mətni *</label>
            <div className="bg-white h-80 mb-12"><ReactQuill theme="snow" modules={quillModules} value={newsFormData.content} onChange={(val: string) => setNewsFormData(prev => ({...prev, content: val}))} className="h-full" placeholder="Mətn..." /></div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Xəbər Şəkli *</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-[200px] h-[150px] rounded shadow-md overflow-hidden mb-3">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                  <span className="text-sm font-bold text-[#f97316]">Dəyişmək üçün klikləyin</span>
                </div>
              ) : (
                <span className="font-semibold text-gray-500">Şəkli yükləmək üçün bura klikləyin</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" disabled={isUploading} className="flex-1 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded transition-colors flex items-center justify-center gap-2">
              {isUploading ? "Yüklənir..." : (editingId ? "Yadda Saxla" : "Xəbəri Əlavə Et")}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded transition-colors">
                Ləğv Et
              </button>
            )}
          </div>
        </form>

        <h2 className="text-xl font-bold text-gray-700 mb-6 uppercase border-b border-gray-200 pb-2">Bütün Xəbərlər</h2>
        {adminNews.length === 0 ? (
          <p className="text-gray-500 italic bg-white p-6 rounded shadow-md">Heç bir xəbər yoxdur.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adminNews.map(n => (
              <div key={n.id} className="bg-white border border-gray-200 p-4 rounded shadow-sm flex flex-col gap-3">
                <div className="relative w-full aspect-video bg-gray-100 rounded">
                  <Image src={n.image} alt="News" fill className="object-cover rounded" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">{n.date}</p>
                  <h3 className="font-bold text-gray-800 line-clamp-1">{n.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{n.content}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2">
                  <button onClick={() => handleEditNews(n)} className="flex-1 py-1 bg-blue-50 text-blue-600 rounded text-sm font-bold border border-blue-200">Redaktə</button>
                  <button onClick={() => handleDeleteNews(n.id)} className="flex-1 py-1 bg-red-50 text-red-600 rounded text-sm font-bold border border-red-200">Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {activeTab === "files" && (<div className="animate-fade-in"><PdfUploader /></div>)}

    </div>
  );
}
