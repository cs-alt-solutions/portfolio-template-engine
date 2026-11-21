/* src/components/portfolio/hero/core/heroHelpers.ts */

export interface FocalPoint {
  x: number;
  y: number;
}

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

/** Backwards-compatible helper for layouts not yet migrated to <HeroMedia />. */
export const getHeroPositionClasses = (heroPosition?: string) => {
  const key = heroPosition || 'center';
  return {
    objectPos: LEGACY_OBJECT_MAP[key] || 'object-center',
    bgPos: LEGACY_CSS_POSITION_MAP[key] || '50% 50%',
  };
};

export const getHeroLogoClasses = (
  size?: string,
  alignment: 'center' | 'left' | 'inline' = 'left'
) => {
  const base = 'block w-auto max-w-full object-contain drop-shadow-xl transition-all duration-300';
  const placement =
    alignment === 'center'
      ? 'mx-auto mb-5'
      : alignment === 'inline'
        ? 'shrink-0'
        : 'mb-5 origin-left';

  if (alignment === 'inline') {
    switch (size) {
      case 'small': return `h-8 md:h-10 ${base} ${placement}`;
      case 'medium': return `h-10 md:h-12 ${base} ${placement}`;
      case 'massive': return `h-14 md:h-20 ${base} ${placement}`;
      case 'large':
      default: return `h-12 md:h-16 ${base} ${placement}`;
    }
  }

  switch (size) {
    case 'small': return `h-12 md:h-16 lg:h-20 ${base} ${placement}`;
    case 'medium': return `h-16 md:h-24 lg:h-32 ${base} ${placement}`;
    case 'massive': return `h-28 md:h-48 lg:h-60 ${base} ${placement}`;
    case 'large':
    default: return `h-20 md:h-32 lg:h-40 ${base} ${placement}`;
  }
};