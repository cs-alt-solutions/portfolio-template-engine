/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/EditorialHoverFlow.tsx */
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

export default function EditorialHoverFlow({
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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [detailsCap, setDetailsCap] = useState<Capability | null>(null);
  const [bookingCap, setBookingCap] = useState<Capability | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const isSharp = shapeRadius === 'rounded-none';
  const brandTextColor = themeStyle === 'midnight' ? 'text-white' : `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;

  const packages = (capabilities || []).filter((c) => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter((c) => c.isAlaCarte);
  const safeTerms = (operationalTerms || []).filter((t) => t && t.title?.trim());
  const validGallery = (galleryItems || []).filter((img) => img.isVisible !== false && img.imageUrl);

  if (packages.length === 0 && alaCarte.length === 0) return null;

  const activeCap = activeIndex !== null ? packages[activeIndex] : null;
  const activeCapPhotos = activeCap ? getCapabilityPhotos(activeCap.title, galleryItems) : [];
  const backdropImage =
    activeCap?.coverImage ||
    activeCapPhotos[0]?.url ||
    (activeIndex !== null && validGallery.length > 0
      ? validGallery[activeIndex % validGallery.length].imageUrl
      : null);

  return (
    <div className="w-full py-20 md:py-24 min-h-[80vh] flex flex-col justify-center relative overflow-hidden">
      {backdropImage && (
        <div className="absolute inset-0 z-0 animate-in fade-in duration-700 pointer-events-none">
          <img
            key={backdropImage}
            src={backdropImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-30 scale-105 transition-transform duration-700"
          />
          <div className={`absolute inset-0 bg-${brandColor} mix-blend-color opacity-20`} />
          <div
            className={`absolute inset-0 bg-linear-to-t ${
              isLightMode
                ? 'from-white/95 via-white/80 to-white/95'
                : 'from-black/95 via-black/80 to-black/95'
            }`}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        <h2 className={`mb-14 md:mb-20 text-center ${brandTextColor} ${fonts.accent}`}>
          {capabilitiesHeading || FLOW_DEFAULTS.EDITORIAL_HEADING}
        </h2>

        {packages.length > 0 && (
          <div className="flex flex-col w-full border-t border-current/20">
            {packages.map((cap, i) => {
              const isAnyActive = activeIndex !== null;
              const isThisActive = activeIndex === i;
              const capPhotos = getCapabilityPhotos(cap.title, galleryItems);
              const capTerms = getCapabilityTerms(cap.title, safeTerms);
              const showDetails = hasCapabilityDetails(cap, capPhotos, capTerms);
              const detailsLabel = getSmartDetailsLabel(cap, capPhotos, capTerms);
              const ctaLabel = getSmartCtaLabel(cap, CAPABILITY_DEFAULTS.INQUIRE_BTN);
              const cleanBullets = (cap.bullets || []).filter((b) => b && b.trim() !== '');

              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(isThisActive ? null : i)}
                  className={`w-full py-8 md:py-12 border-b ${
                    isLightMode ? 'border-zinc-300' : 'border-zinc-800'
                  } flex flex-col md:flex-row justify-between gap-8 cursor-pointer transition-all duration-500 ${
                    isThisActive ? `px-4 md:px-10 bg-current/5 border-${brandColor}` : 'hover:px-4'
                  } ${isAnyActive && !isThisActive ? 'opacity-40' : 'opacity-100'}`}
                >
                  <div className="flex flex-col gap-2 md:w-1/2">
                    <h3
                      className={`text-3xl md:text-5xl transition-colors ${fonts.heading} ${
                        isThisActive
                          ? brandTextColor
                          : isLightMode
                            ? 'text-zinc-900'
                            : 'text-zinc-100'
                      }`}
                    >
                      {cap.title}
                    </h3>
                    {cap.price && (
                      <span className={`text-base md:text-lg font-mono font-bold ${brandTextColor}`}>
                        {cap.price}
                      </span>
                    )}
                  </div>

                  <div
                    className={`md:w-1/2 overflow-hidden transition-all duration-500 ease-in-out ${
                      isThisActive ? 'max-h-300 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="space-y-6">
                      {cap.description && (
                        <p
                          className={`text-base md:text-xl leading-relaxed ${fonts.body} ${
                            isLightMode ? 'text-zinc-700' : 'text-zinc-300'
                          } ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}
                        >
                          {cap.description}
                        </p>
                      )}

                      {cleanBullets.length > 0 && (
                        <ul className={`space-y-3 pt-4 border-t ${isLightMode ? 'border-zinc-300' : 'border-zinc-800'}`}>
                          {cleanBullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-3">
                              {getThemeBullet(themeStyle, brandTextColor)}
                              <span className={`text-sm md:text-base ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>
                                {b}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="pt-2">
                        <CapabilityActionButtons
                          capability={cap}
                          hasDetails={showDetails}
                          detailsLabel={detailsLabel}
                          ctaLabel={ctaLabel}
                          brandTextColor={brandTextColor}
                          activeSecondary={activeSecondary}
                          isLightMode={isLightMode}
                          isSharp={isSharp}
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
      </div>

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