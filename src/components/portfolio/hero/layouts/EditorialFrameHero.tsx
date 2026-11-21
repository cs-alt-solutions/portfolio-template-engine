/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/EditorialFrameHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroLogoClasses } from '../HeroEngine';

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
  const frameRadius = safeTheme.radius === 'rounded-full' ? 'rounded-3xl' : (safeTheme.radius || 'rounded-none');
  const borderClass = safeTheme.isLightMode ? 'border-zinc-900/10' : 'border-white/10';

  return (
    <section
      id="hero"
      className={`relative w-full ${safeTheme.pageBg || ''} ${isHubMode ? 'pt-12 pb-10' : 'pt-16 pb-16 md:pt-24 md:pb-24'}`}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Top Editorial Masthead */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 md:mb-14">
          {hasValidLogo ? (
            <img
              src={store?.brand_logo || ''}
              alt={store?.business_name || 'Logo'}
              className={getHeroLogoClasses(store?.logo_size, 'center')}
            />
          ) : (
            <div className="flex items-center gap-3 mb-5">
              <span className={`h-px w-8 ${lineAccent}`} />
              <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} text-sm md:text-base`}>
                {safeTheme.prefix || ''}{store?.business_name || ''}
              </h2>
              <span className={`h-px w-8 ${lineAccent}`} />
            </div>
          )}

          {store?.tagline && (
            <h1 className={`${safeTheme.primaryText || ''} text-4xl md:text-6xl lg:text-7xl mb-6 text-balance`}>
              {store.tagline}
            </h1>
          )}

          {store?.subtext && (
            <p className={`text-base md:text-xl max-w-2xl ${isHubMode ? 'mb-4' : 'mb-8'} text-balance opacity-90 ${safeTheme.bodyText || ''}`}>
              {store.subtext}
            </p>
          )}

          {!isHubMode && (
            <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
              {store?.hero_cta || heroButtonText}
            </a>
          )}
        </div>

        {/* Bottom Wide Framed Showcase */}
        {store?.hero_image && (
          <div className={`relative w-full ${isHubMode ? 'h-[36vh] md:h-[46vh]' : 'h-[45vh] md:h-[62vh]'} overflow-hidden border ${borderClass} shadow-2xl ${frameRadius}`}>
            {safeTheme.useBrandAccent && (
              <div className={`absolute top-0 left-0 w-full h-1 z-20 ${lineAccent}`} />
            )}
            <div className="absolute inset-0" style={{ clipPath: 'inset(0)' }}>
              <HeroMedia
                store={store}
                isHeroFixed={isHeroFixed}
                alt={store?.business_name || 'Hero Showcase'}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}