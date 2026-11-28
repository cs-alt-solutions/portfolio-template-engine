/* src/components/portfolio/gallery/GalleryGrid.tsx */
'use client';

import React, { useState } from 'react';
import { getFonts } from '../content-engine/utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { GALLERY_DEFAULTS } from '@/utils/glossary';
import ServiceProofModal from '../ServiceProofModal';
import GalleryCard from './GalleryCard';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  galleryHeading?: string;
  themeStyle?: string;
  brandColor?: string;
  secondaryBrandColor?: string;
  isLightMode?: boolean;
  layout?: 'masonry' | 'structured';
  businessName?: string;
}

export default function GalleryGrid({
  items,
  galleryHeading,
  themeStyle = 'industrial',
  brandColor = 'brand-primary',
  secondaryBrandColor,
  isLightMode,
  layout = 'masonry',
  businessName,
}: GalleryGridProps) {
  const [activeProject, setActiveProject] = useState<{ title: string; images: GalleryItem[] } | null>(null);

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const isLight = typeof isLightMode === 'boolean' ? isLightMode : theme.isLightMode || false;
  const activeSecondary = secondaryBrandColor || brandColor;
  const accentColorClass = theme.useBrandAccent ? `text-${brandColor}` : 'text-white';
  const fonts = getFonts(themeStyle);
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const isSharp = shapeRadius === 'rounded-none';

  const validItems = items?.filter((item) => item && item.imageUrl && item.imageUrl.trim() !== '') || [];
  if (validItems.length === 0) return null;

  const groupedProjects = validItems.reduce<Record<string, GalleryItem[]>>((acc, item) => {
    const key = item.category?.trim() || GALLERY_DEFAULTS.UNCATEGORIZED_LABEL;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const projectEntries = Object.entries(groupedProjects);

  const structuredGridClass =
    projectEntries.length === 1
      ? 'grid grid-cols-1 max-w-xl mx-auto gap-8'
      : projectEntries.length === 2
        ? 'grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8 md:gap-10'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10';

  return (
    <div className="w-full py-12 md:py-16 bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className={`text-3xl md:text-5xl tracking-tighter ${isLight ? 'text-zinc-900' : 'text-white'} ${fonts.heading}`}>
            {galleryHeading || GALLERY_DEFAULTS.FALLBACK_HEADING}
          </h2>
        </div>

        <div className={layout === 'structured' ? structuredGridClass : 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'}>
          {projectEntries.map(([folderName, projectImages]) => (
            <GalleryCard
              key={folderName}
              folderName={folderName}
              images={projectImages}
              layout={layout}
              isLightMode={isLight}
              shapeRadius={shapeRadius}
              isSharp={isSharp}
              accentColorClass={accentColorClass}
              activeSecondary={activeSecondary}
              headingFont={fonts.heading}
              bodyFont={fonts.body}
              businessName={businessName}
              onSelect={() => setActiveProject({ title: folderName, images: projectImages })}
            />
          ))}
        </div>
      </div>

      <ServiceProofModal
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
        title={activeProject?.title || GALLERY_DEFAULTS.MODAL_FALLBACK_TITLE}
        images={activeProject?.images || []}
        themeStyle={themeStyle}
        brandColor={brandColor}
        businessName={businessName}
      />
    </div>
  );
}