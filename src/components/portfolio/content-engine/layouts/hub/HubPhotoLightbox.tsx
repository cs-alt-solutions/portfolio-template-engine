/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/hub/HubPhotoLightbox.tsx */
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { HubPhoto } from './HubStoryGallery';

interface HubPhotoLightboxProps {
  photo: HubPhoto;
  index: number;
  total: number;
  departmentTitle: string;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export default function HubPhotoLightbox({
  photo,
  index,
  total,
  departmentTitle,
  onPrev,
  onNext,
  onClose,
}: HubPhotoLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-4 bg-black/95 p-4 md:p-8"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
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
              onPrev();
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
              onNext();
            }}
            aria-label="Next photo"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 hover:bg-brand-primary text-white border border-white/15 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <img
        src={photo.url}
        alt={photo.title || departmentTitle}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[78vh] object-contain rounded-xl shadow-2xl"
      />

      <div onClick={(e) => e.stopPropagation()} className="text-center max-w-2xl space-y-1 px-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          {index + 1} / {total}
        </span>
        {photo.title?.trim() && <p className="text-sm font-bold text-white">{photo.title}</p>}
        {photo.description?.trim() && (
          <p className="text-xs text-zinc-300 leading-relaxed">{photo.description}</p>
        )}
      </div>
    </div>
  );
}