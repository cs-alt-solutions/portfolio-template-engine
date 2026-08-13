// src/components/storefronts/ShowroomGallery.tsx
'use client';

import React, { useState } from 'react';
import ShowroomCard from './ShowroomCard';
import { StorefrontData } from './LiveRoster';

export default function ShowroomGallery({ sites }: { sites: StorefrontData[] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  // 🧠 THE SMART ENGINE: Dynamically generate filter tags based on actual database data
  const existingTags = Array.from(
    new Set(sites.map(site => site.industry_tag).filter(Boolean))
  ).sort() as string[];
  
  const filterTags = ['All', ...existingTags];

  // Filter the grid instantly when a user clicks a directory item
  const filteredSites = activeFilter === 'All' 
    ? sites 
    : sites.filter(site => site.industry_tag === activeFilter);

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
      
      {/* 🟢 LEFT COLUMN: The Vertical Directory */}
      <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-32 space-y-8 lg:border-r lg:border-white/5 lg:pr-10 lg:pb-10">
        
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest">
              Ecosystem
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white leading-none mb-4">
            The Showroom
          </h2>
          <p className="text-sm text-zinc-500 font-light leading-relaxed">
            Explore our deployed foundational frameworks by industry sector.
          </p>
        </div>

        {/* The Sharp Vertical Filter Menu */}
        <div className="flex flex-col gap-1 border-t border-white/5 pt-6">
          {filterTags.map(tag => {
            const isActive = activeFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 border-l-2 ${
                  isActive
                    ? 'border-fuchsia-500 bg-white/5 text-white shadow-[inset_15px_0_30px_-15px_rgba(217,70,239,0.15)] translate-x-1'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5 hover:border-zinc-700'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* 🟢 RIGHT COLUMN: The Grid */}
      <div className="flex-1 w-full min-h-[50vh]">
        {filteredSites.length === 0 ? (
          <div className="text-center py-32 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-xl shadow-inner w-full">
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
              No platforms found matching this sector.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredSites.map((site) => (
              <ShowroomCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}