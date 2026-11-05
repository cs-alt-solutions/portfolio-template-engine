/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { HeroEngineProps } from '../HeroEngine';

export default function CenterHero({
  store, theme, brandColor, isHeroFixed, hasValidLogo, exploreLink, heroButtonText, accentColorClass, buttonBgClass, lineAccent, isHubMode
}: HeroEngineProps) {
  const safeTheme = theme || {};
  const isLight = safeTheme.isLightMode;
  const activePosition = store?.hero_position === 'top' ? 'object-top' : store?.hero_position === 'bottom' ? 'object-bottom' : 'object-center';
  const activeBgPosition = store?.hero_position === 'top' ? 'top center' : store?.hero_position === 'bottom' ? 'bottom center' : 'center center';
  const logoSizePref = store?.logo_size || 'large';
  
  const heightClass = isHubMode ? "min-h-[45vh] py-12" : "min-h-[95vh] py-20";

  const getLogoClasses = (size: string) => {
    const base = "block w-auto max-w-full object-contain drop-shadow-xl transition-all duration-300 mx-auto mb-6 md:mb-8";
    switch(size) {
      case 'small': return `h-12 md:h-16 lg:h-20 ${base}`;
      case 'medium': return `h-16 md:h-24 lg:h-32 ${base}`;
      case 'massive': return `h-32 md:h-56 lg:h-72 ${base}`;
      default: return `h-24 md:h-40 lg:h-48 ${base}`;
    }
  };

  return (
    <section id="hero" className={`relative ${heightClass} w-full flex items-center justify-center overflow-hidden transition-all duration-500`}>
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        {isHeroFixed ? (
          <div className="fixed inset-0 w-full h-full bg-cover" style={{ backgroundImage: `url('${store?.hero_image || ''}')`, backgroundPosition: activeBgPosition, zIndex: -1 }} />
        ) : (
          <img src={store?.hero_image || ''} alt={store?.business_name || 'Hero'} className={`w-full h-full object-cover scale-105 ${activePosition}`} />
        )}
        <div className={`absolute inset-0 ${isLight ? 'bg-black/60' : 'bg-black/80'}`} />
        {safeTheme.useBrandTint && <div className={`absolute inset-0 opacity-30 bg-${brandColor} mix-blend-color`} />}
      </div>
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <div className={`w-full max-w-4xl text-center p-10 md:p-16 relative overflow-hidden group shadow-2xl ${safeTheme.cardStyle || ''} ${isLight ? 'bg-white/95 backdrop-blur-xl border-white/50' : 'bg-zinc-950/95 backdrop-blur-xl border-zinc-800'}`}>
          {safeTheme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />}
          {hasValidLogo ? (
            <img src={store?.brand_logo || ''} alt={store?.business_name || 'Logo'} className={getLogoClasses(logoSizePref)} />
          ) : (
            <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-6 drop-shadow-md`}>{safeTheme.prefix || ''}{store?.business_name || ''}</h2>
          )}
          {store?.tagline && <h1 className={`${safeTheme.primaryText || ''} text-3xl md:text-4xl lg:text-5xl mb-6 text-balance`}>{store.tagline}</h1>}
          {store?.subtext && <p className={`text-base md:text-lg ${isHubMode ? 'mb-4' : 'mb-10'} max-w-2xl mx-auto opacity-90 text-balance ${safeTheme.bodyText || ''}`}>{store.subtext}</p>}
          
          {/* Hide button if in Hub Portal Mode */}
          {!isHubMode && (
            <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>{store?.hero_cta || heroButtonText}</a>
          )}
        </div>
      </div>
    </section>
  );
}