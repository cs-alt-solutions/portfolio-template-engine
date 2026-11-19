/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/TopDockHero.tsx */
import React from 'react';
import { HeroEngineProps, getHeroLogoClasses, getHeroPositionClasses } from '../HeroEngine';

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
  const { objectPos, bgPos } = getHeroPositionClasses(store?.hero_position);
  const dockRadius = safeTheme.radius === 'rounded-full' ? 'rounded-3xl' : (safeTheme.radius || 'rounded-none');
  const dockSurface = safeTheme.isLightMode
    ? 'bg-white/85 text-zinc-950 border-zinc-900/15'
    : 'bg-zinc-950/75 text-white border-white/15';

  return (
    <section
      id="hero"
      className={`relative w-full ${isHubMode ? 'min-h-[70vh] md:min-h-[78vh]' : 'min-h-screen'} flex items-start justify-center p-4 md:p-6 lg:p-8 overflow-hidden bg-zinc-950`}
    >
      {/* Unobstructed Full-Bleed Backdrop */}
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        {store?.hero_image ? (
          isHeroFixed ? (
            <div
              key={store.hero_image}
              className="fixed inset-0 w-full h-full bg-cover animate-in fade-in duration-700"
              style={{
                backgroundImage: `url('${store.hero_image}')`,
                backgroundPosition: bgPos,
              }}
            />
          ) : (
            <img
              key={store.hero_image}
              src={store.hero_image}
              alt={store?.business_name || 'Hero'}
              className={`w-full h-full object-cover animate-in fade-in duration-700 ${objectPos}`}
            />
          )
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        {/* Subtle top legibility gradient only */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/55 via-black/15 to-transparent pointer-events-none" />
      </div>

      {/* Slim Top Floating Dock */}
      <div
        className={`relative z-10 w-full max-w-6xl backdrop-blur-xl border shadow-2xl overflow-hidden px-5 py-4 md:px-7 md:py-5 ${dockSurface} ${dockRadius}`}
      >
        {safeTheme.useBrandAccent && (
          <div className={`absolute bottom-0 left-0 w-full h-1 ${lineAccent}`} />
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          {/* Left: Logo / Identity + Copy */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 min-w-0">
            {hasValidLogo ? (
              <img
                src={store?.brand_logo || ''}
                alt={store?.business_name || 'Logo'}
                className={getHeroLogoClasses(store?.logo_size, 'inline')}
              />
            ) : (
              <span className={`${safeTheme.accentText || ''} ${accentColorClass} text-sm md:text-base shrink-0`}>
                {safeTheme.prefix || ''}{store?.business_name || ''}
              </span>
            )}

            <div className={`hidden md:block w-px self-stretch ${safeTheme.isLightMode ? 'bg-zinc-900/15' : 'bg-white/15'}`} />

            <div className="min-w-0">
              {store?.tagline && (
                <h1 className={`${safeTheme.primaryText || ''} text-xl md:text-2xl lg:text-3xl mb-1 text-balance`}>
                  {store.tagline}
                </h1>
              )}
              {store?.subtext && (
                <p className={`text-xs md:text-sm line-clamp-2 opacity-80 ${safeTheme.isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {store.subtext}
                </p>
              )}
            </div>
          </div>

          {/* Right: Action CTA (Hidden in Hub Mode) */}
          {!isHubMode && (
            <div className="shrink-0">
              <a href={exploreLink} className={`inline-block w-full lg:w-auto text-center ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
                {store?.hero_cta || heroButtonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}