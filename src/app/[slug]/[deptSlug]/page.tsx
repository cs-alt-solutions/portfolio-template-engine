/* eslint-disable @next/next/no-img-element */
/* src/app/[slug]/[deptSlug]/page.tsx */
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { THEME_REGISTRY } from '@/utils/themes';
import DepartmentClientView from '@/components/portfolio/DepartmentClientView';

// 🚀 Allow short caching & instant Next.js Link prefetching so navigation feels snappy
export const revalidate = 60;

interface CapabilityItem {
  title: string;
  description?: string;
  price?: string;
  bullets?: string[];
  addons?: Array<{ title?: string; name?: string; price?: string } | string>;
  coverImage?: string;
  isAlaCarte?: boolean;
}

interface GalleryMediaItem {
  id: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  isVisible?: boolean;
  isRaw?: boolean;
}

interface StoreRecord {
  id: string;
  slug: string;
  business_name?: string;
  tagline?: string;
  brand_logo?: string;
  hero_image?: string;
  contact_email?: string;
  theme_style?: string;
  brand_color?: string;
  secondary_brand_color?: string;
  capabilities?: CapabilityItem[];
  gallery_items?: Array<GalleryMediaItem | string>;
  [key: string]: unknown;
}

const slugifyDept = (text: string) =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const getHexValue = (val: string) => {
  if (!val) return '#06b6d4';
  if (val.startsWith('#')) return val;
  const legacyMap: Record<string, string> = {
    'cyan-500': '#06b6d4',
    'fuchsia-500': '#d946ef',
    'emerald-500': '#10b981',
    'amber-500': '#f59e0b',
    'rose-500': '#f43f5e',
    'indigo-500': '#6366f1',
    'zinc-500': '#71717a',
  };
  return legacyMap[val] || '#06b6d4';
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; deptSlug: string }>;
}): Promise<Metadata> {
  const { slug, deptSlug } = await params;
  const { data: store } = await supabase
    .from('storefronts')
    .select('business_name, capabilities, brand_logo')
    .eq('slug', slug)
    .single<StoreRecord>();

  if (!store) return { title: 'Not Found' };

  const capabilities = Array.isArray(store.capabilities) ? store.capabilities : [];
  const matchedDept = capabilities.find((c) => slugifyDept(c.title) === deptSlug);

  return {
    title: matchedDept
      ? `${matchedDept.title} | ${store.business_name || 'Workspace'}`
      : `${store.business_name || 'Workspace'}`,
    description: matchedDept?.description || '',
  };
}

export default async function DepartmentSubPage({
  params,
}: {
  params: Promise<{ slug: string; deptSlug: string }>;
}) {
  const { slug, deptSlug } = await params;

  const { data: store, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('slug', slug)
    .single<StoreRecord>();

  if (error || !store) notFound();

  const capabilities = Array.isArray(store.capabilities)
    ? store.capabilities.filter((c) => !c.isAlaCarte && c.title)
    : [];

  const matchedDept = capabilities.find((c) => slugifyDept(c.title) === deptSlug);
  if (!matchedDept) notFound();

  const theme = THEME_REGISTRY[store.theme_style || 'industrial'] || THEME_REGISTRY['industrial'];
  const isLightMode = theme.isLightMode || false;

  const rawBrandColor = store.brand_color || 'cyan-500';
  const rawSecondaryColor = store.secondary_brand_color || rawBrandColor;
  const primaryHex = getHexValue(rawBrandColor);
  const secondaryHex = getHexValue(rawSecondaryColor);

  const rawGallery = Array.isArray(store.gallery_items) ? store.gallery_items : [];
  const departmentGallery = rawGallery
    .map((item, idx): GalleryMediaItem => {
      if (typeof item === 'string') {
        return { id: `gal-${idx}`, imageUrl: item, isVisible: true };
      }
      return {
        id: item.id || `gal-${idx}`,
        imageUrl: item.imageUrl || '',
        title: item.title,
        description: item.description,
        category: item.category,
        price: item.price,
        isVisible: item.isVisible !== false,
        isRaw: item.isRaw,
      };
    })
    .filter((item) => item.isVisible && item.category === matchedDept.title);

  const hasValidLogo = typeof store.brand_logo === 'string' && store.brand_logo.trim() !== '';

  return (
    <main
      className={`min-h-screen flex flex-col selection:bg-brand-secondary/30 ${theme.pageBg || 'bg-zinc-950'} relative`}
      style={
        {
          '--brand-primary': primaryHex,
          '--brand-secondary': secondaryHex,
        } as React.CSSProperties
      }
    >
      <DepartmentClientView
        store={store}
        department={matchedDept}
        allDepartments={capabilities}
        departmentGallery={departmentGallery}
        themeStyle={store.theme_style || 'industrial'}
        brandColor="brand-primary"
        isLightMode={isLightMode}
      />

      <footer className="w-full py-8 px-6 border-t border-white/10 bg-zinc-950 text-[11px] font-mono text-zinc-500 uppercase tracking-widest flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
        <div className="flex items-center gap-4">
          {hasValidLogo && (
            <img src={store.brand_logo} alt="Brand Icon" className="h-6 w-auto object-contain opacity-50 grayscale" />
          )}
          <span>
            &copy; {new Date().getFullYear()} {store.business_name || 'All Rights Reserved'}.
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Powered by</span>
          <a
            href="https://alternativesolutions.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-cyan-400 font-bold transition-colors underline decoration-cyan-500/50 underline-offset-4"
          >
            Alternative Solutions
          </a>
        </div>
      </footer>
    </main>
  );
}