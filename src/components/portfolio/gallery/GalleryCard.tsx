/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/gallery/GalleryCard.tsx */
'use client';

import React from 'react';
import { Layers, ArrowUpRight } from 'lucide-react';
import { ImageWatermark } from '../content-engine/utils';
import { GALLERY_DEFAULTS } from '@/utils/glossary';
import { GalleryItem } from './GalleryGrid';

interface GalleryCardProps {
  folderName: string;
  images: GalleryItem[];
  layout: 'masonry' | 'structured';
  isLightMode: boolean;
  shapeRadius: string;
  isSharp: boolean;
  accentColorClass: string;
  activeSecondary: string;
  headingFont: string;
  bodyFont: string;
  businessName?: string;
  onSelect: () => void;
}

export default function GalleryCard({
  folderName,
  images,
  layout,
  isLightMode,
  shapeRadius,
  isSharp,
  accentColorClass,
  activeSecondary,
  headingFont,
  bodyFont,
  businessName,
  onSelect,
}: GalleryCardProps) {
  const coverImage = images[0];
  const photoCount = images.length;
  const countLabel = `${photoCount} ${
    photoCount === 1 ? GALLERY_DEFAULTS.PHOTO_SINGULAR : GALLERY_DEFAULTS.PHOTO_PLURAL
  }`;

  return (
    <div
      onClick={onSelect}
      className={`group relative overflow-hidden ${shapeRadius} transition-all duration-300 cursor-pointer ${
        layout === 'structured'
          ? `flex flex-col aspect-4/3 shadow-xl hover:shadow-2xl border ${
              isLightMode ? 'bg-white border-zinc-200' : 'bg-zinc-900/50 border-white/10'
            }`
          : `shadow-lg hover:shadow-2xl break-inside-avoid border ${
              isLightMode ? 'bg-zinc-100 border-zinc-200/80' : 'bg-zinc-900 border-zinc-800/80'
            }`
      }`}
    >
      <img
        src={coverImage.imageUrl}
        alt={folderName}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        className={`w-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out select-none pointer-events-none ${
          layout === 'structured' ? 'h-full' : 'h-auto'
        }`}
        loading="lazy"
      />

      <ImageWatermark text={businessName} />

      {photoCount > 1 && (
        <div
          className={`absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1.5 flex items-center gap-1.5 border border-white/15 shadow-lg ${
            isSharp ? 'rounded-none' : 'rounded-full'
          }`}
        >
          <Layers size={12} className={accentColorClass} />
          <span className="text-[9px] text-white font-bold tracking-widest uppercase">{countLabel}</span>
        </div>
      )}

      {/* Smooth bottom gradient scrim for effortless text contrast */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent group-hover:from-black/95 group-hover:via-black/45 transition-all duration-300 z-10 pointer-events-none" />

      {/* Full-width title + sleek action cue underneath (zero truncation) */}
      <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 z-20 flex flex-col gap-1.5">
        <h4 className={`text-lg md:text-xl font-bold text-white leading-snug text-balance ${headingFont}`}>
          {folderName}
        </h4>

        {coverImage.title && coverImage.title.trim().toLowerCase() !== folderName.trim().toLowerCase() && (
          <p className={`text-xs text-zinc-300/90 leading-snug ${bodyFont}`}>
            {coverImage.title}
          </p>
        )}

        <div className="pt-1 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest text-${activeSecondary} group-hover:underline underline-offset-4 transition-all`}
          >
            {GALLERY_DEFAULTS.VIEW_SET_LABEL}
          </span>
          <ArrowUpRight
            size={13}
            className={`text-${activeSecondary} transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
          />
        </div>
      </div>
    </div>
  );
}