/* src/components/portfolio/HubStage.tsx */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import HeroEngine, { HeroEngineProps, FocalPoint } from './hero/HeroEngine';
import HubFlow from './content-engine/layouts/HubFlow';
import { Capability, GalleryItem } from './content-engine/types';
import { OperationalTerm } from './content-engine/layouts/hub/HubDetailsModal';

interface FramedGalleryItem extends GalleryItem {
  focalPoint?: FocalPoint;
  imageFit?: 'cover' | 'contain';
  imageZoom?: number;
  heroFocalPoint?: FocalPoint;
  heroImageFit?: 'cover' | 'contain';
  heroImageZoom?: number;
  heroFitAlign?: 'left' | 'center' | 'right';
  heroFitScale?: number;
}

interface HubStageProps {
  heroProps: Omit<HeroEngineProps, 'isHubMode'>;
  capabilities: Capability[];
  galleryItems: FramedGalleryItem[];
  operationalTerms?: OperationalTerm[];
  themeStyle: string;
  brandColor: string;
  secondaryBrandColor?: string;
  isLightMode: boolean;
  businessName?: string;
  storefrontSlug?: string;
  contactEmail?: string;
}

export default function HubStage({
  heroProps,
  capabilities = [],
  galleryItems = [],
  operationalTerms = [],
  themeStyle,
  brandColor,
  secondaryBrandColor,
  isLightMode,
  businessName,
  storefrontSlug,
  contactEmail,
}: HubStageProps) {
  const departments = useMemo<Capability[]>(() => {
    const safeItems = (capabilities || []).filter(
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
  }, [capabilities, galleryItems]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLockedByClick, setIsLockedByClick] = useState(false);

  useEffect(() => {
    if (departments.length <= 1 || isHovered || isFlipped || isLockedByClick) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % departments.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [departments.length, isHovered, isFlipped, isLockedByClick]);

  const activeIndexSafe = departments.length > 0 ? Math.min(activeIndex, departments.length - 1) : 0;
  const activeDept = departments[activeIndexSafe];
  const keepMainHeroStatic = heroProps.store?.hub_hero_static === true;

  const vaultCoverItem = galleryItems.find(
    (g) => g && g.imageUrl && g.category?.toLowerCase() === activeDept?.title?.toLowerCase()
  );

  const activeDeptCover = vaultCoverItem?.imageUrl || activeDept?.coverImage;

  const syncedStore = keepMainHeroStatic
    ? heroProps.store
    : {
        ...heroProps.store,
        hero_image: activeDeptCover || heroProps.store?.hero_image,
        hero_focal_point: vaultCoverItem ? (vaultCoverItem.heroFocalPoint || vaultCoverItem.focalPoint) : undefined,
        hero_image_fit: vaultCoverItem ? (vaultCoverItem.heroImageFit || 'cover') : undefined,
        hero_image_zoom: vaultCoverItem ? (vaultCoverItem.heroImageZoom ?? 1) : undefined,
        hero_fit_align: vaultCoverItem?.heroFitAlign || 'center',
        hero_fit_scale: vaultCoverItem?.heroFitScale ?? 100,
      };

  const handleSelectDept = (idx: number) => {
    setActiveIndex(idx);
    setIsLockedByClick(true);
  };

  return (
    <div className="w-full relative">
      <HeroEngine {...heroProps} store={syncedStore} isHubMode={true} />

      <div id="gallery">
        <HubFlow
          items={departments}
          capabilities={departments}
          galleryItems={galleryItems}
          operationalTerms={operationalTerms}
          themeStyle={themeStyle}
          brandColor={brandColor}
          secondaryBrandColor={secondaryBrandColor}
          isLightMode={isLightMode}
          businessName={businessName}
          storefrontSlug={storefrontSlug}
          contactEmail={contactEmail}
          controlledActiveIndex={activeIndexSafe}
          onSelectIndex={handleSelectDept}
          onHoverChange={setIsHovered}
          onFlipChange={setIsFlipped}
          hideStageImage={true}
        />
      </div>
    </div>
  );
}