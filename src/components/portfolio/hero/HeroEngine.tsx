/* src/components/portfolio/hero/HeroEngine.tsx */
'use client';

import React from 'react';
import { ThemeDefinition } from '@/utils/themes';
import CenterHero from './layouts/CenterHero';
import SplitLeftHero from './layouts/SplitLeftHero';
import SplitRightHero from './layouts/SplitRightHero';
import CinematicHero from './layouts/CinematicHero';
import GlassHero from './layouts/GlassHero';
import EditorialFrameHero from './layouts/EditorialFrameHero';
import ArchSpotlightHero from './layouts/ArchSpotlightHero';
import BentoHero from './layouts/BentoHero';
import BottomDockHero from './layouts/BottomDockHero';
import TopDockHero from './layouts/TopDockHero';
import MinimalTypeHero from './layouts/MinimalTypeHero';

export interface StorefrontHeroData {
  business_name?: string;
  tagline?: string;
  subtext?: string;
  hero_image?: string;
  brand_logo?: string;
  logo_size?: string;
  hero_position?: string;
  hero_cta?: string;
  industry_tag?: string;
  [key: string]: unknown;
}

export interface HeroGalleryPreviewItem {
  id: string;
  imageUrl: string;
  title?: string;
  isVisible?: boolean;
}

export interface HeroEngineProps {
  layout: string;
  store: StorefrontHeroData;
  theme: ThemeDefinition;
  brandColor: string;
  secondaryBrandColor: string;
  isHeroFixed: boolean;
  hasValidLogo: boolean;
  exploreLink: string;
  heroButtonText: string;
  accentColorClass: string;
  buttonBgClass: string;
  lineAccent: string;
  isHubMode?: boolean;
  galleryItems?: HeroGalleryPreviewItem[];
}

export const getRawBgColor = (pageBg: string = '', isLightMode: boolean = false) => {
  if (!pageBg) return isLightMode ? '#ffffff' : '#000000';
  if (pageBg.includes('#')) {
    const match = pageBg.match(/#([0-9a-fA-F]{3,6})/);
    return match ? match[0] : (isLightMode ? '#ffffff' : '#000000');
  }
  if (pageBg.includes('zinc-950')) return '#09090b';
  if (pageBg.includes('zinc-50')) return '#fafafa';
  if (pageBg.includes('yellow-400')) return '#facc15';
  if (pageBg.includes('black')) return '#000000';
  if (pageBg.includes('white')) return '#ffffff';
  return isLightMode ? '#ffffff' : '#000000';
};

export const getHeroPositionClasses = (heroPosition?: string) => {
  const positionClassMap: Record<string, string> = {
    top: 'object-top',
    center: 'object-center',
    bottom: 'object-bottom',
    left: 'object-left',
    right: 'object-right',
  };
  const bgPositionMap: Record<string, string> = {
    top: 'top center',
    center: 'center center',
    bottom: 'bottom center',
    left: 'center left',
    right: 'center right',
  };
  const key = heroPosition || 'center';
  return {
    objectPos: positionClassMap[key] || 'object-center',
    bgPos: bgPositionMap[key] || 'center center',
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

export default function HeroEngine(props: HeroEngineProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LayoutRegistry: Record<string, React.ComponentType<any>> = {
    'center': CenterHero,
    'split-left': SplitLeftHero,
    'split-right': SplitRightHero,
    'cinematic': CinematicHero,
    'glass': GlassHero,
    'editorial-frame': EditorialFrameHero,
    'arch-spotlight': ArchSpotlightHero,
    'bento-hero': BentoHero,
    'bottom-dock': BottomDockHero,
    'top-dock': TopDockHero,
    'minimal-type': MinimalTypeHero,
  };

  const SelectedLayout = LayoutRegistry[props.layout] || CenterHero;

  return <SelectedLayout {...props} />;
}