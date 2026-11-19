/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/layouts/BentoHero.tsx */
import React from 'react';
import { HeroEngineProps, getHeroLogoClasses, getHeroPositionClasses } from '../HeroEngine';

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
  const { objectPos } = getHeroPositionClasses(store?.hero_position);
  const tileRadius = safeTheme.radius === 'rounded-full' ? 'rounded-3xl' : (safeTheme.radius || 'rounded-none');
  const surfaceClass = safeTheme.isLightMode
    ? 'bg-white/80 border-zinc-900/10'
    : 'bg-zinc-900/70 border-white/10';
  const cleanBodyText = (safeTheme.bodyText || '').replace('mx-auto', '');

  const extraTiles = galleryItems
    .filter((item) => item?.imageUrl && item.isVisible !== false && item.imageUrl !== store?.hero_image)
    .slice(0, 2);

  return (
    <section
      id="hero"
      className={`relative w-full ${isHubMode ? 'py-10 md:py-14' : 'min-h-[90vh] py-12 md:py-20'} flex items-center ${safeTheme.pageBg || ''}`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
          {/* Left Identity Bento Card */}
          <div
            className={`lg:col-span-6 relative overflow-hidden border p-8 md:p-12 lg:p-14 flex flex-col justify-between shadow-xl ${surfaceClass} ${tileRadius}`}
          >
            {safeTheme.useBrandAccent && (
              <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />
            )}

            <div>
              {hasValidLogo ? (
                <img
                  src={store?.brand_logo || ''}
                  alt={store?.business_name || 'Logo'}
                  className={getHeroLogoClasses(store?.logo_size, 'left')}
                />
              ) : (
                <h2 className={`${safeTheme.accentText || ''} ${accentColorClass} mb-5`}>
                  {safeTheme.prefix || ''}{store?.business_name || ''}
                </h2>
              )}

              {store?.tagline && (
                <h1 className={`${safeTheme.primaryText || ''} text-3xl md:text-5xl mb-6 text-balance`}>
                  {store.tagline}
                </h1>
              )}

              {store?.subtext && (
                <p className={`text-base md:text-lg mb-10 text-balance ${cleanBodyText}`}>
                  {store.subtext}
                </p>
              )}
            </div>

            <div>
              <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
                {store?.hero_cta || heroButtonText}
              </a>
            </div>
          </div>

          {/* Right Visual Collage Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-5 md:gap-6 min-h-95 md:min-h-130">
            {/* Primary Hero Tile */}
            <div
              className={`relative overflow-hidden border ${safeTheme.isLightMode ? 'border-zinc-900/10' : 'border-white/10'} shadow-xl ${tileRadius} ${
                extraTiles.length > 0 ? 'col-span-2 min-h-60 md:min-h-75' : 'col-span-2 row-span-2 min-h-95'
              }`}
            >
              {store?.hero_image ? (
                <img
                  src={store.hero_image}
                  alt={store?.business_name || 'Primary Feature'}
                  className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${objectPos}`}
                />
              ) : (
                <div className={`w-full h-full opacity-20 ${lineAccent}`} />
              )}
            </div>

            {/* Secondary Auto-Pulled Gallery Tiles */}
            {extraTiles.map((tile, idx) => (
              <div
                key={tile.id || idx}
                className={`relative overflow-hidden border ${safeTheme.isLightMode ? 'border-zinc-900/10' : 'border-white/10'} shadow-lg min-h-40 md:min-h-50 ${tileRadius} ${
                  extraTiles.length === 1 ? 'col-span-2' : 'col-span-1'
                }`}
              >
                <img
                  src={tile.imageUrl}
                  alt={tile.title || `${store?.business_name || 'Preview'} ${idx + 1}`}
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