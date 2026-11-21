/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/hub/HubDetailsModal.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { X, Images, ShieldCheck, ArrowRight, ZoomIn } from 'lucide-react';
import { Capability } from '../../types';
import PolicyCard, { OperationalTerm } from './PolicyCard';

export type { OperationalTerm } from './PolicyCard';

interface HubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquire: () => void;
  department: Capability;
  photos: { url: string; title?: string }[];
  terms: OperationalTerm[];
  isLightMode: boolean;
  fonts: { heading: string; body: string };
}

export default function HubDetailsModal({
  isOpen,
  onClose,
  onInquire,
  department,
  photos,
  terms,
  isLightMode,
  fonts,
}: HubDetailsModalProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomedImage) setZoomedImage(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, zoomedImage, onClose]);

  if (!isOpen) return null;

  const modalSurface = isLightMode
    ? 'bg-white border-zinc-900/15 text-zinc-900'
    : 'bg-zinc-950 border-white/15 text-white';
  const chipSurface = isLightMode
    ? 'bg-zinc-100 border-zinc-900/10 text-zinc-700'
    : 'bg-white/5 border-white/10 text-zinc-200';

  const hasBoth = photos.length > 0 && terms.length > 0;
  const modalTitle = hasBoth
    ? 'Photos & Details'
    : photos.length > 0
      ? 'Photo Gallery'
      : 'Booking Details';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${hasBoth ? 'max-w-4xl' : 'max-w-2xl'} max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${modalSurface}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-current/10 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary block mb-0.5">
              {department.title}
            </span>
            <h4 className={`text-xl md:text-2xl font-black tracking-tight ${fonts.heading}`}>
              {modalTitle}
            </h4>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-brand-primary text-white border border-white/15 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Quick Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${chipSurface} hover:border-brand-primary`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className={`grid grid-cols-1 ${hasBoth ? 'lg:grid-cols-12' : ''} gap-6 items-start`}>
            {photos.length > 0 && (
              <div className={`${hasBoth ? 'lg:col-span-6' : ''} space-y-3`}>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-70">
                  <Images className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Gallery ({photos.length})</span>
                </div>

                <div className={`grid ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                  {photos.slice(0, 6).map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setZoomedImage(photo.url)}
                      className={`group relative overflow-hidden rounded-2xl border border-current/10 bg-black/30 cursor-zoom-in ${
                        photos.length === 1 ? 'aspect-16/10 max-h-80 w-full' : 'aspect-4/3'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title || department.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-5 h-5 text-white drop-shadow" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {terms.length > 0 && (
              <div className={`${hasBoth ? 'lg:col-span-6' : ''} space-y-3`}>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-70">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Booking Details &amp; Policies</span>
                </div>

                <div className="space-y-3">
                  {terms.map((term, idx) => (
                    <PolicyCard
                      key={idx}
                      term={term}
                      isLightMode={isLightMode}
                      bodyFont={fonts.body}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Zoom */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 md:p-8 cursor-zoom-out"
          onClick={(e) => {
            e.stopPropagation();
            setZoomedImage(null);
          }}
        >
          <img
            src={zoomedImage}
            alt="Expanded view"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}