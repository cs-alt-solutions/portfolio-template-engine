/* src/components/portfolio/content-engine/layouts/StickyScrollFlow.tsx */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { ImageIcon } from 'lucide-react';

export default function StickyScrollFlow({
  themeStyle, brandColor, isLightMode, capabilitiesHeading, capabilities, galleryItems
}: ContentLayoutProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.radius || 'rounded-3xl';
  const brandTextColor = `text-${brandColor}`;
  const hasCaps = capabilities && capabilities.length > 0;

  // Set up the Scroll-Spy Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px' } // Triggers when the section reaches the upper-middle of the screen
    );

    const elements = document.querySelectorAll('.scroll-spy-section');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [capabilities]);

  // Find the active image based on the currently viewed service
  const activeService = capabilities[activeIndex];
  const activeImages = galleryItems.filter(img => img.category === activeService?.title);
  const displayImage = activeImages.length > 0 ? activeImages[0].imageUrl : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 relative">
      <div className="text-center md:text-left mb-16 lg:mb-24">
        <h2 className={`text-4xl md:text-6xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
          {capabilitiesHeading || 'Capabilities'}
        </h2>
        <div className={`w-24 h-2 bg-${brandColor} mt-6 ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
        
        {/* LEFT COLUMN: The Scrolling Text Content */}
        <div className="lg:col-span-6 space-y-32 pb-32">
          {hasCaps && capabilities.map((cap, i) => {
            const isActive = activeIndex === i;
            return (
              <div 
                key={i} 
                data-index={i} 
                className={`scroll-spy-section transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-30 blur-[1px]'}`}
              >
                <h3 className={`text-3xl md:text-4xl mb-6 ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
                  {cap.title}
                </h3>
                
                {cap.description && (
                  <p className={`text-lg md:text-xl leading-relaxed mb-8 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                    {cap.description}
                  </p>
                )}
                
                {cap.bullets && cap.bullets.length > 0 && (
                  <ul className="space-y-4">
                    {cap.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent dark:hover:border-white/10 transition-colors">
                        {getThemeBullet(themeStyle, brandTextColor)}
                        <span className={`text-lg ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: The Sticky Crossfading Frame */}
        <div className="hidden lg:block lg:col-span-6 relative">
          <div className={`sticky top-32 w-full aspect-4/5 ${shapeRadius} overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 transition-all duration-500`}>
            
            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 bg-${brandColor} opacity-10 mix-blend-color`} />
            
            {displayImage ? (
              <img 
                key={displayImage} 
                src={displayImage} 
                alt={activeService?.title || 'Service Image'} 
                className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700" 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 animate-in fade-in duration-500">
                <ImageIcon size={48} className="mb-4 opacity-50" />
                <span className={`text-sm uppercase tracking-widest font-bold ${fonts.heading} opacity-50`}>No Media Assigned</span>
              </div>
            )}
            
            {/* Elegant Glass Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-widest text-white ${fonts.heading}`}>
                  {activeService?.title}
                </span>
                <span className={`w-2 h-2 rounded-full bg-${brandColor} animate-pulse shadow-[0_0_10px_currentColor]`} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}