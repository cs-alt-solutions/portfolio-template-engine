/* src/components/storefronts/ShowroomGallery.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorefrontData } from './LiveRoster';
import { Sparkles, BriefcaseBusiness, Utensils, Store } from 'lucide-react';

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
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
            
            // 🚀 SMART ROUTING: Determine if they need a Service List or a Brand Story
            const industry = site.industry_tag?.toLowerCase() || '';
            const isCulinary = industry === 'culinary';
            const isStoryDriven = isCulinary || industry === 'e-commerce' || industry === 'general';
            
            // Prepare Service Data (if applicable)
            const rawServices = (site.capabilities as { title?: string; description?: string }[]) || [];
            const servicesToShow = Array.isArray(rawServices) ? rawServices.slice(0, 3) : [];
            
            const targetUrl = site.custom_domain 
              ? `https://${site.custom_domain}` 
              : `${engineUrl}/${site.slug}`;

            const displayUrl = site.custom_domain 
              ? (site.custom_domain as string)
              : `${engineUrl.replace('https://', '')}/${site.slug}`;

            return (
              <div key={site.id as string} className="group relative h-88 w-full rounded-2xl">
                
                <div className="relative w-full h-full transition-transform duration-700 transform-3d group-hover:transform-[rotateY(180deg)]">
                  
                  {/* ==================================================== */}
                  {/* --- FRONT FACE (CINEMATIC LAYERED PRESENTATION) ---  */}
                  {/* ==================================================== */}
                  <a 
                    href={targetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-zinc-800/50 bg-[#0a0a0c] backface-hidden cursor-pointer shadow-lg"
                  >
                    {/* Live Indicator */}
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: pulseColor, boxShadow: `0 0 12px ${pulseColor}` }} />
                      <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">Live</span>
                    </div>

                    {/* BACKGROUND LAYER */}
                    <div className="absolute inset-0 z-0 bg-zinc-950">
                      {hasHero && (
                        <img 
                          src={site.hero_image as string} 
                          alt="Background" 
                          className="w-full h-full object-cover opacity-30 transition-transform duration-1000 group-hover:scale-110" 
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                    </div>

                    {/* FOREGROUND LAYER: The Logo */}
                    <div className="absolute inset-0 flex items-center justify-center px-6 pb-16 z-10">
                      {hasLogo ? (
                        <img 
                          src={site.brand_logo as string} 
                          alt={site.business_name as string} 
                          className="max-w-[55%] max-h-[55%] object-contain filter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="text-8xl font-black text-white/20 transition-colors duration-500 group-hover:text-white/30"> 
                          {initial} 
                        </div>
                      )}
                    </div>

                    {/* TEXT LAYER */}
                    <div className="absolute inset-x-0 bottom-0 p-5 pt-16 z-20 flex flex-col justify-end">
                      <h3 className="text-lg font-bold text-white mb-0.5 drop-shadow-md leading-tight line-clamp-2">
                        {site.business_name as string}
                      </h3>
                      <p className="text-xs text-zinc-300 line-clamp-2 drop-shadow-md mt-0.5">
                        {site.tagline as string || "View Live Storefront"}
                      </p>
                      {site.industry_tag && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-black/50 backdrop-blur-md rounded border border-zinc-700/50">
                            {site.industry_tag as string}
                          </span>
                        </div>
                      )}
                    </div>
                  </a>

                  {/* ==================================================== */}
                  {/* --- BACK FACE (THE TRUE BUSINESS CARD) ---           */}
                  {/* ==================================================== */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl border border-zinc-800 bg-[#0c0d10] p-7 flex flex-col justify-between backface-hidden transform-[rotateY(180deg)] shadow-xl shadow-cyan-500/5">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 overflow-hidden" style={{ boxShadow: `0 0 16px ${pulseColor}22` }}>
                        {hasLogo ? (
                          <img 
                            src={site.brand_logo as string} 
                            alt="Logo" 
                            className="w-full h-full object-cover p-1.5" 
                          />
                        ) : (
                          <BriefcaseBusiness className="w-5 h-5" style={{ color: pulseColor }} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2"> {site.business_name as string} </h3>
                        <p className="text-[10px] font-mono text-zinc-500 lowercase leading-tight mt-1 line-clamp-2"> {displayUrl} </p>
                      </div>
                    </div>

                    <div className="flex-1 pt-6 pb-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                      
                      {/* 🚀 CONTEXTUAL LAYOUT: Brand Story vs Service Matrix */}
                      {isStoryDriven ? (
                        <div className="animate-in fade-in duration-500">
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Store className="w-3.5 h-3.5 shrink-0" style={{ color: pulseColor }} />
                            The Story
                          </p>
                          <p className="text-sm text-zinc-300 leading-relaxed">
                            {/* Uses the about_text from DB if available, otherwise expands on the tagline */}
                            {(site.about_text as string) || (site.tagline as string) || "A local visionary building their digital footprint on the Alternative Solutions network."}
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
                                  <div className="w-1 h-1 shrink-0 mt-1.5 rounded-full" style={{ backgroundColor: pulseColor }} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-100 leading-tight">{service.title || 'Service'}</p>
                                    <p className="text-xs text-zinc-400 leading-snug mt-1 pr-2">{service.description || ''}</p>
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
          })}
        </div>
      </div>
    </div>
  );
}