/* src/components/portfolio/content-engine/layouts/MenuFlow.tsx */
'use client';

import React from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';

// Smart Price Extractor: Finds "$XX.XX" at the end of a string
const parseItemData = (rawText: string = '') => {
  const match = rawText.match(/(.+?)(?:\s*[-|:—]*\s*)(\$[\d.]+)$/);
  if (match) return { text: match[1].trim(), price: match[2] };
  return { text: rawText.trim(), price: null };
};

export default function MenuFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  
  const hasMenu = capabilities && capabilities.length > 0;
  const validGallery = (galleryItems || []).filter(item => item && item.imageUrl && item.imageUrl.trim() !== '');

  const getAttachedImages = (categoryTitle: string) => {
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
                      const parsedTitle = parseItemData(img.title);
                      const displayName = parsedTitle.text;
                      let displayPrice = parsedTitle.price;
                      
                      let displayDesc = img.description || '';
                      if (!displayPrice && img.description) {
                        const descParse = parseItemData(img.description);
                        if (descParse.price) {
                          displayPrice = descParse.price;
                          displayDesc = descParse.text;
                        }
                      }

                      return (
                        <div key={idx} className={`relative aspect-square md:aspect-4/3 rounded-2xl overflow-hidden group shadow-xl bg-zinc-900 border ${isLightMode ? 'border-zinc-200' : 'border-white/10'} cursor-pointer`}>
                          
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.imageUrl} alt={displayName || section.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          
                          <div className={`absolute inset-0 bg-linear-to-t ${isLightMode ? 'from-black/90 via-black/20' : 'from-black/90 via-black/40'} to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-300`} />

                          <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex justify-between items-end gap-3">
                              <div className="flex-1">
                                {displayName && (
                                  <h4 className={`text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-md ${fonts.heading}`}>
                                    {displayName}
                                  </h4>
                                )}
                                {displayDesc && (
                                  <p className={`text-sm md:text-base text-zinc-300 mt-2 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 drop-shadow-md ${fonts.body}`}>
                                    {displayDesc}
                                  </p>
                                )}
                              </div>
                              {displayPrice && (
                                <span className={`text-xl font-black shrink-0 ${brandTextColor} drop-shadow-md ${fonts.body}`}>
                                  {displayPrice}
                                </span>
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
    </div>
  );
}