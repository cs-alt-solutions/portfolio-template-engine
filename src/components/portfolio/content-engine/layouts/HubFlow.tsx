/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/HubFlow.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';
import UniversalLeadModal from '../../UniversalLeadModal';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { Capability, GalleryItem } from '../types';

interface HubFlowProps {
  items?: Capability[];
  capabilities?: Capability[];
  galleryItems?: GalleryItem[];
  themeStyle?: string;
  brandColor?: string;
  secondaryBrandColor?: string;
  isLightMode?: boolean;
  businessName?: string;
  storefrontSlug?: string;
  contactEmail?: string;
  // Controlled props when synced with Hero via HubStage
  controlledActiveIndex?: number;
  onSelectIndex?: (index: number) => void;
  onHoverChange?: (hovered: boolean) => void;
  hideStageImage?: boolean;
}

export const slugifyDept = (text: string) =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export default function HubFlow({
  items = [],
  capabilities = [],
  galleryItems = [],
  themeStyle = 'industrial',
  brandColor = 'brand-primary',
  isLightMode = false,
  businessName = 'Our Business',
  storefrontSlug = 'platform-direct',
  contactEmail = '',
  controlledActiveIndex,
  onSelectIndex,
  onHoverChange,
  hideStageImage = false,
}: HubFlowProps) {
  const rawList = [...(items || []), ...(capabilities || [])];
  const safeItems = rawList.filter(
    (item, index, self) =>
      item && item.title && !item.isAlaCarte && self.findIndex((t) => t.title === item.title) === index
  );
  const safeGallery = Array.isArray(galleryItems) ? galleryItems : [];

  let departments: Capability[] = safeItems;
  if (departments.length === 0 && safeGallery.length > 0) {
    const uniqueCategories = Array.from(new Set(safeGallery.map((g) => g.category).filter(Boolean))) as string[];
    departments = uniqueCategories.map((cat) => ({
      title: cat,
      description: `Explore offerings and services under ${cat}.`,
      price: '',
      bullets: [],
      addons: [],
    }));
  }

  const isControlled = typeof controlledActiveIndex === 'number';
  const [internalIndex, setInternalIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Capability | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fonts = getFonts(themeStyle || 'industrial');
  const theme = THEME_REGISTRY[themeStyle || 'industrial'] || THEME_REGISTRY['industrial'];

  // Fallback internal reel only when rendered standalone outside HubStage
  useEffect(() => {
    if (isControlled || departments.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setInternalIndex((current) => (current + 1) % departments.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isControlled, departments.length, isPaused]);

  if (departments.length === 0) {
    return (
      <div className={`w-full py-16 px-4 text-center ${theme?.pageBg || 'bg-zinc-950'}`}>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          No departments configured for this storefront yet.
        </p>
      </div>
    );
  }

  const currentIdx = isControlled ? controlledActiveIndex : internalIndex;
  const activeIndexSafe = Math.min(currentIdx, departments.length - 1);
  const activeDept = departments[activeIndexSafe] || departments[0];
  const activeDeptSlug = slugifyDept(activeDept?.title || '');

  const activeCover =
    activeDept?.coverImage ||
    safeGallery.find((g) => g && g.category === activeDept?.title && g.imageUrl)?.imageUrl;

  const handleSelect = (idx: number) => {
    if (onSelectIndex) onSelectIndex(idx);
    else setInternalIndex(idx);
  };

  const handleHover = (hovered: boolean) => {
    setIsPaused(hovered);
    if (onHoverChange) onHoverChange(hovered);
  };

  const handleOpenModal = (dept: Capability) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  const currentAddons = (selectedDept || activeDept)?.addons || [];
  const inquiryTopicList = selectedDept
    ? [selectedDept.title, ...departments.map((d) => d.title).filter((t) => t !== selectedDept.title)]
    : departments.map((d) => d.title).filter(Boolean);

  // Theme-aware surfaces
  const panelSurface = isLightMode
    ? 'bg-white/95 border-zinc-900/10 text-zinc-900 shadow-xl'
    : 'bg-zinc-950/90 border-white/10 text-white shadow-2xl';
  const inactivePill = isLightMode
    ? 'bg-white/90 text-zinc-700 border-zinc-900/10 hover:bg-zinc-100 hover:text-zinc-950'
    : 'bg-zinc-900/80 text-zinc-300 border-white/10 hover:bg-zinc-800 hover:text-white';
  const mutedText = isLightMode ? 'text-zinc-600' : 'text-zinc-300';
  const secondaryBtn = isLightMode
    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-900/10'
    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border-white/10';
  const chipSurface = isLightMode
    ? 'bg-zinc-100 border-zinc-900/10 text-zinc-700'
    : 'bg-white/5 border-white/10 text-zinc-300';

  const visibleBullets = (activeDept?.bullets || []).filter(Boolean).slice(0, 4);

  return (
    <div className="w-full pb-16 md:pb-24 px-4 md:px-8 relative z-20">
      <div
        className="w-full max-w-6xl mx-auto relative z-30 pt-6 md:pt-8 flex flex-col gap-5"
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
      >
        {/* 1. HORIZONTAL DEPARTMENT SWITCHER PILLS */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
          {departments.map((dept, idx) => {
            const isActive = idx === activeIndexSafe;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`px-4 py-2.5 md:px-5 md:py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-zinc-950 border-brand-primary shadow-lg shadow-brand-primary/25 scale-[1.03]'
                    : inactivePill
                }`}
              >
                <span className="font-mono opacity-70">0{idx + 1}</span>
                <span>{dept.title}</span>
              </button>
            );
          })}
        </div>

        {/* 2. STREAMLINED DEPARTMENT INFO PANEL (No duplicate hero image when synced) */}
        {activeDept && (
          <div
            key={activeDept.title}
            className={`rounded-3xl border backdrop-blur-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 flex flex-col ${panelSurface}`}
          >
            {/* Optional Fallback Image ONLY if HubFlow is rendered standalone without HubStage */}
            {!hideStageImage && activeCover && (
              <div className="relative w-full aspect-video md:aspect-21/9 bg-black overflow-hidden border-b border-white/10">
                <img
                  src={activeCover}
                  alt={activeDept.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              </div>
            )}

            <div className="p-6 md:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border ${chipSurface}`}>
                    <Sparkles className="w-3 h-3 text-brand-primary" />
                    <span>Department 0{activeIndexSafe + 1}</span>
                  </div>

                  {activeDept.price && (
                    <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border text-brand-primary ${chipSurface}`}>
                      {activeDept.price}
                    </span>
                  )}
                </div>

                <h3 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${fonts.heading}`}>
                  {activeDept.title}
                </h3>

                {activeDept.description && (
                  <p className={`text-sm md:text-base leading-relaxed ${mutedText} ${fonts.body}`}>
                    {activeDept.description}
                  </p>
                )}

                {visibleBullets.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {visibleBullets.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${chipSurface}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenModal(activeDept)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-brand-primary text-zinc-950 border-none hover:brightness-110 transition-all shadow-lg shadow-brand-primary/25 cursor-pointer"
                >
                  <span>Quick Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href={`/${storefrontSlug || 'store'}/${activeDeptSlug}`}
                  prefetch={true}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all shadow-sm ${secondaryBtn}`}
                >
                  <span>Open Full Page</span>
                  <ArrowUpRight className="w-4 h-4 text-brand-primary" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <UniversalLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessName={businessName || 'Our Business'}
        storefrontSlug={storefrontSlug || 'platform-direct'}
        contactEmail={contactEmail || ''}
        brandColor={brandColor || 'brand-primary'}
        isLightMode={isLightMode}
        themeStyle={themeStyle || 'industrial'}
        inquiryOptions={inquiryTopicList.length > 0 ? inquiryTopicList : ['General Inquiry']}
        addonOptions={currentAddons}
      />
    </div>
  );
}