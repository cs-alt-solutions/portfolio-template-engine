// src/components/storefronts/LiveRoster.tsx
import React from 'react';
import { supabase } from '@/utils/supabase';
import { Zap } from 'lucide-react';
import ShowroomCard from './ShowroomCard';

export interface StorefrontData {
  id?: string;
  slug: string;
  business_name?: string;
  theme_style?: string;
  custom_domain?: string;
  status?: string;
  brand_color?: string;
  brand_logo?: string;
  tagline?: string;
  [key: string]: unknown;
}

export default async function LiveRoster() {
  // Fetch real storefronts
  const { data: storefrontsData } = await supabase
    .from('storefronts')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })
    .limit(12);

  const liveSites = storefrontsData || [];

  return (
    <section className="py-20 relative overflow-hidden bg-[#050505]">
      {/* Deep Space Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/4 right-1/4 w-150 h-150 bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Zap size={16} className="text-cyan-400 animate-pulse" /> THE GRID - LIVE PORTFOLIOS
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-white mb-6 drop-shadow-md">
            ACTIVE CLIENTS
          </h2>
          <p className="text-zinc-400 font-light text-lg max-w-2xl mx-auto">
            Explore the businesses currently powering their digital operations on the Alternative Solutions Engine.
          </p>
        </div>

        {/* ROSTER GRID */}
        {liveSites.length === 0 ? (
          <div className="text-center py-32 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-xl shadow-inner max-w-3xl mx-auto">
             <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Engine standing by for deployment in this sector.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveSites.map((site: StorefrontData) => (
              
              /* HERE IS OUR NEW MODULAR CARD! */
              <ShowroomCard key={site.id} site={site} />
              
            ))}
          </div>
        )}
      </div>
    </section>
  );
}