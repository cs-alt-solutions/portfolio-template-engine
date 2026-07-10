// src/components/portfolio/content-engine/layouts/BentoGridFlow.tsx
import React from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';

export default function BentoGridFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const hasCaps = capabilities && capabilities.length > 0;
  const hasGallery = galleryItems && galleryItems.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h2 className={`text-4xl md:text-6xl mb-20 text-center ${brandTextColor} ${fonts.heading}`}>
        {capabilitiesHeading || galleryHeading || 'The Ecosystem'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
        {hasCaps && capabilities.map((cap, i) => (
          <div key={`cap-${i}`} className={`p-8 md:p-12 rounded-3xl flex flex-col justify-center ${isLightMode ? 'bg-white shadow-2xl' : 'bg-zinc-900 border border-zinc-800'} ${i % 3 === 0 ? 'md:col-span-2' : ''} group overflow-hidden relative transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-700`} />
            
            <h3 className={`text-3xl md:text-4xl mb-4 ${brandTextColor} relative z-10 ${fonts.heading}`}>{cap.title}</h3>
            
            {cap.description && (
               <p className={`relative z-10 text-lg leading-relaxed mb-6 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-300'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                 {cap.description}
               </p>
            )}
            
            {cap.bullets && cap.bullets.length > 0 && (
              <ul className={`space-y-3 relative z-10 border-t ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'} pt-6`}>
                {cap.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                     {getThemeBullet(themeStyle, brandTextColor)}
                     <span className={`text-lg ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        
        {hasGallery && galleryItems.map((item, i) => (
          <div key={item.id || `img-${i}`} className={`rounded-3xl overflow-hidden relative group ${i % 4 === 0 ? 'md:col-span-2 row-span-2' : 'aspect-square md:aspect-auto'} cursor-pointer`}>
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
    </div>
  );
}