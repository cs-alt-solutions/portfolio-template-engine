/* src/components/portfolio/content-engine/layouts/MenuFlow.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { ContentLayoutProps, GalleryItem } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';

interface ExtendedGalleryItem extends GalleryItem {
  price?: string;
  isVisible?: boolean;
  isRaw?: boolean;
  addons?: { name: string; price: string }[];
}

interface UnifiedMenuItem {
  type: 'photo' | 'blank';
  id: string;
  title: string;
  price: string;
  desc: string;
  imageUrl?: string;
  isRaw?: boolean;
  addons?: { name: string; price: string }[];
}

interface CardProps {
  item: UnifiedMenuItem;
  isLightMode?: boolean;
  fonts: { heading: string; body: string; accent: string };
  brandColor: string;
  secondaryBrandColor: string;
  brandTextColor: string;
  themeRadius: string;
}

const parseItemData = (rawText: string = '') => {
  const match = rawText.match(/(.+?)(?:\s*[-|:—]*\s*)(\$[\d.]+)$/);
  if (match) return { text: match[1].trim(), price: match[2] };
  return { text: rawText.trim(), price: null };
};

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// 🚀 Flexible price formatter for variants vs add-ons
const formatVariantPrice = (price: string) => {
  const clean = price.trim();
  if (!clean) return '';
  if (clean.match(/^[+-]/)) {
    const sign = clean[0];
    const num = clean.slice(1).trim();
    return `${sign}${num.startsWith('$') ? '' : '$'}${num}`;
  }
  return clean.startsWith('$') ? clean : `$${clean}`;
};

// 📸 FLIPPING PHOTO CARD
const PhotoCard = ({ item, isLightMode, fonts, brandColor, secondaryBrandColor, brandTextColor, themeRadius }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasAddons = item.addons && item.addons.length > 0;
  const canFlip = !!item.desc || hasAddons;

  return (
    <div 
      className={`relative aspect-square md:aspect-4/3 group perspective-[1000px] w-full h-full ${canFlip ? 'cursor-pointer' : ''}`} 
      onClick={() => canFlip && setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>
        
        {/* FRONT */}
        <div className={`absolute inset-0 w-full h-full backface-hidden shadow-xl bg-zinc-900 border ${isLightMode ? 'border-zinc-200' : 'border-white/10'} ${themeRadius} overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt={item.title || 'Menu Item'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className={`absolute inset-0 bg-linear-to-t ${isLightMode ? 'from-black/80 via-black/10' : 'from-black/90 via-black/30'} to-transparent opacity-90`} />
          <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end">
            <div className="flex justify-between items-end gap-3">
              <div className="flex-1 min-w-0 pr-2">
                {item.title && (
                  <h4 className={`text-lg md:text-xl font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${fonts.heading} text-balance line-clamp-2`}>
                    {item.title}
                    {item.isRaw && <span className="text-rose-500 ml-1 leading-none">*</span>}
                  </h4>
                )}
                {canFlip && (
                  <span className="text-[9px] text-white/80 uppercase tracking-widest font-bold mt-1.5 block opacity-0 group-hover:opacity-100 transition-opacity">
                    Tap for Details
                  </span>
                )}
              </div>
              
              {item.price && (
                <div className={`relative z-20 shrink-0 bg-${brandColor} text-zinc-950 px-2.5 py-1.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] transform -rotate-3`}>
                  <span className={`text-sm md:text-base font-black tracking-tight ${fonts.body}`}>{item.price}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className={`absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] shadow-xl border ${isLightMode ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'} ${themeRadius} relative`}>
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')] pointer-events-none rounded-[inherit]" />
          <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />
          <div className={`absolute -bottom-12 -left-12 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />
          
          {/* 🚀 THE FIX: Ensures the scroll container never squishes and stays perfectly scrollable */}
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center overflow-y-auto hide-scrollbar z-10">
            <div className="w-full text-center flex flex-col items-center">
              {item.desc && (
                <>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${brandTextColor} mb-3 flex items-center justify-center gap-2 w-full`}>
                    <span className="w-3 h-px bg-current opacity-50" /> Details <span className="w-3 h-px bg-current opacity-50" />
                  </span>
                  <p className={`text-sm md:text-base leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    {item.desc}
                  </p>
                </>
              )}

              {/* 🚀 THE SECONDARY COLOR POP FOR ADD-ONS */}
              {hasAddons && (
                <div className={`w-full text-left space-y-2 pt-5 ${item.desc ? 'mt-5 border-t' : ''} ${isLightMode ? 'border-zinc-200' : 'border-zinc-800/80'} shrink-0`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest opacity-70 block mb-3 ${isLightMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Options & Add-ons</span>
                  {item.addons!.map((addon, i) => (
                    <div key={i} className={`flex justify-between items-center text-[11px] uppercase tracking-wider font-bold border-b pb-2 mb-2 border-dashed ${isLightMode ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-300'} last:border-0 last:mb-0 last:pb-0`}>
                      <span className="pr-4">{addon.name}</span>
                      <span className={`shrink-0 px-2 py-1 rounded-md bg-${secondaryBrandColor}/10 text-${secondaryBrandColor} border border-${secondaryBrandColor}/20 shadow-sm`}>
                        {formatVariantPrice(addon.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 📝 FLIPPING TEXT CARD
const TextCard = ({ item, isLightMode, fonts, brandColor, secondaryBrandColor, brandTextColor, themeRadius }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasAddons = item.addons && item.addons.length > 0;
  const canFlip = !!item.desc || hasAddons;

  return (
    <div 
      className={`relative aspect-square md:aspect-4/3 group perspective-[1000px] w-full h-full ${canFlip ? 'cursor-pointer' : ''}`} 
      onClick={() => canFlip && setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>
        
        {/* FRONT */}
        <div className={`absolute inset-0 w-full h-full backface-hidden shadow-xl border ${isLightMode ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-white/5'} ${themeRadius} overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/grid.svg')] pointer-events-none" />
          <div className={`absolute -top-12 -left-12 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />

          <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end">
            <div className="flex justify-between items-end gap-3">
              <div className="flex-1 min-w-0 pr-2">
                {item.title && (
                  <h4 className={`text-lg md:text-xl font-black ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'} leading-tight drop-shadow-xs ${fonts.heading} text-balance line-clamp-2`}>
                    {item.title}
                    {item.isRaw && <span className="text-rose-500 ml-1 leading-none">*</span>}
                  </h4>
                )}
                {canFlip && (
                  <span className={`text-[9px] ${isLightMode ? 'text-zinc-500' : 'text-zinc-400'} uppercase tracking-widest font-bold mt-1.5 block opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Tap for Details
                  </span>
                )}
              </div>
              
              {item.price && (
                <div className={`relative z-20 shrink-0 bg-${brandColor} text-zinc-950 px-2.5 py-1.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] transform -rotate-3`}>
                  <span className={`text-sm md:text-base font-black tracking-tight ${fonts.body}`}>{item.price}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className={`absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] shadow-xl border ${isLightMode ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'} ${themeRadius} relative`}>
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')] pointer-events-none rounded-[inherit]" />
          <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />
          <div className={`absolute -bottom-12 -left-12 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />
          
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center overflow-y-auto hide-scrollbar z-10">
            <div className="w-full text-center flex flex-col items-center">
              {item.desc && (
                <>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${brandTextColor} mb-3 flex items-center justify-center gap-2 w-full`}>
                    <span className="w-3 h-px bg-current opacity-50" /> Details <span className="w-3 h-px bg-current opacity-50" />
                  </span>
                  <p className={`text-sm md:text-base leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    {item.desc}
                  </p>
                </>
              )}

              {/* 🚀 THE SECONDARY COLOR POP FOR ADD-ONS */}
              {hasAddons && (
                <div className={`w-full text-left space-y-2 pt-5 ${item.desc ? 'mt-5 border-t' : ''} ${isLightMode ? 'border-zinc-200' : 'border-zinc-800/80'} shrink-0`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest opacity-70 block mb-3 ${isLightMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Options & Add-ons</span>
                  {item.addons!.map((addon, i) => (
                    <div key={i} className={`flex justify-between items-center text-[11px] uppercase tracking-wider font-bold border-b pb-2 mb-2 border-dashed ${isLightMode ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-300'} last:border-0 last:mb-0 last:pb-0`}>
                      <span className="pr-4">{addon.name}</span>
                      <span className={`shrink-0 px-2 py-1 rounded-md bg-${secondaryBrandColor}/10 text-${secondaryBrandColor} border border-${secondaryBrandColor}/20 shadow-sm`}>
                        {formatVariantPrice(addon.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function MenuFlow({
  themeStyle, brandColor, secondaryBrandColor, isLightMode, capabilitiesHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const [activeCategory, setActiveCategory] = useState<string>('');

  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.radius || 'rounded-none';
  const activeSecondaryColor = secondaryBrandColor || brandColor; // Safe fallback
  
  const hasMenu = capabilities && capabilities.length > 0;
  const typedGallery = (galleryItems || []) as ExtendedGalleryItem[];

  const showRawWarning = typedGallery.some(img => img.isVisible !== false && img.isRaw);

  useEffect(() => {
    if (!hasMenu) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' } 
    );

    capabilities.forEach((cap) => {
      const el = document.getElementById(`category-${slugify(cap.title)}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [capabilities, hasMenu]);

  if (!hasMenu) return null;

  const scrollToCategory = (title: string) => {
    const el = document.getElementById(`category-${slugify(title)}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 relative">
      
      <div className="text-center mb-10 md:mb-16">
        <h2 className={`text-5xl md:text-7xl mb-6 ${brandTextColor} ${fonts.heading} drop-shadow-md`}>
          {capabilitiesHeading || 'Menu'}
        </h2>
        <div className={`w-24 h-1.5 mx-auto bg-${brandColor} ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} />
      </div>

      <div className="sticky top-4 z-50 w-full flex justify-center mb-12 md:mb-16 pointer-events-none">
        <div className={`pointer-events-auto flex overflow-x-auto gap-2 p-2 rounded-full backdrop-blur-2xl border shadow-2xl max-w-full hide-scrollbar
          ${isLightMode ? 'bg-white/80 border-zinc-200' : 'bg-zinc-950/80 border-zinc-800'}
        `} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; }`}} />
          
          {capabilities.map((section) => {
            const catId = `category-${slugify(section.title)}`;
            const isActive = activeCategory === catId;
            
            return (
              <button
                key={section.title}
                onClick={() => scrollToCategory(section.title)}
                className={`whitespace-nowrap shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300
                  ${isActive 
                    ? `bg-${brandColor} text-zinc-950 shadow-[0_0_15px_rgba(var(--tw-colors-${brandColor}),0.4)] scale-105` 
                    : `${isLightMode ? 'bg-transparent text-zinc-500 hover:text-zinc-800' : 'bg-transparent text-zinc-400 hover:text-white'}`
                  }
                `}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-24 md:gap-32">
        {capabilities.map((section, i) => {
          
          const unifiedItems: UnifiedMenuItem[] = [];
          const attachedGallery = typedGallery.filter(item => item.category === section.title && item.isVisible !== false);
          
          attachedGallery.forEach(img => {
            const isPhoto = !!(img.imageUrl && img.imageUrl.trim() !== '');
            const parsedTitle = parseItemData(img.title || '');
            const displayName = parsedTitle.text;
            
            let displayPrice = '';
            if (img.price && String(img.price).trim() !== '') {
              displayPrice = String(img.price).trim();
            } else if (parsedTitle.price) {
              displayPrice = parsedTitle.price;
            }

            let displayDesc = img.description || '';
            if (!displayPrice && displayDesc) {
              const descParse = parseItemData(displayDesc);
              if (descParse.price) {
                displayPrice = descParse.price;
                displayDesc = descParse.text;
              }
            }

            if (displayPrice && !displayPrice.startsWith('$')) {
              displayPrice = `$${displayPrice}`;
            }

            unifiedItems.push({
              type: isPhoto ? 'photo' : 'blank',
              id: img.id || Math.random().toString(),
              title: displayName,
              price: displayPrice,
              desc: displayDesc,
              imageUrl: img.imageUrl,
              isRaw: img.isRaw,
              addons: img.addons
            });
          });

          (section.bullets || []).forEach((bullet, bIdx) => {
            if (!bullet.trim()) return;
            const { text: itemName, price: itemPrice } = parseItemData(bullet);
            unifiedItems.push({
              type: 'blank',
              id: `bullet-${bIdx}`,
              title: itemName,
              price: itemPrice || '',
              desc: '',
            });
          });

          if (unifiedItems.length === 0) return null;

          return (
            <div key={`menu-${i}`} id={`category-${slugify(section.title)}`} className="flex flex-col relative w-full scroll-mt-32">
              
              <div className="flex flex-col items-center text-center border-b border-zinc-800 dark:border-zinc-200/20 pb-8 mb-10">
                <h3 className={`text-4xl md:text-5xl ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'} ${fonts.heading} mb-4`}>
                  {section.title}
                </h3>
                
                {section.description && (
                  <p className={`text-base md:text-lg max-w-2xl opacity-80 leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-700' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                    {section.description}
                  </p>
                )}
              </div>

              <div className="w-full">
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-8 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                  {unifiedItems.map((item) => (
                    <div key={item.id} className="shrink-0 w-[80vw] sm:w-[320px] md:w-auto snap-center h-full">
                      {item.type === 'photo' ? (
                        <PhotoCard item={item} isLightMode={isLightMode} fonts={fonts} brandColor={brandColor} secondaryBrandColor={activeSecondaryColor} brandTextColor={brandTextColor} themeRadius={shapeRadius} />
                      ) : (
                        <TextCard item={item} isLightMode={isLightMode} fonts={fonts} brandColor={brandColor} secondaryBrandColor={activeSecondaryColor} brandTextColor={brandTextColor} themeRadius={shapeRadius} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {showRawWarning && (
        <div className="mt-16 md:mt-24 pt-10 border-t border-zinc-800/40 text-center px-4">
          <p className={`text-[10px] md:text-xs uppercase tracking-widest max-w-3xl mx-auto leading-relaxed ${isLightMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
            <span className="text-rose-500 font-bold text-sm mr-1">*</span> 
            Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness.
          </p>
        </div>
      )}
      
    </div>
  );
}