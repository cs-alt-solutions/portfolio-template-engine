/* src/components/portfolio/gallery/GalleryGrid.tsx */
'use client';

import React, { useState } from 'react';
import { getFonts } from '../content-engine/utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { Layers } from 'lucide-react';
import ServiceProofModal from '../ServiceProofModal';

export interface GalleryItem {
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
  secondaryBrandColor?: string;
  isLightMode?: boolean;
  layout?: 'masonry' | 'structured'; // 🚀 Added layout toggle
}

export default function GalleryGrid({ 
  items, galleryHeading, themeStyle = 'industrial', brandColor = 'cyan-500', secondaryBrandColor, isLightMode, layout = 'masonry'
}: GalleryGridProps) {
  
  const [activeProject, setActiveProject] = useState<{ title: string, images: GalleryItem[] } | null>(null);

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const activeSecondary = secondaryBrandColor || brandColor;
  const accentColorClass = theme.useBrandAccent ? `text-${brandColor}` : 'text-white';
  const bgColor = isLightMode ? 'bg-white border-t border-stone-200' : 'bg-zinc-900 border-t border-zinc-800';

  const validItems = items?.filter((item: GalleryItem) => item && item.imageUrl && item.imageUrl.trim() !== '') || [];
  if (!validItems || validItems.length === 0) return null;

  // Group images by their assigned Vault Folder (Category)
  const groupedProjects = validItems.reduce<Record<string, GalleryItem[]>>((acc, item) => {
    const key = item.category?.trim() ? item.category.trim() : 'Uncategorized Work';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const fonts = getFonts(themeStyle);
  
  // 🚀 Strictly enforce the theme's border radius (Fixes the round images on Industrial)
  const shapeRadius = theme.radius || 'rounded-none';

  return (
    <div id="gallery" className={`w-full py-20 ${bgColor}`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className={`${theme.accentText} ${theme.useBrandAccent ? `text-${brandColor}` : ''} font-mono text-sm tracking-[0.2em] uppercase mb-3`}>
              Our Work
            </h2>
            <h3 className={`text-3xl font-black ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
              {galleryHeading || 'Recent Projects'}
            </h3>
          </div>
        </div>

        {/* 🚀 DYNAMIC LAYOUT ENGINE */}
        <div className={layout === 'structured' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" 
          : "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        }>
          {Object.entries(groupedProjects).map(([folderName, projectImages]) => {
            const coverImage = projectImages[0];
            const isProjectGroup = projectImages.length > 1;

            return (
              <div 
                key={folderName} 
                onClick={() => setActiveProject({ title: folderName, images: projectImages })}
                className={`group relative overflow-hidden ${shapeRadius} transition-all duration-300 cursor-pointer ${
                  layout === 'structured'
                    ? `flex flex-col aspect-4/3 shadow-xl hover:shadow-2xl ${isLightMode ? 'bg-white border border-zinc-200' : 'bg-zinc-900/40 border border-white/5'}`
                    : `shadow-lg hover:shadow-2xl break-inside-avoid bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50`
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={coverImage.imageUrl} 
                  alt={folderName} 
                  className={`w-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out ${layout === 'structured' ? 'h-full' : 'h-auto'}`} 
                  loading="lazy" 
                />
                
                {isProjectGroup && (
                  <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg animate-in fade-in duration-500">
                    <Layers size={12} className={accentColorClass} />
                    <span className="text-[9px] text-white font-bold tracking-widest uppercase">{projectImages.length} Photos</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <span className={`inline-block px-2 py-1 mb-2 text-[10px] font-black uppercase tracking-widest rounded bg-${activeSecondary} text-zinc-950`}>
                    Folder
                  </span>
                  <h4 className={`text-lg font-bold text-white mb-1 ${fonts.heading}`}>{folderName}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ServiceProofModal
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
        title={activeProject?.title || 'Gallery'}
        images={activeProject?.images || []}
        themeStyle={themeStyle}
        brandColor={brandColor}
      />
    </div>
  );
}