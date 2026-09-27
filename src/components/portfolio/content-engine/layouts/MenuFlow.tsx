/* src/components/portfolio/content-engine/layouts/MenuFlow.tsx */
'use client';

import React, { useState } from 'react';
import { ContentLayoutProps, GalleryItem } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { Camera } from 'lucide-react';
import ServiceProofModal from '../../ServiceProofModal';

interface ModalState {
  title: string;
  images: GalleryItem[];
  description?: string;
}

interface ExtendedGalleryItem extends GalleryItem {
  price?: string;
}

// Smart Price Extractor: Finds "$XX.XX" at the end of a string
const parseItemData = (rawText: string = '') => {
  const match = rawText.match(/(.+?)(?:\s*[-|:—]*\s*)(\$[\d.]+)$/);
  if (match) return { text: match[1].trim(), price: match[2] };
  return { text: rawText.trim(), price: null };
};

export default function MenuFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const [activeModal, setActiveModal] = useState<ModalState | null>(null);

  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  
  const hasMenu = capabilities && capabilities.length > 0;
  const typedGallery = (galleryItems || []) as ExtendedGalleryItem[];
  const validGallery = typedGallery.filter(item => item && item.imageUrl && item.imageUrl.trim() !== '');

  const getAttachedImages = (categoryTitle: string): ExtendedGalleryItem[] => {
    return validGallery.filter((item) => item.category === categoryTitle);
  };

  if (!hasMenu) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      
      {/* MASTER MENU HEADER */}
      <div className="text-center mb-20 md:mb-32">
        <h2 className={`text-5xl md:text-7xl mb-6 ${brandTextColor} ${fonts.heading} drop-shadow-md`}>
          {capabilitiesHeading || 'Menu'}
        </h2>
        <div className={`w-24 h-1.5 mx-auto bg-${brandColor} ${theme.radius === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} />
      </div>

      {/* CATEGORY STACK */}
      <div className="flex flex-col gap-24 md:gap-32">
        {capabilities.map((section, i) => {
          const attachedImages = getAttachedImages(section.title);
          const hasPhotos = attachedImages.length > 0;
          const hasTextBullets = section.bullets && section.bullets.length > 0;

          return (
            <div key={`menu-${i}`} className="flex flex-col relative w-full">
              
              {/* SECTION HEADER */}
              <div className="flex items-end justify-between border-b-2 border-zinc-800 dark:border-zinc-200/20 pb-4 mb-8">
                <h3 className={`text-4xl md:text-5xl ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'} ${fonts.heading}`}>
                  {section.title}
                </h3>
                {hasPhotos && (
                  <button
                    onClick={() => setActiveModal({ title: section.title, images: attachedImages, description: section.description })}
                    className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 ${theme.radius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} ${isLightMode ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-300' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View Gallery</span>
                  </button>
                )}
              </div>

              {section.description && (
                <p className={`text-lg md:text-xl mb-10 max-w-3xl opacity-80 leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-700' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                  {section.description}
                </p>
              )}

              {/* DYNAMIC MENU GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12">
                
                {/* 📸 VISUAL MENU ITEMS (The Photo Grid - ONLY shows if photos exist) */}
                {hasPhotos && (
                  <div className="xl:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {attachedImages.map((img, idx) => {
                      // 🚀 STRICT NAME CHECK: Do not fallback to category title!
                      const displayName = img.title ? img.title.trim() : '';
                      
                      // Check dedicated price first, otherwise parse from description if needed
                      let displayPrice = img.price ? img.price.trim() : '';
                      let displayDesc = img.description || '';

                      if (!displayPrice && displayDesc) {
                        const descParse = parseItemData(displayDesc);
                        if (descParse.price) {
                          displayPrice = descParse.price;
                          displayDesc = descParse.text;
                        }
                      }

                      return (
                        <div key={idx} className={`relative aspect-square md:aspect-4/3 rounded-2xl overflow-hidden group shadow-xl bg-zinc-900 border ${isLightMode ? 'border-zinc-200' : 'border-white/10'} cursor-pointer`}>
                          
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.imageUrl} alt={displayName || 'Menu Item'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          
                          {/* Permanent Mobile-Safe Dark Gradient */}
                          <div className={`absolute inset-0 bg-linear-to-t ${isLightMode ? 'from-black/90 via-black/40' : 'from-black/95 via-black/50'} to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100`} />

                          {/* Always-Visible Text Block */}
                          <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                {displayName && (
                                  <h4 className={`text-lg md:text-xl font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${fonts.heading} group-hover:${brandTextColor} transition-colors duration-300`}>
                                    {displayName}
                                  </h4>
                                )}
                                {displayDesc && (
                                  <p className={`text-xs text-zinc-300 mt-1 line-clamp-2 drop-shadow-md font-light leading-relaxed ${fonts.body}`}>
                                    {displayDesc}
                                  </p>
                                )}
                              </div>
                              
                              {/* Flashy, tilted price badge */}
                              {displayPrice && (
                                <div className={`shrink-0 bg-${brandColor} text-zinc-950 px-3 py-1 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] transform -rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300`}>
                                  <span className={`text-sm md:text-base font-black tracking-tight ${fonts.body}`}>
                                    {displayPrice.startsWith('$') ? displayPrice : `$${displayPrice}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 📝 TEXT MENU ITEMS (The Bullet Fallback - ONLY shows if NO photos exist) */}
                {!hasPhotos && hasTextBullets && (
                  <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    {section.bullets?.map((item, bIdx) => {
                      const { text: itemName, price: itemPrice } = parseItemData(item);

                      return (
                        <div key={bIdx} className={`flex justify-between items-start gap-4 p-4 rounded-xl transition-all ${isLightMode ? 'hover:bg-zinc-100' : 'hover:bg-white/5'}`}>
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
                )}
              </div>

            </div>
          );
        })}
      </div>

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