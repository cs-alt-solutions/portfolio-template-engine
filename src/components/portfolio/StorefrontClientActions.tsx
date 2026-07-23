// src/components/portfolio/StorefrontClientActions.tsx
'use client';

import React, { useState } from 'react';
import UniversalLeadModal from '@/components/portfolio/UniversalLeadModal';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';

interface StorefrontClientActionsProps {
  store: {
    business_name?: string;
    primary_cta?: string; // 🚨 REPURPOSED: Now powers the lead catch headline!
    secondary_cta?: string; // Powers the button text
    [key: string]: unknown;
  };
  brandColor: string;
  isLightMode?: boolean;
}

export default function StorefrontClientActions({
  store,
  brandColor,
  isLightMode = false,
}: StorefrontClientActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCtaLabel, setActiveCtaLabel] = useState('');

  const handleOpenModal = (label: string) => {
    setActiveCtaLabel(label);
    setIsModalOpen(true);
  };

  // 🚨 DYNAMIC STRATEGY: Primary CTA is the headline, Secondary CTA is the button!
  const headlineText = store.primary_cta || "Let's Work Together";
  const buttonText = store.secondary_cta || STOREFRONT_DEFAULTS.SECONDARY_CTA || "Get in Touch";

  return (
    <>
      {/* 🚨 THE BOTTOM CTA BANNER: Slimmed down from py-24 to a sharp py-12 🚨 */}
      <section className="py-12 px-6 text-center border-t border-b border-white/10 relative z-20 bg-zinc-950/50">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white drop-shadow-sm">
            {headlineText}
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Connect directly with {store.business_name || 'our team'} today to discuss timelines, pricing, and your custom vision.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleOpenModal(buttonText)}
              className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-lg hover:scale-105 active:scale-95 bg-${brandColor} text-zinc-950`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </section>

      {/* 🚨 THE UNIVERSAL LEAD MODAL 🚨 */}
      <UniversalLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ctaLabel={activeCtaLabel}
        businessName={store.business_name || 'Our Team'}
        brandColor={brandColor}
        isLightMode={isLightMode}
      />
    </>
  );
}