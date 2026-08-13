// src/app/page.tsx
import React from 'react';
import LiveRoster from '@/components/storefronts/LiveRoster';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MarketplaceDirectory() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 relative overflow-hidden font-sans">
      
      {/* THE VIBE: Deep midnight canvas with warm ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-teal-500/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-amber-500/5 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 pt-32 pb-24">
        {/* Welcome Header */}
        <div className="text-center max-w-4xl mx-auto px-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Alternative Solutions <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-400 animate-text-gradient">
              Marketplace
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto">
            Explore live digital storefronts crafted by visionaries, makers, and local businesses. A sanctuary for independent creators—from holistic wellness guides to construction and candle making. Discover the authentic stories and services powering our community.
          </p>
        </div>

        {/* The Upgraded Live Roster Grid */}
        <LiveRoster />
      </div>
    </main>
  );
}