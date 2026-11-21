/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/GlassHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroLogoClasses } from '../HeroEngine';

export default function GlassHero({
  store,
  theme,
  brandColor,
  isHeroFixed,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  lineAccent,
  isHubMode,
}: HeroEngineProps) {
  const safeTheme = theme || {};
  const heightClass = isHubMode ? 'min-h-[45vh] md:min-h-[55vh]' : 'min-h-[90vh]';

  return (
    <section
      id="hero"
      className={`relative w-full ${heightClass} flex items-center justify-center p-6 md:p-12 overflow-hidden bg-zinc-950`}
    >
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        <HeroMedia
          store={store}
          isHeroFixed={isHeroFixed}
          alt={store?.business_name || 'Background'}
          className="opacity-80"
          fallback={<div className="w-full h-full bg-zinc-900 bg-[url('/grid.svg')] opacity-20" />}
        />
        <div className="absolute inset-0 z-20 pointer-events-none bg-zinc-950/40" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto p-10 md:p-16 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center rounded-[2rem]">
        {safeTheme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />}
        {hasValidLogo && (
          <img
            src={store?.brand_logo || ''}
            alt={store?.business_name || 'Logo'}
            className={`${getHeroLogoClasses(store?.logo_size, 'center')} drop-shadow-2xl`}
          />
        )}
        {store?.tagline && (
          <h1 className={`${safeTheme.primaryText || ''} text-3xl md:text-4xl lg:text-5xl mb-4 drop-shadow-md max-w-3xl mx-auto text-balance`}>
            {store.tagline}
          </h1>
        )}
        {store?.subtext && (
          <p
            className={`text-base md:text-lg max-w-2xl ${isHubMode ? 'mb-4' : 'mb-10'} drop-shadow-md leading-relaxed font-light text-balance text-zinc-200 ${safeTheme.bodyText || ''}`}
          >
            {store.subtext}
          </p>
        )}
        {!isHubMode && (
          <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
            <a
              href={exploreLink}
              className={`px-10 py-4 font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-xl bg-${brandColor} text-zinc-950 hover:scale-105 ${safeTheme.buttonStyle || ''}`}
            >
              {store?.hero_cta || heroButtonText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}