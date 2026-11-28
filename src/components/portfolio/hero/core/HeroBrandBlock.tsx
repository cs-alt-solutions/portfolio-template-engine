/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/core/HeroBrandBlock.tsx */
import React from 'react';
import { ThemeDefinition } from '@/utils/themes';
import { PAGE_DEFAULTS } from '@/utils/glossary';
import type { StorefrontHeroData } from '../HeroEngine';
import { getHeroLogoClasses } from './heroHelpers';

export function HeroMastheadLogo({
  store,
  hasValidLogo,
  className = '',
}: {
  store?: StorefrontHeroData;
  hasValidLogo: boolean;
  className?: string;
}) {
  if (!hasValidLogo || store?.logo_placement !== 'masthead') return null;

  return (
    <div className={`absolute top-5 left-6 md:top-7 md:left-10 z-20 pointer-events-none ${className}`}>
      <img
        src={store?.brand_logo || ''}
        alt={store?.business_name || PAGE_DEFAULTS.LOGO_ALT}
        className={getHeroLogoClasses(store?.logo_size, 'masthead')}
      />
    </div>
  );
}

interface HeroBrandBlockProps {
  store: StorefrontHeroData;
  theme: ThemeDefinition;
  hasValidLogo: boolean;
  exploreLink: string;
  heroButtonText: string;
  accentColorClass: string;
  buttonBgClass: string;
  lineAccent: string;
  isHubMode?: boolean;
  align?: 'left' | 'center';
  showBusinessRule?: boolean;
  headingClassName?: string;
  subtextClassName?: string;
}

export default function HeroBrandBlock({
  store,
  theme,
  hasValidLogo,
  exploreLink,
  heroButtonText,
  accentColorClass,
  buttonBgClass,
  lineAccent,
  isHubMode = false,
  align = 'left',
  showBusinessRule = false,
  headingClassName = 'text-3xl md:text-4xl lg:text-5xl',
  subtextClassName = 'text-base md:text-lg',
}: HeroBrandBlockProps) {
  const safeTheme = theme || ({} as ThemeDefinition);
  const placement = store?.logo_placement || 'beside';
  const isBeside = hasValidLogo && placement === 'beside';
  const isStacked = hasValidLogo && placement === 'stacked';
  const isCentered = align === 'center' && !isBeside;
  const cleanBodyText = isCentered
    ? safeTheme.bodyText || ''
    : (safeTheme.bodyText || '').replace('mx-auto', '');

  const copyStack = (
    <div className={`flex flex-col flex-1 min-w-0 ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}>
      {!hasValidLogo && (
        <h2
          className={`${safeTheme.accentText || ''} ${accentColorClass} mb-4 ${
            showBusinessRule
              ? 'flex items-center gap-4'
              : isCentered
                ? 'drop-shadow-md'
                : ''
          }`}
        >
          {showBusinessRule && <span className={`h-px w-12 ${lineAccent}`} />}
          {safeTheme.prefix || ''}
          {store?.business_name || ''}
        </h2>
      )}

      {store?.tagline && (
        <h1 className={`${safeTheme.primaryText || ''} ${headingClassName} leading-tight mb-5 text-balance`}>
          {store.tagline}
        </h1>
      )}

      {store?.subtext && (
        <p
          className={`${subtextClassName} leading-relaxed text-balance ${
            isHubMode ? 'mb-4' : 'mb-8'
          } ${isCentered ? 'max-w-2xl mx-auto opacity-90' : 'max-w-2xl'} ${cleanBodyText}`}
        >
          {store.subtext}
        </p>
      )}

      {!isHubMode && (
        <div>
          <a href={exploreLink} className={`inline-block ${safeTheme.buttonStyle || ''} ${buttonBgClass}`}>
            {store?.hero_cta || heroButtonText}
          </a>
        </div>
      )}
    </div>
  );

  if (isBeside) {
    return (
      <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 text-left">
        <img
          src={store?.brand_logo || ''}
          alt={store?.business_name || PAGE_DEFAULTS.LOGO_ALT}
          className={getHeroLogoClasses(store?.logo_size, 'masthead')}
        />
        {copyStack}
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}>
      {isStacked && (
        <img
          src={store?.brand_logo || ''}
          alt={store?.business_name || PAGE_DEFAULTS.LOGO_ALT}
          className={getHeroLogoClasses(store?.logo_size, isCentered ? 'center' : 'left')}
        />
      )}
      {copyStack}
    </div>
  );
}