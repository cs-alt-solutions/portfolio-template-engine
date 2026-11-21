/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/CinematicHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroLogoClasses, getHeroHeightClass } from '../HeroEngine';

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
  isHubMode,
}: HeroEngineProps) {
  const safeTheme = theme || {};
  const logoSizePref = store?.logo_size || 'large';
  const placement = store?.logo_placement || 'beside';
  const isMasthead = hasValidLogo && placement === 'masthead';
  const isBeside = hasValidLogo && placement === 'beside';

  const heightClass = getHeroHeightClass(
    store?.hero_height,
    isHubMode,
    'min-h-screen',
    'min-h-[45vh] md:min-h-[55vh]'
  );

  const isCompactPadding = isHubMode || store?.hero_height === 'compact';
  const bottomPad = isCompactPadding ? 'pb-8 md:pb-10' : store?.hero_height === 'balanced' ? 'pb-10 md:pb-16' : 'pb-12 md:pb-20';
  const accentRadius = safeTheme.radius === 'rounded-none' ? 'rounded-none' : 'rounded-full';

  const copyStack = (
    <div className="flex flex-col items-start flex-1 min-w-0">
      <div className={`w-16 md:w-24 h-1.5 md:h-2 mb-4 md:mb-5 bg-${brandColor} ${accentRadius}`} />

      {!hasValidLogo && (
        <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-3`}>
          {safeTheme.prefix || ''}{store?.business_name || ''}
        </h2>
      )}

      {store?.tagline && (
        <h1
          className={`${safeTheme.primaryText || ''} ${
            isHubMode ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-3xl md:text-5xl lg:text-6xl'
          } mb-4 leading-tight text-balance`}
        >
          {store.tagline}
        </h1>
      )}

      {store?.subtext && (
        <p
          className={`text-base md:text-lg ${
            isHubMode ? 'mb-2' : 'mb-7'
          } leading-relaxed text-balance max-w-2xl ${safeTheme.bodyText || ''}`}
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
  );

  return (
    <section
      id="hero"
      className={`relative ${heightClass} w-full flex flex-col ${isMasthead ? 'justify-between' : 'justify-end'} overflow-hidden`}
    >
      {/* Full-Bleed Backdrop */}
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        <HeroMedia store={store} isHeroFixed={isHeroFixed} defaultScale={1} />
        <div
          className={`absolute inset-0 z-20 pointer-events-none ${
            isMasthead
              ? 'bg-linear-to-b from-black/55 via-black/25 to-black/85'
              : 'bg-linear-to-t from-black/85 via-black/35 to-transparent'
          }`}
        />
      </div>

      {/* Top-Left Masthead Emblem Mode */}
      {isMasthead && (
        <div className="container mx-auto px-6 pt-6 md:pt-10 relative z-10">
          <img
            src={store?.brand_logo || ''}
            alt={store?.business_name || 'Logo'}
            className={getHeroLogoClasses(logoSizePref, 'masthead')}
          />
        </div>
      )}

      {/* Bottom Headline & Lockup */}
      <div className={`container mx-auto px-6 ${bottomPad} ${isMasthead ? 'pt-8' : 'pt-14 md:pt-20'} relative z-10`}>
        <div className="max-w-5xl">
          {hasValidLogo && !isMasthead ? (
            <div
              className={`w-full flex ${
                isBeside
                  ? 'flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 text-left'
                  : 'flex-col items-start gap-5'
              }`}
            >
              <img
                src={store?.brand_logo || ''}
                alt={store?.business_name || 'Logo'}
                className={`${getHeroLogoClasses(logoSizePref, 'left')} mb-0! shrink-0`}
              />
              {copyStack}
            </div>
          ) : (
            copyStack
          )}
        </div>
      </div>
    </section>
  );
}