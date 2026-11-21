/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/SplitLeftHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroLogoClasses, getRawBgColor } from '../HeroEngine';

export default function SplitLeftHero({
  store,
  theme,
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
  const rawBgColor = getRawBgColor(safeTheme.pageBg, safeTheme.isLightMode);
  const heightClass = isHubMode ? 'min-h-[45vh] md:min-h-[55vh]' : 'min-h-[90vh]';

  return (
    <section
      id="hero"
      className={`relative ${heightClass} w-full flex flex-col md:flex-row ${safeTheme.pageBg || ''}`}
    >
      {isHeroFixed && (
        <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
          <HeroMedia store={store} isHeroFixed={true} />
          <div
            className="absolute inset-0 z-20 pointer-events-none hidden md:block"
            style={{ background: `linear-gradient(to right, ${rawBgColor} 0%, ${rawBgColor}F2 40%, transparent 65%)` }}
          />
          <div
            className="absolute inset-0 z-20 pointer-events-none md:hidden"
            style={{ background: `linear-gradient(to bottom, ${rawBgColor} 0%, ${rawBgColor}F2 65%, transparent 100%)` }}
          />
        </div>
      )}

      <div
        className={
          isHeroFixed
            ? 'w-full md:w-1/2 lg:w-5/12 flex items-center p-8 md:p-16 lg:p-24 relative z-10'
            : `w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10 ${safeTheme.pageBg || ''}`
        }
      >
        <div className="w-full max-w-xl text-left">
          {hasValidLogo ? (
            <img
              src={store?.brand_logo || ''}
              alt={store?.business_name || 'Logo'}
              className={`${getHeroLogoClasses(store?.logo_size, 'left')} drop-shadow-2xl`}
            />
          ) : (
            <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-4 flex items-center gap-4`}>
              <span className={`h-px w-12 ${lineAccent}`} /> {safeTheme.prefix || ''}{store?.business_name || ''}
            </h2>
          )}
          {store?.tagline && (
            <h1 className={`${safeTheme.primaryText || ''} text-3xl md:text-4xl lg:text-5xl mb-6 text-balance`}>
              {store.tagline}
            </h1>
          )}
          {store?.subtext && (
            <p className={`text-base md:text-lg ${isHubMode ? 'mb-4' : 'mb-10'} text-balance ${safeTheme.bodyText || ''}`}>
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

      {!isHeroFixed && (
        <div className={`w-full md:w-1/2 ${isHubMode ? 'h-[30vh] md:h-auto' : 'h-[50vh] md:h-auto'} relative overflow-hidden`}>
          <div className="absolute inset-0">
            <HeroMedia store={store} isHeroFixed={false} />
          </div>
          <div
            className="absolute inset-0 z-20 pointer-events-none hidden md:block"
            style={{ background: `linear-gradient(to right, ${rawBgColor} 0%, transparent 20%)` }}
          />
        </div>
      )}
    </section>
  );
}