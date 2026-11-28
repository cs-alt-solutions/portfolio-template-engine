/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/BentoHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroHeightClass } from '../HeroEngine';
import HeroBrandBlock, { HeroMastheadLogo } from '../core/HeroBrandBlock';
import { PAGE_DEFAULTS } from '@/utils/glossary';

export default function BentoHero({
  store,
  theme,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  accentColorClass,
  buttonBgClass,
  lineAccent,
  isHubMode,
  galleryItems = [],
}: HeroEngineProps) {
  const safeTheme = theme || {};
  const tileRadius =
    safeTheme.surfaceRadius ||
    (safeTheme.radius === 'rounded-full' ? 'rounded-3xl' : safeTheme.radius || 'rounded-none');
  const surfaceClass = safeTheme.isLightMode
    ? 'bg-white/85 border-zinc-900/10'
    : 'bg-zinc-900/65 border-white/10';
  const heightClass = getHeroHeightClass(store?.hero_height, isHubMode);
  const isMasthead = hasValidLogo && store?.logo_placement === 'masthead';

  const extraTiles = galleryItems
    .filter((item) => item?.imageUrl && item.isVisible !== false && item.imageUrl !== store?.hero_image)
    .slice(0, 2);

  const hasExtraTiles = extraTiles.length > 0;
  const fallbackName = store?.business_name || PAGE_DEFAULTS.FALLBACK_BUSINESS_NAME;

  return (
    <section
      id="hero"
      className={`relative w-full ${heightClass} ${
        isMasthead ? 'pt-28 md:pt-36 pb-10 md:pb-14' : isHubMode ? 'py-8 md:py-12' : 'py-10 md:py-14'
      } flex items-center ${safeTheme.pageBg || ''}`}
    >
      <HeroMastheadLogo store={store} hasValidLogo={hasValidLogo} />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
          <div
            className={`lg:col-span-6 relative overflow-hidden border p-7 md:p-10 lg:p-12 flex flex-col justify-center shadow-xl ${surfaceClass} ${tileRadius}`}
          >
            {safeTheme.useBrandAccent && (
              <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />
            )}

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
              headingClassName="text-3xl md:text-4xl lg:text-5xl"
            />
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-5">
            <div
              className={`relative overflow-hidden border ${
                safeTheme.isLightMode ? 'border-zinc-900/10' : 'border-white/10'
              } shadow-xl ${tileRadius} ${
                hasExtraTiles ? 'col-span-2 h-56 md:h-68' : 'col-span-2 row-span-2 min-h-85 md:min-h-105'
              }`}
            >
              <HeroMedia
                store={store}
                isHeroFixed={false}
                alt={fallbackName}
                className="duration-700 hover:scale-105"
                fallback={<div className={`w-full h-full opacity-20 ${lineAccent}`} />}
              />
            </div>

            {extraTiles.map((tile, idx) => (
              <div
                key={tile.id || idx}
                className={`relative overflow-hidden border ${
                  safeTheme.isLightMode ? 'border-zinc-900/10' : 'border-white/10'
                } shadow-lg h-36 md:h-44 ${tileRadius} ${
                  extraTiles.length === 1 ? 'col-span-2' : 'col-span-1'
                }`}
              >
                <img
                  src={tile.imageUrl}
                  alt={tile.title || `${fallbackName} ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}