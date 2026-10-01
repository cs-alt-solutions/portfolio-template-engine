/* src/components/portfolio/GalleryGrid.tsx */
'use client';

import React, { useState } from 'react';
import { getFonts } from './content-engine/utils'; 
import { THEME_REGISTRY } from '@/utils/themes';
import { Layers } from 'lucide-react';
import ServiceProofModal from './ServiceProofModal'; // 🚀 Reusing your gorgeous modal!

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
  secondaryBrandColor?: string;
  isLightMode?: boolean;
}

export default function GalleryGrid({ 
  items, galleryHeading, themeStyle = 'industrial', brandColor = 'cyan-500', secondaryBrandColor, isLightMode 
}: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // Modal State for Project Deep-Dives
  const [activeProject, setActiveProject] = useState<{ title: string, images: GalleryItem[], description?: string } | null>(null);

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const activeSecondary = secondaryBrandColor || brandColor;
  const accentColorClass = theme.useBrandAccent ? `text-${brandColor}` : 'text-white';
  const bgColor = isLightMode ? 'bg-white border-t border-stone-200' : 'bg-zinc-900 border-t border-zinc-800';
  
  const validItems = items?.filter((item: GalleryItem) => item && item.imageUrl && item.imageUrl.trim() !== '') || [];
  if (!validItems || validItems.length === 0) return null;

  const categories: string[] = ['All', ...Array.from(new Set(validItems.map((item: GalleryItem) => item.category).filter(Boolean) as string[]))];
  const filteredItems = activeFilter === 'All' 
    ? validItems 
    : validItems.filter((item: GalleryItem) => item.category === activeFilter);

  // 🚀 SMART GROUPING ENGINE: Groups images by Title. If no title exists, groups by ID (keeps them separate).
  const groupedProjects = filteredItems.reduce((acc, item) => {
    const key = item.title?.trim() ? item.title.trim() : item.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, GalleryItem[]>);

  const fonts = getFonts(themeStyle);
  const shapeRadius = themeStyle === 'elegant' ? 'rounded-sm' : 
                      ['industrial', 'neo', 'cyberpunk', 'editorial'].includes(themeStyle) ? 'rounded-none' : 
                      themeStyle === 'organic' ? 'rounded-[30px]' : 'rounded-2xl';

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

        {/* MASONRY GRID OVERHAUL */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {Object.entries(groupedProjects).map(([key, projectImages], index) => {
            const coverImage = projectImages[0];
            const isProjectGroup = projectImages.length > 1;
            const displayTitle = coverImage.title || '';

            return (
              <div 
                key={key} 
                onClick={() => setActiveProject({ title: displayTitle || 'Project Details', images: projectImages, description: coverImage.description })}
                className={`group relative overflow-hidden ${shapeRadius} shadow-lg transition-all duration-300 hover:shadow-2xl break-inside-avoid bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 cursor-pointer`}
              >
                {/* 🚀 THE COVER IMAGE */}
                <img 
                  src={coverImage.imageUrl} 
                  alt={displayTitle || `Gallery Image ${index + 1}`} 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* 🚀 PROJECT BADGE (Only shows if multiple photos share a title) */}
                {isProjectGroup && (
                  <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg animate-in fade-in duration-500">
                    <Layers size={12} className={accentColorClass} />
                    <span className="text-[9px] text-white font-bold tracking-widest uppercase">{projectImages.length} Photos</span>
                  </div>
                )}

                <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`} />
                
                {/* DETAILS OVERLAY */}
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  {coverImage.category && (
                    <span className={`inline-block px-2 py-1 mb-2 text-[10px] font-black uppercase tracking-widest rounded bg-${activeSecondary} text-zinc-950`}>
                      {coverImage.category}
                    </span>
                  )}
                  {displayTitle && <h4 className={`text-lg font-bold text-white mb-1 ${fonts.heading}`}>{displayTitle}</h4>}
                  {coverImage.description && <p className={`text-xs text-zinc-300 line-clamp-2 ${fonts.body}`}>{coverImage.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 PROJECT DEEP-DIVE MODAL */}
      <ServiceProofModal
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
        title={activeProject?.title || 'Gallery'}
        images={activeProject?.images || []}
        description={activeProject?.description}
        themeStyle={themeStyle}
        brandColor={brandColor}
      />
    </div>
  );
}