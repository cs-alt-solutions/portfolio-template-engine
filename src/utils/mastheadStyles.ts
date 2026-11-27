/* src/utils/mastheadStyles.ts */
import type React from 'react';

const LEGACY_HEX_MAP: Record<string, string> = {
  'cyan-500': '#06b6d4',
  'fuchsia-500': '#d946ef',
  'emerald-500': '#10b981',
  'amber-500': '#f59e0b',
  'rose-500': '#f43f5e',
  'indigo-500': '#6366f1',
  'zinc-500': '#71717a',
  'cyan': '#06b6d4',
  'fuchsia': '#d946ef',
  'emerald': '#10b981',
  'amber': '#f59e0b',
  'rose': '#f43f5e',
  'indigo': '#6366f1',
  'zinc': '#71717a',
};

export const MASTHEAD_FONT_MAP: Record<string, { fontClass: string; trackingClass: string }> = {
  gothic: { fontClass: 'font-gothic', trackingClass: 'tracking-normal' },
  pirata: { fontClass: 'font-pirata', trackingClass: 'tracking-[0.02em]' },
  grenze: { fontClass: 'font-grenze', trackingClass: 'tracking-[0.02em]' },
  cinzel: { fontClass: 'font-cinzel', trackingClass: 'tracking-[0.08em]' },
};

export function resolveBrandHex(val?: unknown, fallback = '#22d3ee'): string {
  if (typeof val !== 'string' || !val.trim()) return fallback;
  const trimmed = val.trim();
  if (trimmed.startsWith('#')) return trimmed;
  return LEGACY_HEX_MAP[trimmed.toLowerCase()] || fallback;
}

export interface MastheadCardStyle {
  isMasthead: boolean;
  fontKey: string;
  fontClass: string;
  trackingClass: string;
  isBlackletter: boolean;
  isGradient: boolean;
  textStyle: React.CSSProperties;
}

function buildGradientStyle(gradientCss: string): React.CSSProperties {
  return {
    backgroundImage: gradientCss,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.7))',
  };
}

export function parseMastheadSpec(
  heroLayout?: unknown,
  primaryColor?: unknown,
  secondaryColor?: unknown
): MastheadCardStyle {
  const raw = typeof heroLayout === 'string' ? heroLayout : '';
  const [baseLayout = '', fontKey = 'default', colorKey = 'default'] = raw.split('--');
  const isMasthead = baseLayout === 'masthead' || baseLayout === 'masthead-wash';

  const customFont = MASTHEAD_FONT_MAP[fontKey];
  const primaryHex = resolveBrandHex(primaryColor, '#22d3ee');
  const secondaryHex = resolveBrandHex(secondaryColor || primaryColor, primaryHex);
  const isBlackletter = fontKey === 'gothic' || fontKey === 'pirata';

  let isGradient = false;
  let textStyle: React.CSSProperties = {
    color: '#F3EFE6',
    textShadow: '0 6px 24px rgba(0, 0, 0, 0.75)',
  };

  if (colorKey === 'primary') {
    textStyle = {
      color: primaryHex,
      textShadow: '0 6px 24px rgba(0, 0, 0, 0.75)',
    };
  } else if (colorKey === 'duotone') {
    isGradient = true;
    textStyle = buildGradientStyle(`linear-gradient(180deg, ${primaryHex} 0%, ${secondaryHex} 100%)`);
  } else if (colorKey === 'gold') {
    isGradient = true;
    textStyle = buildGradientStyle('linear-gradient(180deg, #FFF4B8 0%, #F5C518 46%, #B47809 100%)');
  } else if (colorKey.startsWith('hex-')) {
    const hexParts = colorKey
      .slice(4)
      .split('-')
      .filter((h) => /^[0-9a-fA-F]{3,6}$/.test(h));

    if (hexParts.length >= 2) {
      isGradient = true;
      textStyle = buildGradientStyle(`linear-gradient(180deg, #${hexParts[0]} 0%, #${hexParts[1]} 100%)`);
    } else if (hexParts.length === 1) {
      textStyle = {
        color: `#${hexParts[0]}`,
        textShadow: '0 6px 24px rgba(0, 0, 0, 0.75)',
      };
    }
  }

  return {
    isMasthead,
    fontKey,
    fontClass: customFont ? customFont.fontClass : 'font-serif',
    trackingClass: customFont ? customFont.trackingClass : 'tracking-[0.06em]',
    isBlackletter,
    isGradient,
    textStyle,
  };
}