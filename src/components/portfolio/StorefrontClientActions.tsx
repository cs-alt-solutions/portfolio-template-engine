// src/app/[slug]/StorefrontClientActions.tsx
'use client';

import React, { useState } from 'react';
import UniversalLeadModal from '@/components/portfolio/UniversalLeadModal';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';

interface StorefrontClientActionsProps {
  store: {
    business_name?: string;
    secondary_cta?: string;
    [key: string]: unknown; // Safely accommodates additional Supabase row fields
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

  const buttonText = store.secondary_cta || STOREFRONT_DEFAULTS.SECONDARY_CTA;

  return (
    <>
      {/* 🚨 THE BOTTOM CTA BANNER (PEAK CONVERSION POINT) 🚨 */}
      <section className="py-24 px-6 text-center border-t border-white/10 relative z-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Ready to elevate your project?
          </h2>
          <p className="text-sm md:text-base opacity-70 max-w-xl mx-auto">
            Connect directly with {store.business_name || 'our team'} today to discuss timelines, pricing, and your custom vision.
          </p>
          <div className="pt-4">
            <button
              onClick={() => handleOpenModal(buttonText)}
              className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl hover:scale-105 active:scale-95 bg-${brandColor} text-zinc-950`}
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