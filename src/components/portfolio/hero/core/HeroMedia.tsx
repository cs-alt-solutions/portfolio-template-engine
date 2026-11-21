/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/hero/core/HeroMedia.tsx */
'use client';

import React from 'react';
import { StorefrontHeroData } from '../HeroEngine';
import { resolveHeroCssPosition } from './heroHelpers';

interface HeroMediaProps {
  store: StorefrontHeroData;
  isHeroFixed?: boolean;
  alt?: string;
  className?: string;
  defaultScale?: number;
  fallback?: React.ReactNode;
}

export default function HeroMedia({
  store,
  isHeroFixed = false,
  alt,
  className = '',
  defaultScale = 1,
  fallback = null,
}: HeroMediaProps) {
  const src = store?.hero_image;
  if (!src) return <>{fallback}</>;

  const cssPosition = resolveHeroCssPosition(store.hero_focal_point, store.hero_position);
  const isContain = store.hero_image_fit === 'contain';
  const customZoom =
    typeof store.hero_image_zoom === 'number' && store.hero_image_zoom > 1 ? store.hero_image_zoom : null;
  const effectiveScale = customZoom ?? defaultScale;

  if (isContain) {
    const align = store.hero_fit_align || 'center';
    const scalePct = Math.min(100, Math.max(60, store.hero_fit_scale ?? 100));

    const justifyClass =
      align === 'left'
        ? 'justify-start md:pl-8'
        : align === 'right'
          ? 'justify-end md:pr-8'
          : 'justify-center';

    const maskGradient =
      align === 'left'
        ? 'linear-gradient(to right, transparent 0%, black 8%, black 82%, transparent 100%)'
        : align === 'right'
          ? 'linear-gradient(to right, transparent 0%, black 18%, black 92%, transparent 100%)'
          : 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)';

    return (
      <div className={`relative w-full h-full overflow-hidden flex items-center ${justifyClass}`}>
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50 pointer-events-none"
        />
        <img
          src={src}
          alt={alt || store?.business_name || 'Hero'}
          className={`relative z-10 max-w-full object-contain transition-all duration-300 ${className}`}
          style={{
            height: `${scalePct}%`,
            WebkitMaskImage: maskGradient,
            maskImage: maskGradient,
          }}
        />
      </div>
    );
  }

  if (isHeroFixed) {
    return (
      <div
        className={`fixed inset-0 w-full h-full bg-cover bg-no-repeat transition-[background-position] duration-300 ${className}`}
        style={{
          backgroundImage: `url('${src}')`,
          backgroundPosition: cssPosition,
          zIndex: -1,
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt || store?.business_name || 'Hero'}
      className={`w-full h-full object-cover transition-[object-position,transform] duration-300 ${className}`}
      style={{
        objectPosition: cssPosition,
        transform: effectiveScale > 1 ? `scale(${effectiveScale})` : undefined,
        transformOrigin: cssPosition,
      }}
    />
  );
}