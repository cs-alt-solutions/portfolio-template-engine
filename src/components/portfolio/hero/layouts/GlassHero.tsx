/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { HeroEngineProps } from '../HeroEngine';

export default function GlassHero({
  store,
  theme,
  brandColor,
  isHeroFixed,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  lineAccent
}: HeroEngineProps) {
  const safeTheme = theme || {};

  const positionClassMap: Record<string, string> = {
    'top': 'object-top',
    'center': 'object-center',
    'bottom': 'object-bottom',
    'left': 'object-left',
    'right': 'object-right',
  };

  const bgPositionMap: Record<string, string> = {
    'top': 'top center',
    'center': 'center center',
    'bottom': 'bottom center',
    'left': 'center left',
    'right': 'center right',
  };

  const activePosition = positionClassMap[store?.hero_position || 'center'] || 'object-center';
  const activeBgPosition = bgPositionMap[store?.hero_position || 'center'] || 'center center';

  const logoSizePref = store?.logo_size || 'large';
  const getLogoClasses = (size: string) => {
    const base = "block w-auto max-w-full object-contain drop-shadow-2xl transition-all duration-300 mx-auto mb-4 md:mb-6";
    switch(size) {
      case 'small': return `h-12 md:h-16 lg:h-20 ${base}`;
      case 'medium': return `h-16 md:h-24 lg:h-32 ${base}`;
      case 'massive': return `h-32 md:h-56 lg:h-72 ${base}`;
      case 'large':
      default: return `h-24 md:h-40 lg:h-48 ${base}`;
    }
  };

  return (
    <section id="hero" className="relative w-full min-h-[90vh] flex items-center justify-center p-6 md:p-12 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        {store?.hero_image ? (
          isHeroFixed ? (
            <div 
              className="fixed inset-0 w-full h-full bg-cover opacity-80" 
              style={{ backgroundImage: `url('${store?.hero_image || ''}')`, backgroundPosition: activeBgPosition, zIndex: -1 }} 
            />
          ) : (
            <img src={store?.hero_image || ''} alt={store?.business_name || 'Background'} className={`w-full h-full object-cover opacity-80 ${activePosition}`} />
          )
        ) : (
          <div className="w-full h-full bg-zinc-900 bg-[url('/grid.svg')] opacity-20" />
        )}
        
        <div className="absolute inset-0 bg-zinc-950/40" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto p-10 md:p-16 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center rounded-4xl">
        {safeTheme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />}
        
        {hasValidLogo && (
          <img src={store?.brand_logo || ''} alt={store?.business_name || 'Logo'} className={getLogoClasses(logoSizePref)} />
        )}
        
        {store?.tagline && (
          <h1 className={`${safeTheme.primaryText || ''} text-3xl md:text-4xl lg:text-5xl mb-4 drop-shadow-md max-w-3xl mx-auto text-balance`}>
            {store.tagline}
          </h1>
        )}

        {store?.subtext && (
          <p className={`text-base md:text-lg max-w-2xl mb-10 drop-shadow-md leading-relaxed font-light text-balance text-zinc-200 ${safeTheme.bodyText || ''}`}>
            {store.subtext}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
          <a href={exploreLink} className={`px-10 py-4 font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-xl bg-${brandColor} text-zinc-950 hover:scale-105 ${safeTheme.buttonStyle || ''}`}>
            {store?.hero_cta || heroButtonText}
          </a>
        </div>
      </div>
    </section>
  );
}