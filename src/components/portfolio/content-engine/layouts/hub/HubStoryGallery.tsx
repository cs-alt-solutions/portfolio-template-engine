/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/hub/HubStoryGallery.tsx */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Images } from 'lucide-react';
import HubPhotoLightbox from './HubPhotoLightbox';

export interface HubPhoto {
  url: string;
  title?: string;
  description?: string;
  focalPoint?: { x: number; y: number };
  imageFit?: 'cover' | 'contain';
  imageZoom?: number;
}

interface HubStoryGalleryProps {
  photos: HubPhoto[];
  departmentTitle: string;
  isLightMode: boolean;
  themeStyle?: string;
  bodyFont: string;
  headingFont?: string;
  onZoomChange?: (zoomed: boolean) => void;
}

export default function HubStoryGallery({
  photos,
  departmentTitle,
  isLightMode,
  themeStyle = 'industrial',
  bodyFont,
  headingFont = '',
  onZoomChange,
}: HubStoryGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const total = photos.length;
  const safeIndex = total > 0 ? Math.min(activeIndex, total - 1) : 0;
  const activePhoto = photos[safeIndex];

  const setZoom = useCallback(
    (open: boolean) => {
      setIsZoomed(open);
      if (onZoomChange) onZoomChange(open);
    },
    [onZoomChange]
  );

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'Escape' && isZoomed) setZoom(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrev, handleNext, isZoomed, setZoom]);

  if (!activePhoto) return null;

  const isMidnight = themeStyle === 'midnight';
  const captionSurface = isLightMode
    ? 'bg-white/85 border-zinc-900/10 text-zinc-900'
    : isMidnight
      ? 'bg-zinc-950/90 border-white/10 text-white'
      : 'bg-zinc-900/80 border-white/10 text-white';

  const hasCaption = !!(activePhoto.title?.trim() || activePhoto.description?.trim());
  const isContain = activePhoto.imageFit === 'contain';
  const fx = activePhoto.focalPoint?.x ?? 50;
  const fy = activePhoto.focalPoint?.y ?? 50;
  const zoom = activePhoto.imageZoom ?? 1;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest opacity-80">
        <span className="flex items-center gap-2">
          <Images className="w-3.5 h-3.5" />
          <span>Story Gallery</span>
        </span>
        <span>
          {safeIndex + 1} / {total}
        </span>
      </div>

      {/* Spotlight Stage */}
      <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden border border-current/10 bg-black group">
        {isContain ? (
          <>
            <img
              src={activePhoto.url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-45 pointer-events-none"
            />
            <img
              src={activePhoto.url}
              alt={activePhoto.title || departmentTitle}
              onClick={() => setZoom(true)}
              className="relative z-10 w-full h-full object-contain cursor-zoom-in"
            />
          </>
        ) : (
          <img
            src={activePhoto.url}
            alt={activePhoto.title || departmentTitle}
            onClick={() => setZoom(true)}
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500"
            style={{
              objectPosition: `${fx}% ${fy}%`,
              transform: zoom > 1 ? `scale(${zoom})` : undefined,
              transformOrigin: `${fx}% ${fy}%`,
            }}
          />
        )}

        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label="Expand image"
          className="absolute top-3 right-3 z-20 p-2.5 rounded-xl bg-black/65 hover:bg-black/85 text-white border border-white/15 backdrop-blur-md opacity-85 group-hover:opacity-100 transition-all cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/65 hover:bg-brand-primary text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/65 hover:bg-brand-primary text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* High-Contrast Editorial Caption Card */}
      {hasCaption && (
        <div className={`px-5 py-4 rounded-2xl border flex gap-3.5 items-stretch ${captionSurface}`}>
          <div className="w-1 rounded-full bg-brand-primary shrink-0" />
          <div className="space-y-1 min-w-0">
            {activePhoto.title?.trim() && (
              <h5 className={`text-base md:text-lg font-black tracking-tight ${headingFont}`}>
                {activePhoto.title}
              </h5>
            )}
            {activePhoto.description?.trim() && (
              <p className={`text-sm leading-relaxed opacity-85 ${bodyFont}`}>
                {activePhoto.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Thumbnail Filmstrip */}
      {total > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {photos.map((photo, idx) => {
            const isActive = idx === safeIndex;
            const thumbX = photo.focalPoint?.x ?? 50;
            const thumbY = photo.focalPoint?.y ?? 50;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 bg-black transition-all cursor-pointer ${
                  isActive
                    ? 'border-brand-primary opacity-100 ring-1 ring-white/25'
                    : 'border-transparent opacity-50 hover:opacity-90'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title || `Photo ${idx + 1}`}
                  className={`w-full h-full ${photo.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                  style={photo.imageFit === 'contain' ? undefined : { objectPosition: `${thumbX}% ${thumbY}%` }}
                />
              </button>
            );
          })}
        </div>
      )}

      {isZoomed && (
        <HubPhotoLightbox
          photo={activePhoto}
          index={safeIndex}
          total={total}
          departmentTitle={departmentTitle}
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={() => setZoom(false)}
        />
      )}
    </div>
  );
}