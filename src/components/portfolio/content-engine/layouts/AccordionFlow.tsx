// src/components/portfolio/content-engine/layouts/AccordionFlow.tsx
'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';
import GalleryGrid from '../../GalleryGrid';

export default function AccordionFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  
  const [openAccordion, setOpenAccordion] = useState<number | null>(0); 
  
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const hasCaps = capabilities && capabilities.length > 0;
  const hasGallery = galleryItems && galleryItems.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 relative">
      <div className="mb-20 md:text-center">
        <h2 className={`text-5xl md:text-7xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
          {capabilitiesHeading}
        </h2>
        <div className={`w-32 h-2 bg-${brandColor} mt-8 md:mx-auto`} />
      </div>

      {hasCaps && (
        <div className="space-y-2 mb-24">
          {capabilities.map((cap, i) => {
            const isOpen = openAccordion === i;
            return (
              <div 
                key={i} 
                className={`border-b-2 transition-all duration-300 ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'} ${isOpen ? `border-${brandColor} bg-black/5 dark:bg-white/5 rounded-t-2xl` : ''}`}
              >
                <button 
                  onClick={() => setOpenAccordion(isOpen ? null : i)}
                  className="w-full py-8 px-4 flex items-center justify-between text-left group outline-none focus:outline-none appearance-none"
                >
                  <h3 className={`text-2xl md:text-4xl transition-colors ${fonts.heading} ${isOpen ? brandTextColor : isLightMode ? 'text-zinc-800 group-hover:text-black' : 'text-zinc-100 group-hover:text-white'}`}>
                    {cap.title}
                  </h3>
                  
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isOpen ? `border-${brandColor} bg-${brandColor}/10 ${brandTextColor} rotate-45` : isLightMode ? 'border-zinc-300 text-zinc-400 group-hover:border-zinc-500 group-hover:text-zinc-600' : 'border-zinc-700 text-zinc-500 group-hover:border-zinc-500 group-hover:text-white'}`}>
                    <Plus size={20} strokeWidth={isOpen ? 3 : 2} />
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out px-4 md:px-8 ${isOpen ? 'max-h-375 opacity-100 mb-10' : 'max-h-0 opacity-0'}`}>
                  
                  <div className={`pt-4 pb-2 border-l-2 ${isOpen ? `border-${brandColor}/30` : 'border-transparent'} pl-4 md:pl-8`}>
                    {cap.description && (
                      <p className={`text-xl md:text-2xl leading-relaxed whitespace-pre-wrap mb-8 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-300'} ${['elegant', 'organic', 'editorial'].includes(themeStyle) ? 'italic' : ''}`}>
                        {cap.description}
                      </p>
                    )}
                    
                    {cap.bullets && cap.bullets.length > 0 && (
                      <ul className={`space-y-4 mt-8 ${fonts.body}`}>
                        {cap.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                             {getThemeBullet(themeStyle, brandTextColor)}
                             <span className={`text-lg md:text-xl leading-relaxed ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasGallery && (
        <div className="mt-20 pt-20 border-t border-current/10">
           <h3 className={`text-center mb-16 ${brandTextColor} ${fonts.accent}`}>
              {galleryHeading}
           </h3>
           <GalleryGrid items={galleryItems} themeStyle={themeStyle} />
        </div>
      )}
    </div>
  );
}