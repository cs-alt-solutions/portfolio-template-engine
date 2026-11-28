/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/BentoGridFlow.tsx */
'use client';

import React, { useState } from 'react';
import { Capability, ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { CAPABILITY_DEFAULTS, FLOW_DEFAULTS } from '@/utils/glossary';
import CapabilityActionButtons from '../shared/CapabilityActionButtons';
import CapabilityActionModals from '../shared/CapabilityActionModals';
import CapabilityAddonsSection from '../shared/CapabilityAddonsSection';
import {
  getCapabilityPhotos,
  getCapabilityTerms,
  getSmartCtaLabel,
  getSmartDetailsLabel,
  hasCapabilityDetails,
} from '../shared/capabilityHelpers';

export default function BentoGridFlow({
  themeStyle,
  brandColor,
  secondaryBrandColor,
  isLightMode,
  capabilitiesHeading,
  capabilities,
  galleryItems,
  operationalTerms,
  businessName,
  storefrontSlug,
  contactEmail,
}: ContentLayoutProps) {
  const [detailsCap, setDetailsCap] = useState<Capability | null>(null);
  const [bookingCap, setBookingCap] = useState<Capability | null>(null);

  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const isSharp = shapeRadius === 'rounded-none';
  const isMidnight = themeStyle === 'midnight';

  const packages = (capabilities || []).filter((c) => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter((c) => c.isAlaCarte);
  const safeTerms = (operationalTerms || []).filter((t) => t && t.title?.trim());

  if (packages.length === 0 && alaCarte.length === 0) return null;

  const gridColsClass =
    packages.length === 1
      ? 'grid-cols-1 max-w-3xl mx-auto'
      : packages.length === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
      <div className="mb-14 md:mb-16 text-center md:text-left">
        <h2 className={`text-4xl md:text-6xl ${brandTextColor} ${fonts.heading}`}>
          {capabilitiesHeading || FLOW_DEFAULTS.BENTO_HEADING}
        </h2>
      </div>

      {packages.length > 0 && (
        <div className={`grid ${gridColsClass} gap-6 auto-rows-[minmax(380px,auto)]`}>
          {packages.map((cap, i) => {
            const capPhotos = getCapabilityPhotos(cap.title, galleryItems);
            const capTerms = getCapabilityTerms(cap.title, safeTerms);
            const primaryPhoto = capPhotos[0];
            const bgPhoto = cap.coverImage || primaryPhoto?.url || null;
            const hasBackgroundPhoto = Boolean(bgPhoto);
            const fp = primaryPhoto?.focalPoint || { x: 50, y: 50 };

            const showDetails = hasCapabilityDetails(cap, capPhotos, capTerms);
            const detailsLabel = getSmartDetailsLabel(cap, capPhotos, capTerms);
            const ctaLabel = getSmartCtaLabel(cap, CAPABILITY_DEFAULTS.INQUIRE_BTN);
            const cleanBullets = (cap.bullets || []).filter((b) => b && b.trim() !== '');
            const isWide = packages.length >= 3 && i % 3 === 0;

            return (
              <div
                key={`bento-${i}`}
                className={`relative flex flex-col justify-between overflow-hidden group transition-all duration-500 hover:-translate-y-1 ${shapeRadius} shadow-xl hover:shadow-2xl ${
                  isWide ? 'md:col-span-2' : 'col-span-1'
                } ${
                  !hasBackgroundPhoto
                    ? isMidnight
                      ? 'bg-zinc-900/30 backdrop-blur-2xl border border-white/10'
                      : isLightMode
                        ? 'bg-white border border-zinc-200'
                        : 'bg-zinc-900 border border-zinc-800'
                    : 'border border-white/10'
                }`}
              >
                {hasBackgroundPhoto && bgPhoto && (
                  <>
                    <img
                      src={bgPhoto}
                      alt={cap.title}
                      style={{ objectPosition: `${fp.x}% ${fp.y}%` }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/15 opacity-90 group-hover:opacity-100 transition-opacity" />
                  </>
                )}

                <div
                  className={`relative z-10 flex flex-col h-full ${
                    hasBackgroundPhoto ? 'p-6 md:p-8 justify-end' : 'p-7 md:p-10 justify-between'
                  }`}
                >
                  <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                    <h3
                      className={`text-2xl md:text-4xl leading-tight ${fonts.heading} ${
                        hasBackgroundPhoto ? 'text-white drop-shadow-md' : brandTextColor
                      }`}
                    >
                      {cap.title}
                    </h3>
                    {cap.price && (
                      <span
                        className={`text-sm md:text-base font-mono font-bold px-3 py-1 border ${
                          isSharp ? 'rounded-none' : 'rounded-full'
                        } ${
                          hasBackgroundPhoto
                            ? 'bg-black/60 border-white/20 text-white backdrop-blur-md'
                            : `${brandTextColor} border-current/20 bg-current/5`
                        }`}
                      >
                        {cap.price}
                      </span>
                    )}
                  </div>

                  <div
                    className={`space-y-5 ${
                      hasBackgroundPhoto
                        ? `bg-black/45 backdrop-blur-md border border-white/10 p-5 md:p-6 ${shapeRadius}`
                        : 'flex flex-col flex-1'
                    }`}
                  >
                    {cap.description && (
                      <p
                        className={`text-sm md:text-base leading-relaxed ${fonts.body} ${
                          hasBackgroundPhoto ? 'text-zinc-200' : isLightMode ? 'text-zinc-600' : 'text-zinc-300'
                        }`}
                      >
                        {cap.description}
                      </p>
                    )}

                    {cleanBullets.length > 0 && (
                      <ul
                        className={`space-y-2.5 border-t pt-4 ${
                          hasBackgroundPhoto
                            ? 'border-white/10'
                            : isLightMode
                              ? 'border-zinc-200'
                              : 'border-white/10'
                        }`}
                      >
                        {cleanBullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-3">
                            {getThemeBullet(themeStyle, hasBackgroundPhoto ? 'text-white' : brandTextColor)}
                            <span
                              className={`text-sm md:text-base ${fonts.body} ${
                                hasBackgroundPhoto ? 'text-white' : isLightMode ? 'text-zinc-800' : 'text-zinc-200'
                              }`}
                            >
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="pt-2 mt-auto">
                      <CapabilityActionButtons
                        capability={cap}
                        hasDetails={showDetails}
                        detailsLabel={detailsLabel}
                        ctaLabel={ctaLabel}
                        brandTextColor={brandTextColor}
                        activeSecondary={activeSecondary}
                        isLightMode={isLightMode}
                        isSharp={isSharp}
                        variant={hasBackgroundPhoto ? 'overlay' : 'solid'}
                        compact={true}
                        onOpenDetails={() => setDetailsCap(cap)}
                        onInquire={() => setBookingCap(cap)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CapabilityAddonsSection
        items={alaCarte}
        activeSecondary={activeSecondary}
        isLightMode={isLightMode}
        shapeRadius={shapeRadius}
        isSharp={isSharp}
        fonts={fonts}
      />

      <CapabilityActionModals
        capabilities={packages}
        alaCarte={alaCarte}
        galleryItems={galleryItems}
        operationalTerms={safeTerms}
        detailsCapability={detailsCap}
        bookingCapability={bookingCap}
        onCloseDetails={() => setDetailsCap(null)}
        onCloseBooking={() => setBookingCap(null)}
        onSwitchDetailsToBooking={(cap) => {
          setDetailsCap(null);
          setBookingCap(cap);
        }}
        themeStyle={themeStyle}
        brandColor={brandColor}
        isLightMode={isLightMode}
        fonts={fonts}
        businessName={businessName}
        storefrontSlug={storefrontSlug}
        contactEmail={contactEmail}
      />
    </div>
  );
}