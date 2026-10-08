// src/components/portfolio/content-engine/layouts/ClassicFlow.tsx
import React from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import Capabilities from '../../Capabilities';
import GalleryGrid from '../../GalleryGrid';

export default function ClassicFlow({
  themeStyle, brandColor, secondaryBrandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const hasCaps = capabilities && capabilities.length > 0;
  
  const unattachedGallery = (galleryItems || []).filter(img => !img.category || img.category.trim() === '');
  const hasUnattachedGallery = unattachedGallery.length > 0;

  return (
    <>
      {hasCaps && (
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className={`text-4xl md:text-5xl mb-16 text-center ${brandTextColor} ${fonts.heading}`}>
            {capabilitiesHeading || 'Scope of Work'}
          </h2>
          
          <Capabilities 
            items={capabilities} 
            galleryItems={galleryItems} 
            themeStyle={themeStyle} 
            brandColor={brandColor} 
            secondaryBrandColor={secondaryBrandColor} // 🚀 THE FIX: Pass the color down to the cards
          />
        </div>
      )}
      
      {hasUnattachedGallery && (
        <div className={`w-full py-24 ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`}>
          <div className="container mx-auto px-6">
            <h3 className={`text-4xl md:text-5xl mb-12 text-center ${brandTextColor} ${fonts.heading}`}>
              {galleryHeading || 'Proof of Work'}
            </h3>
            <GalleryGrid items={unattachedGallery} themeStyle={themeStyle} brandColor={brandColor} secondaryBrandColor={secondaryBrandColor} isLightMode={isLightMode} />
          </div>
        </div>
      )}
    </>
  );
}