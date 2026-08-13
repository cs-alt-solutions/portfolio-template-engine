// src/components/storefronts/ShowroomGallery.tsx
'use client';

import React, { useState } from 'react';
import { StorefrontData } from './LiveRoster';
import { Sparkles, BriefcaseBusiness } from 'lucide-react';

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

        {/* --- THE MAIN GRID (Now a 2-Column Wide Layout) --- */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10 perspective-[1000px]">
          {displayedSites.map((site) => {
            const hasLogo = !!site.brand_logo;
            const hasHero = !!site.hero_image; 
            const initial = site.business_name ? site.business_name.charAt(0).toUpperCase() : '?';
            const pulseColor = site.brand_color || '#22d3ee'; 
            
            const rawServices = (site.capabilities as { title?: string; description?: string }[]) || [];
            // We can show slightly fewer services if needed since the card is shorter horizontally
            const servicesToShow = Array.isArray(rawServices) ? rawServices.slice(0, 3) : [];
            
            const targetUrl = site.custom_domain 
              ? `https://${site.custom_domain}` 
              : `${engineUrl}/${site.slug}`;

            const displayUrl = site.custom_domain 
              ? (site.custom_domain as string)
              : `${engineUrl.replace('https://', '')}/${site.slug}`;

            return (
              // FIX: Changed from h-88 to a wider, cinematic height (h-72) for the business card ratio
              <div key={site.id as string} className="group relative h-72 w-full rounded-2xl">
                
                <div className="relative w-full h-full transition-transform duration-700 transform-3d group-hover:transform-[rotateY(180deg)]">
                  
                  {/* --- FRONT FACE (Cinematic Billboard) --- */}
                  <a 
                    href={targetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-zinc-800/50 bg-[#0a0a0c] backface-hidden cursor-pointer"
                  >
                    <div className="absolute top-5 right-5 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 shadow-xl">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: pulseColor, boxShadow: `0 0 12px ${pulseColor}` }} />
                      <span className="text-[10px] font-bold tracking-widest text-zinc-200 uppercase">Live</span>
                    </div>

                    {hasLogo ? (
                      <div className="absolute inset-0 flex items-center justify-center p-8 pb-20 z-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={site.brand_logo as string} alt={site.business_name as string} className="max-w-[50%] max-h-[50%] object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    ) : hasHero ? (
                      <div className="absolute inset-0 w-full h-full z-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={site.hero_image as string} alt={site.business_name as string} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center pb-20 z-10">
                        <div className="text-8xl font-black text-zinc-800/50 transition-colors duration-500 group-hover:text-zinc-700"> {initial} </div>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-6 pt-24 bg-linear-to-t from-[#050505] via-[#050505]/90 to-transparent z-20">
                      <h3 className="text-2xl font-black text-white mb-1 tracking-tight">
                        {site.business_name as string}
                      </h3>
                      <p className="text-sm text-zinc-300 font-light truncate">
                        {site.tagline as string || "View Live Storefront"}
                      </p>
                    </div>
                  </a>

                  {/* --- BACK FACE (Split Business Card Layout) --- */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl border border-zinc-800 bg-[#0c0d10] flex overflow-hidden backface-hidden transform-[rotateY(180deg)] shadow-xl shadow-cyan-500/5">
                    
                    {/* Left Column: Identity & Action */}
                    <div className="w-5/12 p-6 flex flex-col justify-between border-r border-zinc-800/80 bg-[#0a0b0e]">
                      <div>
                        <div className="w-12 h-12 mb-4 shrink-0 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800" style={{ boxShadow: `0 0 16px ${pulseColor}22` }}>
                          <BriefcaseBusiness className="w-6 h-6" style={{ color: pulseColor }} />
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 mb-1"> {site.business_name as string} </h3>
                        <p className="text-[10px] font-mono text-zinc-500 truncate lowercase"> {displayUrl} </p>
                      </div>

                      <a 
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-lg text-sm font-bold tracking-tight bg-white text-black hover:bg-zinc-200 transition text-center mt-4"
                      >
                        Visit Site
                      </a>
                    </div>

                    {/* Right Column: Capabilities */}
                    <div className="w-7/12 p-6 flex flex-col">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" style={{ color: pulseColor }} />
                        Featured Services
                      </p>
                      <div className="space-y-3.5 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                        {servicesToShow.length > 0 ? (
                          servicesToShow.map((service, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="w-1.5 h-1.5 shrink-0 mt-1.5 rounded-full" style={{ backgroundColor: pulseColor, boxShadow: `0 0 8px ${pulseColor}` }} />
                              <div className="flex-1">
                                <p className="text-sm font-bold text-zinc-100 leading-none mb-1">{service.title || 'Service'}</p>
                                <p className="text-xs text-zinc-400 line-clamp-2 leading-snug">{service.description || ''}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-zinc-600 italic">Exploring custom offerings...</p>
                        )}
                      </div>
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