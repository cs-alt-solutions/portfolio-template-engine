/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/GlassHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroHeightClass } from '../HeroEngine';
import HeroBrandBlock, { HeroMastheadLogo } from '../core/HeroBrandBlock';
import { PAGE_DEFAULTS } from '@/utils/glossary';

export default function GlassHero({
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
  const heightClass = getHeroHeightClass(
    store?.hero_height,
    isHubMode,
    'min-h-[90vh]',
    'min-h-[45vh] md:min-h-[55vh]'
  );
  const placement = store?.logo_placement || 'beside';
  const isBeside = hasValidLogo && placement === 'beside';
  const isMasthead = hasValidLogo && placement === 'masthead';
  const glassRadius = safeTheme.surfaceRadius || safeTheme.radius || 'rounded-4xl';
  const fallbackName = store?.business_name || PAGE_DEFAULTS.FALLBACK_BUSINESS_NAME;

  return (
    <section
      id="hero"
      className={`relative w-full ${heightClass} ${
        isMasthead ? 'pt-28 md:pt-36 pb-12 px-6 md:px-12' : 'p-6 md:p-12'
      } flex items-center justify-center overflow-hidden bg-zinc-950`}
    >
      <HeroMastheadLogo store={store} hasValidLogo={hasValidLogo} />

      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        <HeroMedia
          store={store}
          isHeroFixed={isHeroFixed}
          alt={fallbackName}
          className="opacity-80"
          fallback={<div className="w-full h-full bg-zinc-900 bg-[url('/grid.svg')] opacity-20" />}
        />
        <div className="absolute inset-0 z-20 pointer-events-none bg-zinc-950/45" />
      </div>

      <div
        className={`relative z-10 w-full ${
          isBeside ? 'max-w-5xl' : 'max-w-4xl'
        } mx-auto p-8 md:p-14 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ${glassRadius}`}
      >
        {safeTheme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />}

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
        />
      </div>
    </section>
  );
}