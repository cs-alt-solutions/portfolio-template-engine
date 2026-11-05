/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/HubFlow.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';
import UniversalLeadModal from '../../UniversalLeadModal';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';

interface Capability {
  title: string;
  description?: string;
  price?: string;
  bullets?: string[];
  addons?: Array<{ title?: string; name?: string; price?: string } | string>;
  coverImage?: string;
  isAlaCarte?: boolean;
}

interface GalleryItem {
  id: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  isVisible?: boolean;
}

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

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDept, setSelectedDept] = useState<Capability | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const fonts = getFonts(themeStyle || 'industrial');
  const theme = THEME_REGISTRY[themeStyle || 'industrial'] || THEME_REGISTRY['industrial'];

  // Auto-advancing live reel
  useEffect(() => {
    if (departments.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % departments.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [departments.length, isPaused]);

  if (departments.length === 0) {
    return (
      <div className={`w-full py-20 px-4 text-center ${theme?.pageBg || 'bg-zinc-950'} text-white`}>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          No departments configured for this storefront yet.
        </p>
      </div>
    );
  }

  const activeIndexSafe = Math.min(activeIndex, departments.length - 1);
  const activeDept = departments[activeIndexSafe] || departments[0];
  const activeDeptSlug = slugifyDept(activeDept?.title || '');

  const activeCover =
    activeDept?.coverImage ||
    safeGallery.find((g) => g && g.category === activeDept?.title && g.imageUrl)?.imageUrl;

  const handleOpenModal = (dept: Capability) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  const currentAddons = (selectedDept || activeDept)?.addons || [];
  const inquiryTopicList = selectedDept
    ? [selectedDept.title, ...departments.map((d) => d.title).filter((t) => t !== selectedDept.title)]
    : departments.map((d) => d.title).filter(Boolean);

  return (
    <div className="w-full pb-16 md:pb-24 px-4 md:px-8 relative z-20">
      
      {/* Container with a clean offset spacing from the hero */}
      <div className="w-full max-w-6xl mx-auto relative z-30 pt-6 md:pt-10 flex flex-col gap-8">
        
        {/* 1. HORIZONTAL DEPARTMENT REEL SELECTOR (Pills at the top) */}
        <div 
          className="flex flex-wrap items-center justify-center gap-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {departments.map((dept, idx) => {
            const isActive = idx === activeIndexSafe;
            
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-zinc-950 border-brand-primary shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.4)] scale-105'
                    : 'bg-zinc-900/80 text-zinc-300 border-white/10 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span className="font-mono opacity-70">0{idx + 1}</span>
                <span>{dept.title}</span>
              </button>
            );
          })}
        </div>

        {/* 2. THE PICTURE-FIRST CINEMATIC STAGE (Image on top, details below) */}
        {activeDept && (
          <div 
            className="rounded-[2.5rem] border border-white/10 bg-zinc-950/95 backdrop-blur-2xl overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 flex flex-col"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Picture on Top */}
            <div className="relative w-full aspect-video md:aspect-[21/9] bg-black overflow-hidden border-b border-white/10">
              {activeCover ? (
                <>
                  <img
                    key={activeCover}
                    src={activeCover}
                    alt={activeDept.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5s] ease-in-out scale-100 hover:scale-105 animate-in fade-in duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    {activeDept.title} Visual
                  </span>
                </div>
              )}
              
              {activeDept.price && (
                <div className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-brand-primary font-mono font-bold text-sm shadow-xl">
                  {activeDept.price}
                </div>
              )}
            </div>

            {/* Details Below the Picture */}
            <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-white/5 border border-white/10 text-brand-primary">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>Featured Department Stage</span>
                </div>

                <h3 className={`text-3xl md:text-4xl font-black tracking-tight text-white leading-tight ${fonts.heading}`}>
                  {activeDept.title}
                </h3>

                {activeDept.description && (
                  <p className={`text-sm md:text-base text-zinc-300 leading-relaxed ${fonts.body}`}>
                    {activeDept.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenModal(activeDept)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-brand-primary text-zinc-950 border-none hover:brightness-110 transition-all shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)] cursor-pointer"
                >
                  <span>Quick Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href={`/${storefrontSlug || 'store'}/${activeDeptSlug}`}
                  prefetch={true}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 transition-all shadow-md"
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