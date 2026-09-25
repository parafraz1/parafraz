import React from 'react';

export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Yüklənir...</p>
      </div>
    </div>
  );
}
