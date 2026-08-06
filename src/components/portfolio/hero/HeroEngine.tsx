// src/components/portfolio/hero/HeroEngine.tsx
import React from 'react';
import { ThemeDefinition } from '@/utils/themes';

export interface StorefrontHeroData {
  business_name?: string;
  tagline?: string;
  subtext?: string;
  hero_image?: string;
  brand_logo?: string;
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
  
  // The refined Cinematic gradient logic isolated safely in the Engine
  const cinematicBorderClass = theme.useBrandAccent ? 'border-' + brandColor : 'border-white';
  const cinematicCardClass = theme.cardStyle === 'bg-transparent border-none shadow-none'
    ? 'relative z-10'
    : 'p-8 pt-24 md:pt-32 md:pr-24 bg-gradient-to-r from-black/95 via-black/60 to-transparent border-l-4 relative z-10 ' + cinematicBorderClass;

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
                  <img src={store.brand_logo} alt={store.business_name} className="h-20 md:h-32 w-auto object-contain mx-auto mb-6 drop-shadow-2xl" />
                </>
              ) : (
                <h2 className={`${theme.accentText} ${accentColorClass} mb-6 drop-shadow-md`}>{theme.prefix}{store.business_name}</h2>
              )}
              <h1 className={`${theme.primaryText} text-5xl md:text-7xl lg:text-8xl mb-8 drop-shadow-sm max-w-5xl mx-auto`}>{store.tagline}</h1>
              <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90 ${theme.bodyText}`}>{store.subtext}</p>
              <a href={exploreLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>{heroButtonText}</a>
            </div>
          </div>
        </section>
      )}

      {/* LAYOUT 2: SPLIT-LEFT */}
      {layout === 'split-left' && (
        <section id="hero" className={`relative min-h-[90vh] w-full flex flex-col md:flex-row ${theme.pageBg}`}>
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10">
            <div className="w-full max-w-xl text-left">
              {hasValidLogo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.brand_logo} alt={store.business_name} className="h-16 md:h-24 w-auto object-contain mb-6 drop-shadow-xl" />
                </>
              ) : (
                <h2 className={`${theme.accentText} ${accentColorClass} mb-4 flex items-center gap-4`}>
                  <div className={`h-px w-12 ${lineAccent}`} /> {theme.prefix}{store.business_name}
                </h2>
              )}
              <h1 className={`${theme.primaryText} text-5xl md:text-6xl lg:text-7xl mb-6`}>{store.tagline}</h1>
              <p className={`text-lg mb-10 ${theme.bodyText}`}>{store.subtext}</p>
              <a href={exploreLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>{heroButtonText}</a>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative overflow-hidden">
             {isHeroFixed ? (
               <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${store.hero_image}')` }} />
             ) : (
               <>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={store.hero_image} alt={store.business_name} className="absolute inset-0 w-full h-full object-cover object-center" />
               </>
             )}
             <div className={`absolute inset-0 bg-linear-to-r from-${theme.pageBg.replace('bg-', '')} via-transparent to-transparent opacity-50 hidden md:block`} />
          </div>
        </section>
      )}

      {/* LAYOUT 3: SPLIT-RIGHT */}
      {layout === 'split-right' && (
        <section id="hero" className={`relative min-h-[90vh] w-full flex flex-col md:flex-row-reverse ${theme.pageBg}`}>
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10">
            <div className="w-full max-w-xl text-left">
              {hasValidLogo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.brand_logo} alt={store.business_name} className="h-16 md:h-24 w-auto object-contain mb-6 drop-shadow-xl" />
                </>
              ) : (
                <h2 className={`${theme.accentText} ${accentColorClass} mb-4 flex items-center gap-4`}>
                  <div className={`h-px w-12 ${lineAccent}`} /> {theme.prefix}{store.business_name}
                </h2>
              )}
              <h1 className={`${theme.primaryText} text-5xl md:text-6xl lg:text-7xl mb-6`}>{store.tagline}</h1>
              <p className={`text-lg mb-10 ${theme.bodyText}`}>{store.subtext}</p>
              <a href={exploreLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>{heroButtonText}</a>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative overflow-hidden">
             {isHeroFixed ? (
               <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${store.hero_image}')` }} />
             ) : (
               <>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={store.hero_image} alt={store.business_name} className="absolute inset-0 w-full h-full object-cover object-center" />
               </>
             )}
             <div className={`absolute inset-0 bg-linear-to-l from-${theme.pageBg.replace('bg-', '')} via-transparent to-transparent opacity-50 hidden md:block`} />
          </div>
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
                <div className="absolute -top-20 md:-top-32 left-4 md:left-8 z-20 pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.brand_logo} alt={store.business_name} className="h-32 md:h-56 w-auto object-contain drop-shadow-2xl origin-bottom-left" />
                </div>
              )}
              <div className={cinematicCardClass}>
                {!hasValidLogo && (
                  <h2 className={`${theme.accentText} ${accentColorClass} mb-3`}>{theme.prefix}{store.business_name}</h2>
                )}
                <h1 className={`${theme.primaryText} text-white text-3xl md:text-5xl mb-4 leading-tight relative z-10`}>{store.tagline}</h1>
                <p className="text-base md:text-lg mb-8 leading-relaxed font-light text-zinc-300 max-w-lg relative z-10">{store.subtext}</p>
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
                <img src={store.brand_logo} alt={store.business_name} className="h-24 md:h-36 w-auto object-contain mx-auto mb-6 drop-shadow-2xl" />
              </>
            )}
            <h1 className={`${theme.primaryText} text-4xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-lg max-w-4xl mx-auto`}>{store.tagline || store.business_name}</h1>
            <p className="text-base md:text-xl text-zinc-200 max-w-2xl mb-10 drop-shadow-md leading-relaxed font-light">{store.subtext}</p>
            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
              <a href={exploreLink} className={`px-10 py-4 font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-xl bg-${brandColor} text-black hover:scale-105 ${theme.buttonStyle}`}>{heroButtonText}</a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}