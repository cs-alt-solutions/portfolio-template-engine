// src/components/portfolio/hero/HeroEngine.tsx
import React from 'react';
import { ThemeDefinition } from '@/utils/themes';

export interface StorefrontHeroData {
  business_name?: string;
  tagline?: string;
  subtext?: string;
  hero_image?: string;
  brand_logo?: string;
  logo_size?: string;
  [key: string]: unknown;
}

export interface HeroEngineProps {
  layout: string;
  store: StorefrontHeroData;
  theme: ThemeDefinition;
  brandColor: string;
  isHeroFixed: boolean;
  hasValidLogo: boolean;
  exploreLink: string;
  heroButtonText: string;
  accentColorClass: string;
  buttonBgClass: string;
  lineAccent: string;
}

const getRawBgColor = (pageBg: string, isLightMode: boolean) => {
  if (pageBg.includes('#')) {
    const match = pageBg.match(/#([0-9a-fA-F]{3,6})/);
    return match ? match[0] : (isLightMode ? '#ffffff' : '#000000');
  }
  if (pageBg.includes('zinc-950')) return '#09090b';
  if (pageBg.includes('zinc-50')) return '#fafafa';
  if (pageBg.includes('yellow-400')) return '#facc15';
  if (pageBg.includes('black')) return '#000000';
  if (pageBg.includes('white')) return '#ffffff';
  return isLightMode ? '#ffffff' : '#000000';
};

export default function HeroEngine({
  layout,
  store,
  theme,
  brandColor,
  isHeroFixed,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  accentColorClass,
  buttonBgClass,
  lineAccent
}: HeroEngineProps) {
  
  const cinematicBorderClass = theme.useBrandAccent ? 'border-' + brandColor : 'border-white';
  const cinematicCardClass = theme.cardStyle === 'bg-transparent border-none shadow-none'
    ? 'relative z-10'
    : 'p-8 pt-20 md:pt-24 md:pr-24 bg-gradient-to-r from-black/95 via-black/60 to-transparent border-l-4 relative z-10 ' + cinematicBorderClass;

  const rawBgColor = getRawBgColor(theme.pageBg, theme.isLightMode);

  const getLogoClasses = (size: string | undefined, isSplit: boolean) => {
    const base = "w-auto max-w-full object-contain drop-shadow-2xl transition-all duration-300";
    const placement = isSplit ? "mb-6 origin-left" : "mx-auto mb-8";
    
    switch(size) {
      case 'small': return `h-12 md:h-16 lg:h-20 ${base} ${placement}`;
      case 'medium': return `h-16 md:h-24 lg:h-32 ${base} ${placement}`;
      case 'massive': return `h-32 md:h-56 lg:h-72 ${base} ${placement}`;
      case 'large':
      default: return `h-24 md:h-40 lg:h-48 ${base} ${placement}`;
    }
  };

  const logoSizePref = store.logo_size || 'large';

  return (
    <>
      {/* LAYOUT 1: CENTERED */}
      {layout === 'center' && (
        <section id="hero" className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {isHeroFixed ? (
              <div className="w-full h-full bg-cover bg-center bg-fixed opacity-50" style={{ backgroundImage: `url('${store.hero_image}')` }} />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={store.hero_image} alt={store.business_name} className="w-full h-full object-cover object-center scale-105 opacity-50" />
              </>
            )}
          </div>
          {theme.useBrandTint && <div className={`absolute inset-0 z-0 opacity-20 bg-${brandColor} mix-blend-color`} />}
          <div className={`absolute inset-0 z-0 bg-linear-to-b ${theme.overlayFade}`} />
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center mt-12">
            <div className={`w-full max-w-4xl text-center p-8 md:p-16 relative overflow-hidden group ${theme.cardStyle}`}>
              {theme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />}
              
              {hasValidLogo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.brand_logo} alt={store.business_name} className={getLogoClasses(logoSizePref, false)} />
                </>
              ) : (
                <h2 className={`${theme.accentText} ${accentColorClass} mb-6 drop-shadow-md`}>{theme.prefix}{store.business_name}</h2>
              )}
              
              {/* THE FIX: Shrunk text-4xl/5xl and added text-balance */}
              <h1 className={`${theme.primaryText} text-3xl md:text-4xl lg:text-5xl mb-6 drop-shadow-sm max-w-3xl mx-auto text-balance`}>
                {store.tagline}
              </h1>
              <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 text-balance ${theme.bodyText}`}>
                {store.subtext}
              </p>
              <a href={exploreLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>{heroButtonText}</a>
            </div>
          </div>
        </section>
      )}

      {/* LAYOUT 2: SPLIT-LEFT */}
      {layout === 'split-left' && (
        <section id="hero" className={`relative min-h-[90vh] w-full flex flex-col md:flex-row ${theme.pageBg}`}>
          
          {isHeroFixed && (
            <>
              <div className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${store.hero_image}')` }} />
              <div className="absolute inset-0 z-0 pointer-events-none hidden md:block" style={{ background: `linear-gradient(to right, ${rawBgColor} 0%, ${rawBgColor}F2 40%, transparent 65%)` }} />
              <div className="absolute inset-0 z-0 pointer-events-none md:hidden" style={{ background: `linear-gradient(to bottom, ${rawBgColor} 0%, ${rawBgColor}F2 65%, transparent 100%)` }} />
            </>
          )}

          <div className={isHeroFixed ? "w-full md:w-1/2 lg:w-5/12 flex items-center p-8 md:p-16 lg:p-24 relative z-10" : `w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10 ${theme.pageBg}`}>
            <div className="w-full max-w-xl text-left">
              {hasValidLogo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.brand_logo} alt={store.business_name} className={getLogoClasses(logoSizePref, true)} />
                </>
              ) : (
                <h2 className={`${theme.accentText} ${accentColorClass} mb-4 flex items-center gap-4`}>
                  <div className={`h-px w-12 ${lineAccent}`} /> {theme.prefix}{store.business_name}
                </h2>
              )}
              
              <h1 className={`${theme.primaryText} text-3xl md:text-4xl lg:text-5xl mb-6 text-balance`}>
                {store.tagline}
              </h1>
              <p className={`text-base md:text-lg mb-10 text-balance ${theme.bodyText}`}>
                {store.subtext}
              </p>
              <a href={exploreLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>{heroButtonText}</a>
            </div>
          </div>

          {!isHeroFixed && (
            <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative overflow-hidden">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={store.hero_image} alt={store.business_name} className="absolute inset-0 w-full h-full object-cover object-center" />
               <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: `linear-gradient(to right, ${rawBgColor} 0%, transparent 20%)` }} />
            </div>
          )}
        </section>
      )}

      {/* LAYOUT 3: SPLIT-RIGHT */}
      {layout === 'split-right' && (
        <section id="hero" className={`relative min-h-[90vh] w-full flex flex-col md:flex-row-reverse ${theme.pageBg}`}>
          
          {isHeroFixed && (
            <>
              <div className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${store.hero_image}')` }} />
              <div className="absolute inset-0 z-0 pointer-events-none hidden md:block" style={{ background: `linear-gradient(to left, ${rawBgColor} 0%, ${rawBgColor}F2 40%, transparent 65%)` }} />
              <div className="absolute inset-0 z-0 pointer-events-none md:hidden" style={{ background: `linear-gradient(to bottom, ${rawBgColor} 0%, ${rawBgColor}F2 65%, transparent 100%)` }} />
            </>
          )}

          <div className={isHeroFixed ? "w-full md:w-1/2 lg:w-5/12 flex items-center p-8 md:p-16 lg:p-24 relative z-10" : `w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10 ${theme.pageBg}`}>
            <div className="w-full max-w-xl text-left">
              {hasValidLogo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.brand_logo} alt={store.business_name} className={getLogoClasses(logoSizePref, true)} />
                </>
              ) : (
                <h2 className={`${theme.accentText} ${accentColorClass} mb-4 flex items-center gap-4`}>
                  <div className={`h-px w-12 ${lineAccent}`} /> {theme.prefix}{store.business_name}
                </h2>
              )}
              
              <h1 className={`${theme.primaryText} text-3xl md:text-4xl lg:text-5xl mb-6 text-balance`}>
                {store.tagline}
              </h1>
              <p className={`text-base md:text-lg mb-10 text-balance ${theme.bodyText}`}>
                {store.subtext}
              </p>
              <a href={exploreLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>{heroButtonText}</a>
            </div>
          </div>

          {!isHeroFixed && (
            <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative overflow-hidden">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={store.hero_image} alt={store.business_name} className="absolute inset-0 w-full h-full object-cover object-center" />
               <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: `linear-gradient(to left, ${rawBgColor} 0%, transparent 20%)` }} />
            </div>
          )}
        </section>
      )}

      {/* LAYOUT 4: CINEMATIC */}
      {layout === 'cinematic' && (
        <section id="hero" className="relative min-h-screen w-full flex items-end justify-start overflow-hidden pb-20">
          <div className="absolute inset-0 z-0">
            {isHeroFixed ? (
              <div className="w-full h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${store.hero_image}')` }} />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={store.hero_image} alt={store.business_name} className="w-full h-full object-cover object-center scale-105" />
              </>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-90" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="relative max-w-4xl mt-32"> 
              
              {hasValidLogo && (
                <div className="absolute -top-16 md:-top-24 left-4 md:left-8 z-20 pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.brand_logo} alt={store.business_name} className={`${getLogoClasses(logoSizePref, true).replace('mb-6', 'mb-0')} origin-bottom-left`} />
                </div>
              )}
              
              <div className={cinematicCardClass}>
                {!hasValidLogo && (
                  <h2 className={`${theme.accentText} ${accentColorClass} mb-3`}>{theme.prefix}{store.business_name}</h2>
                )}
                
                <h1 className={`${theme.primaryText} text-white text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight relative z-10 text-balance`}>
                  {store.tagline}
                </h1>
                <p className="text-base md:text-lg mb-8 leading-relaxed font-light text-zinc-300 max-w-lg relative z-10 text-balance">
                  {store.subtext}
                </p>
                <a href={exploreLink} className={`inline-block relative z-10 ${theme.buttonStyle}`}>{heroButtonText}</a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LAYOUT 5: GLASS CENTER */}
      {layout === 'glass' && (
        <section id="hero" className="relative w-full min-h-[90vh] flex items-center justify-center p-6 md:p-12 overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 z-0">
            {store.hero_image ? (
              isHeroFixed ? (
                <div className="w-full h-full bg-cover bg-center bg-fixed opacity-80" style={{ backgroundImage: `url('${store.hero_image}')` }} />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.hero_image} alt={store.business_name || 'Background'} className="w-full h-full object-cover opacity-80" />
                </>
              )
            ) : (
              <div className="w-full h-full bg-zinc-900 bg-[url('/grid.svg')] opacity-20" />
            )}
            <div className="absolute inset-0 bg-zinc-950/40" />
          </div>
          <div className="relative z-10 w-full max-w-5xl mx-auto p-10 md:p-16 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center rounded-4xl">
            
            {hasValidLogo && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={store.brand_logo} alt={store.business_name} className={getLogoClasses(logoSizePref, false)} />
              </>
            )}
            
            <h1 className={`${theme.primaryText} text-3xl md:text-4xl lg:text-5xl mb-6 text-white drop-shadow-lg max-w-3xl mx-auto text-balance`}>
              {store.tagline || store.business_name}
            </h1>
            <p className="text-base md:text-xl text-zinc-200 max-w-2xl mb-10 drop-shadow-md leading-relaxed font-light text-balance">
              {store.subtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
              <a href={exploreLink} className={`px-10 py-4 font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-xl bg-${brandColor} text-black hover:scale-105 ${theme.buttonStyle}`}>{heroButtonText}</a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}