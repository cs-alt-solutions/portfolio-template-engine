// src/components/portfolio/StorefrontClientActions.tsx
'use client';

import React, { useState } from 'react';
import UniversalLeadModal from '@/components/portfolio/UniversalLeadModal';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';

interface StorefrontClientActionsProps {
  store: {
    business_name?: string;
    primary_cta?: string; 
    secondary_cta?: string; 
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

  const headlineText = store.primary_cta || "Let's Work Together";
  const buttonText = store.secondary_cta || STOREFRONT_DEFAULTS.SECONDARY_CTA || "Get in Touch";

  return (
    <>
      {/* 🚨 THE HIGH-CONTRAST CONVERSION BANNER 🚨 */}
      <section className={`py-16 px-6 text-center border-t border-b relative z-20 transition-colors overflow-hidden ${
        isLightMode 
          ? 'bg-zinc-100/95 border-zinc-200 text-zinc-900 shadow-inner' 
          : 'bg-zinc-900/90 border-zinc-800 text-white shadow-2xl'
      }`}>
        
        {/* Ambient Brand Glow behind the button so their color still shines! */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-${brandColor || 'cyan-500'}/15 rounded-full blur-3xl pointer-events-none`} />

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-sm">
            {headlineText}
          </h2>
          <p className={`text-xs md:text-sm max-w-lg mx-auto leading-relaxed ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Connect directly with {store.business_name || 'our team'} today to discuss timelines, pricing, and your custom vision.
          </p>
          
          <div className="pt-4">
            {/* 🚨 THE INVERTED PILL: Guaranteed 100% contrast against any background 🚨 */}
            <button
              onClick={() => handleOpenModal(buttonText)}
              className={`group relative inline-flex items-center justify-center px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 border-2 ${
                isLightMode
                  ? 'bg-zinc-950 text-white border-zinc-950 hover:bg-zinc-800 hover:shadow-2xl'
                  : 'bg-white text-zinc-950 border-white hover:bg-zinc-200 shadow-[0_0_25px_rgba(255,255,255,0.2)]'
              }`}
            >
              <span>{buttonText}</span>
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