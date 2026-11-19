/* src/components/portfolio/HubStage.tsx */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import HeroEngine, { HeroEngineProps } from './hero/HeroEngine';
import HubFlow from './content-engine/layouts/HubFlow';
import { Capability, GalleryItem } from './content-engine/types';

interface HubStageProps {
  heroProps: Omit<HeroEngineProps, 'isHubMode'>;
  capabilities: Capability[];
  galleryItems: GalleryItem[];
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
  const [isLockedByClick, setIsLockedByClick] = useState(false);

  // Auto-advancing reel (pauses on hover, locks once visitor clicks a department)
  useEffect(() => {
    if (departments.length <= 1 || isHovered || isLockedByClick) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % departments.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [departments.length, isHovered, isLockedByClick]);

  const activeIndexSafe = departments.length > 0 ? Math.min(activeIndex, departments.length - 1) : 0;
  const activeDept = departments[activeIndexSafe];

  const activeDeptCover =
    activeDept?.coverImage ||
    galleryItems.find((g) => g && g.category === activeDept?.title && g.imageUrl)?.imageUrl;

  // Swap the active department's image directly into the Hero backdrop (with main hero fallback)
  const syncedStore = {
    ...heroProps.store,
    hero_image: activeDeptCover || heroProps.store?.hero_image,
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
          hideStageImage={true}
        />
      </div>
    </div>
  );
}