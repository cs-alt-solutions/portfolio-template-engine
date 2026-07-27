// src/components/portfolio/StorefrontClientActions.tsx
'use client';

import React, { useState } from 'react';
import UniversalLeadModal from '@/components/portfolio/UniversalLeadModal';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';
import { getFonts } from './content-engine/utils';

interface StorefrontClientActionsProps {
  store: {
    slug?: string;
    contact_email?: string;
    business_name?: string;
    primary_cta?: string; 
    secondary_cta?: string; 
    [key: string]: unknown;
  };
  brandColor: string;
  isLightMode?: boolean;
  themeStyle?: string;
}

export default function StorefrontClientActions({
  store,
  brandColor,
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

  const fonts = getFonts(themeStyle);
  const isNeo = themeStyle === 'neo';
  const isCyber = themeStyle === 'cyberpunk';
  const isMidnight = themeStyle === 'midnight';

  const getBannerStyles = () => {
    if (themeStyle === 'elegant') return 'bg-[#FAFAFA] border-y border-zinc-200 text-zinc-900 shadow-inner';
    if (isNeo) return 'bg-white border-y-4 border-black text-black shadow-[0_-8px_0_0_rgba(0,0,0,1)]';
    if (isCyber) return 'bg-black/90 border-y border-white/20 text-white font-mono shadow-[0_0_30px_rgba(255,255,255,0.05)]';
    if (isMidnight) return 'bg-zinc-950/80 backdrop-blur-2xl border-y border-white/10 text-white shadow-2xl';
    if (isLightMode) return 'bg-zinc-100/95 border-y border-zinc-200 text-zinc-900 shadow-inner';
    return 'bg-zinc-900/90 border-y border-zinc-800 text-white shadow-2xl';
  };

  const getButtonStyles = () => {
    if (themeStyle === 'elegant') {
      return 'bg-zinc-950 text-white border border-zinc-800 hover:bg-zinc-800 rounded-sm font-serif tracking-widest shadow-lg';
    }
    if (themeStyle === 'organic') {
      return 'bg-[#2C3B2D] text-white hover:bg-[#3d523e] rounded-full font-serif tracking-wide shadow-md';
    }
    if (themeStyle === 'editorial') {
      return 'bg-black text-white border-2 border-black hover:bg-zinc-800 rounded-none font-sans font-black tracking-[0.2em]';
    }
    if (isNeo) {
      return 'bg-white text-black border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 font-black';
    }
    if (isCyber) {
      return 'bg-black text-white border border-current shadow-[0_0_15px_currentColor] hover:bg-white hover:text-black rounded-none font-mono font-bold';
    }
    if (isLightMode) {
      return 'bg-zinc-950 text-white border-2 border-zinc-950 hover:bg-zinc-800 hover:shadow-2xl rounded-xl font-black';
    }
    return 'bg-white text-zinc-950 border-2 border-white hover:bg-zinc-200 shadow-[0_0_25px_rgba(255,255,255,0.2)] rounded-xl font-black';
  };

  return (
    <>
      <section id="contact" className={`py-16 px-6 text-center relative z-20 transition-colors overflow-hidden ${getBannerStyles()}`}>
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-${brandColor}/15 rounded-full blur-3xl pointer-events-none`} />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className={`text-3xl md:text-5xl tracking-tight drop-shadow-sm ${fonts.heading}`}>
            {headlineText}
          </h2>
          <p className={`text-xs md:text-sm max-w-lg mx-auto leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Connect directly with {store.business_name || 'our team'} today to discuss timelines, pricing, and your custom vision.
          </p>
          
          <div className="pt-4">
            <button
              onClick={() => handleOpenModal(buttonText)}
              className={`group relative inline-flex items-center justify-center px-10 py-4 uppercase text-xs transition-all duration-300 ${getButtonStyles()}`}
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
      />
    </>
  );
}