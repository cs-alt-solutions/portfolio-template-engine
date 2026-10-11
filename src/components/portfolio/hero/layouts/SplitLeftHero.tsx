import React from 'react';
import { HeroEngineProps, getRawBgColor } from '../HeroEngine';

export default function SplitLeftHero({
  store,
  theme,
  isHeroFixed,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  accentColorClass,
  buttonBgClass,
  lineAccent
}: HeroEngineProps) {
  const safeTheme = theme || {};
  const rawBgColor = getRawBgColor(safeTheme.pageBg, safeTheme.isLightMode);
  
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
    const base = "block w-auto max-w-full object-contain drop-shadow-2xl transition-all duration-300 mb-4 md:mb-6 origin-left";
    switch(size) {
      case 'small': return `h-12 md:h-16 lg:h-20 ${base}`;
      case 'medium': return `h-16 md:h-24 lg:h-32 ${base}`;
      case 'massive': return `h-32 md:h-56 lg:h-72 ${base}`;
      case 'large':
      default: return `h-24 md:h-40 lg:h-48 ${base}`;
    }
  };

  return (
    <section id="hero" className={`relative min-h-[90vh] w-full flex flex-col md:flex-row ${safeTheme.pageBg || ''}`}>
      {isHeroFixed && (
        <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
          <div 
            className="fixed inset-0 w-full h-full bg-cover" 
            style={{ backgroundImage: `url('${store?.hero_image || ''}')`, backgroundPosition: activeBgPosition, zIndex: -1 }} 
          />
          <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: `linear-gradient(to right, ${rawBgColor} 0%, ${rawBgColor}F2 40%, transparent 65%)` }} />
          <div className="absolute inset-0 pointer-events-none md:hidden" style={{ background: `linear-gradient(to bottom, ${rawBgColor} 0%, ${rawBgColor}F2 65%, transparent 100%)` }} />
        </div>
      )}

      <div className={isHeroFixed ? "w-full md:w-1/2 lg:w-5/12 flex items-center p-8 md:p-16 lg:p-24 relative z-10" : `w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10 ${safeTheme.pageBg || ''}`}>
        <div className="w-full max-w-xl text-left">
          {hasValidLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={store?.brand_logo || ''} alt={store?.business_name || 'Logo'} className={getLogoClasses(logoSizePref)} />
          ) : (
            <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-4 flex items-center gap-4`}>
              <div className={`h-px w-12 ${lineAccent}`} /> {safeTheme.prefix || ''}{store?.business_name || ''}
            </h2>
          )}
          
          {store?.tagline && (
            <h1 className={`${safeTheme.primaryText || ''} text-3xl md:text-4xl lg:text-5xl mb-6 text-balance`}>
              {store.tagline}
            </h1>
          )}
          
          {store?.subtext && (
            <p className={`text-base md:text-lg mb-10 text-balance ${safeTheme.bodyText || ''}`}>
              {store.subtext}
            </p>
          )}

          <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>{store?.hero_cta || heroButtonText}</a>
        </div>
      </div>

      {!isHeroFixed && (
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative overflow-hidden">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src={store?.hero_image || ''} alt={store?.business_name || 'Hero'} className={`absolute inset-0 w-full h-full object-cover ${activePosition}`} />
           <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: `linear-gradient(to right, ${rawBgColor} 0%, transparent 20%)` }} />
        </div>
      )}
    </section>
  );
}