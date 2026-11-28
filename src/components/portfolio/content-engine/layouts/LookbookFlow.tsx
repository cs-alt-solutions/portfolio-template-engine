/* src/components/portfolio/content-engine/layouts/LookbookFlow.tsx */
'use client';

import React, { useState } from 'react';
import { Map } from 'lucide-react';
import { Capability, ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { LOOKBOOK_DEFAULTS } from '@/utils/glossary';
import GalleryGrid from '../../gallery/GalleryGrid';
import LookbookPackageCard from './lookbook/LookbookPackageCard';
import LookbookAddonsSection from './lookbook/LookbookAddonsSection';
import LookbookLogisticsModal from './lookbook/LookbookLogisticsModal';
import CapabilityActionModals from '../shared/CapabilityActionModals';
import {
  getCapabilityPhotos,
  getCapabilityTerms,
  getSmartCtaLabel,
  getSmartDetailsLabel,
  hasCapabilityDetails,
} from '../shared/capabilityHelpers';

export default function LookbookFlow({
  themeStyle,
  brandColor,
  secondaryBrandColor,
  isLightMode,
  capabilitiesHeading,
  galleryHeading,
  capabilities,
  galleryItems,
  storefrontSlug,
  businessName,
  contactEmail,
  heroImage,
  isHeroFixed,
  operationalTerms,
  industryTag,
}: ContentLayoutProps) {
  const [detailsCap, setDetailsCap] = useState<Capability | null>(null);
  const [bookingCap, setBookingCap] = useState<Capability | null>(null);
  const [isLogisticsOpen, setIsLogisticsOpen] = useState<boolean>(false);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const isSharp = shapeRadius === 'rounded-none';
  const sectionBg = theme.pageBg || (isLightMode ? 'bg-white' : 'bg-zinc-950');

  const packages = (capabilities || []).filter((c) => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter((c) => c.isAlaCarte);
  const safeOperationalTerms = (operationalTerms || []).filter((t) => t && t.title?.trim());
  const validGalleryItems = (galleryItems || []).filter((img) => img.isVisible !== false);
  const hasGallery = validGalleryItems.length > 0;

  const defaultBookingLabel =
    industryTag === 'Culinary' ? LOOKBOOK_DEFAULTS.BOOK_CULINARY_BTN : LOOKBOOK_DEFAULTS.BOOK_PACKAGE_BTN;

  const packageGridClass =
    packages.length === 1
      ? 'grid-cols-1 max-w-xl mx-auto'
      : packages.length === 2
        ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`w-full ${sectionBg} ${hasGallery ? 'pt-8 md:pt-12' : 'pt-20'} pb-28 relative z-10`}>
      {hasGallery && (
        <div className="mb-16">
          <GalleryGrid
            items={validGalleryItems}
            galleryHeading={galleryHeading || LOOKBOOK_DEFAULTS.GALLERY_HEADING}
            themeStyle={themeStyle}
            brandColor={brandColor}
            secondaryBrandColor={secondaryBrandColor}
            isLightMode={isLightMode}
            layout="structured"
            businessName={businessName}
          />
        </div>
      )}

      {hasGallery && packages.length > 0 && (
        isHeroFixed && heroImage ? (
          <div
            className="relative w-full h-[30vh] md:h-[40vh] border-y border-white/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] mb-20"
            style={{ clipPath: 'inset(0)' }}
          >
            <div
              className="fixed inset-0 w-full h-full bg-cover bg-center opacity-40 pointer-events-none"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto flex items-center justify-center mb-20 opacity-30">
            <div className={`w-full h-px bg-linear-to-r from-transparent via-${brandColor} to-transparent`} />
          </div>
        )
      )}

      <div className="max-w-7xl mx-auto px-6">
        {packages.length > 0 && (
          <div className="mb-20">
            <div className="mb-12 text-center">
              <h2 className={`text-4xl md:text-5xl lg:text-6xl tracking-tighter ${brandTextColor} ${fonts.heading}`}>
                {capabilitiesHeading || LOOKBOOK_DEFAULTS.COLLECTIONS_HEADING}
              </h2>
            </div>

            <div className={`grid ${packageGridClass} gap-8 md:gap-10`}>
              {packages.map((cap, i) => {
                const capPhotos = getCapabilityPhotos(cap.title, galleryItems);
                const capTerms = getCapabilityTerms(cap.title, safeOperationalTerms);
                const coverImage = cap.coverImage || (capPhotos.length > 0 ? capPhotos[0].url : null);
                const showDetails = hasCapabilityDetails(cap, capPhotos, capTerms);
                const detailsLabel = getSmartDetailsLabel(cap, capPhotos, capTerms);
                const bookingLabel = getSmartCtaLabel(cap, defaultBookingLabel);

                return (
                  <LookbookPackageCard
                    key={i}
                    capability={cap}
                    coverImage={coverImage}
                    hasDetails={showDetails}
                    detailsLabel={detailsLabel}
                    themeStyle={themeStyle}
                    brandTextColor={brandTextColor}
                    activeSecondary={activeSecondary}
                    isLightMode={isLightMode}
                    shapeRadius={shapeRadius}
                    isSharp={isSharp}
                    fonts={fonts}
                    bookingLabel={bookingLabel}
                    onOpenDetails={() => setDetailsCap(cap)}
                    onBook={() => setBookingCap(cap)}
                  />
                );
              })}
            </div>
          </div>
        )}

        <LookbookAddonsSection
          items={alaCarte}
          activeSecondary={activeSecondary}
          isLightMode={isLightMode}
          shapeRadius={shapeRadius}
          isSharp={isSharp}
          fonts={fonts}
        />

        {safeOperationalTerms.length > 0 && (
          <div className="mt-8 mb-16 flex justify-center">
            <button
              type="button"
              onClick={() => setIsLogisticsOpen(true)}
              className={`inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest border transition-all shadow-md hover:shadow-xl cursor-pointer ${
                isSharp ? 'rounded-none' : 'rounded-full'
              } ${
                isLightMode
                  ? 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {LOOKBOOK_DEFAULTS.LOGISTICS_BTN}
            </button>
          </div>
        )}
      </div>

      <LookbookLogisticsModal
        isOpen={isLogisticsOpen}
        onClose={() => setIsLogisticsOpen(false)}
        terms={safeOperationalTerms}
        brandTextColor={brandTextColor}
        isLightMode={isLightMode}
        shapeRadius={shapeRadius}
        isSharp={isSharp}
        fonts={fonts}
      />

      <CapabilityActionModals
        capabilities={packages}
        alaCarte={alaCarte}
        galleryItems={galleryItems}
        operationalTerms={safeOperationalTerms}
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
        ctaPrefix={LOOKBOOK_DEFAULTS.BOOK_CTA_PREFIX}
      />
    </div>
  );
}