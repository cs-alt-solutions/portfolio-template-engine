'use client';

import React from 'react';
import { ThemeDefinition } from '@/utils/themes';

import CenterHero from './layouts/CenterHero';
import SplitLeftHero from './layouts/SplitLeftHero';
import SplitRightHero from './layouts/SplitRightHero';
import CinematicHero from './layouts/CinematicHero';
import GlassHero from './layouts/GlassHero';

export interface StorefrontHeroData {
  business_name?: string;
  tagline?: string;
  subtext?: string;
  hero_image?: string;
  brand_logo?: string;
  logo_size?: string;
  hero_position?: string;
  hero_cta?: string;
  [key: string]: unknown;
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

export default function HeroEngine(props: HeroEngineProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LayoutRegistry: Record<string, React.ComponentType<any>> = {
    'center': CenterHero,
    'split-left': SplitLeftHero,
    'split-right': SplitRightHero,
    'cinematic': CinematicHero,
    'glass': GlassHero,
  };

  const SelectedLayout = LayoutRegistry[props.layout] || CenterHero;

  return <SelectedLayout {...props} />;
}