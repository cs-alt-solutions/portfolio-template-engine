/* src/components/portfolio/content-engine/layouts/MenuFlow.tsx */
'use client';

import React, { useState } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { Camera } from 'lucide-react';
import ServiceProofModal, { GalleryItem } from '../../ServiceProofModal';

interface ModalState {
  title: string;
  images: GalleryItem[];
  description?: string;
}

export default function MenuFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const [activeModal, setActiveModal] = useState<ModalState | null>(null);

  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  
  const hasMenu = capabilities && capabilities.length > 0;
  const validGallery = (galleryItems || []).filter(item => item && item.imageUrl && item.imageUrl.trim() !== '');

  const getAttachedImages = (categoryTitle: string): GalleryItem[] => {
    return validGallery.filter((item) => item.category === categoryTitle);
  };

  if (!hasMenu) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-20">
        <h2 className={`text-5xl md:text-7xl mb-6 ${brandTextColor} ${fonts.heading}`}>
          {capabilitiesHeading || 'Menu'}
        </h2>
        <div className={`w-24 h-1.5 mx-auto bg-${brandColor} ${theme.radius === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
        {capabilities.map((section, i) => {
          const attachedImages = getAttachedImages(section.title);
          const hasPhotos = attachedImages.length > 0;

          return (
            <div key={`menu-${i}`} className="flex flex-col relative">
              
              {/* MENU CATEGORY HEADER */}
              <div className="flex items-end justify-between border-b-2 border-zinc-800 dark:border-zinc-200/20 pb-4 mb-6">
                <h3 className={`text-3xl md:text-4xl ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'} ${fonts.heading}`}>
                  {section.title}
                </h3>
                {hasPhotos && (
                  <button
                    onClick={() => setActiveModal({ title: section.title, images: attachedImages, description: section.description })}
                    className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 ${theme.radius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} ${isLightMode ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-300' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Photos</span>
                  </button>
                )}
              </div>

              {section.description && (
                <p className={`text-base md:text-lg mb-8 opacity-80 leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-700' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                  {section.description}
                </p>
              )}

              {/* MENU ITEMS (Bullets) */}
              <div className="space-y-6 flex-1">
                {section.bullets?.map((item, bIdx) => {
                  // Smart Parse: If they type "Cheeseburger - $12" or "Cheeseburger $12", we split it nicely
                  const priceMatch = item.match(/(.+?)(?:\s+[-—]\s+|\s+)(\$[\d.]+)$/);
                  const itemName = priceMatch ? priceMatch[1] : item;
                  const itemPrice = priceMatch ? priceMatch[2] : null;

                  return (
                    <div key={bIdx} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className={`text-lg md:text-xl font-bold ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'} ${fonts.body}`}>
                          {itemName}
                        </h4>
                      </div>
                      {itemPrice && (
                        <span className={`text-lg font-bold shrink-0 ${brandTextColor} ${fonts.body}`}>
                          {itemPrice}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* RE-USING THE PROOF MODAL FOR MENU PHOTOS */}
      <ServiceProofModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={activeModal?.title || ''}
        images={activeModal?.images || []}
        description={activeModal?.description}
        themeStyle={themeStyle}
        brandColor={brandColor}
      />
    </div>
  );
}