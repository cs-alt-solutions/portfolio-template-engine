/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/ArchSpotlightHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroHeightClass } from '../HeroEngine';
import HeroBrandBlock, { HeroMastheadLogo } from '../core/HeroBrandBlock';
import { PAGE_DEFAULTS } from '@/utils/glossary';

export default function ArchSpotlightHero({
  store,
  theme,
  secondaryBrandColor,
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
  const heightClass = getHeroHeightClass(
    store?.hero_height,
    isHubMode,
    'min-h-[90vh]',
    'min-h-[65vh]'
  );
  const isMasthead = hasValidLogo && store?.logo_placement === 'masthead';
  const fallbackName = store?.business_name || PAGE_DEFAULTS.FALLBACK_BUSINESS_NAME;

  return (
    <section
      id="hero"
      className={`relative w-full ${heightClass} ${
        isMasthead ? 'pt-28 md:pt-36 pb-16' : isHubMode ? 'py-12' : 'py-16 md:py-20'
      } flex items-center ${safeTheme.pageBg || ''} overflow-hidden`}
    >
      <HeroMastheadLogo store={store} hasValidLogo={hasValidLogo} />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 text-left order-2 lg:order-1">
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
              headingClassName="text-4xl md:text-5xl lg:text-6xl"
            />
          </div>

          {/* Right Sculpted Arch Frame */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div
                className={`absolute -inset-3 translate-x-3 translate-y-3 rounded-t-[260px] rounded-b-3xl border-2 border-${secondaryBrandColor} opacity-40 pointer-events-none`}
              />

              <div
                className={`relative w-full ${
                  isHubMode || store?.hero_height === 'compact' ? 'aspect-square' : 'aspect-4/5'
                } rounded-t-[260px] rounded-b-3xl overflow-hidden shadow-2xl border ${
                  safeTheme.isLightMode ? 'border-zinc-900/10 bg-zinc-200' : 'border-white/15 bg-zinc-900'
                }`}
                style={{ clipPath: 'inset(0 round 260px 260px 24px 24px)' }}
              >
                <HeroMedia
                  store={store}
                  isHeroFixed={isHeroFixed}
                  alt={fallbackName}
                  fallback={<div className={`w-full h-full opacity-20 ${lineAccent}`} />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}