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
  buttonBgClass,
  isHubMode
}: HeroEngineProps & { isHubMode?: boolean }) {
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

  // Check if logo is large/massive to trigger side-by-side layout instead of pushing down
  const isMassiveLogo = logoSizePref === 'massive' || logoSizePref === 'large';

  const getLogoClasses = (size: string) => {
    const base = "block object-contain drop-shadow-2xl transition-all duration-300 shrink-0";
    switch(size) {
      case 'small': return `h-12 md:h-16 w-auto ${base}`;
      case 'medium': return `h-16 md:h-24 w-auto ${base}`;
      case 'massive': return `h-32 md:h-48 lg:h-56 w-auto ${base}`;
      case 'large':
      default: return `h-20 md:h-32 lg:h-40 w-auto ${base}`;
    }
  };

  const heightClass = isHubMode ? "min-h-[45vh] md:min-h-[55vh]" : "min-h-screen pb-12 md:pb-24";

  return (
    <section id="hero" className={`relative ${heightClass} w-full flex items-end justify-start overflow-hidden`}>
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        {isHeroFixed ? (
          <div 
            className="fixed inset-0 w-full h-full bg-cover" 
            style={{ backgroundImage: `url('${store?.hero_image || ''}')`, backgroundPosition: activeBgPosition, zIndex: -1 }} 
          />
        ) : (
          <img src={store?.hero_image || ''} alt={store?.business_name || 'Hero'} className={`w-full h-full object-cover scale-105 ${activePosition}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`relative max-w-5xl ${isHubMode ? 'mt-12 mb-8' : 'mt-32'}`}>
          
          <div className="relative z-10 flex flex-col items-start pt-8 md:pt-12">
            <div className={`w-20 md:w-32 h-2 md:h-3 mb-6 md:mb-8 bg-${brandColor} ${safeTheme.radius === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} />
            
            {hasValidLogo ? (
              <div className={`w-full flex ${isMassiveLogo ? 'flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 text-left mb-6' : 'flex-col items-start'}`}>
                <img src={store?.brand_logo || ''} alt={store?.business_name || 'Logo'} className={getLogoClasses(logoSizePref)} />
                
                <div className="flex flex-col flex-1">
                  {!hasValidLogo && (
                    <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-3`}>{safeTheme.prefix || ''}{store?.business_name || ''}</h2>
                  )}
                  {store?.tagline && (
                    <h1 className={`${safeTheme.primaryText || ''} ${isHubMode ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl lg:text-5xl'} mb-4 leading-tight text-balance`}>
                      {store.tagline}
                    </h1>
                  )}
                  {store?.subtext && (
                    <p className={`text-base md:text-lg ${isHubMode ? 'mb-3' : 'mb-6'} leading-relaxed text-balance max-w-2xl ${safeTheme.bodyText || ''}`}>
                      {store.subtext}
                    </p>
                  )}
                  {!isHubMode && (
                    <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>{store?.hero_cta || heroButtonText}</a>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-start">
                <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-3`}>{safeTheme.prefix || ''}{store?.business_name || ''}</h2>
                {store?.tagline && (
                  <h1 className={`${safeTheme.primaryText || ''} ${isHubMode ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-7xl'} mb-6 leading-tight text-balance`}>
                    {store.tagline}
                  </h1>
                )}
                {store?.subtext && (
                  <p className={`text-lg md:text-xl ${isHubMode ? 'mb-4' : 'mb-8'} leading-relaxed text-balance max-w-2xl ${safeTheme.bodyText || ''}`}>
                    {store.subtext}
                  </p>
                )}
                {!isHubMode && (
                  <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>{store?.hero_cta || heroButtonText}</a>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}