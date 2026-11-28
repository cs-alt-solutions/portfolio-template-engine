/* src/components/portfolio/hero/layouts/MastheadHero.tsx */
import React from 'react';
import { HeroEngineProps, HeroMedia, getRawBgColor } from '../HeroEngine';
import { PAGE_DEFAULTS } from '@/utils/glossary';

const MASTHEAD_FONTS: Record<string, { fontClass: string; trackingClass: string }> = {
  gothic: { fontClass: 'font-gothic', trackingClass: 'tracking-normal' },
  pirata: { fontClass: 'font-pirata', trackingClass: 'tracking-[0.02em]' },
  grenze: { fontClass: 'font-grenze', trackingClass: 'tracking-[0.02em]' },
  cinzel: { fontClass: 'font-cinzel', trackingClass: 'tracking-[0.08em]' },
};

function resolveMastheadColor(colorKey: string): {
  isCustomColor: boolean;
  isGradient: boolean;
  style?: React.CSSProperties;
} {
  if (!colorKey || colorKey === 'default') {
    return { isCustomColor: false, isGradient: false };
  }

  if (colorKey === 'primary') {
    return {
      isCustomColor: true,
      isGradient: false,
      style: { color: 'var(--brand-primary)' },
    };
  }

  if (colorKey === 'duotone') {
    return {
      isCustomColor: true,
      isGradient: true,
      style: {
        backgroundImage: 'linear-gradient(180deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        filter: 'drop-shadow(0 4px 18px rgba(0, 0, 0, 0.45))',
      },
    };
  }

  if (colorKey === 'gold') {
    return {
      isCustomColor: true,
      isGradient: true,
      style: {
        backgroundImage: 'linear-gradient(180deg, #FFF4B8 0%, #F5C518 46%, #B47809 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        filter: 'drop-shadow(0 4px 18px rgba(0, 0, 0, 0.45))',
      },
    };
  }

  if (colorKey.startsWith('hex-')) {
    const hexParts = colorKey
      .slice(4)
      .split('-')
      .filter((h) => /^[0-9a-fA-F]{3,6}$/.test(h));

    if (hexParts.length >= 2) {
      return {
        isCustomColor: true,
        isGradient: true,
        style: {
          backgroundImage: `linear-gradient(180deg, #${hexParts[0]} 0%, #${hexParts[1]} 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          filter: 'drop-shadow(0 4px 18px rgba(0, 0, 0, 0.45))',
        },
      };
    }

    if (hexParts.length === 1) {
      return {
        isCustomColor: true,
        isGradient: false,
        style: { color: `#${hexParts[0]}` },
      };
    }
  }

  return { isCustomColor: false, isGradient: false };
}

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

  const [baseLayout, fontKey = 'default', colorKey = 'default'] = (layout || 'masthead').split('--');
  const showWash = baseLayout === 'masthead-wash' && Boolean(store?.hero_image);
  const rawBgColor = getRawBgColor(safeTheme.pageBg || '', isLight);
  const customFont = MASTHEAD_FONTS[fontKey];
  const mastheadColor = resolveMastheadColor(colorKey);

  const displayName = (store?.business_name || store?.tagline || PAGE_DEFAULTS.FALLBACK_BUSINESS_NAME).trim();
  const charCount = displayName.length;

  const isBlackletter = fontKey === 'gothic' || fontKey === 'pirata';
  const mastheadSize =
    charCount <= 10
      ? isBlackletter
        ? 'text-[clamp(3.75rem,12.5vw,10.5rem)]'
        : 'text-[clamp(3.25rem,11vw,9.5rem)]'
      : charCount <= 18
        ? 'text-[clamp(2.5rem,8vw,7rem)]'
        : 'text-[clamp(2rem,6vw,5.25rem)]';

  const heightClass =
    store?.hero_height === 'compact'
      ? 'py-10 md:py-14'
      : store?.hero_height === 'balanced'
        ? 'min-h-[54vh] py-16 md:py-24'
        : store?.hero_height === 'full'
          ? 'min-h-[76vh] py-20 md:py-28'
          : isHubMode
            ? 'py-12 md:py-16'
            : 'py-16 md:py-24';

  const borderClass = isLight ? 'border-zinc-900/10' : 'border-white/10';
  const eyebrowTone = isLight ? 'text-zinc-600' : 'text-stone-400';

  let basePrimaryText = safeTheme.primaryText || '';
  if (customFont) {
    basePrimaryText = basePrimaryText
      .replace(/\bfont-(sans|serif|mono|cinzel|pirata|gothic|grenze)\b/g, '')
      .replace(/\btracking-[^\s]+\b/g, '');
  }
  if (mastheadColor.isCustomColor) {
    basePrimaryText = basePrimaryText.replace(
      /\btext-(?:white|black|current|transparent|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(?:\/\d+)?|\[[^\]]+\])\b/g,
      ''
    );
  }

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
        {store?.industry_tag && (
          <div className="flex items-center justify-center gap-4 mb-5 md:mb-7">
            <span className={`h-px w-8 md:w-12 opacity-60 ${lineAccent}`} />
            <span className={`text-[10px] md:text-xs font-mono uppercase tracking-[0.35em] ${eyebrowTone}`}>
              {store.industry_tag}
            </span>
            <span className={`h-px w-8 md:w-12 opacity-60 ${lineAccent}`} />
          </div>
        )}

        <h1
          style={mastheadColor.style}
          className={`w-full ${basePrimaryText} ${
            customFont ? `${customFont.fontClass} ${customFont.trackingClass} font-normal` : 'tracking-[0.04em]'
          } ${mastheadSize} ${mastheadColor.isGradient ? 'py-2' : ''} leading-[1.02] text-balance select-none`}
        >
          {safeTheme.prefix || ''}
          {displayName}
        </h1>

        <div className="w-full max-w-2xl flex items-center justify-center gap-4 my-6 md:my-8">
          <div className={`h-px flex-1 opacity-40 ${lineAccent}`} />
          <div className={`w-1.5 h-1.5 rotate-45 opacity-80 ${lineAccent}`} />
          <div className={`h-px flex-1 opacity-40 ${lineAccent}`} />
        </div>

        {store?.tagline && store.tagline.trim().toLowerCase() !== displayName.toLowerCase() && (
          <p className={`${safeTheme.accentText || ''} ${accentColorClass} max-w-3xl mx-auto mb-4 text-balance`}>
            {store.tagline}
          </p>
        )}

        {store?.subtext && (
          <p
            className={`text-sm md:text-lg max-w-2xl mx-auto opacity-85 text-balance ${
              isHubMode ? 'mb-0' : 'mb-8 md:mb-10'
            } ${safeTheme.bodyText || ''}`}
          >
            {store.subtext}
          </p>
        )}

        {!isHubMode && (
          <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
            {store?.hero_cta || heroButtonText}
          </a>
        )}
      </div>
    </section>
  );
}