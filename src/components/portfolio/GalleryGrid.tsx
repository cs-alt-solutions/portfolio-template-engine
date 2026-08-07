// src/components/portfolio/GalleryGrid.tsx
'use client';

import React, { useState } from 'react';
import { getFonts } from './content-engine/utils'; 
import { THEME_REGISTRY } from '@/utils/themes';

interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  galleryHeading?: string;
  themeStyle?: string;
  brandColor?: string;
  isLightMode?: boolean;
}

export default function GalleryGrid({ items, galleryHeading, themeStyle = 'industrial', brandColor, isLightMode }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const accentColorClass = theme.useBrandAccent ? `text-${brandColor}` : '';
  const bgColor = isLightMode ? 'bg-white border-t border-stone-200' : 'bg-zinc-900 border-t border-zinc-800';

  const validItems = items?.filter((item: GalleryItem) => item && item.imageUrl && item.imageUrl.trim() !== '') || [];
  
  if (!validItems || validItems.length === 0) return null;

  // THE FIX: Explicitly cast the filtered array as string[] so TypeScript knows it is safe
  const categories: string[] = ['All', ...Array.from(new Set(validItems.map((item: GalleryItem) => item.category).filter(Boolean) as string[]))];

  const filteredItems = activeFilter === 'All' 
    ? validItems 
    : validItems.filter((item: GalleryItem) => item.category === activeFilter);

  const fonts = getFonts(themeStyle);

  // 🚀 SINGLE SOURCE OF TRUTH: Map geometry cleanly to our theme registry!
  const shapeRadius = themeStyle === 'elegant' ? 'rounded-sm' : 
                      ['industrial', 'neo', 'cyberpunk', 'editorial'].includes(themeStyle) ? 'rounded-none' : 
                      themeStyle === 'organic' ? 'rounded-[30px]' : 'rounded-2xl';

  return (
    <div id="gallery" className={`w-full py-20 ${bgColor}`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className={`${theme.accentText} ${accentColorClass} font-mono text-sm tracking-[0.2em] uppercase mb-3`}>
              Our Work
            </h2>
            <h3 className={`text-3xl font-black ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
              {galleryHeading || 'Recent Projects'}
            </h3>
          </div>
          
          {/* Dynamic Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeFilter === cat 
                      ? theme.useBrandAccent ? `bg-${brandColor} text-zinc-950` : 'bg-white text-zinc-950'
                      : isLightMode ? 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Masonry Columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item: GalleryItem, index: number) => (
            <div key={item.id || index} className={`group relative overflow-hidden ${shapeRadius} shadow-lg transition-all duration-300 hover:shadow-2xl break-inside-avoid bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50`}>
              <div className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`} />
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.imageUrl} 
                alt={item.title || `Gallery Image ${index + 1}`} 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              
              {/* Overlay Details */}
              {(item.title || item.description) && (
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  {item.category && (
                    <span className={`inline-block px-2 py-1 mb-2 text-[10px] font-black uppercase tracking-widest rounded bg-${brandColor} text-zinc-950`}>
                      {item.category}
                    </span>
                  )}
                  {item.title && <h4 className={`text-lg font-bold text-white mb-1 ${fonts.heading}`}>{item.title}</h4>}
                  {item.description && <p className={`text-xs text-zinc-300 line-clamp-2 ${fonts.body}`}>{item.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}