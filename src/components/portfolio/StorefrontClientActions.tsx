// src/components/portfolio/StorefrontClientActions.tsx
'use client';

import React, { useState } from 'react';
import UniversalLeadModal from '@/components/portfolio/UniversalLeadModal';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';
import { getFonts } from './content-engine/utils';

interface StorefrontClientActionsProps {
  store: {
    business_name?: string;
    primary_cta?: string; 
    secondary_cta?: string; 
    [key: string]: unknown;
  };
  brandColor: string;
  isLightMode?: boolean;
  themeStyle?: string; // 🚨 ADDED: Directly controls font and shape rules!
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

  // 1. TYPOGRAPHY & SHAPE ENGINE
  const fonts = getFonts(themeStyle);
  const isSharpTheme = ['industrial', 'neo', 'cyberpunk', 'editorial'].includes(themeStyle);
  const isNeo = themeStyle === 'neo';
  const isCyber = themeStyle === 'cyberpunk';
  const isMidnight = themeStyle === 'midnight';

  // 2. DYNAMIC BANNER WRAPPER STYLES
  const getBannerStyles = () => {
    if (isNeo) return 'bg-white border-y-4 border-black text-black shadow-[0_-8px_0_0_rgba(0,0,0,1)]';
    if (isCyber) return 'bg-black/90 border-y border-white/20 text-white font-mono shadow-[0_0_30px_rgba(255,255,255,0.05)]';
    if (isMidnight) return 'bg-zinc-950/80 backdrop-blur-2xl border-y border-white/10 text-white shadow-2xl';
    if (isLightMode) return 'bg-zinc-100/95 border-y border-zinc-200 text-zinc-900 shadow-inner';
    return 'bg-zinc-900/90 border-y border-zinc-800 text-white shadow-2xl';
  };

  // 3. DYNAMIC BUTTON STYLES
  const getButtonStyles = () => {
    const radius = isSharpTheme ? 'rounded-none' : themeStyle === 'minimal' ? 'rounded-full' : 'rounded-xl';
    
    if (isNeo) {
      return `bg-white text-black border-4 border-black ${radius} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 font-black`;
    }
    if (isCyber) {
      return `bg-black text-white border border-current shadow-[0_0_15px_currentColor] hover:bg-white hover:text-black ${radius} font-mono font-bold`;
    }
    if (isLightMode) {
      return `bg-zinc-950 text-white border-2 border-zinc-950 hover:bg-zinc-800 hover:shadow-2xl ${radius} font-black`;
    }
    return `bg-white text-zinc-950 border-2 border-white hover:bg-zinc-200 shadow-[0_0_25px_rgba(255,255,255,0.2)] ${radius} font-black`;
  };

  return (
    <>
      <section className={`py-16 px-6 text-center relative z-20 transition-colors overflow-hidden ${getBannerStyles()}`}>
        {/* Ambient Brand Glow behind the button */}
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
              className={`group relative inline-flex items-center justify-center px-10 py-4 uppercase tracking-widest text-xs transition-all duration-300 ${getButtonStyles()}`}
            >
              <span>{buttonText}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 🚨 WIRE THEME STYLE STRAIGHT INTO THE MODAL 🚨 */}
      <UniversalLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ctaLabel={activeCtaLabel}
        businessName={store.business_name || 'Our Team'}
        brandColor={brandColor}
        isLightMode={isLightMode}
        themeStyle={themeStyle}
      />
    </>
  );
}