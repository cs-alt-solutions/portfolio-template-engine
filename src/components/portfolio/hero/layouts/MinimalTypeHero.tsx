/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/MinimalTypeHero.tsx */
import React from 'react';
import {
  HeroEngineProps,
  HeroMedia,
  getHeroHeightClass,
  getHeroLogoClasses,
} from '../HeroEngine';
import { PAGE_DEFAULTS } from '@/utils/glossary';

export default function MinimalTypeHero({
  store,
  theme,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  accentColorClass,
  buttonBgClass,
  lineAccent,
  isHubMode,
}: HeroEngineProps) {
  const safeTheme = theme || {};
  const badgeRadius =
    safeTheme.surfaceRadius ||
    (safeTheme.radius === 'rounded-full' ? 'rounded-3xl' : safeTheme.radius || 'rounded-none');
  const dividerColor = safeTheme.isLightMode ? 'border-zinc-900/15' : 'border-white/15';
  const cleanBodyText = (safeTheme.bodyText || '').replace('mx-auto', '');
  const heightClass = getHeroHeightClass(
    store?.hero_height,
    isHubMode,
    'min-h-[88vh]',
    'min-h-[65vh]'
  );

  const placement = store?.logo_placement || 'beside';
  const isMasthead = hasValidLogo && placement === 'masthead';
  const isBeside = hasValidLogo && placement === 'beside';
  const isStacked = hasValidLogo && placement === 'stacked';
  const fallbackName = store?.business_name || PAGE_DEFAULTS.FALLBACK_BUSINESS_NAME;

  return (
    <section
      id="hero"
      className={`relative w-full ${heightClass} ${
        isHubMode || store?.hero_height === 'compact' ? 'py-10 md:py-14' : 'py-16 md:py-24'
      } flex flex-col justify-between ${safeTheme.pageBg || ''} overflow-hidden`}
    >
      {/* Ultra-subtle Atmospheric Watermark */}
      {store?.hero_image && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <HeroMedia
            store={store}
            isHeroFixed={false}
            alt=""
            className="opacity-[0.06] blur-sm"
            defaultScale={1.05}
          />
        </div>
      )}

      <div className="container mx-auto px-6 max-w-7xl relative z-10 flex-1 flex flex-col justify-between gap-10">
        {/* Top Brand Row */}
        <div className={`flex items-center justify-between pb-6 border-b ${dividerColor}`}>
          {isMasthead ? (
            <img
              src={store?.brand_logo || ''}
              alt={store?.business_name || PAGE_DEFAULTS.LOGO_ALT}
              className={getHeroLogoClasses(store?.logo_size, 'inline')}
            />
          ) : (
            <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} text-sm md:text-base`}>
              {safeTheme.prefix || ''}
              {store?.business_name || ''}
            </h2>
          )}

          {store?.industry_tag && (
            <span
              className={`text-[11px] font-mono uppercase tracking-[0.25em] opacity-60 ${
                safeTheme.isLightMode ? 'text-zinc-900' : 'text-zinc-100'
              }`}
            >
              {store.industry_tag}
            </span>
          )}
        </div>

        {/* Giant Display Statement + Inset Media Pill */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end my-auto">
          <div className={store?.hero_image ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <div
              className={
                isBeside
                  ? 'flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8'
                  : 'flex flex-col items-start'
              }
            >
              {(isBeside || isStacked) && (
                <img
                  src={store?.brand_logo || ''}
                  alt={store?.business_name || PAGE_DEFAULTS.LOGO_ALT}
                  className={getHeroLogoClasses(store?.logo_size, isBeside ? 'masthead' : 'left')}
                />
              )}

              {store?.tagline && (
                <h1
                  className={`${safeTheme.primaryText || ''} text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.98] text-balance`}
                >
                  {store.tagline}
                </h1>
              )}
            </div>
          </div>

          {store?.hero_image && (
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className={`relative w-full max-w-xs aspect-4/3 overflow-hidden border ${dividerColor} shadow-xl ${badgeRadius}`}>
                <HeroMedia store={store} isHeroFixed={false} alt={fallbackName} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Subtext + CTA Strip */}
        <div className={`pt-8 border-t ${dividerColor} flex flex-col md:flex-row md:items-center justify-between gap-8`}>
          <div className="max-w-2xl">
            <div className={`w-16 h-1 mb-4 ${lineAccent}`} />
            {store?.subtext && (
              <p className={`text-base md:text-xl text-balance ${cleanBodyText}`}>
                {store.subtext}
              </p>
            )}
          </div>

          {!isHubMode && (
            <div className="shrink-0">
              <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
                {store?.hero_cta || heroButtonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}