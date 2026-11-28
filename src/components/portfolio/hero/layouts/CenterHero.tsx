 
/* src/components/portfolio/hero/layouts/CenterHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getHeroHeightClass } from '../HeroEngine';
import HeroBrandBlock, { HeroMastheadLogo } from '../core/HeroBrandBlock';

export default function CenterHero({
  store,
  theme,
  brandColor,
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
  const isLight = safeTheme.isLightMode;
  const heightClass = getHeroHeightClass(
    store?.hero_height,
    isHubMode,
    'min-h-[95vh] py-20',
    'min-h-[45vh] py-12'
  );
  const placement = store?.logo_placement || 'beside';
  const isBeside = hasValidLogo && placement === 'beside';
  const isMasthead = hasValidLogo && placement === 'masthead';

  return (
    <section
      id="hero"
      className={`relative ${heightClass} ${isMasthead ? 'pt-28 md:pt-36 pb-12 md:pb-16' : 'py-12 md:py-16'} w-full flex items-center justify-center overflow-hidden transition-all duration-500`}
    >
      <HeroMastheadLogo store={store} hasValidLogo={hasValidLogo} />

      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0)' }}>
        <HeroMedia store={store} isHeroFixed={isHeroFixed} defaultScale={1} />
        <div className={`absolute inset-0 z-20 pointer-events-none ${isLight ? 'bg-black/60' : 'bg-black/80'}`} />
        {safeTheme.useBrandTint && (
          <div className={`absolute inset-0 z-20 pointer-events-none opacity-30 bg-${brandColor} mix-blend-color`} />
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <div
          className={`w-full ${isBeside ? 'max-w-5xl' : 'max-w-4xl'} p-8 md:p-14 relative overflow-hidden group shadow-2xl ${safeTheme.cardStyle || ''} ${
            isLight
              ? 'bg-white/95 backdrop-blur-xl border-white/50'
              : 'bg-zinc-950/95 backdrop-blur-xl border-zinc-800'
          }`}
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
      </div>
    </section>
  );
}