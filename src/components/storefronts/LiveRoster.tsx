// src/components/storefronts/LiveRoster.tsx
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Zap, Coffee, Flame, Briefcase, HeartHandshake, ChevronRight, Store } from 'lucide-react';

export interface StorefrontData {
  id?: string;
  slug: string;
  business_name?: string;
  theme_style?: string;
  custom_domain?: string;
  status?: string;
  [key: string]: unknown;
}

// Mapping business themes to icons for the roster
const getTierIcon = (theme: string) => {
  switch(theme?.toLowerCase()) {
    case 'industrial': return { icon: <Briefcase size={20} />, style: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/30' };
    case 'neo': return { icon: <HeartHandshake size={20} />, style: 'bg-fuchsia-500/10 text-fuchsia-400 ring-fuchsia-500/30' };
    case 'minimal': return { icon: <Coffee size={20} />, style: 'bg-teal-500/10 text-teal-400 ring-teal-500/30' };
    case 'cyberpunk': return { icon: <Flame size={20} />, style: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30' };
    default: return { icon: <Store size={20} />, style: 'bg-white/5 text-white/50 ring-white/10' };
  }
};

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
    <section className="py-12 relative overflow-hidden">
      {/* Warm Ambient Glow for the Showroom Vibe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Zap size={14} className="text-cyan-400 animate-pulse" /> THE GRID - LIVE PORTFOLIOS
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white mb-4 drop-shadow-md">
            ACTIVE CLIENTS
          </h2>
          <p className="text-zinc-400 font-light max-w-xl mx-auto">
            See who is running their business on the Alternative Solutions Grid.
          </p>
        </div>

        {/* ROSTER GRID */}
        {liveSites.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-xl shadow-inner max-w-3xl mx-auto">
             <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Engine standing by for deployment in this sector.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveSites.map((site: StorefrontData, idx: number) => {
              const styleData = getTierIcon(site.theme_style || '');
              
              // Determine routing based on domain setup
              const targetUrl = site.custom_domain 
                ? `https://${site.custom_domain}` 
                : `/${site.slug}`;
              
              return (
                <Link 
                  key={site.id || idx} 
                  href={targetUrl}
                  target={site.custom_domain ? "_blank" : undefined}
                  rel={site.custom_domain ? "noopener noreferrer" : undefined}
                  className="group relative flex items-center gap-5 bg-black/50 border border-white/5 p-6 rounded-2xl backdrop-blur-xl hover:border-fuchsia-500/30 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(217,70,239,0.15)] transition-all duration-500 cursor-pointer"
                >
                  <div className={`p-4 rounded-xl ring-1 flex shrink-0 transition-all duration-300 group-hover:scale-110 ${styleData.style} group-hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]`}>
                    {styleData.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate group-hover:text-fuchsia-300 transition-colors">
                      {site.business_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-400 capitalize">{site.theme_style || 'Standard'}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-fuchsia-400 transition-all duration-300" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  );
}