/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/SplitRightHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroHeightClass, getRawBgColor } from '../HeroEngine';
import HeroBrandBlock, { HeroMastheadLogo } from '../core/HeroBrandBlock';

export default function SplitRightHero({
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
  const heightClass = getHeroHeightClass(store?.hero_height, isHubMode);
  const placement = store?.logo_placement || 'beside';
  const isBesideLogo = hasValidLogo && placement === 'beside';
  const isMastheadLogo = hasValidLogo && placement === 'masthead';

  const fixedWidthClass = isBesideLogo
    ? 'w-full md:w-3/4 lg:w-7/12 xl:w-3/5'
    : 'w-full md:w-7/12 lg:w-1/2';

  const fixedGradient = isBesideLogo
    ? `linear-gradient(to left, ${rawBgColor} 0%, ${rawBgColor}F2 48%, transparent 78%)`
    : `linear-gradient(to left, ${rawBgColor} 0%, ${rawBgColor}F2 42%, transparent 68%)`;

  return (
    <section
      id="hero"
      className={`relative ${heightClass} w-full flex flex-col md:flex-row-reverse ${safeTheme.pageBg || ''}`}
    >
      <HeroMastheadLogo store={store} hasValidLogo={hasValidLogo} />

      {isHeroFixed && (
        <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
          <HeroMedia store={store} isHeroFixed={true} />
          <div
            className="absolute inset-0 z-20 pointer-events-none hidden md:block"
            style={{ background: fixedGradient }}
          />
          <div
            className="absolute inset-0 z-20 pointer-events-none md:hidden"
            style={{ background: `linear-gradient(to bottom, ${rawBgColor} 0%, ${rawBgColor}F2 65%, transparent 100%)` }}
          />
        </div>
      )}

      <div
        className={`${
          isHeroFixed
            ? `${fixedWidthClass} flex items-center px-6 py-12 md:px-12 lg:px-16 relative z-10`
            : `w-full md:w-1/2 flex items-center justify-center px-6 py-12 md:px-10 lg:px-16 relative z-10 ${safeTheme.pageBg || ''}`
        } ${isMastheadLogo ? 'pt-28 md:pt-36' : ''}`}
      >
        <div className={`w-full ${isBesideLogo ? 'max-w-3xl' : 'max-w-2xl'} text-left`}>
          <HeroBrandBlock
            store={store}
            theme={theme}
            hasValidLogo={hasValidLogo}
            exploreLink={exploreLink}
            heroButtonText={heroButtonText}
            accentColorClass={accentColorClass}
            buttonBgClass={buttonBgClass}
            lineAccent={lineAccent}
            isHubMode={isHubMode}
            align="left"
            showBusinessRule={true}
          />
        </div>
      </div>

      {!isHeroFixed && (
        <div className={`w-full md:w-1/2 ${isHubMode ? 'h-[30vh] md:h-auto' : 'h-[50vh] md:h-auto'} relative overflow-hidden`}>
          <div className="absolute inset-0">
            <HeroMedia store={store} isHeroFixed={false} />
          </div>
          <div
            className="absolute inset-0 z-20 pointer-events-none hidden md:block"
            style={{ background: `linear-gradient(to left, ${rawBgColor} 0%, transparent 20%)` }}
          />
        </div>
      )}
    </section>
  );
}