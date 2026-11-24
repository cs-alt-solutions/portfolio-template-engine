/* src/components/portfolio/content-engine/layouts/hub/HubDetailsModal.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { THEME_REGISTRY } from '@/utils/themes';
import { HUB_DETAILS_DEFAULTS } from '@/utils/glossary';
import { Capability } from '../../types';
import PolicyCard, { OperationalTerm } from './PolicyCard';
import HubStoryGallery, { HubPhoto } from './HubStoryGallery';
import HubFaqAccordion from './HubFaqAccordion';

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
  themeStyle?: string;
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
  themeStyle = 'industrial',
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

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const isMidnight = themeStyle === 'midnight';
  const isSquare = theme?.radius === 'rounded-none';
  const modalRadius = isSquare ? 'rounded-none' : themeStyle === 'organic' ? 'rounded-3xl' : 'rounded-2xl';
  const cardRadius = isSquare ? 'rounded-none' : 'rounded-2xl';

  const modalSurface = isLightMode
    ? `${theme?.pageBg || 'bg-white'} border-zinc-900/15 text-zinc-950`
    : isMidnight
      ? 'bg-black/95 border-white/10 text-white shadow-[0_0_90px_rgba(0,0,0,0.95)]'
      : 'bg-zinc-950/95 border-white/15 text-white';

  const closeBtnSurface = isLightMode
    ? 'bg-zinc-100 border-zinc-900/10 text-zinc-800 hover:bg-zinc-200'
    : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/15 hover:text-white';

  const validFaqs = (department.faqs || []).filter((f) => f && f.question?.trim() && f.answer?.trim());
  const hasRightColumn = terms.length > 0 || validFaqs.length > 0;
  const hasBoth = photos.length > 0 && hasRightColumn;

  const badgeLabel = hasBoth
    ? HUB_DETAILS_DEFAULTS.PHOTOS_DETAILS_BADGE
    : photos.length > 0
      ? HUB_DETAILS_DEFAULTS.STORY_GALLERY_BADGE
      : validFaqs.length > 0 && terms.length === 0
        ? HUB_DETAILS_DEFAULTS.FAQS_ONLY_BADGE
        : HUB_DETAILS_DEFAULTS.BOOKING_DETAILS_BADGE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative ${hasBoth ? 'w-[95vw] max-w-7xl' : 'w-[94vw] max-w-4xl'} max-h-[92vh] border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${modalRadius} ${modalSurface}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-0.5 w-full bg-brand-primary shrink-0" />

        {/* Header */}
        <div className="px-6 py-4 md:px-8 md:py-5 border-b border-current/10 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0 space-y-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-brand-primary text-white text-[10px] font-mono font-bold uppercase tracking-widest">
              {badgeLabel}
            </span>
            <h4 className={`text-xl md:text-3xl font-black tracking-tight truncate ${fonts.heading}`}>
              {department.title}
            </h4>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-brand-primary text-white border border-white/15 hover:brightness-110 transition-all shadow-lg cursor-pointer"
            >
              <span>{HUB_DETAILS_DEFAULTS.QUICK_INQUIRY_BTN}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${closeBtnSurface}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className={`grid grid-cols-1 ${hasBoth ? 'lg:grid-cols-12' : ''} gap-6 lg:gap-8 items-start`}>
            {photos.length > 0 && (
              <div className={hasBoth ? 'lg:col-span-7' : ''}>
                <HubStoryGallery
                  key={department.title}
                  photos={photos}
                  departmentTitle={department.title}
                  isLightMode={isLightMode}
                  themeStyle={themeStyle}
                  bodyFont={fonts.body}
                  headingFont={fonts.heading}
                  onZoomChange={setIsGalleryZoomed}
                />
              </div>
            )}

            {hasRightColumn && (
              <div className={`${hasBoth ? 'lg:col-span-5' : ''} space-y-6`}>
                <HubFaqAccordion
                  key={`faqs-${department.title}`}
                  faqs={validFaqs}
                  isLightMode={isLightMode}
                  themeStyle={themeStyle}
                  cardRadius={cardRadius}
                  bodyFont={fonts.body}
                />

                {terms.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest opacity-80">
                      <ShieldCheck className="w-3.5 h-3.5 opacity-80" />
                      <span>{HUB_DETAILS_DEFAULTS.POLICIES_HEADING}</span>
                    </div>

                    <div className="space-y-3.5">
                      {terms.map((term, idx) => (
                        <PolicyCard
                          key={idx}
                          term={term}
                          isLightMode={isLightMode}
                          themeStyle={themeStyle}
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