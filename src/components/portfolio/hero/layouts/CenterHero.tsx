/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/CenterHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroLogoClasses, getHeroHeightClass } from '../HeroEngine';

export default function CenterHero({
  store,
  theme,
  brandColor,
  isHeroFixed,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  accentColorClass,
  buttonBgClass,
  lineAccent,
  isHubMode,
}: HeroEngineProps) {
  const safeTheme = theme || {};
  const isLight = safeTheme.isLightMode;
  const heightClass = getHeroHeightClass(
    store?.hero_height,
    isHubMode,
    'min-h-[95vh] py-20',
    'min-h-[45vh] py-12'
  );

  return (
    <section
      id="hero"
      className={`relative ${heightClass} py-12 md:py-16 w-full flex items-center justify-center overflow-hidden transition-all duration-500`}
    >
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        <HeroMedia store={store} isHeroFixed={isHeroFixed} defaultScale={1} />
        <div className={`absolute inset-0 z-20 pointer-events-none ${isLight ? 'bg-black/60' : 'bg-black/80'}`} />
        {safeTheme.useBrandTint && (
          <div className={`absolute inset-0 z-20 pointer-events-none opacity-30 bg-${brandColor} mix-blend-color`} />
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <div
          className={`w-full max-w-4xl text-center p-10 md:p-16 relative overflow-hidden group shadow-2xl ${safeTheme.cardStyle || ''} ${
            isLight
              ? 'bg-white/95 backdrop-blur-xl border-white/50'
              : 'bg-zinc-950/95 backdrop-blur-xl border-zinc-800'
          }`}
        >
          {safeTheme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />}
          {hasValidLogo ? (
            <img
              src={store?.brand_logo || ''}
              alt={store?.business_name || 'Logo'}
              className={getHeroLogoClasses(store?.logo_size, 'center')}
            />
          ) : (
            <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-6 drop-shadow-md`}>
              {safeTheme.prefix || ''}{store?.business_name || ''}
            </h2>
          )}
          {store?.tagline && (
            <h1 className={`${safeTheme.primaryText || ''} text-3xl md:text-4xl lg:text-5xl mb-6 text-balance`}>
              {store.tagline}
            </h1>
          )}
          {store?.subtext && (
            <p
              className={`text-base md:text-lg ${isHubMode ? 'mb-4' : 'mb-10'} max-w-2xl mx-auto opacity-90 text-balance ${safeTheme.bodyText || ''}`}
            >
              {store.subtext}
            </p>
          )}
          {!isHubMode && (
            <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
              {store?.hero_cta || heroButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}