// src/components/portfolio/content-engine/layouts/LookbookFlow.tsx
'use client';

import React, { useState } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { ImageIcon, Layers } from 'lucide-react';
import ServiceProofModal, { GalleryItem } from '../../ServiceProofModal';

interface ModalServiceState {
  title: string;
  images: GalleryItem[];
  desc?: string;
}

export default function LookbookFlow({
  themeStyle, brandColor, secondaryBrandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const [activeModalService, setActiveModalService] = useState<ModalServiceState | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;
  const shapeRadius = theme.radius || 'rounded-none';

  const hasCaps = capabilities && capabilities.length > 0;
  
  const getAttachedImages = (serviceTitle: string): GalleryItem[] => {
    return (galleryItems || []).filter((item: GalleryItem) => item.category === serviceTitle);
  };

  const unattachedGallery = (galleryItems || []).filter(img => !img.category || img.category.trim() === '');
  const hasUnattachedGallery = unattachedGallery.length > 0;

  return (
    <div className="w-full bg-inherit pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* LOOKBOOK: SERVICES / PACKAGES */}
        {hasCaps && (
          <div className="mb-32">
            <div className="mb-16 md:mb-24 text-center md:text-left">
              <h2 className={`text-5xl md:text-7xl lg:text-8xl tracking-tighter ${brandTextColor} ${fonts.heading}`}>
                {capabilitiesHeading || 'Collections'}
              </h2>
            </div>
            
            {/* Masonry Layout for Packages */}
            <div className="columns-1 md:columns-2 gap-8 md:gap-12 space-y-12 md:space-y-16">
              {capabilities.map((cap, i) => {
                const attachedImages = getAttachedImages(cap.title);
                const hasProof = attachedImages.length > 0;
                const coverImage = hasProof ? attachedImages[0].imageUrl : null;

                return (
                  <div key={i} className="break-inside-avoid flex flex-col group cursor-pointer" onClick={() => hasProof && setActiveModalService({ title: cap.title, images: attachedImages, desc: cap.description })}>
                    
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
                      
                      {/* Hover Indicator */}
                      {hasProof && (
                        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Layers size={12} className={`text-${activeSecondary}`} />
                          <span className="text-[9px] text-white font-bold tracking-widest uppercase">View Gallery</span>
                        </div>
                      )}
                    </div>

                    {/* The Package Details (Clean Typography below the art) */}
                    <div className="px-2">
                      <h3 className={`text-3xl md:text-4xl mb-4 transition-colors duration-300 ${fonts.heading} ${isLightMode ? 'text-zinc-900 group-hover:text-zinc-600' : 'text-zinc-100 group-hover:text-white'} ${themeStyle === 'editorial' ? 'border-b-2 border-current pb-2 inline-block' : ''}`}>
                        {cap.title}
                      </h3>
                      
                      {cap.description && (
                        <p className={`text-lg leading-relaxed mb-6 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                          {cap.description}
                        </p>
                      )}
                      
                      {cap.bullets && cap.bullets.length > 0 && (
                        <ul className="space-y-3 pt-4">
                          {cap.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                              {getThemeBullet(themeStyle, `text-${brandColor}`)}
                              <span className={`text-base ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-300'}`}>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOOKBOOK: UNATTACHED GALLERY (Masonry Grid) */}
        {hasUnattachedGallery && (
          <div className={`mt-24 pt-24 ${hasCaps ? `border-t ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'}` : ''}`}>
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
        themeStyle={themeStyle}
        brandColor={brandColor}
      />
    </div>
  );
}