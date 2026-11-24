/* src/components/portfolio/content-engine/layouts/hub/HubDetailsModal.tsx */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { THEME_REGISTRY } from '@/utils/themes';
import { HUB_DETAILS_DEFAULTS } from '@/utils/glossary';
import PolicyCard, { OperationalTerm } from './PolicyCard';
import HubStoryGallery from './HubStoryGallery';
import HubFaqAccordion from './HubFaqAccordion';
import {
  HubCollectionPhoto,
  HubDepartmentData,
  extractCollections,
  normalizeExternalUrl,
} from './hubCollections';

export type { OperationalTerm } from './PolicyCard';
export type { HubPhoto } from './HubStoryGallery';

interface HubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquire: () => void;
  department: HubDepartmentData;
  photos: HubCollectionPhoto[];
  terms: OperationalTerm[];
  initialCollection?: string | null;
  isLightMode: boolean;
  isLightBrand?: boolean;
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
  initialCollection = null,
  isLightMode,
  isLightBrand = false,
  themeStyle = 'industrial',
  fonts,
}: HubDetailsModalProps) {
  const [isGalleryZoomed, setIsGalleryZoomed] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string>(initialCollection || 'ALL');

  useEffect(() => {
    if (isOpen) {
      setActiveCollection(initialCollection || 'ALL');
    }
  }, [isOpen, initialCollection, department.title]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGalleryZoomed) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isGalleryZoomed, onClose]);

  const collections = useMemo(() => extractCollections(photos), [photos]);

  const filteredPhotos = useMemo(() => {
    if (!activeCollection || activeCollection === 'ALL') return photos;
    const target = activeCollection.toLowerCase();
    const matches = photos.filter((p) => p.collection?.trim().toLowerCase() === target);
    return matches.length > 0 ? matches : photos;
  }, [photos, activeCollection]);

  if (!isOpen) return null;

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const validFaqs = (department.faqs || []).filter((f) => f && f.question?.trim() && f.answer?.trim());
  const hasRightColumn = terms.length > 0 || validFaqs.length > 0;
  const hasBoth = photos.length > 0 && hasRightColumn;

  const showFilterBar =
    collections.length > 1 || (collections.length === 1 && photos.length > collections[0].count);

  const badgeLabel = hasBoth
    ? HUB_DETAILS_DEFAULTS.PHOTOS_DETAILS_BADGE
    : photos.length > 0
      ? HUB_DETAILS_DEFAULTS.STORY_GALLERY_BADGE
      : validFaqs.length > 0 && terms.length === 0
        ? HUB_DETAILS_DEFAULTS.FAQS_ONLY_BADGE
        : HUB_DETAILS_DEFAULTS.BOOKING_DETAILS_BADGE;

  const brandBtnText = isLightBrand ? 'text-zinc-950' : 'text-white';
  const ctaText = department.ctaLabel?.trim() || HUB_DETAILS_DEFAULTS.QUICK_INQUIRY_BTN;
  const bookingHref = normalizeExternalUrl(department.bookingUrl);
  const bookingText = department.bookingLabel?.trim() || 'Book Online';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative ${hasBoth ? 'w-[95vw] max-w-7xl' : 'w-[94vw] max-w-4xl'} max-h-[92vh] border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${theme.surfaceRadius} ${theme.surfaceStyle}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-0.5 w-full bg-brand-primary shrink-0" />

        {/* Header */}
        <div className={`px-6 py-4 md:px-8 md:py-5 border-b ${theme.borderColor} flex items-center justify-between gap-4 shrink-0`}>
          <div className="min-w-0 space-y-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 bg-brand-primary ${brandBtnText} text-[10px] font-mono font-bold uppercase tracking-widest ${theme.controlRadius}`}
            >
              {badgeLabel}
            </span>
            <h4 className={`text-xl md:text-3xl truncate ${fonts.heading}`}>
              {department.title}
            </h4>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {bookingHref && (
              <a
                href={bookingHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:inline-flex items-center gap-2 px-4 py-3 text-xs border transition-all cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${theme.pillStyle}`}
              >
                <span>{bookingText}</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-primary" />
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire();
              }}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs bg-brand-primary ${brandBtnText} border border-brand-primary hover:brightness-110 transition-all shadow-lg cursor-pointer ${theme.controlRadius} ${theme.uiLabel}`}
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className={`p-2.5 border transition-colors cursor-pointer ${theme.controlRadius} ${theme.pillStyle}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className={`grid grid-cols-1 ${hasBoth ? 'lg:grid-cols-12' : ''} gap-6 lg:gap-8 items-start`}>
            {photos.length > 0 && (
              <div className={`${hasBoth ? 'lg:col-span-7' : ''} space-y-4`}>
                {showFilterBar && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveCollection('ALL')}
                      className={`px-3.5 py-2 text-[11px] border transition-all cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${
                        activeCollection === 'ALL'
                          ? `bg-brand-primary ${brandBtnText} border-brand-primary shadow-sm`
                          : theme.pillStyle
                      }`}
                    >
                      All ({photos.length})
                    </button>

                    {collections.map((col) => {
                      const isSelected = activeCollection.toLowerCase() === col.name.toLowerCase();
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setActiveCollection(col.name)}
                          className={`px-3.5 py-2 text-[11px] border transition-all cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${
                            isSelected
                              ? `bg-brand-primary ${brandBtnText} border-brand-primary shadow-sm`
                              : theme.pillStyle
                          }`}
                        >
                          {col.name} ({col.count})
                        </button>
                      );
                    })}
                  </div>
                )}

                <HubStoryGallery
                  key={`${department.title}-${activeCollection}`}
                  photos={filteredPhotos}
                  departmentTitle={
                    activeCollection !== 'ALL'
                      ? `${department.title} — ${activeCollection}`
                      : department.title
                  }
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
                  cardRadius={theme.surfaceRadius}
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