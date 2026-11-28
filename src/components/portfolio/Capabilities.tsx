/* src/components/portfolio/Capabilities.tsx */
'use client';

import React, { useState } from 'react';
import { THEME_REGISTRY } from '@/utils/themes';
import { CAPABILITY_DEFAULTS, FLOW_DEFAULTS, STOREFRONT_DEFAULTS } from '@/utils/glossary';
import {
  Capability,
  CapabilityOperationalTerm,
  GalleryItem,
} from './content-engine/types';
import { getFonts } from './content-engine/utils';
import CapabilityActionButtons from './content-engine/shared/CapabilityActionButtons';
import CapabilityActionModals from './content-engine/shared/CapabilityActionModals';
import CapabilityAddonsSection from './content-engine/shared/CapabilityAddonsSection';
import {
  getCapabilityPhotos,
  getCapabilityTerms,
  getSmartCtaLabel,
  getSmartDetailsLabel,
  hasCapabilityDetails,
} from './content-engine/shared/capabilityHelpers';

export type { Capability } from './content-engine/types';

interface CapabilitiesProps {
  heading?: string;
  items: (string | Capability)[];
  galleryItems?: GalleryItem[];
  operationalTerms?: CapabilityOperationalTerm[];
  themeStyle?: string;
  brandColor?: string;
  secondaryBrandColor?: string;
  businessName?: string;
  storefrontSlug?: string;
  contactEmail?: string;
}

export default function Capabilities({
  heading,
  items,
  galleryItems = [],
  operationalTerms = [],
  themeStyle = 'industrial',
  brandColor = 'brand-primary',
  secondaryBrandColor,
  businessName = FLOW_DEFAULTS.FALLBACK_CLIENT_NAME,
  storefrontSlug,
  contactEmail,
}: CapabilitiesProps) {
  const [detailsCap, setDetailsCap] = useState<Capability | null>(null);
  const [bookingCap, setBookingCap] = useState<Capability | null>(null);

  if (!items || items.length === 0) return null;

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const fonts = getFonts(themeStyle);
  const isLightMode = Boolean(theme.isLightMode);
  const isNoir = themeStyle === 'noir';
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const isSharp = shapeRadius === 'rounded-none';

  const subtleBorder = isLightMode
    ? 'border-zinc-900/10'
    : isNoir
      ? 'border-[#F3EFE6]/10'
      : 'border-white/10';

  const activeSecondary = secondaryBrandColor || brandColor;
  const brandTextColor = `text-${brandColor}`;
  const isBrutalist = themeStyle?.startsWith('neo');
  const isEditorial = themeStyle === 'editorial';

  const secAccent =
    isBrutalist || isEditorial
      ? isLightMode
        ? 'text-black'
        : 'text-white'
      : `text-${activeSecondary}`;

  const cardSurface =
    theme.surfaceStyle ||
    (isLightMode
      ? 'bg-white border border-zinc-200'
      : 'bg-zinc-900/60 border border-white/10');

  const badgeRadius = isSharp ? 'rounded-none' : isNoir ? 'rounded-sm' : 'rounded-full';
  const titleWeight = isNoir ? 'font-normal tracking-wide' : 'font-bold';
  const descTone = isLightMode ? 'text-zinc-600' : isNoir ? 'text-stone-300 font-light' : 'text-zinc-400';
  const bulletTone = isLightMode ? 'text-zinc-700' : isNoir ? 'text-stone-300 font-light' : 'text-zinc-300';

  const normalizedItems: Capability[] = items.map((item) =>
    typeof item === 'string' ? { title: item, description: '' } : item
  );

  const packages = normalizedItems.filter((item) => !item.isAlaCarte);
  const addons = normalizedItems.filter((item) => item.isAlaCarte);
  const safeTerms = (operationalTerms || []).filter((t) => t && t.title?.trim());

  return (
    <section className={`py-20 md:py-24 px-6 border-t ${subtleBorder} relative z-10 ${theme.pageBg || ''}`}>
      <div className="max-w-7xl mx-auto">
        {heading && (
          <div className="flex flex-col items-center text-center mb-14 md:mb-16">
            <h2 className={`${theme.accentText} ${secAccent} mb-4 flex items-center justify-center gap-3`}>
              <span className="w-2 h-2 rounded-full bg-current opacity-70" />
              {STOREFRONT_DEFAULTS.CAPABILITIES_HEADING || FLOW_DEFAULTS.CAPABILITIES_EYEBROW}
              <span className="w-2 h-2 rounded-full bg-current opacity-70" />
            </h2>
            <h3 className={`text-4xl md:text-5xl ${theme.primaryText}`}>{heading}</h3>
          </div>
        )}

        {packages.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {packages.map((item, idx) => {
              const capPhotos = getCapabilityPhotos(item.title, galleryItems);
              const capTerms = getCapabilityTerms(item.title, safeTerms);
              const showDetails = hasCapabilityDetails(item, capPhotos, capTerms);
              const detailsLabel = getSmartDetailsLabel(item, capPhotos, capTerms);
              const ctaLabel = getSmartCtaLabel(item, CAPABILITY_DEFAULTS.INQUIRE_BTN);
              const cleanBullets = (item.bullets || []).filter((b) => b && b.trim() !== '');
              const indexLabel = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

              return (
                <div
                  key={idx}
                  className={`w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] p-7 md:p-8 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-6 ${cardSurface} ${shapeRadius}`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-5">
                      <span
                        className={`text-xs font-mono opacity-50 px-2.5 py-1 border border-current ${
                          isSharp ? 'rounded-none' : 'rounded-sm'
                        } ${secAccent}`}
                      >
                        {indexLabel}
                      </span>

                      {item.price && (
                        <span
                          className={`px-3 py-1 ${badgeRadius} text-xs font-mono font-bold tracking-wider border border-current/20 bg-current/5 ${secAccent}`}
                        >
                          {item.price}
                        </span>
                      )}
                    </div>

                    <h4 className={`text-xl md:text-2xl mb-3 ${titleWeight} ${theme.primaryText}`}>
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className={`text-sm leading-relaxed ${descTone}`}>{item.description}</p>
                    )}

                    {cleanBullets.length > 0 && (
                      <ul className="mt-6 space-y-2.5 border-t border-current/10 pt-5">
                        {cleanBullets.map((bullet, bIdx) => (
                          <li key={bIdx} className={`text-xs flex items-start gap-2.5 ${bulletTone}`}>
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0 ${secAccent}`} />
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-current/10 mt-auto">
                    <CapabilityActionButtons
                      capability={item}
                      hasDetails={showDetails}
                      detailsLabel={detailsLabel}
                      ctaLabel={ctaLabel}
                      brandTextColor={brandTextColor}
                      activeSecondary={activeSecondary}
                      isLightMode={isLightMode}
                      isSharp={isSharp}
                      compact={true}
                      onOpenDetails={() => setDetailsCap(item)}
                      onInquire={() => setBookingCap(item)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <CapabilityAddonsSection
          items={addons}
          activeSecondary={activeSecondary}
          isLightMode={isLightMode}
          shapeRadius={shapeRadius}
          isSharp={isSharp}
          fonts={fonts}
        />
      </div>

      <CapabilityActionModals
        capabilities={packages}
        alaCarte={addons}
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
    </section>
  );
}