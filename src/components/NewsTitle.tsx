import React from 'react';

export default function NewsTitle({ title, className = "" }: { title: string, className?: string }) {
  if (title.includes(' - ')) {
    const parts = title.split(' - ');
    return (
      <h3 className={className}>
        <span className="text-gray-900">{parts[0]}</span> <span className="text-red-600">- {parts.slice(1).join(' - ')}</span>
      </h3>
    );
  }
  if (title.includes(' | ')) {
    const parts = title.split(' | ');
    return (
      <h3 className={className}>
        <span className="text-gray-900">{parts[0]}</span> <span className="text-red-600">| {parts.slice(1).join(' | ')}</span>
      </h3>
    );
  }
  return <h3 className={`${className} text-gray-900`}>{title}</h3>;
}
