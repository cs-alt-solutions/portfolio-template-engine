/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/StickyScrollFlow.tsx */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';
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

export default function StickyScrollFlow({
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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [detailsCap, setDetailsCap] = useState<Capability | null>(null);
  const [bookingCap, setBookingCap] = useState<Capability | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const isSharp = shapeRadius === 'rounded-none';
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;

  const packages = (capabilities || []).filter((c) => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter((c) => c.isAlaCarte);
  const safeTerms = (operationalTerms || []).filter((t) => t && t.title?.trim());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px' }
    );

    const elements = document.querySelectorAll('.scroll-spy-section');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [packages.length]);

  if (packages.length === 0 && alaCarte.length === 0) return null;

  const safeIndex = packages.length > 0 ? Math.min(activeIndex, packages.length - 1) : 0;
  const activeService = packages[safeIndex];
  const activePhotos = activeService ? getCapabilityPhotos(activeService.title, galleryItems) : [];
  const activeTerms = activeService ? getCapabilityTerms(activeService.title, safeTerms) : [];
  const activeHasDetails = activeService ? hasCapabilityDetails(activeService, activePhotos, activeTerms) : false;
  const displayImage = activeService?.coverImage || activePhotos[0]?.url || null;
  const activeFp = activePhotos[0]?.focalPoint || { x: 50, y: 50 };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 relative">
      <div className="text-center md:text-left mb-14 lg:mb-20">
        <h2 className={`text-4xl md:text-6xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
          {capabilitiesHeading || FLOW_DEFAULTS.STICKY_HEADING}
        </h2>
        <div className={`w-24 h-1.5 bg-${brandColor} mt-5 ${isSharp ? 'rounded-none' : 'rounded-full'} mx-auto md:mx-0`} />
      </div>

      {packages.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative">
          {/* LEFT COLUMN: Scrolling Offerings */}
          <div className="lg:col-span-6 space-y-24 md:space-y-32 pb-16 lg:pb-28">
            {packages.map((cap, i) => {
              const isActive = safeIndex === i;
              const capPhotos = getCapabilityPhotos(cap.title, galleryItems);
              const capTerms = getCapabilityTerms(cap.title, safeTerms);
              const showDetails = hasCapabilityDetails(cap, capPhotos, capTerms);
              const detailsLabel = getSmartDetailsLabel(cap, capPhotos, capTerms);
              const ctaLabel = getSmartCtaLabel(cap, CAPABILITY_DEFAULTS.INQUIRE_BTN);
              const cleanBullets = (cap.bullets || []).filter((b) => b && b.trim() !== '');

              return (
                <div
                  key={i}
                  data-index={i}
                  onClick={() => setActiveIndex(i)}
                  className={`scroll-spy-section transition-all duration-500 ${
                    isActive ? 'opacity-100' : 'opacity-45 hover:opacity-80'
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
                    <h3 className={`text-3xl md:text-4xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
                      {cap.title}
                    </h3>
                    {cap.price && (
                      <span className={`text-xl font-black font-mono tabular-nums ${brandTextColor}`}>
                        {cap.price}
                      </span>
                    )}
                  </div>

                  {cap.description && (
                    <p
                      className={`text-base md:text-lg leading-relaxed mb-6 ${fonts.body} ${
                        isLightMode ? 'text-zinc-600' : 'text-zinc-400'
                      } ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}
                    >
                      {cap.description}
                    </p>
                  )}

                  {cleanBullets.length > 0 && (
                    <ul className="space-y-3 mb-7">
                      {cleanBullets.map((b, bIdx) => (
                        <li
                          key={bIdx}
                          className={`flex items-start gap-3.5 p-3.5 border ${
                            isSharp ? 'rounded-none' : 'rounded-xl'
                          } ${isLightMode ? 'bg-black/3 border-zinc-200/70' : 'bg-white/5 border-white/10'}`}
                        >
                          {getThemeBullet(themeStyle, brandTextColor)}
                          <span className={`text-sm md:text-base ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

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
              );
            })}
          </div>

          {/* RIGHT COLUMN: Sticky Crossfading Frame */}
          <div className="hidden lg:block lg:col-span-6 relative">
            <div
              onClick={() => activeService && activeHasDetails && setDetailsCap(activeService)}
              className={`sticky top-28 w-full aspect-4/5 ${shapeRadius} overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 transition-all duration-500 ${
                activeHasDetails ? 'cursor-pointer group' : ''
              }`}
            >
              <div className={`absolute inset-0 bg-${brandColor} opacity-10 mix-blend-color`} />

              {displayImage ? (
                <img
                  key={displayImage}
                  src={displayImage}
                  alt={activeService?.title || FLOW_DEFAULTS.STICKY_HEADING}
                  style={{ objectPosition: `${activeFp.x}% ${activeFp.y}%` }}
                  className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 animate-in fade-in duration-500">
                  <ImageIcon size={48} className="mb-4 opacity-50" />
                  <span className={`text-xs uppercase tracking-widest font-bold ${fonts.heading} opacity-50`}>
                    {FLOW_DEFAULTS.STICKY_NO_MEDIA}
                  </span>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6">
                <div
                  className={`bg-black/65 backdrop-blur-md border border-white/20 p-4 shadow-xl flex items-center justify-between gap-3 ${
                    isSharp ? 'rounded-none' : 'rounded-xl'
                  }`}
                >
                  <span className={`text-xs font-bold uppercase tracking-widest text-white truncate ${fonts.heading}`}>
                    {activeService?.title}
                  </span>
                  <span className={`w-2 h-2 rounded-full bg-${brandColor} animate-pulse shrink-0`} />
                </div>
              </div>
            </div>
          </div>
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