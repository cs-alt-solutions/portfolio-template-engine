/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/EditorialFrameHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia } from '../HeroEngine';
import HeroBrandBlock, { HeroMastheadLogo } from '../core/HeroBrandBlock';
import { PAGE_DEFAULTS } from '@/utils/glossary';

export default function EditorialFrameHero({
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
  const frameRadius =
    safeTheme.surfaceRadius ||
    (safeTheme.radius === 'rounded-full' ? 'rounded-3xl' : safeTheme.radius || 'rounded-none');
  const borderClass = safeTheme.isLightMode ? 'border-zinc-900/10' : 'border-white/10';
  const isMasthead = hasValidLogo && store?.logo_placement === 'masthead';
  const isBeside = hasValidLogo && (store?.logo_placement || 'beside') === 'beside';
  const fallbackName = store?.business_name || PAGE_DEFAULTS.FALLBACK_BUSINESS_NAME;

  const showcaseHeightClass =
    store?.hero_height === 'compact'
      ? 'h-[32vh] md:h-[40vh]'
      : store?.hero_height === 'balanced'
        ? 'h-[42vh] md:h-[52vh]'
        : store?.hero_height === 'full'
          ? 'h-[55vh] md:h-[72vh]'
          : isHubMode
            ? 'h-[36vh] md:h-[46vh]'
            : 'h-[45vh] md:h-[62vh]';

  return (
    <section
      id="hero"
      className={`relative w-full ${safeTheme.pageBg || ''} ${
        isMasthead
          ? 'pt-28 md:pt-36 pb-16'
          : isHubMode
            ? 'pt-12 pb-10'
            : 'pt-14 pb-16 md:pt-20 md:pb-24'
      }`}
    >
      <HeroMastheadLogo store={store} hasValidLogo={hasValidLogo} />

      <div className="container mx-auto px-6 max-w-6xl">
        {/* Top Editorial Masthead */}
        <div className={`${isBeside ? 'max-w-5xl' : 'max-w-4xl'} mx-auto mb-10 md:mb-14`}>
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
            align="center"
            headingClassName="text-4xl md:text-5xl lg:text-6xl"
            subtextClassName="text-base md:text-xl"
          />
        </div>

        {/* Bottom Wide Framed Showcase */}
        {store?.hero_image && (
          <div
            className={`relative w-full ${showcaseHeightClass} overflow-hidden border ${borderClass} shadow-2xl ${frameRadius}`}
          >
            {safeTheme.useBrandAccent && (
              <div className={`absolute top-0 left-0 w-full h-1 z-20 ${lineAccent}`} />
            )}
            <div className="absolute inset-0" style={{ clipPath: 'inset(0)' }}>
              <HeroMedia
                store={store}
                isHeroFixed={isHeroFixed}
                alt={fallbackName}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}