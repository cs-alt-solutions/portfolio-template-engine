// src/app/page.tsx
/* eslint-disable @next/next/no-img-element */
import { SITE_CONFIG, ABOUT_DATA, GALLERY_ITEMS } from '@/utils/glossary';
import AboutSection from '@/components/portfolio/AboutSection';
import GalleryGrid from '@/components/portfolio/GalleryGrid';
import Capabilities from '@/components/portfolio/Capabilities';

export default function StorefrontPage() {
  return (
    <main className="min-h-screen flex flex-col bg-zinc-950">
      
      {/* 1. HERO BLOCK: Optimized for visual impact */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        {/* The visual backdrop */}
        <div className="absolute inset-0 z-0">
          <img 
            src={SITE_CONFIG.heroImage} 
            alt={SITE_CONFIG.businessName}
            className="w-full h-full object-cover object-center animate-slow-pan"
          />
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px]" />
        </div>

        {/* Content Wrapper */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h2 className={`text-${SITE_CONFIG.brandColor}-500 font-bold tracking-[0.3em] uppercase text-sm mb-6`}>
              {SITE_CONFIG.businessName}
            </h2>
            <h1 className="text-5xl md:text-8xl font-extrabold text-white leading-[0.9] tracking-tighter mb-8">
              {SITE_CONFIG.tagline}
            </h1>
            <p className="text-xl text-zinc-300 mb-10 leading-relaxed font-light max-w-2xl">
              {SITE_CONFIG.subtext}
            </p>
            
            <button className={`bg-${SITE_CONFIG.brandColor}-500 hover:bg-${SITE_CONFIG.brandColor}-400 text-zinc-950 font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl`}>
              {SITE_CONFIG.primaryCTA}
            </button>
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
          
            ctaText: ABOUT_DATA.ctaText,
            brandColor: SITE_CONFIG.brandColor
          }} 
        />
        
        <Capabilities />
      </div>

      {/* 3. THE GALLERY ENGINE */}
      <div className="w-full bg-zinc-900 py-20">
        <div className="container mx-auto px-6">
          <GalleryGrid items={GALLERY_ITEMS} />
        </div>
      </div>

    </main>
  );
}