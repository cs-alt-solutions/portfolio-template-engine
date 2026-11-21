/* src/components/portfolio/hero/HeroEngine.tsx */
'use client';

import React from 'react';
import { ThemeDefinition } from '@/utils/themes';
import { FocalPoint, HeroHeightOption, LogoPlacementOption } from './core/heroHelpers';
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

export {
  getRawBgColor,
  resolveHeroCssPosition,
  getHeroPositionClasses,
  getHeroHeightClass,
  getHeroLogoClasses,
} from './core/heroHelpers';
export type { FocalPoint, HeroHeightOption, LogoPlacementOption } from './core/heroHelpers';
export { default as HeroMedia } from './core/HeroMedia';

export interface StorefrontHeroData {
  business_name?: string;
  tagline?: string;
  subtext?: string;
  hero_image?: string;
  brand_logo?: string;
  logo_size?: string;
  logo_placement?: LogoPlacementOption;
  hero_height?: HeroHeightOption;
  hero_position?: string;
  hero_focal_point?: FocalPoint;
  hero_image_fit?: 'cover' | 'contain';
  hero_image_zoom?: number;
  hero_fit_align?: 'left' | 'center' | 'right';
  hero_fit_scale?: number;
  hub_hero_static?: boolean;
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