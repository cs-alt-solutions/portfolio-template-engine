/* src/components/portfolio/content-engine/layouts/AccordionFlow.tsx */
'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Capability, ContentLayoutProps } from '../types';
import { getFonts, getThemeBullet } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { CAPABILITY_DEFAULTS, FLOW_DEFAULTS } from '@/utils/glossary';
import GalleryGrid from '../../gallery/GalleryGrid';
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

export default function AccordionFlow({
  themeStyle,
  brandColor,
  secondaryBrandColor,
  isLightMode,
  capabilitiesHeading,
  galleryHeading,
  capabilities,
  galleryItems,
  operationalTerms,
  businessName,
  storefrontSlug,
  contactEmail,
}: ContentLayoutProps) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [detailsCap, setDetailsCap] = useState<Capability | null>(null);
  const [bookingCap, setBookingCap] = useState<Capability | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const isSharp = shapeRadius === 'rounded-none';
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;

  const packages = (capabilities || []).filter((c) => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter((c) => c.isAlaCarte);
  const safeTerms = (operationalTerms || []).filter((t) => t && t.title?.trim());
  const validGallery = (galleryItems || []).filter((img) => img.isVisible !== false && img.imageUrl);

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-24 relative">
      <div className="mb-14 md:mb-18 md:text-center">
        <h2 className={`text-4xl md:text-6xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
          {capabilitiesHeading || FLOW_DEFAULTS.ACCORDION_HEADING}
        </h2>
        <div className={`w-28 h-1.5 bg-${brandColor} mt-6 md:mx-auto ${isSharp ? 'rounded-none' : 'rounded-full'}`} />
      </div>

      {packages.length > 0 && (
        <div className="space-y-2 mb-16">
          {packages.map((cap, i) => {
            const isOpen = openAccordion === i;
            const capPhotos = getCapabilityPhotos(cap.title, galleryItems);
            const capTerms = getCapabilityTerms(cap.title, safeTerms);
            const showDetails = hasCapabilityDetails(cap, capPhotos, capTerms);
            const detailsLabel = getSmartDetailsLabel(cap, capPhotos, capTerms);
            const ctaLabel = getSmartCtaLabel(cap, CAPABILITY_DEFAULTS.INQUIRE_BTN);
            const cleanBullets = (cap.bullets || []).filter((b) => b && b.trim() !== '');

            return (
              <div
                key={i}
                className={`border-b-2 transition-all duration-300 ${
                  isLightMode ? 'border-zinc-200' : 'border-zinc-800'
                } ${isOpen ? `border-${brandColor} ${isLightMode ? 'bg-black/3' : 'bg-white/5'} ${isSharp ? 'rounded-none' : 'rounded-t-2xl'}` : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenAccordion(isOpen ? null : i)}
                  className="w-full py-7 px-4 flex items-center justify-between gap-4 text-left group outline-none cursor-pointer"
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 min-w-0">
                    <h3
                      className={`text-2xl md:text-4xl transition-colors ${fonts.heading} ${
                        isOpen
                          ? brandTextColor
                          : isLightMode
                            ? 'text-zinc-800 group-hover:text-black'
                            : 'text-zinc-100 group-hover:text-white'
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
                    className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isOpen
                        ? `border-${brandColor} bg-${brandColor}/10 ${brandTextColor} rotate-45`
                        : isLightMode
                          ? 'border-zinc-300 text-zinc-400 group-hover:border-zinc-500 group-hover:text-zinc-600'
                          : 'border-zinc-700 text-zinc-500 group-hover:border-zinc-500 group-hover:text-white'
                    }`}
                  >
                    <Plus size={20} strokeWidth={isOpen ? 3 : 2} />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out px-4 md:px-8 ${
                    isOpen ? 'max-h-[2000px] opacity-100 mb-8' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div
                    className={`pt-2 pb-2 border-l-2 ${
                      isOpen ? `border-${brandColor}/40` : 'border-transparent'
                    } pl-4 md:pl-8 space-y-6`}
                  >
                    {cap.description && (
                      <p
                        className={`text-base md:text-xl leading-relaxed whitespace-pre-wrap ${fonts.body} ${
                          isLightMode ? 'text-zinc-600' : 'text-zinc-300'
                        } ${['elegant', 'organic', 'editorial'].includes(themeStyle) ? 'italic' : ''}`}
                      >
                        {cap.description}
                      </p>
                    )}

                    {cleanBullets.length > 0 && (
                      <ul className={`space-y-3 ${fonts.body}`}>
                        {cleanBullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            className={`flex items-start gap-3.5 p-3.5 transition-colors ${
                              isSharp ? 'rounded-none' : 'rounded-xl'
                            } ${isLightMode ? 'hover:bg-black/5' : 'hover:bg-white/5'}`}
                          >
                            {getThemeBullet(themeStyle, brandTextColor)}
                            <span className={`text-base md:text-lg leading-relaxed ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>
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

      {validGallery.length > 0 && (
        <div className="mt-16 pt-12 border-t border-current/10">
          <GalleryGrid
            items={validGallery}
            galleryHeading={galleryHeading}
            themeStyle={themeStyle}
            brandColor={brandColor}
            secondaryBrandColor={secondaryBrandColor}
            isLightMode={isLightMode}
            businessName={businessName}
          />
        </div>
      )}

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