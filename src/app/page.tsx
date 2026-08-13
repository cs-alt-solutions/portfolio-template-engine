// src/app/page.tsx
import React from 'react';
import LiveRoster from '@/components/storefronts/LiveRoster';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MarketplaceDirectory() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 relative overflow-hidden font-sans">
      
      {/* --- THE STATIC BACKGROUND LOGO (FIXED SCALING) --- */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/logo.png" 
          alt="Alternative Solutions Background"
          className="w-[80vw] md:w-[40vw] max-w-2xl object-contain grayscale mix-blend-screen opacity-10"
        />
      </div>

      {/* THE VIBE: Deep midnight canvas with warm ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-teal-500/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-amber-500/5 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 pt-32 pb-24">
        {/* Welcome Header */}
        <div className="text-center max-w-5xl mx-auto px-6 mb-20">
          
          {/* FIX: Used flex justify-center to guarantee perfect centering */}
          {/* Adjusted text sizing (text-4xl to 7xl) to accommodate the longer "Digital Storefronts" phrase */}
          <h1 className="flex justify-center text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight leading-none drop-shadow-[0_0_25px_rgba(34,211,238,0.15)] mb-6">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-400 pb-4 px-2">
              Digital Storefronts
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