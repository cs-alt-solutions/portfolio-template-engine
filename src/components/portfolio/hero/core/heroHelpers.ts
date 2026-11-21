/* src/components/portfolio/hero/core/heroHelpers.ts */

export interface FocalPoint {
  x: number;
  y: number;
}

export type HeroHeightOption = 'default' | 'compact' | 'balanced' | 'full';
export type LogoPlacementOption = 'beside' | 'masthead' | 'stacked';

const LEGACY_OBJECT_MAP: Record<string, string> = {
  top: 'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
};

const LEGACY_CSS_POSITION_MAP: Record<string, string> = {
  top: '50% 0%',
  center: '50% 50%',
  bottom: '50% 100%',
  left: '0% 50%',
  right: '100% 50%',
};

export const getRawBgColor = (pageBg: string = '', isLightMode: boolean = false) => {
  if (!pageBg) return isLightMode ? '#ffffff' : '#000000';
  if (pageBg.includes('#')) {
    const match = pageBg.match(/#([0-9a-fA-F]{3,6})/);
    return match ? match[0] : isLightMode ? '#ffffff' : '#000000';
  }
  if (pageBg.includes('zinc-950')) return '#09090b';
  if (pageBg.includes('zinc-50')) return '#fafafa';
  if (pageBg.includes('yellow-400')) return '#facc15';
  if (pageBg.includes('black')) return '#000000';
  if (pageBg.includes('white')) return '#ffffff';
  return isLightMode ? '#ffffff' : '#000000';
};

/** Resolves exact focalPoint percentages first, falling back to legacy hero_position keywords. */
export const resolveHeroCssPosition = (focalPoint?: FocalPoint, heroPosition?: string): string => {
  if (focalPoint && typeof focalPoint.x === 'number' && typeof focalPoint.y === 'number') {
    return `${focalPoint.x}% ${focalPoint.y}%`;
  }
  return LEGACY_CSS_POSITION_MAP[heroPosition || 'center'] || '50% 50%';
};

/** Backwards-compatible helper for legacy references. */
export const getHeroPositionClasses = (heroPosition?: string) => {
  const key = heroPosition || 'center';
  return {
    objectPos: LEGACY_OBJECT_MAP[key] || 'object-center',
    bgPos: LEGACY_CSS_POSITION_MAP[key] || '50% 50%',
  };
};

/** Centralized Hero height resolver — defaults preserve all existing live storefronts. */
export const getHeroHeightClass = (
  heroHeight?: string,
  isHubMode?: boolean,
  defaultStandard: string = 'min-h-[90vh]',
  defaultHub: string = 'min-h-[45vh] md:min-h-[55vh]'
): string => {
  switch (heroHeight) {
    case 'compact':
      return 'min-h-[45vh] md:min-h-[55vh]';
    case 'balanced':
      return 'min-h-[65vh] md:min-h-[75vh]';
    case 'full':
      return 'min-h-screen';
    default:
      return isHubMode ? defaultHub : defaultStandard;
  }
};

export const getHeroLogoClasses = (
  size?: string,
  alignment: 'center' | 'left' | 'inline' | 'masthead' = 'left'
) => {
  const base = 'block w-auto max-w-full object-contain drop-shadow-2xl transition-all duration-300';

  if (alignment === 'inline') {
    switch (size) {
      case 'small': return `h-8 md:h-10 ${base} shrink-0`;
      case 'medium': return `h-10 md:h-12 ${base} shrink-0`;
      case 'massive': return `h-14 md:h-20 ${base} shrink-0`;
      case 'xlarge': return `h-16 md:h-24 ${base} shrink-0`;
      case 'heroic': return `h-20 md:h-28 ${base} shrink-0`;
      case 'large':
      default: return `h-12 md:h-16 ${base} shrink-0`;
    }
  }

  if (alignment === 'masthead') {
    switch (size) {
      case 'small': return `h-12 md:h-16 lg:h-20 ${base} shrink-0`;
      case 'medium': return `h-16 md:h-24 lg:h-28 ${base} shrink-0`;
      case 'massive': return `h-28 md:h-36 lg:h-48 ${base} shrink-0`;
      case 'xlarge': return `h-32 md:h-44 lg:h-56 ${base} shrink-0`;
      case 'heroic': return `h-36 md:h-52 lg:h-64 ${base} shrink-0`;
      case 'large':
      default: return `h-20 md:h-28 lg:h-36 ${base} shrink-0`;
    }
  }

  const placement = alignment === 'center' ? 'mx-auto mb-5' : 'mb-5 origin-left';
  switch (size) {
    case 'small': return `h-12 md:h-16 lg:h-20 ${base} ${placement}`;
    case 'medium': return `h-16 md:h-24 lg:h-32 ${base} ${placement}`;
    case 'massive': return `h-28 md:h-44 lg:h-56 ${base} ${placement}`;
    case 'xlarge': return `h-36 md:h-52 lg:h-64 ${base} ${placement}`;
    case 'heroic': return `h-44 md:h-64 lg:h-80 ${base} ${placement}`;
    case 'large':
    default: return `h-20 md:h-32 lg:h-40 ${base} ${placement}`;
  }
};