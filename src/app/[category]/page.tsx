import React from "react";
import { fetchBooks, fetchCategories } from "@/lib/data";
import BookGrid from "@/components/BookGrid";
import { notFound } from "next/navigation";

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categories = await fetchCategories();
  const categoryData = categories.find(c => c.slug === resolvedParams.category);
  
  if (!categoryData) return { title: 'Kateqoriya tapılmadı' };
  
  return {
    title: `${categoryData.name} — Parafr.az`,
    description: `${categoryData.name} kateqoriyasındakı kitablar. Parafraz Nəşrləri.`,
    openGraph: {
      title: `${categoryData.name} — Parafr.az`,
      description: `${categoryData.name} kateqoriyasındakı kitablar.`,
      images: [{ url: "https://parafraz.vercel.app/Logo.png" }],
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  
  const [categories, allBooks] = await Promise.all([
    fetchCategories(),
    fetchBooks()
  ]);
  
  const categoryData = categories.find(c => c.slug === resolvedParams.category);
  
  if (!categoryData) {
    notFound();
  }
  const categoryBooks = allBooks.filter(b => b.categorySlugs.includes(resolvedParams.category));

  return (
    <div className="py-8 px-4 md:px-8 animate-fade-in w-full max-w-[1250px] mx-auto overflow-hidden">
      <div className="border-b-2 border-[#f97316] mb-8 pb-3">
        <h1 className="text-[12px] xl:text-[13px] font-bold text-gray-800 uppercase tracking-wider">{categoryData.name}</h1>
        <p className="text-gray-500 mt-2">Bu bölmədəki ümumi kitab sayı: <span className="font-bold text-[#f97316]">{categoryBooks.length}</span></p>
      </div>

      <BookGrid books={categoryBooks} />
    </div>
  );
}
