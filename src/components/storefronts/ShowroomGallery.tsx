// src/components/storefronts/ShowroomGallery.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorefrontData } from './LiveRoster';
import { Sparkles, BriefcaseBusiness } from 'lucide-react'; // Removed Mail icon

export default function ShowroomGallery({ sites }: { sites: StorefrontData[] }) {
  const [activeFilter, setActiveFilter] = useState('All Builds');

  const rawTags = sites.map((s) => s.industry_tag).filter(Boolean) as string[];
  const categories = ['All Builds', ...Array.from(new Set(rawTags))];

  const displayedSites = activeFilter === 'All Builds' 
    ? sites 
    : sites.filter((s) => s.industry_tag === activeFilter);

  if (!sites || sites.length === 0) {
    return (
      <div className="container mx-auto px-6 relative z-10 text-center py-20">
        <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">The Grid is currently empty</p>
      </div>
    );
  }

  // Fallback to production engine if local env var is missing
  const engineUrl = process.env.NEXT_PUBLIC_ENGINE_URL || 'https://storefronts.alternativesolutions.io';

  return (
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* --- THE SIDEBAR FILTER --- */}
        <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-24 h-fit z-20">
          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4"> Explore The Grid </h4>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all text-left whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-zinc-100 text-black shadow-lg' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* --- THE MAIN GRID --- */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 perspective-[1000px]">
          {displayedSites.map((site) => {
            const hasLogo = !!site.brand_logo;
            const hasHero = !!site.hero_image; 
            const initial = site.business_name ? site.business_name.charAt(0).toUpperCase() : '?';
            const pulseColor = site.brand_color || '#22d3ee'; 
            
            const rawServices = (site.capabilities as { title?: string; description?: string }[]) || [];
            const servicesToShow = Array.isArray(rawServices) ? rawServices.slice(0, 4) : [];
            
            // Determine the absolute URL to bounce them to Repo B (or their custom domain)
            const targetUrl = site.custom_domain 
              ? `https://${site.custom_domain}` 
              : `${engineUrl}/${site.slug}`;

            // Clean up the URL just for the visual display on the card
            const displayUrl = site.custom_domain 
              ? (site.custom_domain as string)
              : `${engineUrl.replace('https://', '')}/${site.slug}`;

            const mediaContent = hasLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={site.brand_logo as string} alt={site.business_name as string} className="max-w-[70%] max-h-[70%] object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" />
            ) : hasHero ? (
              <div className="absolute inset-0 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={site.hero_image as string} alt={site.business_name as string} className="w-full h-full object-cover opacity-60" />
              </div>
            ) : (
              <div className="text-9xl font-black text-zinc-800/50"> {initial} </div>
            );

            return (
              <div key={site.id as string} className="group relative h-88 w-full rounded-2xl">
                
                {/* 3D Rotation Wrapper */}
                <div className="relative w-full h-full transition-transform duration-700 transform-3d group-hover:transform-[rotateY(180deg)]">
                  
                  {/* --- FRONT FACE --- */}
                  <a 
                    href={targetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-zinc-800/50 bg-[#0a0a0c] p-6 flex flex-col justify-between backface-hidden cursor-pointer"
                  >
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: pulseColor, boxShadow: `0 0 12px ${pulseColor}` }} />
                      <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">Live</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center p-8 overflow-hidden z-10">
                      {mediaContent}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-[#050505] via-black/90 to-transparent z-20">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {site.business_name as string}
                      </h3>
                      <p className="text-sm text-zinc-300 line-clamp-2">
                        {site.tagline as string || "View Live Storefront"}
                      </p>
                      {site.industry_tag && (
                        <span className="inline-block mt-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800/50 rounded border border-zinc-700/50">
                          {site.industry_tag as string}
                        </span>
                      )}
                    </div>
                  </a>

                  {/* --- BACK FACE (The Real Business Card) --- */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl border border-zinc-800 bg-[#0c0d10] p-7 flex flex-col justify-between backface-hidden transform-[rotateY(180deg)] shadow-xl shadow-cyan-500/5">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800" style={{ boxShadow: `0 0 12px ${pulseColor}22` }}>
                        <BriefcaseBusiness className="w-5 h-5" style={{ color: pulseColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate"> {site.business_name as string} </h3>
                        <p className="text-xs font-mono text-zinc-500 truncate lowercase"> {displayUrl} </p>
                      </div>
                    </div>

                    {/* --- THE REAL CAPABILITIES --- */}
                    <div className="flex-1 pt-6 pb-4 overflow-hidden">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" style={{ color: pulseColor }} />
                        Featured Services
                      </p>
                      <div className="space-y-2.5">
                        {servicesToShow.length > 0 ? (
                          servicesToShow.map((service, index) => (
                            <div key={index} className="flex gap-2">
                              <div className="w-1 h-1 shrink-0 mt-1.5 rounded-full" style={{ backgroundColor: pulseColor }} />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-zinc-100">{service.title || 'Service'}</p>
                                <p className="text-xs text-zinc-400 line-clamp-1">{service.description || ''}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-zinc-600 italic">Exploring custom offerings...</p>
                        )}
                      </div>
                    </div>

                    {/* --- CENTERED VISIT SITE BUTTON --- */}
                    <div className="border-t border-zinc-800/80 pt-4 flex justify-center">
                      <a 
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-lg text-sm font-bold tracking-tight bg-white text-black hover:bg-zinc-200 transition text-center block"
                      >
                        Visit Site
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}