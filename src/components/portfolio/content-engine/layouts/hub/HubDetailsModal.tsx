/* src/components/portfolio/content-engine/layouts/hub/HubDetailsModal.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { Capability } from '../../types';
import PolicyCard, { OperationalTerm } from './PolicyCard';
import HubStoryGallery, { HubPhoto } from './HubStoryGallery';

export type { OperationalTerm } from './PolicyCard';
export type { HubPhoto } from './HubStoryGallery';

interface HubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquire: () => void;
  department: Capability;
  photos: HubPhoto[];
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
  const [isGalleryZoomed, setIsGalleryZoomed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGalleryZoomed) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isGalleryZoomed, onClose]);

  if (!isOpen) return null;

  const modalSurface = isLightMode
    ? 'bg-white border-zinc-900/15 text-zinc-900'
    : 'bg-zinc-950 border-white/15 text-white';
  const subCardSurface = isLightMode
    ? 'bg-zinc-50 border-zinc-900/10 text-zinc-800'
    : 'bg-zinc-900/70 border-white/10 text-zinc-200';
  const chipSurface = isLightMode
    ? 'bg-zinc-100 border-zinc-900/10 text-zinc-700'
    : 'bg-white/5 border-white/10 text-zinc-200';

  const visibleBullets = (department.bullets || []).filter(Boolean);
  const hasOverview = !!(department.description?.trim() || visibleBullets.length > 0);
  const hasRightColumn = terms.length > 0 || hasOverview;
  const hasBoth = photos.length > 0 && hasRightColumn;

  const modalTitle =
    photos.length > 0 && terms.length > 0
      ? 'Photos & Details'
      : photos.length > 0
        ? 'Story & Gallery'
        : 'Booking Details';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${hasBoth ? 'max-w-5xl' : 'max-w-2xl'} max-h-[88vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${modalSurface}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-current/10 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary block mb-0.5 truncate">
              {department.title}
            </span>
            <h4 className={`text-xl md:text-2xl font-black tracking-tight ${fonts.heading}`}>
              {modalTitle}
            </h4>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
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
            {/* Left: Spotlight Story Gallery + Filmstrip */}
            {photos.length > 0 && (
              <div className={hasBoth ? 'lg:col-span-7' : ''}>
                <HubStoryGallery
                  photos={photos}
                  departmentTitle={department.title}
                  isLightMode={isLightMode}
                  bodyFont={fonts.body}
                  onZoomChange={setIsGalleryZoomed}
                />
              </div>
            )}

            {/* Right: Informational Sheet (Overview + Highlights + Policies) */}
            {hasRightColumn && (
              <div className={`${hasBoth ? 'lg:col-span-5' : ''} space-y-5`}>
                {hasOverview && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-70">
                      <Info className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Overview &amp; Highlights</span>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-3 ${subCardSurface}`}>
                      {department.description?.trim() && (
                        <p className={`text-xs leading-relaxed opacity-90 ${fonts.body}`}>
                          {department.description}
                        </p>
                      )}

                      {visibleBullets.length > 0 && (
                        <ul className="space-y-2 pt-2 border-t border-current/10">
                          {visibleBullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                              <span className={fonts.body}>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {terms.length > 0 && (
                  <div className="space-y-2.5">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}