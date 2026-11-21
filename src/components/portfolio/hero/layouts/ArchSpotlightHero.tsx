/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/ArchSpotlightHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroLogoClasses } from '../HeroEngine';

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
  const cleanBodyText = (safeTheme.bodyText || '').replace('mx-auto', '');

  return (
    <section
      id="hero"
      className={`relative w-full ${isHubMode ? 'min-h-[70vh] py-12' : 'min-h-[90vh] py-16 md:py-24'} flex items-center ${safeTheme.pageBg || ''} overflow-hidden`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 text-left order-2 lg:order-1">
            {hasValidLogo ? (
              <img
                src={store?.brand_logo || ''}
                alt={store?.business_name || 'Logo'}
                className={getHeroLogoClasses(store?.logo_size, 'left')}
              />
            ) : (
              <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-5 flex items-center gap-3`}>
                <span className={`h-px w-10 ${lineAccent}`} />
                {safeTheme.prefix || ''}{store?.business_name || ''}
              </h2>
            )}

            {store?.tagline && (
              <h1 className={`${safeTheme.primaryText || ''} text-4xl md:text-5xl lg:text-6xl mb-6 text-balance`}>
                {store.tagline}
              </h1>
            )}

            <div className={`w-20 h-1.5 mb-6 rounded-full ${lineAccent}`} />

            {store?.subtext && (
              <p className={`text-base md:text-lg ${isHubMode ? 'mb-4' : 'mb-10'} max-w-xl text-balance ${cleanBodyText}`}>
                {store.subtext}
              </p>
            )}

            {!isHubMode && (
              <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
                {store?.hero_cta || heroButtonText}
              </a>
            )}
          </div>

          {/* Right Sculpted Arch Frame */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div
                className={`absolute -inset-3 translate-x-3 translate-y-3 rounded-t-[260px] rounded-b-3xl border-2 border-${secondaryBrandColor} opacity-40 pointer-events-none`}
              />

              <div
                className={`relative w-full ${isHubMode ? 'aspect-4/4' : 'aspect-4/5'} rounded-t-[260px] rounded-b-3xl overflow-hidden shadow-2xl border ${safeTheme.isLightMode ? 'border-zinc-900/10 bg-zinc-200' : 'border-white/15 bg-zinc-900'}`}
                style={{ clipPath: 'inset(0 round 260px 260px 24px 24px)' }}
              >
                <HeroMedia
                  store={store}
                  isHeroFixed={isHeroFixed}
                  alt={store?.business_name || 'Featured'}
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