/* src/components/portfolio/content-engine/layouts/HubFlow.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import UniversalLeadModal from '../../UniversalLeadModal';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { Capability, GalleryItem } from '../types';
import HubDepartmentCard from './hub/HubDepartmentCard';
import HubDetailsModal, { OperationalTerm } from './hub/HubDetailsModal';

interface HubFlowProps {
  items?: Capability[];
  capabilities?: Capability[];
  galleryItems?: GalleryItem[];
  operationalTerms?: OperationalTerm[];
  themeStyle?: string;
  brandColor?: string;
  secondaryBrandColor?: string;
  isLightMode?: boolean;
  businessName?: string;
  storefrontSlug?: string;
  contactEmail?: string;
  controlledActiveIndex?: number;
  onSelectIndex?: (index: number) => void;
  onHoverChange?: (hovered: boolean) => void;
  onFlipChange?: (isOpen: boolean) => void;
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
  operationalTerms = [],
  themeStyle = 'industrial',
  brandColor = 'brand-primary',
  isLightMode = false,
  businessName = 'Our Business',
  storefrontSlug = 'platform-direct',
  contactEmail = '',
  controlledActiveIndex,
  onSelectIndex,
  onHoverChange,
  onFlipChange,
}: HubFlowProps) {
  const rawList = [...(items || []), ...(capabilities || [])];
  const safeItems = rawList.filter(
    (item, index, self) =>
      item && item.title && !item.isAlaCarte && self.findIndex((t) => t.title === item.title) === index
  );
  const safeGallery = Array.isArray(galleryItems) ? galleryItems : [];
  const safeTerms = Array.isArray(operationalTerms) ? operationalTerms.filter((t) => t && t.title) : [];

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Capability | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fonts = getFonts(themeStyle || 'industrial');
  const theme = THEME_REGISTRY[themeStyle || 'industrial'] || THEME_REGISTRY['industrial'];

  const currentIdx = isControlled ? controlledActiveIndex : internalIndex;
  const activeIndexSafe = departments.length > 0 ? Math.min(currentIdx, departments.length - 1) : 0;

  useEffect(() => {
    if (isControlled || departments.length <= 1 || isPaused || isDetailsOpen) return;
    const timer = setInterval(() => {
      setInternalIndex((current) => (current + 1) % departments.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isControlled, departments.length, isPaused, isDetailsOpen]);

  if (departments.length === 0) {
    return (
      <div className={`w-full py-16 px-4 text-center ${theme?.pageBg || 'bg-zinc-950'}`}>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          No departments configured for this storefront yet.
        </p>
      </div>
    );
  }

  const activeDept = departments[activeIndexSafe] || departments[0];

  const deptPhotos: { url: string; title?: string }[] = [];
  if (activeDept?.coverImage) {
    deptPhotos.push({ url: activeDept.coverImage, title: activeDept.title });
  }
  safeGallery
    .filter(
      (g) =>
        g &&
        g.imageUrl &&
        g.isVisible !== false &&
        g.category?.toLowerCase() === activeDept?.title?.toLowerCase() &&
        g.imageUrl !== activeDept?.coverImage
    )
    .forEach((g) => deptPhotos.push({ url: g.imageUrl, title: g.title || activeDept.title }));

  const toggleDetails = (open: boolean) => {
    setIsDetailsOpen(open);
    if (onFlipChange) onFlipChange(open);
  };

  const handleSelect = (idx: number) => {
    toggleDetails(false);
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

  const inactivePill = isLightMode
    ? 'bg-white/90 text-zinc-700 border-zinc-900/10 hover:bg-zinc-100 hover:text-zinc-950'
    : 'bg-zinc-900/80 text-zinc-300 border-white/10 hover:bg-zinc-800 hover:text-white';

  return (
    <div className="w-full pb-16 md:pb-24 px-4 md:px-8 relative z-20">
      <div
        className="w-full max-w-6xl mx-auto relative z-30 pt-6 md:pt-8 flex flex-col gap-5"
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
      >
        {/* Horizontal Department Switcher Pills */}
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
                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/25 scale-[1.03]'
                    : inactivePill
                }`}
              >
                <span className="font-mono opacity-80">0{idx + 1}</span>
                <span>{dept.title}</span>
              </button>
            );
          })}
        </div>

        {/* Compact 1-Page Department Card */}
        {activeDept && (
          <HubDepartmentCard
            department={activeDept}
            index={activeIndexSafe}
            hasDetails={deptPhotos.length > 0 || safeTerms.length > 0}
            isLightMode={isLightMode}
            fonts={fonts}
            onInquire={() => handleOpenModal(activeDept)}
            onOpenDetails={() => toggleDetails(true)}
          />
        )}
      </div>

      {/* Auto-Centered Photos & Logistics Modal */}
      {activeDept && (
        <HubDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => toggleDetails(false)}
          onInquire={() => handleOpenModal(activeDept)}
          department={activeDept}
          photos={deptPhotos}
          terms={safeTerms}
          isLightMode={isLightMode}
          fonts={fonts}
        />
      )}

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