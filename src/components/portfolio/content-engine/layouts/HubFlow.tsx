/* src/components/portfolio/content-engine/layouts/HubFlow.tsx */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import UniversalLeadModal, { TopicConfig } from '../../UniversalLeadModal';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { GalleryItem } from '../types';
import HubDepartmentCard from './hub/HubDepartmentCard';
import HubDetailsModal, { OperationalTerm } from './hub/HubDetailsModal';
import {
  HubCollectionPhoto,
  HubDepartmentData,
  extractCollections,
} from './hub/hubCollections';

interface FramedGalleryItem extends GalleryItem {
  focalPoint?: { x: number; y: number };
  imageFit?: 'cover' | 'contain';
  imageZoom?: number;
  collection?: string;
}

interface HubFlowProps {
  items?: HubDepartmentData[];
  capabilities?: HubDepartmentData[];
  galleryItems?: FramedGalleryItem[];
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

function detectLightColor(raw?: string): boolean | null {
  if (!raw) return null;
  const val = raw.trim().toLowerCase();

  const hexMatch = val.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 >= 150;
  }

  const rgbMatch = val.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);
  if (rgbMatch) {
    const alpha = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    if (alpha === 0) return null;
    const r = parseFloat(rgbMatch[1]);
    const g = parseFloat(rgbMatch[2]);
    const b = parseFloat(rgbMatch[3]);
    return (r * 299 + g * 587 + b * 114) / 1000 >= 150;
  }

  const oklchMatch = val.match(/^oklch\(\s*([\d.]+)(%?)/);
  if (oklchMatch) {
    const rawL = parseFloat(oklchMatch[1]);
    const l = oklchMatch[2] === '%' ? rawL / 100 : rawL;
    return l >= 0.66;
  }

  const twMatch = val.match(/^([a-z]+)-(\d{2,3})$/);
  if (twMatch) {
    const [, hue, shadeStr] = twMatch;
    const shade = parseInt(shadeStr, 10);
    if (shade <= 300) return true;
    if (
      shade === 400 &&
      ['yellow', 'lime', 'amber', 'stone', 'neutral', 'zinc', 'gray', 'slate', 'cyan', 'emerald', 'teal', 'sky'].includes(
        hue
      )
    ) {
      return true;
    }
    if (shade === 500 && ['yellow', 'lime', 'amber'].includes(hue)) return true;
    return false;
  }

  return null;
}

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
  const departments = useMemo<HubDepartmentData[]>(() => {
    const rawList = [...(items || []), ...(capabilities || [])];
    const safeItems = rawList.filter(
      (item, index, self) =>
        item && item.title && !item.isAlaCarte && self.findIndex((t) => t.title === item.title) === index
    );
    if (safeItems.length > 0) return safeItems;

    const safeGallery = Array.isArray(galleryItems) ? galleryItems : [];
    const uniqueCategories = Array.from(new Set(safeGallery.map((g) => g.category).filter(Boolean))) as string[];
    return uniqueCategories.map((cat) => ({
      title: cat,
      description: `Explore offerings and services under ${cat}.`,
      price: '',
      bullets: [],
      addons: [],
    }));
  }, [items, capabilities, galleryItems]);

  const topicConfigs = useMemo<Record<string, TopicConfig>>(() => {
    const map: Record<string, TopicConfig> = {};
    departments.forEach((dept) => {
      if (dept.title) {
        map[dept.title] = {
          addons: dept.addons || [],
          askTimeframe: dept.askTimeframe === true,
          timeframeMode: dept.timeframeMode,
          addonSelectionMode: dept.addonSelectionMode,
        };
      }
    });
    return map;
  }, [departments]);

  const safeGallery = Array.isArray(galleryItems) ? galleryItems : [];
  const safeTerms = Array.isArray(operationalTerms) ? operationalTerms.filter((t) => t && t.title) : [];

  const isControlled = typeof controlledActiveIndex === 'number';
  const [internalIndex, setInternalIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<HubDepartmentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const directLightBrand = detectLightColor(brandColor);
  const [probedLightBrand, setProbedLightBrand] = useState(false);
  const brandProbeRef = useRef<HTMLSpanElement | null>(null);
  const probeKey = `${brandColor}|${themeStyle}`;

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

  useEffect(() => {
    if (directLightBrand !== null || !probeKey) return;
    const frameId = window.requestAnimationFrame(() => {
      if (!brandProbeRef.current) return;
      const computedBg = window.getComputedStyle(brandProbeRef.current).backgroundColor;
      const probed = detectLightColor(computedBg);
      if (probed !== null) setProbedLightBrand(probed);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [directLightBrand, probeKey]);

  const isLightBrand = directLightBrand ?? probedLightBrand;

  if (departments.length === 0) {
    return (
      <div className={`w-full py-16 px-4 text-center ${theme.pageBg}`}>
        <p className={`text-xs font-mono uppercase tracking-widest ${theme.mutedText}`}>
          No departments configured for this storefront yet.
        </p>
      </div>
    );
  }

  const activeDept = departments[activeIndexSafe] || departments[0];

  // Scope modal policies strictly to this department (storewide ALL policies live at the bottom of the page)
  const activeDeptTerms = safeTerms.filter((t) => {
    if (!t.appliesTo || t.appliesTo === 'ALL') return false;
    return t.appliesTo.trim().toLowerCase() === activeDept?.title?.trim().toLowerCase();
  });

  const activeDeptFaqs = (activeDept?.faqs || []).filter((f) => f && f.question?.trim() && f.answer?.trim());

  const deptPhotos: HubCollectionPhoto[] = safeGallery
    .filter(
      (g) =>
        g &&
        g.imageUrl &&
        g.isVisible !== false &&
        g.category?.toLowerCase() === activeDept?.title?.toLowerCase()
    )
    .map((g) => {
      const cleanDesc =
        g.description && g.description.trim().toLowerCase() !== activeDept?.title?.trim().toLowerCase()
          ? g.description.trim()
          : '';
      return {
        url: g.imageUrl,
        title: g.title?.trim() || '',
        description: cleanDesc,
        collection: g.collection?.trim() || '',
        focalPoint: g.focalPoint,
        imageFit: g.imageFit,
        imageZoom: g.imageZoom,
      };
    });

  if (deptPhotos.length === 0 && activeDept?.coverImage) {
    deptPhotos.push({ url: activeDept.coverImage });
  }

  const deptCollections = extractCollections(deptPhotos);
  const activeDeptProfiles = (activeDept?.collectionProfiles || []).filter(
    (p) => p && p.name?.trim()
  );

  const hasSecondaryContent =
    activeDeptTerms.length > 0 || activeDeptFaqs.length > 0 || activeDeptProfiles.length > 0;

  const smartDetailsLabel =
    activeDept?.detailsLabel?.trim() ||
    (deptPhotos.length > 0 && hasSecondaryContent
      ? 'Photos & Details'
      : deptPhotos.length > 0
        ? 'View Gallery'
        : activeDeptProfiles.length > 0
          ? 'Bios & Details'
          : 'Policies & Details');

  const toggleDetails = (open: boolean, collectionName: string | null = null) => {
    setActiveCollection(open ? collectionName : null);
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

  const handleOpenModal = (dept: HubDepartmentData) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  const modalDept = selectedDept || activeDept;
  const inquiryTopicList = modalDept
    ? [modalDept.title, ...departments.map((d) => d.title).filter((t) => t !== modalDept.title)]
    : departments.map((d) => d.title).filter(Boolean);

  const activePill = isLightBrand
    ? 'bg-brand-primary text-zinc-950 border-brand-primary shadow-lg shadow-brand-primary/20 scale-[1.02]'
    : 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/25 scale-[1.02]';

  return (
    <div className="w-full pb-16 md:pb-24 px-4 md:px-8 relative z-20">
      <span ref={brandProbeRef} aria-hidden="true" className="sr-only bg-brand-primary pointer-events-none" />

      <div
        className="w-full mx-auto relative z-30 pt-6 md:pt-8 flex flex-col items-center gap-5"
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
      >
        {/* Theme-Driven Single-Row Department Bar */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 md:gap-2.5">
          {departments.map((dept, idx) => {
            const isActive = idx === activeIndexSafe;
            const indexLabel = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
            const displayTitle = dept.tabLabel?.trim() || dept.title;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`px-4 py-2.5 border text-[11px] whitespace-nowrap transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${
                  isActive ? activePill : theme.pillStyle
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    isActive
                      ? isLightBrand
                        ? 'text-zinc-950/70'
                        : 'text-white/80'
                      : 'opacity-50'
                  }`}
                >
                  {indexLabel}
                </span>
                <span>{displayTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Focused Spotlight Card */}
        {activeDept && (
          <div className="w-full max-w-6xl mx-auto">
            <HubDepartmentCard
              department={activeDept}
              index={activeIndexSafe}
              hasDetails={deptPhotos.length > 0 || hasSecondaryContent}
              hasPhotos={deptPhotos.length > 0}
              detailsLabel={smartDetailsLabel}
              collections={deptCollections}
              profiles={activeDeptProfiles}
              isLightMode={isLightMode}
              isLightBrand={isLightBrand}
              theme={theme}
              themeStyle={themeStyle}
              fonts={fonts}
              onInquire={() => handleOpenModal(activeDept)}
              onOpenDetails={() => toggleDetails(true, null)}
              onSelectCollection={(collectionName) => toggleDetails(true, collectionName)}
            />
          </div>
        )}
      </div>

      {activeDept && (
        <HubDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => toggleDetails(false)}
          onInquire={() => handleOpenModal(activeDept)}
          department={activeDept}
          photos={deptPhotos}
          terms={activeDeptTerms}
          initialCollection={activeCollection}
          isLightMode={isLightMode}
          isLightBrand={isLightBrand}
          themeStyle={themeStyle}
          fonts={fonts}
        />
      )}

      <UniversalLeadModal
        key={modalDept?.title || 'hub-lead'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessName={businessName || 'Our Business'}
        storefrontSlug={storefrontSlug || 'platform-direct'}
        contactEmail={contactEmail || ''}
        brandColor={brandColor || 'brand-primary'}
        isLightMode={isLightMode}
        themeStyle={themeStyle || 'industrial'}
        inquiryOptions={inquiryTopicList.length > 0 ? inquiryTopicList : ['General Inquiry']}
        addonOptions={modalDept?.addons || []}
        addonSelectionMode={modalDept?.addonSelectionMode || 'multiple'}
        showTimeframeFields={
          modalDept?.timeframeMode
            ? modalDept.timeframeMode !== 'off'
            : modalDept?.askTimeframe === true
        }
        allowSpecificDate={
          modalDept?.timeframeMode ? modalDept.timeframeMode === 'calendar' : true
        }
        topicConfigs={topicConfigs}
      />
    </div>
  );
}