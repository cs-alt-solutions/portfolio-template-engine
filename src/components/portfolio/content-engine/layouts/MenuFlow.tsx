/* src/components/portfolio/content-engine/layouts/MenuFlow.tsx */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Capability, ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { CAPABILITY_DEFAULTS, MENU_DEFAULTS } from '@/utils/glossary';
import MenuFlipCard from './menu/MenuFlipCard';
import { buildUnifiedMenuItems, slugifyMenuCategory } from './menu/menuHelpers';
import CapabilityActionButtons from '../shared/CapabilityActionButtons';
import CapabilityActionModals from '../shared/CapabilityActionModals';
import CapabilityAddonsSection from '../shared/CapabilityAddonsSection';
import {
  getCapabilityTerms,
  getSmartCtaLabel,
  getSmartDetailsLabel,
  getValidCapabilityFaqs,
  resolveCapabilityBookingLink,
} from '../shared/capabilityHelpers';

export default function MenuFlow({
  themeStyle,
  brandColor,
  secondaryBrandColor,
  isLightMode,
  capabilitiesHeading,
  capabilities,
  galleryItems,
  orderingUrl,
  operationalTerms,
  businessName,
  storefrontSlug,
  contactEmail,
}: ContentLayoutProps) {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [detailsCap, setDetailsCap] = useState<Capability | null>(null);
  const [bookingCap, setBookingCap] = useState<Capability | null>(null);

  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const isSharp = shapeRadius === 'rounded-none';
  const activeSecondaryColor = secondaryBrandColor || brandColor;

  const menuSections = useMemo(
    () => (capabilities || []).filter((c) => !c.isAlaCarte),
    [capabilities]
  );
  const alaCarte = useMemo(
    () => (capabilities || []).filter((c) => c.isAlaCarte),
    [capabilities]
  );
  const safeTerms = useMemo(
    () => (operationalTerms || []).filter((t) => t && t.title?.trim()),
    [operationalTerms]
  );
  const showRawWarning = (galleryItems || []).some(
    (img) => img.isVisible !== false && img.isRaw
  );

  useEffect(() => {
    if (menuSections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCategory(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    menuSections.forEach((cap) => {
      const el = document.getElementById(`category-${slugifyMenuCategory(cap.title)}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [menuSections]);

  if (menuSections.length === 0 && alaCarte.length === 0) return null;

  const scrollToCategory = (title: string) => {
    const el = document.getElementById(`category-${slugifyMenuCategory(title)}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative">
      <div className="text-center mb-8 md:mb-12">
        <h2 className={`text-4xl sm:text-5xl md:text-7xl mb-4 md:mb-6 ${brandTextColor} ${fonts.heading} drop-shadow-md`}>
          {capabilitiesHeading || MENU_DEFAULTS.HEADING}
        </h2>
        <div className={`w-24 h-1.5 mx-auto bg-${brandColor} ${isSharp ? 'rounded-none' : 'rounded-full'}`} />
      </div>

      {/* WRAPPING CATEGORY BAR + PINNED ORDER ONLINE */}
      <div className="sticky top-4 z-40 w-full flex justify-center mb-12 md:mb-16 pointer-events-none">
        <div
          className={`pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 ${
            isSharp ? 'rounded-none' : 'rounded-2xl sm:rounded-3xl'
          } backdrop-blur-2xl border shadow-2xl max-w-5xl ${
            isLightMode ? 'bg-white/90 border-zinc-200' : 'bg-zinc-950/90 border-zinc-800'
          }`}
        >
          {menuSections.map((section) => {
            const catId = `category-${slugifyMenuCategory(section.title)}`;
            const isActive = activeCategory === catId;

            return (
              <button
                key={section.title}
                type="button"
                onClick={() => scrollToCategory(section.title)}
                className={`whitespace-nowrap px-3.5 py-2 sm:px-4 sm:py-2 ${
                  isSharp ? 'rounded-none' : 'rounded-full'
                } text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `bg-${brandColor} text-zinc-950 shadow-lg scale-105`
                    : isLightMode
                      ? 'bg-zinc-100/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/80'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {section.tabLabel?.trim() || section.title}
              </button>
            );
          })}

          {orderingUrl && (
            <a
              href={orderingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2 ${
                isSharp ? 'rounded-none' : 'rounded-full'
              } text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 bg-${activeSecondaryColor} text-zinc-950 shadow-lg hover:scale-105 ml-1`}
            >
              {MENU_DEFAULTS.ORDER_ONLINE_BTN}
            </a>
          )}
        </div>
      </div>

      {/* MENU CATEGORIES */}
      <div className="flex flex-col gap-16 md:gap-24">
        {menuSections.map((section, i) => {
          const unifiedItems = buildUnifiedMenuItems(section, galleryItems || []);
          const sectionTerms = getCapabilityTerms(section.title, safeTerms);
          const sectionFaqs = getValidCapabilityFaqs(section);
          const hasSectionExtras = sectionTerms.length > 0 || sectionFaqs.length > 0;
          const hasInteractiveCta = Boolean(
            hasSectionExtras ||
              resolveCapabilityBookingLink(section) ||
              section.ctaLabel?.trim() ||
              (section.addons && section.addons.length > 0) ||
              (section.timeframeMode && section.timeframeMode !== 'off') ||
              section.askTimeframe
          );

          if (unifiedItems.length === 0 && !hasInteractiveCta) return null;

          return (
            <div
              key={`menu-${i}`}
              id={`category-${slugifyMenuCategory(section.title)}`}
              className="flex flex-col relative w-full scroll-mt-36"
            >
              <div
                className={`flex flex-col items-center text-center border-b pb-6 mb-8 ${
                  isLightMode ? 'border-zinc-200' : 'border-zinc-800'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-2">
                  <h3 className={`text-3xl sm:text-4xl md:text-5xl ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'} ${fonts.heading}`}>
                    {section.title}
                  </h3>

                  {section.price && (
                    <span
                      className={`px-3 py-1 ${
                        isSharp ? 'rounded-none' : 'rounded-full'
                      } text-[10px] sm:text-xs font-black uppercase tracking-widest border bg-${brandColor}/10 text-${brandColor} border-${brandColor}/20`}
                    >
                      {section.price}
                    </span>
                  )}
                </div>

                {section.description && (
                  <p
                    className={`text-sm md:text-base max-w-2xl opacity-80 leading-relaxed ${fonts.body} ${
                      isLightMode ? 'text-zinc-700' : 'text-zinc-400'
                    } ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}
                  >
                    {section.description}
                  </p>
                )}

                {hasInteractiveCta && (
                  <div className="mt-4">
                    <CapabilityActionButtons
                      capability={section}
                      hasDetails={hasSectionExtras}
                      detailsLabel={getSmartDetailsLabel(section, [], sectionTerms)}
                      ctaLabel={getSmartCtaLabel(section, CAPABILITY_DEFAULTS.INQUIRE_BTN)}
                      brandTextColor={brandTextColor}
                      activeSecondary={activeSecondaryColor}
                      isLightMode={isLightMode}
                      isSharp={isSharp}
                      compact={true}
                      onOpenDetails={() => setDetailsCap(section)}
                      onInquire={() => setBookingCap(section)}
                    />
                  </div>
                )}
              </div>

              {unifiedItems.length > 0 && (
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {unifiedItems.map((item) => (
                    <div key={item.id} className="w-full h-full">
                      <MenuFlipCard
                        item={item}
                        isLightMode={isLightMode}
                        fonts={fonts}
                        brandColor={brandColor}
                        secondaryBrandColor={activeSecondaryColor}
                        brandTextColor={brandTextColor}
                        themeRadius={shapeRadius}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CapabilityAddonsSection
        items={alaCarte}
        activeSecondary={activeSecondaryColor}
        isLightMode={isLightMode}
        shapeRadius={shapeRadius}
        isSharp={isSharp}
        fonts={fonts}
      />

      {showRawWarning && (
        <div className="mt-16 md:mt-24 pt-10 border-t border-zinc-800/40 text-center px-4">
          <p className="text-[10px] md:text-xs uppercase tracking-widest max-w-3xl mx-auto leading-relaxed text-zinc-500">
            <span className="text-rose-500 font-bold text-sm mr-1">*</span>
            {MENU_DEFAULTS.RAW_WARNING_TEXT}
          </p>
        </div>
      )}

      <CapabilityActionModals
        capabilities={menuSections}
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