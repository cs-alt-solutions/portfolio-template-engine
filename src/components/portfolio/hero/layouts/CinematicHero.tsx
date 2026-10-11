import React from 'react';
import { HeroEngineProps } from '../HeroEngine';

export default function CinematicHero({
  store,
  theme,
  brandColor,
  isHeroFixed,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  accentColorClass,
  buttonBgClass
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
    const base = "block w-auto max-w-full object-contain drop-shadow-2xl transition-all duration-300 mb-0 origin-bottom-left";
    switch(size) {
      case 'small': return `h-12 md:h-16 lg:h-20 ${base}`;
      case 'medium': return `h-16 md:h-24 lg:h-32 ${base}`;
      case 'massive': return `h-32 md:h-56 lg:h-72 ${base}`;
      case 'large':
      default: return `h-24 md:h-40 lg:h-48 ${base}`;
    }
  };

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-end justify-start overflow-hidden pb-12 md:pb-24">
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        {isHeroFixed ? (
          <div 
            className="fixed inset-0 w-full h-full bg-cover" 
            style={{ backgroundImage: `url('${store?.hero_image || ''}')`, backgroundPosition: activeBgPosition, zIndex: -1 }} 
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={store?.hero_image || ''} alt={store?.business_name || 'Hero'} className={`w-full h-full object-cover scale-105 ${activePosition}`} />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-90" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="relative max-w-4xl mt-32">
          
          {hasValidLogo && (
            <div className="absolute -top-16 md:-top-24 left-4 md:left-8 z-20 pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={store?.brand_logo || ''} alt={store?.business_name || 'Logo'} className={getLogoClasses(logoSizePref)} />
            </div>
          )}
          
          <div className="relative z-10 flex flex-col items-start pt-8 md:pt-12">
            <div className={`w-20 md:w-32 h-2 md:h-3 mb-6 md:mb-8 bg-${brandColor} ${safeTheme.radius === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} />
            {!hasValidLogo && (
              <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-3`}>{safeTheme.prefix || ''}{store?.business_name || ''}</h2>
            )}
            
            {store?.tagline && (
              <h1 className={`${safeTheme.primaryText || ''} text-4xl md:text-5xl lg:text-7xl mb-6 leading-tight relative z-10 text-balance`}>
                {store.tagline}
              </h1>
            )}
            
            {store?.subtext && (
              <p className={`text-lg md:text-xl mb-8 leading-relaxed relative z-10 text-balance max-w-2xl ${(safeTheme.bodyText || '').replace('mx-auto', 'mr-auto')}`}>
                {store.subtext}
              </p>
            )}
            
            <a href={exploreLink} className={`inline-block relative z-10 ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>{store?.hero_cta || heroButtonText}</a>
          </div>
        </div>
      </div>
    </section>
  );
}