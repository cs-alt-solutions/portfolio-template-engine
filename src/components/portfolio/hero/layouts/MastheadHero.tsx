/* src/components/portfolio/hero/layouts/MastheadHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getRawBgColor } from '../HeroEngine';

const MASTHEAD_FONTS: Record<string, { fontClass: string; trackingClass: string }> = {
  gothic: { fontClass: 'font-gothic', trackingClass: 'tracking-normal' },
  pirata: { fontClass: 'font-pirata', trackingClass: 'tracking-[0.02em]' },
  grenze: { fontClass: 'font-grenze', trackingClass: 'tracking-[0.02em]' },
  cinzel: { fontClass: 'font-cinzel', trackingClass: 'tracking-[0.08em]' },
};

export default function MastheadHero({
  layout,
  store,
  theme,
  isHeroFixed,
  exploreLink,
  heroButtonText,
  accentColorClass,
  buttonBgClass,
  lineAccent,
  isHubMode,
}: HeroEngineProps) {
  const safeTheme = theme || {};
  const isLight = Boolean(safeTheme.isLightMode);

  const [baseLayout, fontKey = 'default'] = (layout || 'masthead').split('--');
  const showWash = baseLayout === 'masthead-wash' && Boolean(store?.hero_image);
  const rawBgColor = getRawBgColor(safeTheme.pageBg || '', isLight);
  const customFont = MASTHEAD_FONTS[fontKey];

  const displayName = (store?.business_name || store?.tagline || 'Studio').trim();
  const charCount = displayName.length;

  // Slightly larger ceiling for ornate blackletter so fine serifs stay crisp
  const isBlackletter = fontKey === 'gothic' || fontKey === 'pirata';
  const mastheadSize =
    charCount <= 10
      ? isBlackletter
        ? 'text-[clamp(3.75rem,12.5vw,10.5rem)]'
        : 'text-[clamp(3.25rem,11vw,9.5rem)]'
      : charCount <= 18
        ? 'text-[clamp(2.5rem,8vw,7rem)]'
        : 'text-[clamp(2rem,6vw,5.25rem)]';

  const heightClass = isHubMode
    ? 'py-12 md:py-16'
    : store?.hero_height === 'full'
      ? 'min-h-[76vh] py-20 md:py-28'
      : store?.hero_height === 'balanced'
        ? 'min-h-[54vh] py-16 md:py-24'
        : 'py-16 md:py-24';

  const borderClass = isLight ? 'border-zinc-900/10' : 'border-white/10';
  const eyebrowTone = isLight ? 'text-zinc-600' : 'text-stone-400';

  // Strip theme font-family & tracking when a custom display lettering is chosen
  const basePrimaryText = customFont
    ? (safeTheme.primaryText || '')
        .replace(/\bfont-(sans|serif|mono|cinzel|pirata|gothic|grenze)\b/g, '')
        .replace(/\btracking-[^\s]+\b/g, '')
    : safeTheme.primaryText || '';

  return (
    <section
      id="hero"
      className={`relative w-full flex flex-col items-center justify-center overflow-hidden border-b ${borderClass} ${safeTheme.pageBg || ''} ${heightClass}`}
    >
      {/* Optional Whisper-Faint Atmospheric Wash */}
      {showWash && (
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{ clipPath: 'inset(0)' }}
          aria-hidden="true"
        >
          <HeroMedia
            store={store}
            isHeroFixed={isHeroFixed}
            alt=""
            className={isLight ? 'opacity-[0.10] saturate-50' : 'opacity-[0.18]'}
            defaultScale={1.04}
          />
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `radial-gradient(ellipse at center, transparent 15%, ${rawBgColor} 95%), linear-gradient(to bottom, ${rawBgColor}B3 0%, transparent 30%, transparent 65%, ${rawBgColor} 100%)`,
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col items-center text-center">
        {/* Optional Top Location / Category Eyebrow */}
        {store?.industry_tag && (
          <div className="flex items-center justify-center gap-4 mb-5 md:mb-7">
            <span className={`h-px w-8 md:w-12 opacity-60 ${lineAccent}`} />
            <span className={`text-[10px] md:text-xs font-mono uppercase tracking-[0.35em] ${eyebrowTone}`}>
              {store.industry_tag}
            </span>
            <span className={`h-px w-8 md:w-12 opacity-60 ${lineAccent}`} />
          </div>
        )}

        {/* Monumental Brand Masthead */}
        <h1
          className={`w-full ${basePrimaryText} ${customFont ? `${customFont.fontClass} ${customFont.trackingClass} font-normal` : 'tracking-[0.04em]'} ${mastheadSize} leading-[1.02] text-balance select-none`}
        >
          {safeTheme.prefix || ''}
          {displayName}
        </h1>

        {/* Fine Gallery Rule */}
        <div className="w-full max-w-2xl flex items-center justify-center gap-4 my-6 md:my-8">
          <div className={`h-px flex-1 opacity-40 ${lineAccent}`} />
          <div className={`w-1.5 h-1.5 rotate-45 opacity-80 ${lineAccent}`} />
          <div className={`h-px flex-1 opacity-40 ${lineAccent}`} />
        </div>

        {/* Subtitle (Tagline) */}
        {store?.tagline && store.tagline.trim().toLowerCase() !== displayName.toLowerCase() && (
          <p className={`${safeTheme.accentText || ''} ${accentColorClass} max-w-3xl mx-auto mb-4 text-balance`}>
            {store.tagline}
          </p>
        )}

        {/* Supporting Line */}
        {store?.subtext && (
          <p className={`text-sm md:text-lg max-w-2xl mx-auto opacity-85 text-balance ${isHubMode ? 'mb-0' : 'mb-8 md:mb-10'} ${safeTheme.bodyText || ''}`}>
            {store.subtext}
          </p>
        )}

        {/* Action CTA (Hidden in Hub Mode) */}
        {!isHubMode && (
          <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
            {store?.hero_cta || heroButtonText}
          </a>
        )}
      </div>
    </section>
  );
}