/* src/components/storefronts/ShowroomGallery.tsx */
'use client';

import React, { useState } from 'react';
import { StorefrontData } from './LiveRoster';
import ShowroomCard from './ShowroomCard';

export default function ShowroomGallery({ sites }: { sites: StorefrontData[] }) {
  const [activeFilter, setActiveFilter] = useState('All Builds');

  const rawTags = sites.map((s) => s.industry_tag).filter(Boolean) as string[];
  const categories = ['All Builds', ...Array.from(new Set(rawTags))];

  const displayedSites =
    activeFilter === 'All Builds'
      ? sites
      : sites.filter((s) => s.industry_tag === activeFilter);

  if (!sites || sites.length === 0) {
    return (
      <div className="container mx-auto px-6 relative z-10 text-center py-20">
        <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
          The Grid is currently empty
        </p>
      </div>
    );
  }

  const engineUrl =
    process.env.NEXT_PUBLIC_ENGINE_URL || 'https://storefronts.alternativesolutions.io';

  return (
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* --- SIDEBAR FILTER --- */}
        <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-24 h-fit z-20">
          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
            Explore The Grid
          </h4>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all text-left whitespace-nowrap cursor-pointer ${
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

        {/* --- MAIN GRID --- */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 perspective-[1000px]">
          {displayedSites.map((site) => (
            <ShowroomCard
              key={(site.id as string) || site.slug}
              site={site}
              engineUrl={engineUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}