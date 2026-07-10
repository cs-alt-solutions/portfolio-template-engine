// src/components/portfolio/content-engine/layouts/ClassicFlow.tsx
import React from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import Capabilities from '../../Capabilities';
import GalleryGrid from '../../GalleryGrid';

export default function ClassicFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const hasCaps = capabilities && capabilities.length > 0;
  const hasGallery = galleryItems && galleryItems.length > 0;

  return (
    <>
      {hasCaps && (
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className={`text-4xl md:text-5xl mb-16 text-center ${brandTextColor} ${fonts.heading}`}>
            {capabilitiesHeading}
          </h2>
          <Capabilities items={capabilities} themeStyle={themeStyle} brandColor={brandColor} />
        </div>
      )}
      
      {hasGallery && (
        <div className={`w-full py-24 ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
          <div className="container mx-auto px-6">
            <h3 className={`text-4xl md:text-5xl mb-12 text-center ${brandTextColor} ${fonts.heading}`}>
              {galleryHeading}
            </h3>
            <GalleryGrid items={galleryItems} themeStyle={themeStyle} />
          </div>
        </div>
      )}
    </>
  );
}