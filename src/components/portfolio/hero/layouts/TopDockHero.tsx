/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/TopDockHero.tsx */
import React from 'react';
import {
  HeroEngineProps,
  HeroMedia,
  getHeroHeightClass,
  getHeroLogoClasses,
} from '../HeroEngine';
import { HeroMastheadLogo } from '../core/HeroBrandBlock';
import { PAGE_DEFAULTS } from '@/utils/glossary';

export default function TopDockHero({
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
  const dockRadius =
    safeTheme.surfaceRadius ||
    (safeTheme.radius === 'rounded-full' ? 'rounded-3xl' : safeTheme.radius || 'rounded-none');
  const dockSurface = safeTheme.isLightMode
    ? 'bg-white/85 text-zinc-950 border-zinc-900/15'
    : 'bg-zinc-950/75 text-white border-white/15';
  const heightClass = getHeroHeightClass(
    store?.hero_height,
    isHubMode,
    'min-h-screen',
    'min-h-[70vh] md:min-h-[78vh]'
  );

  const placement = store?.logo_placement || 'beside';
  const isMasthead = hasValidLogo && placement === 'masthead';
  const isStacked = hasValidLogo && placement === 'stacked';
  const showInlineLogo = hasValidLogo && placement === 'beside';

  return (
    <section
      id="hero"
      className={`relative w-full ${heightClass} flex items-start justify-center p-4 md:p-6 lg:p-8 ${
        isMasthead ? 'pt-28 md:pt-36' : ''
      } overflow-hidden bg-zinc-950`}
    >
      <HeroMastheadLogo store={store} hasValidLogo={hasValidLogo} />

      {/* Unobstructed Full-Bleed Backdrop */}
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        <HeroMedia
          key={store?.hero_image || 'empty'}
          store={store}
          isHeroFixed={isHeroFixed}
          className="animate-in fade-in duration-700"
          fallback={<div className="w-full h-full bg-zinc-900" />}
        />
        <div className="absolute inset-x-0 top-0 z-20 h-1/3 bg-linear-to-b from-black/55 via-black/15 to-transparent pointer-events-none" />
      </div>

      {/* Slim Top Floating Dock */}
      <div
        className={`relative z-10 w-full max-w-6xl backdrop-blur-xl border shadow-2xl overflow-hidden px-5 py-4 md:px-7 md:py-5 ${dockSurface} ${dockRadius}`}
      >
        {safeTheme.useBrandAccent && (
          <div className={`absolute bottom-0 left-0 w-full h-1 ${lineAccent}`} />
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          <div
            className={`flex min-w-0 ${
              isStacked
                ? 'flex-col items-start gap-3'
                : 'flex-col md:flex-row md:items-center gap-4 md:gap-6'
            }`}
          >
            {showInlineLogo && (
              <>
                <img
                  src={store?.brand_logo || ''}
                  alt={store?.business_name || PAGE_DEFAULTS.LOGO_ALT}
                  className={getHeroLogoClasses(store?.logo_size, 'inline')}
                />
                <div
                  className={`hidden md:block w-px self-stretch ${
                    safeTheme.isLightMode ? 'bg-zinc-900/15' : 'bg-white/15'
                  }`}
                />
              </>
            )}

            {isStacked && (
              <img
                src={store?.brand_logo || ''}
                alt={store?.business_name || PAGE_DEFAULTS.LOGO_ALT}
                className={getHeroLogoClasses(store?.logo_size, 'inline')}
              />
            )}

            {!hasValidLogo && !isMasthead && (
              <>
                <span className={`${safeTheme.accentText || ''} ${accentColorClass} text-sm md:text-base shrink-0`}>
                  {safeTheme.prefix || ''}
                  {store?.business_name || ''}
                </span>
                <div
                  className={`hidden md:block w-px self-stretch ${
                    safeTheme.isLightMode ? 'bg-zinc-900/15' : 'bg-white/15'
                  }`}
                />
              </>
            )}

            <div className="min-w-0">
              {store?.tagline && (
                <h1 className={`${safeTheme.primaryText || ''} text-xl md:text-2xl lg:text-3xl mb-1 text-balance`}>
                  {store.tagline}
                </h1>
              )}
              {store?.subtext && (
                <p
                  className={`text-xs md:text-sm line-clamp-2 opacity-80 ${
                    safeTheme.isLightMode ? 'text-zinc-700' : 'text-zinc-300'
                  }`}
                >
                  {store.subtext}
                </p>
              )}
            </div>
          </div>

          {!isHubMode && (
            <div className="shrink-0">
              <a
                href={exploreLink}
                className={`inline-block w-full lg:w-auto text-center ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}
              >
                {store?.hero_cta || heroButtonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}