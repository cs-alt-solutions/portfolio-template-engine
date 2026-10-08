// src/components/portfolio/content-engine/layouts/LookbookFlow.tsx
'use client';

import React, { useState } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { ImageIcon, Maximize2 } from 'lucide-react';
import ServiceProofModal, { GalleryItem } from '../../ServiceProofModal';

interface ModalServiceState {
  title: string;
  images: GalleryItem[];
  desc?: string;
  bullets?: string[]; 
}

const parseItemData = (rawText: string = '') => {
  const match = rawText.match(/(.+?)(?:\s*[-|: ]*\s*)(\$[\d.]+)$/);
  if (match) return { text: match[1].trim(), price: match[2] };
  return { text: rawText.trim(), price: null };
};

export default function LookbookFlow({
  themeStyle, brandColor, secondaryBrandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const [activeModalService, setActiveModalService] = useState<ModalServiceState | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;
  const shapeRadius = theme.radius || 'rounded-none';

  // 🚀 THE FIX: Restored the missing hasCaps declaration
  const hasCaps = capabilities && capabilities.length > 0;
  
  const packages = (capabilities || []).filter(c => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter(c => c.isAlaCarte);
  
  const getAttachedImages = (serviceTitle: string): GalleryItem[] => {
    return (galleryItems || []).filter((item: GalleryItem) => item.category === serviceTitle);
  };

  const unattachedGallery = (galleryItems || []).filter(img => !img.category || img.category.trim() === '');
  const hasUnattachedGallery = unattachedGallery.length > 0;

  return (
    <div className="w-full bg-inherit pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* LOOKBOOK: SERVICES / PACKAGES */}
        {packages.length > 0 && (
          <div className="mb-24">
            <div className="mb-16 md:mb-24 text-center md:text-left">
              <h2 className={`text-5xl md:text-7xl lg:text-8xl tracking-tighter ${brandTextColor} ${fonts.heading}`}>
                {capabilitiesHeading || 'Collections'}
              </h2>
            </div>
            
            <div className="columns-1 md:columns-2 gap-8 md:gap-12 space-y-12 md:space-y-16">
              {packages.map((cap, i) => {
                const attachedImages = getAttachedImages(cap.title);
                const coverImage = attachedImages.length > 0 ? attachedImages[0].imageUrl : null;

                return (
                  <div 
                    key={i} 
                    className="break-inside-avoid flex flex-col group cursor-pointer" 
                    onClick={() => setActiveModalService({ title: cap.title, images: attachedImages, desc: cap.description, bullets: cap.bullets })}
                  >
                    
                    {/* The Uncropped Cover Photo */}
                    <div className={`relative w-full mb-6 overflow-hidden shadow-2xl ${shapeRadius} ${isLightMode ? 'bg-zinc-100' : 'bg-zinc-900 border border-white/5'}`}>
                      {coverImage ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={coverImage} alt={cap.title} className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
                          <div className={`absolute inset-0 bg-${activeSecondary} mix-blend-color opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
                        </>
                      ) : (
                        <div className="w-full aspect-4/5 flex flex-col items-center justify-center text-zinc-500 bg-zinc-800/20">
                          <ImageIcon size={48} className="mb-4 opacity-50" />
                          <span className="text-xs uppercase tracking-widest font-bold opacity-50">No Cover Assigned</span>
                        </div>
                      )}
                      
                      {/* Clean hover instruction */}
                      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Maximize2 size={12} className={`text-${activeSecondary}`} />
                        <span className="text-[9px] text-white font-bold tracking-widest uppercase">View Details</span>
                      </div>
                    </div>

                    {/* The Package Details (Title and Price Only) */}
                    <div className="px-2 pt-2">
                      <div className={`flex flex-col xl:flex-row xl:items-baseline justify-between gap-2 ${themeStyle === 'editorial' ? 'border-b-2 border-current pb-2' : ''}`}>
                        <h3 className={`text-2xl md:text-3xl transition-colors duration-300 ${fonts.heading} ${isLightMode ? 'text-zinc-900 group-hover:text-zinc-600' : 'text-zinc-100 group-hover:text-white'}`}>
                          {cap.title}
                        </h3>
                        {cap.price && (
                          <span className={`text-lg md:text-xl shrink-0 ${fonts.body} ${brandTextColor}`}>
                            {cap.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* À LA CARTE MENU */}
        {alaCarte.length > 0 && (
          <div className="mt-24 mb-32 max-w-4xl mx-auto">
            {alaCarte.map((cap, i) => (
              <div key={i} className="mb-16">
                <div className="text-center mb-12">
                   <h3 className={`text-4xl md:text-5xl ${fonts.heading} ${brandTextColor}`}>{cap.title}</h3>
                   {cap.description && <p className={`mt-4 text-lg max-w-2xl mx-auto ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>{cap.description}</p>}
                </div>
                
                <div className="space-y-4">
                   {cap.bullets?.map((b, bIdx) => {
                      const { text, price } = parseItemData(b);
                      return (
                         <div key={bIdx} className={`flex items-end justify-between gap-4 border-b ${isLightMode ? 'border-zinc-200' : 'border-zinc-800/60'} pb-4 transition-colors hover:border-current/30`}>
                            <span className={`text-lg md:text-xl ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{text}</span>
                            {price && <span className={`text-lg md:text-xl font-bold tracking-tight ${brandTextColor}`}>{price}</span>}
                         </div>
                      );
                   })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOOKBOOK: UNATTACHED GALLERY (Masonry Grid) */}
        {hasUnattachedGallery && (
          <div className={`mt-24 pt-24 ${hasCaps || alaCarte.length > 0 ? `border-t ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'}` : ''}`}>
            <h3 className={`text-4xl md:text-6xl mb-16 text-center ${brandTextColor} ${fonts.heading}`}>
              {galleryHeading || 'Portfolio'}
            </h3>
            
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {unattachedGallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative break-inside-avoid overflow-hidden shadow-lg group cursor-pointer ${shapeRadius}`}
                  onClick={() => setActiveModalService({ title: galleryHeading || 'Portfolio', images: unattachedGallery, desc: '' })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt={img.title || `Gallery Image ${idx}`} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  
                  {img.title && (
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-6">
                      <h4 className={`text-lg font-bold text-white ${fonts.heading}`}>{img.title}</h4>
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 bg-${activeSecondary} mix-blend-color opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0`} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <ServiceProofModal
        isOpen={!!activeModalService}
        onClose={() => setActiveModalService(null)}
        title={activeModalService?.title || ''}
        images={activeModalService?.images || []}
        description={activeModalService?.desc}
        bullets={activeModalService?.bullets}
        themeStyle={themeStyle}
        brandColor={brandColor}
      />
    </div>
  );
}