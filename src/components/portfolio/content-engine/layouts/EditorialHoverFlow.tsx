// src/components/portfolio/content-engine/layouts/EditorialHoverFlow.tsx
'use client';

import React, { useState } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';

export default function EditorialHoverFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const hasCaps = capabilities && capabilities.length > 0;
  const hasGallery = galleryItems && galleryItems.length > 0;

  return (
    <div className="w-full py-24 min-h-screen flex items-center relative overflow-hidden">
      
      {hasGallery && hoveredIndex !== null && galleryItems[hoveredIndex] && (
        <div className="absolute inset-0 z-0 animate-in fade-in duration-700">
           {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={galleryItems[hoveredIndex].imageUrl} alt="Hover visual" className="w-full h-full object-cover opacity-30 scale-105 transition-transform duration-[10s]" />
          <div className={`absolute inset-0 bg-${brandColor} mix-blend-color opacity-20`} />
          <div className={`absolute inset-0 bg-linear-to-t ${isLightMode ? 'from-white/95 via-white/80 to-white/95' : 'from-black/95 via-black/80 to-black/95'}`} />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        <h2 className={`mb-20 text-center ${brandTextColor} ${fonts.accent}`}>
          {capabilitiesHeading || 'Index'}
        </h2>
        
        <div className="flex flex-col w-full border-t border-current/20">
          {hasCaps && capabilities.map((cap, i) => {
            const isHoveringAny = hoveredIndex !== null;
            const isThisHovered = hoveredIndex === i;
            
            return (
              <div 
                key={i}
                onMouseEnter={() => setHoveredIndex(i % (hasGallery ? galleryItems.length : 1))}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`w-full py-10 md:py-16 border-b ${isLightMode ? 'border-zinc-300' : 'border-zinc-800'} flex flex-col md:flex-row justify-between gap-10 cursor-pointer transition-all duration-500 ${isThisHovered ? `px-4 md:px-12 bg-current/5 border-${brandColor}` : 'hover:px-4'} ${isHoveringAny && !isThisHovered ? 'opacity-30' : 'opacity-100'}`}
              >
                <div className="flex items-baseline gap-6 md:w-1/2">
                  <h3 className={`text-4xl md:text-6xl transition-colors ${fonts.heading} ${isThisHovered ? brandTextColor : isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
                    {cap.title}
                  </h3>
                </div>
                
                {isThisHovered && (
                  <div className="md:w-1/2 animate-in slide-in-from-left-4 fade-in duration-300">
                    {cap.description && (
                      <p className={`text-xl leading-relaxed mb-6 ${fonts.body} ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                        {cap.description}
                      </p>
                    )}
                    {cap.bullets && cap.bullets.length > 0 && (
                      <ul className={`space-y-4 pt-4 border-t ${isLightMode ? 'border-zinc-300' : 'border-zinc-800'}`}>
                        {cap.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-4">
                             {getThemeBullet(themeStyle, brandTextColor)}
                             <span className={`text-lg ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}