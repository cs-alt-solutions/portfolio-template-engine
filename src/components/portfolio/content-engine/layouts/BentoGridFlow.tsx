/* src/components/portfolio/content-engine/layouts/BentoGridFlow.tsx */
'use client';

import React from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';

export default function BentoGridFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.radius || 'rounded-3xl';
  const isMidnight = themeStyle === 'midnight';
  const hasCaps = capabilities && capabilities.length > 0;

  const getAttachedImages = (serviceTitle: string) => {
    return (galleryItems || []).filter((item) => item.category === serviceTitle && item.imageUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-20 text-center md:text-left">
        <h2 className={`text-4xl md:text-6xl ${brandTextColor} ${fonts.heading}`}>
          {capabilitiesHeading || 'The Ecosystem'}
        </h2>
      </div>
      
      {/* 🚀 TRUE ASYMMETRIC BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(380px,auto)]">
        {hasCaps && capabilities.map((cap, i) => {
          const attachedImages = getAttachedImages(cap.title);
          const hasBackgroundPhoto = attachedImages.length > 0;
          const bgPhoto = hasBackgroundPhoto ? attachedImages[0].imageUrl : null;
          
          // Every 3rd card becomes an asymmetric double-wide feature!
          const isWide = i % 3 === 0;

          return (
            <div 
              key={`bento-${i}`} 
              className={`relative flex flex-col justify-between overflow-hidden group transition-all duration-500 hover:-translate-y-1 ${shapeRadius} shadow-xl hover:shadow-2xl ${isWide ? 'md:col-span-2' : 'col-span-1'} ${
                !hasBackgroundPhoto 
                  ? (isMidnight ? 'bg-zinc-900/30 backdrop-blur-2xl border border-white/5' : isLightMode ? 'bg-white border border-zinc-200' : 'bg-zinc-900 border border-zinc-800')
                  : 'border border-white/10'
              }`}
            >
              {/* IMAGE BACKGROUND (If Available) */}
              {hasBackgroundPhoto && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bgPhoto!} alt={cap.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 opacity-90 group-hover:opacity-100 transition-opacity" />
                </>
              )}

              {/* CARD CONTENT */}
              <div className={`relative z-10 flex flex-col h-full ${hasBackgroundPhoto ? 'p-6 md:p-10 justify-end' : 'p-8 md:p-12'}`}>
                
                {/* Header Area */}
                <div className="mb-6">
                  <h3 className={`text-3xl md:text-4xl leading-tight ${fonts.heading} ${hasBackgroundPhoto ? 'text-white drop-shadow-md' : brandTextColor}`}>
                    {cap.title}
                  </h3>
                </div>

                {/* Description & Bullets (Glassmorphism if it has a photo) */}
                <div className={`${hasBackgroundPhoto ? 'bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl' : ''}`}>
                  {cap.description && (
                    <p className={`text-lg leading-relaxed ${!hasBackgroundPhoto ? 'mb-6' : 'mb-4'} ${fonts.body} ${hasBackgroundPhoto ? 'text-zinc-200' : isLightMode ? 'text-zinc-600' : 'text-zinc-300'}`}>
                      {cap.description}
                    </p>
                  )}

                  {cap.bullets && cap.bullets.length > 0 && (
                    <ul className={`space-y-3 relative z-10 ${!hasBackgroundPhoto ? `border-t ${isLightMode ? 'border-zinc-200' : 'border-white/10'} pt-6` : 'border-t border-white/10 pt-4'}`}>
                      {cap.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-4 py-1">
                          {getThemeBullet(themeStyle, hasBackgroundPhoto ? 'text-white' : brandTextColor)}
                          <span className={`text-base md:text-lg ${fonts.body} ${hasBackgroundPhoto ? 'text-white' : isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
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
    </div>
  );
}