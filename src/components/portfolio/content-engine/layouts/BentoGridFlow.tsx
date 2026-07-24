// src/components/portfolio/content-engine/layouts/BentoGridFlow.tsx
'use client';
import React, { useState } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { Info, Image as ImageIcon, ArrowRight } from 'lucide-react';
import ServiceProofModal, { GalleryItem } from '../../ServiceProofModal';

interface ModalState {
  title: string;
  images: GalleryItem[];
  description?: string;
}

export default function BentoGridFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const [activeModal, setActiveModal] = useState<ModalState | null>(null);

  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.radius || 'rounded-3xl';
  const isMidnight = themeStyle === 'midnight';

  const hasCaps = capabilities && capabilities.length > 0;
  const validGallery = (galleryItems || []).filter(item => item && item.imageUrl && item.imageUrl.trim() !== '');
  
  const getAttachedImages = (serviceTitle: string): GalleryItem[] => {
    return validGallery.filter((item) => item.category === serviceTitle);
  };

  const unattachedItems = validGallery.filter(
    (item) => !item.category || item.category.trim() === ""
  );
  const hasGallery = unattachedItems.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h2 className={`text-4xl md:text-6xl mb-20 text-center ${brandTextColor} ${fonts.heading}`}>
        {capabilitiesHeading || galleryHeading || 'The Ecosystem'}
      </h2>
      
      {/* BENTO CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
        {hasCaps && capabilities.map((cap, i) => {
          const attachedImages = getAttachedImages(cap.title);
          const hasProof = attachedImages.length > 0;
          
          // 🚀 THE FIX: Every 3rd card becomes an asymmetric double-wide feature banner!
          const isWide = i % 3 === 0;

          return (
            <div 
              key={`cap-${i}`} 
              className={`p-8 md:p-12 ${shapeRadius} flex flex-col justify-between ${
                isMidnight 
                  ? 'bg-zinc-900/30 backdrop-blur-2xl border border-white/5 hover:border-white/20 hover:bg-zinc-900/40 shadow-2xl' 
                  : isLightMode 
                    ? 'bg-white shadow-2xl border border-zinc-100 hover:border-zinc-300' 
                    : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
              } ${isWide ? 'md:col-span-2' : ''} group overflow-hidden relative transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-${brandColor} opacity-5 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
              
              {/* 🚀 INTERNAL GRID: If wide, split into side-by-side columns on desktop! */}
              <div className={isWide ? "grid grid-cols-1 md:grid-cols-12 gap-8 h-full flex-1" : "flex flex-col justify-between h-full flex-1"}>
                
                {/* Left Side (or Top if standard card) */}
                <div className={isWide ? "md:col-span-6 flex flex-col justify-between" : ""}>
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                      <h3 className={`text-3xl md:text-4xl ${brandTextColor} ${fonts.heading}`}>{cap.title}</h3>
                      {hasProof && (
                        <button
                          onClick={() => setActiveModal({ title: cap.title, images: attachedImages, description: cap.description })}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-sm shrink-0 hover:scale-105 ${
                            isLightMode 
                              ? 'bg-zinc-900 text-white hover:bg-zinc-700' 
                              : 'bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black'
                          }`}
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Proof ({attachedImages.length})</span>
                        </button>
                      )}
                    </div>
                    
                    {cap.description && (
                      <p className={`relative z-10 text-lg leading-relaxed ${isWide ? 'mb-0' : 'mb-6'} ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-300'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                        {cap.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side (or Bottom if standard card): Anchors bullets and buttons! */}
                <div className={isWide ? `md:col-span-6 flex flex-col justify-between border-t md:border-t-0 md:border-l ${isLightMode ? 'border-zinc-200' : 'border-white/10'} md:pl-8 pt-6 md:pt-0` : "flex flex-col justify-between mt-auto"}>
                  {cap.bullets && cap.bullets.length > 0 && (
                    <ul className={`space-y-3 relative z-10 ${!isWide ? `border-t ${isLightMode ? 'border-zinc-200' : 'border-white/10'} pt-6 mb-6` : 'mb-6'}`}>
                      {cap.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-4 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                           {getThemeBullet(themeStyle, brandTextColor)} 
                           <span className={`text-lg ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {hasProof && (
                    <button
                      onClick={() => setActiveModal({ title: cap.title, images: attachedImages, description: cap.description })}
                      className={`w-full mt-auto py-3 px-4 border ${shapeRadius} text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative z-10 ${
                        isLightMode
                          ? 'bg-zinc-100 hover:bg-zinc-900 border-zinc-300 hover:border-zinc-900 text-zinc-800 hover:text-white'
                          : 'bg-black/40 hover:bg-white/10 border-white/10 hover:border-white/30 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" /> View Work Gallery <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {/* BOTTOM GALLERY DUMP */}
        {hasGallery && unattachedItems.map((item, i) => (
          <div key={item.id || `img-${i}`} className={`${shapeRadius} overflow-hidden relative group ${i % 4 === 0 ? 'md:col-span-2 row-span-2' : 'aspect-square md:aspect-auto'} cursor-pointer border border-white/5 shadow-xl`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.title || 'Work'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
            <div className={`absolute inset-0 bg-linear-to-t ${isLightMode ? 'from-white/95 via-white/50' : 'from-black/95 via-black/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end h-full">
              {item.title && (
                <h3 className={`text-2xl md:text-4xl leading-snug ${isLightMode ? 'text-zinc-900 drop-shadow-sm' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'} ${fonts.heading}`}>
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p className={`mt-3 text-base md:text-lg line-clamp-4 ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'} ${fonts.body}`}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* POP-OUT PROOF MODAL */}
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