// src/components/storefronts/LiveRoster.tsx
import React from 'react';
import { supabase } from '@/utils/supabase';
import ShowroomGallery from './ShowroomGallery';

// CRITICAL FIX: Kills the Next.js cache so your gallery is ALWAYS live.
// The second you approve a storefront in the dashboard, it renders here.
export const revalidate = 0; 

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
  industry_tag?: string; 
  [key: string]: unknown;
}

export default async function LiveRoster() {
  // Fetch real active storefronts from Supabase
  const { data: storefrontsData, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching live roster data:", error);
  }

  const liveSites = storefrontsData || [];

  return (
    // FIX: Removed bg-[#050505] and overflow-hidden so the watermark shines through
    <section className="py-24 relative">
      {/* Deep Space Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/4 right-1/4 w-150 h-150 bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Mount the interactive Client Component */}
      <ShowroomGallery sites={liveSites} />
      
    </section>
  );
}