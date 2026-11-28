/* src/components/portfolio/content-engine/layouts/ClassicFlow.tsx */
'use client';

import React from 'react';
import { ContentLayoutProps } from '../types';
import { FLOW_DEFAULTS } from '@/utils/glossary';
import Capabilities from '../../Capabilities';
import GalleryGrid from '../../gallery/GalleryGrid';

export default function ClassicFlow({
  themeStyle,
  brandColor,
  secondaryBrandColor,
  isLightMode,
  capabilitiesHeading,
  galleryHeading,
  capabilities,
  galleryItems,
  operationalTerms,
  businessName,
  storefrontSlug,
  contactEmail,
}: ContentLayoutProps) {
  const hasCaps = capabilities && capabilities.length > 0;
  const unattachedGallery = (galleryItems || []).filter(
    (img) => img.isVisible !== false && (!img.category || img.category.trim() === '')
  );

  return (
    <>
      {hasCaps && (
        <Capabilities
          heading={capabilitiesHeading || FLOW_DEFAULTS.CLASSIC_HEADING}
          items={capabilities}
          galleryItems={galleryItems}
          operationalTerms={operationalTerms}
          themeStyle={themeStyle}
          brandColor={brandColor}
          secondaryBrandColor={secondaryBrandColor}
          businessName={businessName}
          storefrontSlug={storefrontSlug}
          contactEmail={contactEmail}
        />
      )}

      {unattachedGallery.length > 0 && (
        <div className={`w-full py-12 md:py-16 ${isLightMode ? 'bg-black/3' : 'bg-white/3'}`}>
          <GalleryGrid
            items={unattachedGallery}
            galleryHeading={galleryHeading || FLOW_DEFAULTS.CLASSIC_GALLERY_HEADING}
            themeStyle={themeStyle}
            brandColor={brandColor}
            secondaryBrandColor={secondaryBrandColor}
            isLightMode={isLightMode}
            businessName={businessName}
          />
        </div>
      )}
    </>
  );
}