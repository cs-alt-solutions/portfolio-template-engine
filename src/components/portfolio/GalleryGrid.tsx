// src/components/portfolio/GalleryGrid.tsx
import React from 'react';
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
  themeStyle?: string;
}

export default function GalleryGrid({ items, themeStyle = 'industrial' }: GalleryGridProps) {
  const validItems = items?.filter(item => item && item.imageUrl && item.imageUrl.trim() !== '') || [];
  const unattachedItems = validItems.filter(
    (item) => !item.category || item.category.trim() === ""
  );

  if (unattachedItems.length === 0) return null;

  const fonts = getFonts(themeStyle);
  const isLightMode = ['elegant', 'minimal', 'organic', 'editorial', 'neo', 'retropop'].includes(themeStyle);

  // 🚀 SINGLE SOURCE OF TRUTH: Map geometry cleanly to our theme registry!
  const shapeRadius = themeStyle === 'elegant' ? 'rounded-sm' : 
                      ['industrial', 'neo', 'cyberpunk', 'editorial'].includes(themeStyle) ? 'rounded-none' : 
                      themeStyle === 'organic' ? 'rounded-[30px]' : 'rounded-2xl';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {unattachedItems.map((item, i) => (
        <div 
          key={item.id || i} 
          className={`group relative overflow-hidden ${shapeRadius} shadow-lg transition-all duration-300 hover:shadow-2xl aspect-square bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.imageUrl} 
            alt={item.title || "Gallery image"} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          <div className={`absolute inset-0 bg-linear-to-t ${isLightMode ? 'from-white/95 via-white/50' : 'from-black/95 via-black/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
            {item.title && (
              <h3 className={`text-xl leading-snug ${isLightMode ? 'text-zinc-900 drop-shadow-sm' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'} ${fonts.heading}`}>
                {item.title}
              </h3>
            )}
            {item.description && (
              <p className={`mt-2 text-sm line-clamp-3 ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'} ${fonts.body}`}>
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}