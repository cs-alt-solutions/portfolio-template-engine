// src/components/portfolio/StorefrontClientActions.tsx
'use client';

import React, { useState } from 'react';
import UniversalLeadModal from '@/components/portfolio/UniversalLeadModal';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';
import { getFonts } from './content-engine/utils';
import { THEME_REGISTRY } from '@/utils/themes';

interface StorefrontClientActionsProps {
  store: {
    slug?: string;
    contact_email?: string;
    business_name?: string;
    primary_cta?: string;
    secondary_cta?: string;
    lead_inquiry_types?: string[];
    [key: string]: unknown;
  };
  brandColor: string;
  secondaryBrandColor?: string;
  isLightMode?: boolean;
  themeStyle?: string;
}

export default function StorefrontClientActions({
  store,
  brandColor,
  secondaryBrandColor,
  isLightMode = false,
  themeStyle = 'industrial',
}: StorefrontClientActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCtaLabel, setActiveCtaLabel] = useState('');

  const handleOpenModal = (label: string) => {
    setActiveCtaLabel(label);
    setIsModalOpen(true);
  };

  const headlineText = store.primary_cta || "Let's Work Together";
  const buttonText = store.secondary_cta || STOREFRONT_DEFAULTS.SECONDARY_CTA || "Get in Touch";

  const activeSecondary = secondaryBrandColor || brandColor;
  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];

  return (
    <>
      <section
        id="contact"
        className={`py-16 md:py-20 px-6 text-center relative z-20 transition-colors overflow-hidden border-y border-x-0 ${theme.surfaceStyle}`}
      >
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-${activeSecondary}/15 rounded-full blur-3xl pointer-events-none`}
        />

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className={`text-3xl md:text-5xl drop-shadow-sm ${fonts.heading}`}>
            {headlineText}
          </h2>
          <p className={`text-xs md:text-sm max-w-lg mx-auto leading-relaxed ${fonts.body} ${theme.mutedText}`}>
            Connect directly with {store.business_name || 'our team'} today to discuss timelines, pricing, and your custom vision.
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => handleOpenModal(buttonText)}
              className={`group relative inline-flex items-center justify-center px-10 py-4 text-xs transition-all duration-300 cursor-pointer bg-${activeSecondary} text-zinc-950 hover:brightness-110 shadow-xl ${theme.controlRadius} ${theme.uiLabel}`}
            >
              <span>{buttonText}</span>
            </button>
          </div>
        </div>
      </section>

      <UniversalLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ctaLabel={activeCtaLabel}
        businessName={store.business_name || 'Our Team'}
        storefrontSlug={store.slug || 'demo-storefront'}
        contactEmail={store.contact_email || ''}
        brandColor={brandColor}
        isLightMode={isLightMode}
        themeStyle={themeStyle}
        inquiryOptions={store.lead_inquiry_types}
      />
    </>
  );
}