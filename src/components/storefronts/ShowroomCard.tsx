/* eslint-disable @next/next/no-img-element */
/* src/components/storefronts/ShowroomCard.tsx */
'use client';

import React from 'react';
import { StorefrontData } from './LiveRoster';
import { Sparkles, BriefcaseBusiness, Store } from 'lucide-react';
import { parseMastheadSpec, resolveBrandHex } from '@/utils/mastheadStyles';

interface ShowroomCardProps {
  site: StorefrontData;
  engineUrl: string;
}

export default function ShowroomCard({ site, engineUrl }: ShowroomCardProps) {
  const brandLogo = typeof site.brand_logo === 'string' ? site.brand_logo.trim() : '';
  const heroImage = typeof site.hero_image === 'string' ? site.hero_image.trim() : '';
  const businessName = (typeof site.business_name === 'string' && site.business_name.trim()) || 'Storefront';

  const hasLogo = brandLogo !== '';
  const hasHero = heroImage !== '';
  const initial = businessName.charAt(0).toUpperCase();
  const pulseColor = resolveBrandHex(site.brand_color, '#22d3ee');

  const masthead = parseMastheadSpec(
    site.hero_layout,
    site.brand_color,
    site.secondary_brand_color
  );
  const useMastheadMark = !hasLogo && masthead.isMasthead;

  // Responsive wordmark sizing so short names command the card and longer names wrap cleanly
  const charCount = businessName.length;
  const wordmarkSize =
    charCount <= 10
      ? masthead.isBlackletter
        ? 'text-5xl'
        : 'text-4xl'
      : charCount <= 16
        ? 'text-3xl'
        : 'text-2xl';

  const industry = (typeof site.industry_tag === 'string' ? site.industry_tag : '').toLowerCase();
  const isCulinary = industry === 'culinary';
  const isStoryDriven = isCulinary || industry === 'e-commerce' || industry === 'general';

  const rawServices = (site.capabilities as { title?: string; description?: string }[]) || [];
  const servicesToShow = Array.isArray(rawServices) ? rawServices.slice(0, 3) : [];

  const targetUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${engineUrl}/${site.slug}`;

  const displayUrl = site.custom_domain
    ? (site.custom_domain as string)
    : `${engineUrl.replace(/^https?:\/\//, '')}/${site.slug}`;

  return (
    <div className="group relative h-88 w-full rounded-2xl">
      <div className="relative w-full h-full transition-transform duration-700 transform-3d group-hover:transform-[rotateY(180deg)]">
        {/* --- FRONT FACE --- */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-zinc-800/50 bg-[#0a0a0c] backface-hidden cursor-pointer shadow-lg"
        >
          {/* Live Indicator */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: pulseColor, boxShadow: `0 0 12px ${pulseColor}` }}
            />
            <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">Live</span>
          </div>

          {/* Background Layer */}
          <div className="absolute inset-0 z-0 bg-zinc-950">
            {hasHero && (
              <img
                src={heroImage}
                alt=""
                className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${
                  useMastheadMark ? 'opacity-20' : 'opacity-30'
                }`}
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          </div>

          {/* Foreground Layer: Logo -> Live Masthead Wordmark -> Initial Fallback */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-14 z-10">
            {hasLogo ? (
              <img
                src={brandLogo}
                alt={businessName}
                className="max-w-[55%] max-h-[55%] object-contain filter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-110"
              />
            ) : useMastheadMark ? (
              <div className="w-full flex flex-col items-center text-center transition-transform duration-700 group-hover:scale-105">
                <span
                  style={masthead.textStyle}
                  className={`block w-full ${masthead.fontClass} ${masthead.trackingClass} ${wordmarkSize} ${
                    masthead.isGradient ? 'py-1.5' : ''
                  } leading-[1.06] font-normal text-balance select-none`}
                >
                  {businessName}
                </span>
                <div className="w-24 flex items-center justify-center gap-2 mt-3 opacity-70">
                  <span className="h-px flex-1" style={{ backgroundColor: pulseColor }} />
                  <span className="w-1 h-1 rotate-45" style={{ backgroundColor: pulseColor }} />
                  <span className="h-px flex-1" style={{ backgroundColor: pulseColor }} />
                </div>
              </div>
            ) : (
              <div className="text-8xl font-black text-white/20 transition-colors duration-500 group-hover:text-white/30">
                {initial}
              </div>
            )}
          </div>

          {/* Bottom Details Layer (hides duplicate title when Masthead Wordmark is shown above) */}
          <div className="absolute inset-x-0 bottom-0 p-5 pt-16 z-20 flex flex-col justify-end">
            {!useMastheadMark && (
              <h3 className="text-lg font-bold text-white mb-0.5 drop-shadow-md leading-tight line-clamp-2">
                {businessName}
              </h3>
            )}
            <p className="text-xs text-zinc-300 line-clamp-2 drop-shadow-md mt-0.5">
              {(site.tagline as string) || 'View Live Storefront'}
            </p>
            {typeof site.industry_tag === 'string' && site.industry_tag && (
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-black/50 backdrop-blur-md rounded border border-zinc-700/50">
                  {site.industry_tag}
                </span>
              </div>
            )}
          </div>
        </a>

        {/* --- BACK FACE (BUSINESS CARD) --- */}
        <div className="absolute inset-0 w-full h-full rounded-2xl border border-zinc-800 bg-[#0c0d10] p-7 flex flex-col justify-between backface-hidden transform-[rotateY(180deg)] shadow-xl shadow-cyan-500/5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 overflow-hidden"
              style={{ boxShadow: `0 0 16px ${pulseColor}22` }}
            >
              {hasLogo ? (
                <img src={brandLogo} alt="Logo" className="w-full h-full object-cover p-1.5" />
              ) : useMastheadMark ? (
                <span
                  style={masthead.textStyle}
                  className={`${masthead.fontClass} text-2xl leading-none select-none ${
                    masthead.isGradient ? 'px-1 py-0.5' : ''
                  }`}
                >
                  {initial}
                </span>
              ) : (
                <BriefcaseBusiness className="w-5 h-5" style={{ color: pulseColor }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{businessName}</h3>
              <p className="text-[10px] font-mono text-zinc-500 lowercase leading-tight mt-1 line-clamp-2">
                {displayUrl}
              </p>
            </div>
          </div>

          <div className="flex-1 pt-6 pb-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {isStoryDriven ? (
              <div className="animate-in fade-in duration-500">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 shrink-0" style={{ color: pulseColor }} />
                  The Story
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {(site.about_text as string) ||
                    (site.tagline as string) ||
                    'A local visionary building their digital footprint on the Alternative Solutions network.'}
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: pulseColor }} />
                  Featured Services
                </p>
                <div className="space-y-3">
                  {servicesToShow.length > 0 ? (
                    servicesToShow.map((service, index) => (
                      <div key={index} className="flex gap-2.5">
                        <div
                          className="w-1 h-1 shrink-0 mt-1.5 rounded-full"
                          style={{ backgroundColor: pulseColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-100 leading-tight">
                            {service.title || 'Service'}
                          </p>
                          <p className="text-xs text-zinc-400 leading-snug mt-1 pr-2">
                            {service.description || ''}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-600 italic">Exploring custom offerings...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800/80 pt-4 flex justify-center shrink-0">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg text-sm font-bold tracking-tight bg-white text-black hover:bg-zinc-200 transition text-center block"
            >
              {isCulinary ? 'Explore Menu' : 'Visit Site'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}