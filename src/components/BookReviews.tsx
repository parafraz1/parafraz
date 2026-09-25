"use client";

import React, { useState } from "react";
import StarRating from "./StarRating";
import { Review } from "@/lib/data";
import { supabase } from "@/lib/supabase";

interface BookReviewsProps {
  initialReviews: Review[];
  bookId: number;
}

export default function BookReviews({ initialReviews, bookId }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    const dateStr = new Date().toISOString().split("T")[0];

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          book_id: bookId,
          name: name,
          rating: rating,
          comment: comment,
          date: dateStr
        })
        .select()
        .single();
        
      if (error) throw error;

      const newReview: Review = {
        id: data.id,
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        date: data.date,
      };

      setReviews([newReview, ...reviews]);
      setName("");
      setComment("");
      setRating(5);
      setHoverRating(0);
      alert("Rəyiniz uğurla əlavə edildi!");
    } catch (err) {
      alert("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 bg-white border border-gray-100 p-6 md:p-10 rounded-lg shadow-sm">
      <h2 className="text-[12px] xl:text-[13px] tracking-wider font-bold text-gray-800 uppercase border-b border-gray-200 pb-4 mb-8">İstifadəçi rəyləri</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Review Form */}
        <div>
          <h3 className="font-bold text-gray-700 mb-4 text-lg">Öz rəyinizi bildirin</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Adınız və soyadınız</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız..." 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Qiymətləndirmə</label>
              <div className="flex gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    width="28" height="28" 
                    viewBox="0 0 24 24" 
                    fill={(hoverRating || rating) >= star ? "#fbbf24" : "none"} 
                    stroke={(hoverRating || rating) >= star ? "#fbbf24" : "#d1d5db"} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                    className="transition-colors"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Şərhiniz</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Kitab haqqında fikirləriniz..." 
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] resize-none"
                required
              ></textarea>
            </div>

            <button 
            type="submit" 
            disabled={isSubmitting}
            className={`px-8 py-3 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded shadow-md transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Göndərilir...' : 'Rəyini Göndər'}
          </button>
          </form>
        </div>

        {/* Reviews List */}
        <div>
          <h3 className="font-bold text-gray-700 mb-4 text-lg">Son rəylər ({reviews.length})</h3>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">Hələ heç bir rəy yazılmayıb. İlk rəy yazan siz olun!</p>
          ) : (
            <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{review.name}</span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} showCount={false} />
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">{review.comment}</p>
                  
                  {review.adminReply && (
                    <div className="ml-4 mt-4 bg-blue-50 border border-blue-100 p-3 rounded shadow-sm relative">
                      <div className="absolute -left-2 top-4 w-4 h-4 bg-blue-50 rotate-45 border-l border-b border-blue-100"></div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-[#f97316] text-sm">Parafr.az</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <p className="text-gray-700 text-sm">{review.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
