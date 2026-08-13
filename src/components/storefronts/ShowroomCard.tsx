// src/components/storefronts/ShowroomCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { StorefrontData } from './LiveRoster';

export default function ShowroomCard({ site }: { site: StorefrontData }) {
  // Graceful fallbacks for the UI
  const brandColor = (site.brand_color as string) || '#06b6d4'; // Defaults to cyan
  const hasLogo = site.brand_logo && (site.brand_logo as string).trim() !== '';
  const businessName = site.business_name || 'Unnamed Project';
  const tagline = (site.tagline as string) || 'Explore this custom digital storefront.';
  
  // Clean offline state handling
  const isOffline = site.status === 'MAINTENANCE' || site.status === 'HIDDEN';

  // Determine routing based on domain setup
  const targetUrl = site.custom_domain 
    ? `https://${site.custom_domain}` 
    : `/${site.slug}`;

  // If it's a custom domain, we want to open it in a new tab so they don't lose the directory
  const linkProps = site.custom_domain ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : {};

  return (
    <Link 
      href={targetUrl}
      {...linkProps}
      className={`group relative block w-full transition-all duration-500 hover:-translate-y-2 ${isOffline ? 'opacity-50 grayscale' : ''}`}
      style={{ 
        // We safely pass the dynamic hex color to our CSS variable
        '--brand-color': brandColor 
      } as React.CSSProperties}
    >
      {/* 🟢 THE OUTER NEON EDGE GLOW */}
      {/* This sits absolutely behind the card (-inset-0.5 makes it slightly larger) and blurs outward on hover */}
      <div 
        className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-60 blur-lg transition-all duration-500"
        style={{ backgroundColor: 'var(--brand-color)' }}
      />

      {/* 🟢 THE ACTUAL CARD CONTAINER (Sits on top of the glow) */}
      <div className="relative z-10 flex flex-col h-full w-full rounded-3xl overflow-hidden border border-white/5 bg-black/60 backdrop-blur-xl shadow-2xl">

        {/* TOP HALF: The Brand Showcase */}
        <div className="relative h-64 w-full bg-zinc-950/80 flex items-center justify-center overflow-hidden border-b border-white/5">
          
          {/* Subtle top-down gradient wash (Replaces the weird centered blob) */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `linear-gradient(to bottom, var(--brand-color), transparent)` }}
          />

          {/* Logo or Fallback */}
          {hasLogo ? (
            <div className="relative w-3/4 h-3/4 z-10 transition-transform duration-700 group-hover:scale-110">
              <Image 
                src={site.brand_logo as string} 
                alt={businessName} 
                fill 
                className="object-contain drop-shadow-2xl"
              />
            </div>
          ) : (
            <h2 className="text-7xl font-black tracking-tighter text-zinc-800 group-hover:text-zinc-600 transition-colors z-10">
              {businessName.charAt(0).toUpperCase()}
            </h2>
          )}
        </div>

        {/* BOTTOM HALF: The Details & Pulse */}
        <div className="p-6 relative z-10 flex flex-col grow bg-black/20 group-hover:bg-black/40 transition-colors duration-500">
          
          {/* Header & Pulse */}
          <div className="flex items-start justify-between mb-3 gap-4">
            <div className="flex items-center gap-3">
              {/* The Live Blinking Indicator */}
              {!isOffline && (
                <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
                  <span 
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: 'var(--brand-color)' }}
                  />
                  <span 
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{ backgroundColor: 'var(--brand-color)' }}
                  />
                </span>
              )}
              <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors leading-tight">
                {businessName}
              </h3>
            </div>
          </div>

          {/* Tagline / Bio */}
          <p className="text-sm text-zinc-400 line-clamp-2 mb-8">
            {tagline}
          </p>

          {/* Interaction Footer */}
          <div className="flex items-center justify-end border-t border-white/5 pt-5 mt-auto">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors duration-300" style={{ color: 'var(--brand-color)' }}>
              Visit Site
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}