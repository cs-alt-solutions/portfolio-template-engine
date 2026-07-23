// src/app/page.tsx
'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { SITE_CONFIG, ABOUT_DATA, GALLERY_ITEMS } from '@/utils/glossary';
import AboutSection from '@/components/portfolio/AboutSection';
import GalleryGrid from '@/components/portfolio/GalleryGrid';
import Capabilities from '@/components/portfolio/Capabilities';
import UniversalLeadModal from '@/components/portfolio/UniversalLeadModal';

export default function StorefrontPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCtaLabel, setActiveCtaLabel] = useState('Get Started');

  const handleOpenModal = (label: string) => {
    setActiveCtaLabel(label);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-cyan-500/30 relative">
      
      {/* 1. HERO BLOCK: Optimized for visual impact */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        {/* The visual backdrop */}
        <div className="absolute inset-0 z-0">
          <img 
            src={SITE_CONFIG.heroImage} 
            alt={SITE_CONFIG.businessName || 'Hero Background'}
            className="w-full h-full object-cover object-center animate-slow-pan"
          />
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px]" />
        </div>

        {/* Content Wrapper */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h2 className={`text-${SITE_CONFIG.brandColor || 'cyan'}-500 font-bold tracking-[0.3em] uppercase text-sm mb-6`}>
              {SITE_CONFIG.businessName}
            </h2>
            <h1 className="text-5xl md:text-8xl font-extrabold text-white leading-[0.9] tracking-tighter mb-8">
              {SITE_CONFIG.tagline}
            </h1>
            <p className="text-xl text-zinc-300 mb-10 leading-relaxed font-light max-w-2xl">
              {SITE_CONFIG.subtext}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Exploratory CTA: Smooth scrolls to Gallery */}
              <a 
                href="#portfolio"
                className={`inline-block bg-${SITE_CONFIG.brandColor || 'cyan'}-500 hover:bg-${SITE_CONFIG.brandColor || 'cyan'}-400 text-zinc-950 font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl`}
              >
                {SITE_CONFIG.primaryCTA || 'View Portfolio'}
              </a>

              {/* Conversion CTA: Pops open the Universal Lead Modal */}
              {SITE_CONFIG.secondaryCTA && (
                <button 
                  onClick={() => handleOpenModal(SITE_CONFIG.secondaryCTA)}
                  className="bg-transparent border border-white/20 hover:border-white/50 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white/10"
                >
                  {SITE_CONFIG.secondaryCTA}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE TRUST BUILDER & CAPABILITIES */}
      <div className="container mx-auto px-6 py-20 space-y-20">
        <AboutSection 
          data={{
            heading: ABOUT_DATA.heading,
            bio: ABOUT_DATA.bio,
            imageUrl: ABOUT_DATA.imageUrl,
            brandColor: SITE_CONFIG.brandColor
          }} 
        />
        
        <Capabilities />
      </div>

      {/* 3. THE GALLERY ENGINE */}
      <div id="portfolio" className="w-full bg-zinc-900 py-20">
        <div className="container mx-auto px-6">
          <GalleryGrid items={GALLERY_ITEMS} />
        </div>
      </div>

      {/* 4. BOTTOM CONVERSION BANNER (Peak Intent Point) */}
      <section className="py-20 px-6 text-center border-t border-white/10 relative z-20 mt-12 bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Ready to elevate your project?
          </h2>
          <p className="text-base text-zinc-400 max-w-xl mx-auto">
            Connect directly with {SITE_CONFIG.businessName || 'our team'} today to discuss timelines, custom requirements, and project scope.
          </p>
          <div className="pt-4">
            <button
              onClick={() => handleOpenModal(SITE_CONFIG.secondaryCTA || 'Get in Touch')}
              className={`px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-xl hover:scale-105 active:scale-95 bg-${SITE_CONFIG.brandColor || 'cyan'}-500 text-zinc-950`}
            >
              {SITE_CONFIG.secondaryCTA || 'Get in Touch'}
            </button>
          </div>
        </div>
      </section>

      {/* 5. UNIVERSAL LEAD MODAL */}
      <UniversalLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ctaLabel={activeCtaLabel}
        businessName={SITE_CONFIG.businessName || 'Our Team'}
        brandColor={SITE_CONFIG.brandColor || '#06b6d4'}
      />

      {/* 🚨 6. POWERED BY ALTERNATIVE SOLUTIONS BAR 🚨 */}
      <footer className="w-full py-8 px-6 border-t border-white/10 bg-zinc-950 text-xs font-mono text-zinc-500 uppercase tracking-widest flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20">
        <div>
          © {new Date().getFullYear()} {SITE_CONFIG.businessName || 'All Rights Reserved'}.
        </div>
        <div className="flex items-center gap-1.5">
          <span>Powered by</span>
          <a 
            href="https://alternativesolutions.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-cyan-400 font-bold transition-colors underline decoration-cyan-500/50 underline-offset-4"
          >
            Alternative Solutions
          </a>
        </div>
      </footer>

    </main>
  );
}