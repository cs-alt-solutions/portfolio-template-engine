/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/BottomDockHero.tsx */
import React from 'react';
import { HeroEngineProps, getHeroLogoClasses, getHeroPositionClasses } from '../HeroEngine';

export default function BottomDockHero({
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
    : 'bg-zinc-950/80 text-white border-white/15';

  return (
    <section
      id="hero"
      className={`relative w-full ${isHubMode ? 'min-h-[75vh]' : 'min-h-screen'} flex items-end justify-center p-4 md:p-8 lg:p-10 overflow-hidden bg-zinc-950`}
    >
      {/* Unobstructed Full-Bleed Backdrop */}
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        {store?.hero_image ? (
          isHeroFixed ? (
            <div
              className="fixed inset-0 w-full h-full bg-cover"
              style={{
                backgroundImage: `url('${store.hero_image}')`,
                backgroundPosition: bgPos,
                zIndex: -1,
              }}
            />
          ) : (
            <img
              src={store.hero_image}
              alt={store?.business_name || 'Hero'}
              className={`w-full h-full object-cover ${objectPos}`}
            />
          )
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Floating Horizontal Dock */}
      <div
        className={`relative z-10 w-full max-w-7xl backdrop-blur-2xl border shadow-2xl overflow-hidden p-6 md:p-8 ${dockSurface} ${dockRadius}`}
      >
        {safeTheme.useBrandAccent && (
          <div className={`absolute top-0 left-0 w-full h-1 ${lineAccent}`} />
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Logo / Identity + Copy */}
          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8 min-w-0">
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
                <h1 className={`${safeTheme.primaryText || ''} text-2xl md:text-3xl lg:text-4xl mb-1.5 text-balance`}>
                  {store.tagline}
                </h1>
              )}
              {store?.subtext && (
                <p className={`text-sm md:text-base line-clamp-2 opacity-80 ${safeTheme.isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {store.subtext}
                </p>
              )}
            </div>
          </div>

          {/* Right: Action CTA */}
          <div className="shrink-0">
            <a href={exploreLink} className={`inline-block w-full lg:w-auto text-center ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
              {store?.hero_cta || heroButtonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}