/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/HubFlow.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
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
  capabilitiesHeading?: string;
  galleryHeading?: string;
  businessName?: string;
  storefrontSlug?: string;
  contactEmail?: string;
  orderingUrl?: string;
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
  capabilitiesHeading,
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

  const fonts = getFonts(themeStyle || 'industrial');
  const theme = THEME_REGISTRY[themeStyle || 'industrial'] || THEME_REGISTRY['industrial'];

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

  const displayHeading =
    !capabilitiesHeading || capabilitiesHeading === 'My Services' || capabilitiesHeading === 'Services'
      ? 'Explore Our Departments'
      : capabilitiesHeading;

  return (
    <div className={`w-full py-20 px-4 md:px-8 ${theme?.pageBg || 'bg-zinc-950'}`}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Clean Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight text-white ${fonts.heading}`}>
            {displayHeading}
          </h2>
          <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full opacity-80" />
        </div>

        {/* 1. Top Department Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept, idx) => {
            const isActive = idx === activeIndexSafe;
            const deptCover =
              dept.coverImage ||
              safeGallery.find((g) => g && g.category === dept.title && g.imageUrl)?.imageUrl;

            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer min-h-36 p-5 flex flex-col justify-between bg-zinc-900/40 ${
                  isActive
                    ? 'border-brand-primary ring-2 ring-brand-primary shadow-xl scale-[1.01]'
                    : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/25'
                }`}
              >
                {deptCover && (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={deptCover}
                      alt={dept.title}
                      className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20" />
                  </div>
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border ${
                      isActive
                        ? 'bg-brand-primary text-white border-white/30'
                        : 'bg-black/65 text-zinc-300 border-white/10'
                    }`}
                  >
                    {isActive ? 'Viewing' : `0${idx + 1}`}
                  </span>
                </div>

                <div className="relative z-10 mt-6">
                  <h3 className={`text-base font-bold text-white leading-snug ${fonts.heading}`}>
                    {dept.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Department Preview Stage */}
        {activeDept && (
          <div className="rounded-3xl border p-6 md:p-10 transition-all duration-500 shadow-2xl bg-zinc-900/40 border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    Selected Department
                  </span>

                  <h3 className={`text-2xl md:text-4xl font-black tracking-tight text-white ${fonts.heading}`}>
                    {activeDept.title}
                  </h3>

                  {activeDept.description && (
                    <p className={`text-sm md:text-base text-zinc-300 leading-relaxed pt-1 ${fonts.body}`}>
                      {activeDept.description}
                    </p>
                  )}
                </div>

                {/* Deliverables Grid */}
                {activeDept.bullets && activeDept.bullets.filter(Boolean).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeDept.bullets.filter(Boolean).map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                        <span className={`text-xs leading-relaxed text-zinc-200 ${fonts.body}`}>
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Clean Two-Button Action Row (High Contrast) */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(activeDept)}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-brand-primary text-white border border-white/25 hover:brightness-110 transition-all cursor-pointer shadow-lg"
                  >
                    <span>Request Info / Book</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/${storefrontSlug || 'store'}/${activeDeptSlug}`}
                    prefetch={true}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/15 transition-all"
                  >
                    <span>Open Full Page</span>
                    <ArrowUpRight className="w-4 h-4 text-brand-primary" />
                  </Link>
                </div>
              </div>

              {/* Clickable Spotlight Image */}
              <div className="lg:col-span-5">
                <Link
                  href={`/${storefrontSlug || 'store'}/${activeDeptSlug}`}
                  prefetch={true}
                  className="block group relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl"
                >
                  {activeCover ? (
                    <>
                      <img
                        src={activeCover}
                        alt={activeDept.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 rounded-full bg-black/80 text-white text-[10px] font-mono uppercase tracking-widest border border-white/20 flex items-center gap-1.5">
                          Open Department Page <ArrowUpRight className="w-3.5 h-3.5 text-brand-primary" />
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        {activeDept.title}
                      </span>
                    </div>
                  )}
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