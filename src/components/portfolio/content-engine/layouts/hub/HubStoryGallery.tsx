/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/hub/HubStoryGallery.tsx */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X, Images } from 'lucide-react';

export interface HubPhoto {
  url: string;
  title?: string;
  description?: string;
}

interface HubStoryGalleryProps {
  photos: HubPhoto[];
  departmentTitle: string;
  isLightMode: boolean;
  bodyFont: string;
  onZoomChange?: (zoomed: boolean) => void;
}

export default function HubStoryGallery({
  photos,
  departmentTitle,
  isLightMode,
  bodyFont,
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

  useEffect(() => {
    setActiveIndex(0);
    setZoom(false);
  }, [departmentTitle, setZoom]);

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

  const captionSurface = isLightMode
    ? 'bg-zinc-50 border-zinc-900/10 text-zinc-800'
    : 'bg-zinc-900/70 border-white/10 text-zinc-200';
  const hasCaption = !!(activePhoto.title?.trim() || activePhoto.description?.trim());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest opacity-70">
        <span className="flex items-center gap-2">
          <Images className="w-3.5 h-3.5 text-brand-primary" />
          <span>Story Gallery</span>
        </span>
        <span>
          {safeIndex + 1} / {total}
        </span>
      </div>

      {/* Spotlight Stage */}
      <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden border border-current/10 bg-black/40 group">
        <img
          src={activePhoto.url}
          alt={activePhoto.title || departmentTitle}
          onClick={() => setZoom(true)}
          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
        />

        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label="Expand image"
          className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-brand-primary text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-brand-primary text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Editorial Caption Card (only shows when photo has a custom title or story) */}
      {hasCaption && (
        <div className={`px-4 py-3 rounded-2xl border space-y-1 ${captionSurface}`}>
          {activePhoto.title?.trim() && (
            <h5 className="text-xs font-bold tracking-wide text-brand-primary">{activePhoto.title}</h5>
          )}
          {activePhoto.description?.trim() && (
            <p className={`text-xs leading-relaxed opacity-85 ${bodyFont}`}>{activePhoto.description}</p>
          )}
        </div>
      )}

      {/* Horizontal Thumbnail Filmstrip */}
      {total > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {photos.map((photo, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-brand-primary opacity-100 scale-[1.03]'
                    : 'border-transparent opacity-50 hover:opacity-90'
                }`}
              >
                <img src={photo.url} alt={photo.title || `Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Arrow-Enabled Lightbox */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-4 bg-black/95 p-4 md:p-8"
          onClick={(e) => {
            e.stopPropagation();
            setZoom(false);
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(false);
            }}
            aria-label="Close lightbox"
            className="absolute top-5 right-5 p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white border border-white/15 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous photo"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 hover:bg-brand-primary text-white border border-white/15 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next photo"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 hover:bg-brand-primary text-white border border-white/15 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <img
            src={activePhoto.url}
            alt={activePhoto.title || departmentTitle}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[78vh] object-contain rounded-xl shadow-2xl"
          />

          <div onClick={(e) => e.stopPropagation()} className="text-center max-w-2xl space-y-1 px-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              {safeIndex + 1} / {total}
            </span>
            {activePhoto.title?.trim() && (
              <p className="text-sm font-bold text-white">{activePhoto.title}</p>
            )}
            {activePhoto.description?.trim() && (
              <p className="text-xs text-zinc-300 leading-relaxed">{activePhoto.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}