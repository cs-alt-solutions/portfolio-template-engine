// src/components/portfolio/content-engine/layouts/StickyScrollFlow.tsx
import React from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';

export default function StickyScrollFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const hasCaps = capabilities && capabilities.length > 0;
  const hasGallery = galleryItems && galleryItems.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 space-y-8">
            <div>
              <h2 className={`text-4xl md:text-6xl mb-6 ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
                {capabilitiesHeading}
              </h2>
              <div className={`w-24 h-2 bg-${brandColor} mb-8`} />
            </div>

            {hasCaps && (
              <div className="space-y-2">
                {capabilities.map((cap, i) => (
                  <div key={i} className={`group py-12 border-b ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'} last:border-0`}>
                    <h3 className={`text-3xl mb-4 ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>{cap.title}</h3>
                    
                    {cap.description && (
                      <p className={`text-lg leading-relaxed mb-6 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-300'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                        {cap.description}
                      </p>
                    )}
                    
                    {cap.bullets && cap.bullets.length > 0 && (
                      <ul className="space-y-3">
                        {cap.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-4">
                             {getThemeBullet(themeStyle, brandTextColor)}
                             <span className={`text-lg ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <h3 className={`text-2xl mb-8 hidden lg:block ${fonts.accent} ${brandTextColor}`}>
            {galleryHeading}
          </h3>
          {hasGallery && galleryItems.map((item, i) => (
            <div key={item.id || i} className="w-full aspect-4/3 rounded-3xl overflow-hidden relative shadow-2xl group cursor-pointer">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.title || "Portfolio item"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
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
      </div>
    </div>
  );
}