/* src/components/portfolio/content-engine/layouts/hub/HubDetailsModal.tsx */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, ShieldCheck, ArrowRight, ExternalLink, Images } from 'lucide-react';
import { THEME_REGISTRY } from '@/utils/themes';
import { HUB_DETAILS_DEFAULTS } from '@/utils/glossary';
import PolicyCard, { OperationalTerm } from './PolicyCard';
import HubStoryGallery from './HubStoryGallery';
import HubFaqAccordion from './HubFaqAccordion';
import HubCollectionProfilePanel from './HubCollectionProfilePanel';
import {
  HubCollectionPhoto,
  HubDepartmentData,
  extractCollections,
  mergeCollectionsWithProfiles,
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
  const [selection, setSelection] = useState<{ key: string; value: string } | null>(null);

  const sessionKey = `${department.title}::${initialCollection || 'ALL'}`;
  const activeCollection =
    selection && selection.key === sessionKey
      ? selection.value
      : initialCollection || 'ALL';

  const handleSelectCollection = (next: string) => {
    setSelection({ key: sessionKey, value: next });
  };

  const handleClose = useCallback(() => {
    setSelection(null);
    setIsGalleryZoomed(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGalleryZoomed) handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isGalleryZoomed, handleClose]);

  const collections = useMemo(() => extractCollections(photos), [photos]);
  const spotlightEntries = useMemo(
    () => mergeCollectionsWithProfiles(collections, department.collectionProfiles),
    [collections, department.collectionProfiles]
  );

  const isViewingAll = !activeCollection || activeCollection === 'ALL';

  const activeEntry = useMemo(() => {
    if (isViewingAll) return undefined;
    const target = activeCollection.toLowerCase();
    return spotlightEntries.find((e) => e.name.toLowerCase() === target);
  }, [spotlightEntries, activeCollection, isViewingAll]);

  const filteredPhotos = useMemo(() => {
    if (isViewingAll) return photos;
    const target = activeCollection.toLowerCase();
    return photos.filter((p) => p.collection?.trim().toLowerCase() === target);
  }, [photos, activeCollection, isViewingAll]);

  if (!isOpen) return null;

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const validFaqs = (department.faqs || []).filter((f) => f && f.question?.trim() && f.answer?.trim());

  const hasProfileContent = isViewingAll
    ? spotlightEntries.some((e) => e.bio || e.subtitle || e.highlights.length > 0)
    : Boolean(activeEntry && (activeEntry.bio || activeEntry.subtitle || activeEntry.highlights.length > 0));

  const hasPhotoColumn = photos.length > 0;
  const hasRightColumn = hasProfileContent || terms.length > 0 || validFaqs.length > 0;
  const hasBoth = hasPhotoColumn && hasRightColumn;

  const showFilterBar =
    spotlightEntries.length > 1 ||
    (spotlightEntries.length === 1 && photos.length > spotlightEntries[0].photoCount);

  const badgeLabel = hasBoth
    ? HUB_DETAILS_DEFAULTS.PHOTOS_DETAILS_BADGE
    : hasPhotoColumn
      ? HUB_DETAILS_DEFAULTS.STORY_GALLERY_BADGE
      : validFaqs.length > 0 && terms.length === 0 && !hasProfileContent
        ? HUB_DETAILS_DEFAULTS.FAQS_ONLY_BADGE
        : HUB_DETAILS_DEFAULTS.BOOKING_DETAILS_BADGE;

  const brandBtnText = isLightBrand ? 'text-zinc-950' : 'text-white';
  const ctaText = department.ctaLabel?.trim() || HUB_DETAILS_DEFAULTS.QUICK_INQUIRY_BTN;
  const bookingHref = normalizeExternalUrl(department.bookingUrl);
  const bookingText = department.bookingLabel?.trim() || 'Book Online';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
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
                handleClose();
                onInquire();
              }}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs bg-brand-primary ${brandBtnText} border border-brand-primary hover:brightness-110 transition-all shadow-lg cursor-pointer ${theme.controlRadius} ${theme.uiLabel}`}
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className={`p-2.5 border transition-colors cursor-pointer ${theme.controlRadius} ${theme.pillStyle}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-5">
          {/* Shared Filter Bar (switches both Gallery Photos AND Artist/Project Bio simultaneously) */}
          {showFilterBar && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectCollection('ALL')}
                className={`px-3.5 py-2 text-[11px] border transition-all cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${
                  isViewingAll
                    ? `bg-brand-primary ${brandBtnText} border-brand-primary shadow-sm`
                    : theme.pillStyle
                }`}
              >
                All{photos.length > 0 ? ` (${photos.length})` : ''}
              </button>

              {spotlightEntries.map((entry) => {
                const isSelected = !isViewingAll && activeCollection.toLowerCase() === entry.name.toLowerCase();
                return (
                  <button
                    key={entry.name}
                    type="button"
                    onClick={() => handleSelectCollection(entry.name)}
                    className={`px-3.5 py-2 text-[11px] border transition-all cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${
                      isSelected
                        ? `bg-brand-primary ${brandBtnText} border-brand-primary shadow-sm`
                        : theme.pillStyle
                    }`}
                  >
                    {entry.name}
                    {entry.photoCount > 0 ? ` (${entry.photoCount})` : ''}
                  </button>
                );
              })}
            </div>
          )}

          <div className={`grid grid-cols-1 ${hasBoth ? 'lg:grid-cols-12' : ''} gap-6 lg:gap-8 items-start`}>
            {hasPhotoColumn && (
              <div className={hasBoth ? 'lg:col-span-7' : ''}>
                {filteredPhotos.length > 0 ? (
                  <HubStoryGallery
                    key={`${department.title}-${activeCollection}`}
                    photos={filteredPhotos}
                    departmentTitle={
                      !isViewingAll
                        ? `${department.title} — ${activeCollection}`
                        : department.title
                    }
                    isLightMode={isLightMode}
                    themeStyle={themeStyle}
                    bodyFont={fonts.body}
                    headingFont={fonts.heading}
                    onZoomChange={setIsGalleryZoomed}
                  />
                ) : (
                  <div
                    className={`aspect-16/10 border border-dashed ${theme.borderColor} ${theme.surfaceRadius} flex flex-col items-center justify-center gap-2 p-6 text-center opacity-70`}
                  >
                    <Images className="w-6 h-6 text-brand-primary opacity-70" />
                    <p className="text-xs font-mono uppercase tracking-widest">
                      Portfolio pieces for {activeCollection} coming soon
                    </p>
                  </div>
                )}
              </div>
            )}

            {hasRightColumn && (
              <div className={`${hasBoth ? 'lg:col-span-5' : ''} space-y-6`}>
                <HubCollectionProfilePanel
                  activeEntry={activeEntry}
                  allEntries={spotlightEntries}
                  isViewingAll={isViewingAll}
                  theme={theme}
                  themeStyle={themeStyle}
                  fonts={fonts}
                  onSelectEntry={handleSelectCollection}
                />

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