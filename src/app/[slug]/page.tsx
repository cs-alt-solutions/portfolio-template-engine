// src/app/[slug]/page.tsx
import React, { SVGProps } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { THEME_REGISTRY } from '@/utils/themes';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';

import HeroEngine from '@/components/portfolio/hero/HeroEngine';
import AboutSection from '@/components/portfolio/AboutSection';
import ContentEngine from '@/components/portfolio/content-engine';
import PrototypeTourGuide from '@/components/portfolio/PrototypeTourGuide';
import StorefrontClientActions from '../../components/portfolio/StorefrontClientActions';
import StagingReviewOverlay from '@/components/portfolio/staging-review/StagingReviewOverlay';
import { Send } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// ============================================================================
// DYNAMIC METADATA (BROWSER TAB & SEO)
// ============================================================================
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  const { data: store } = await supabase
    .from('storefronts')
    .select('business_name, tagline, brand_logo')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!store) return { title: 'Not Found' };

  const hasLogo = typeof store.brand_logo === 'string' && store.brand_logo.trim() !== '';

  return {
    title: `${store.business_name} | ${store.tagline || 'Custom Solutions'}`,
    description: store.tagline,
    // EXPLICIT ICON OVERRIDE: Forcing Next.js to use the uploaded logo
    icons: hasLogo ? [
      { rel: 'icon', url: store.brand_logo },
      { rel: 'apple-touch-icon', url: store.brand_logo },
      { rel: 'shortcut icon', url: store.brand_logo }
    ] : undefined,
  };
}

export interface SocialPlatform { name: string; url: string; Icon: React.ElementType; }
interface CustomIconProps extends SVGProps<SVGSVGElement> { size?: number | string; }
interface FormattedGalleryItem { id: string; imageUrl: string; title?: string; description?: string; category?: string; }

const HERO_NAMES: Record<string, string> = { 'center': "Centered Focus", 'split-left': "Split-Left Structure", 'split-right': "Split-Right Structure", 'cinematic': "Cinematic Frame Layout", 'glass': "Frosted Glass Overlay" };
const FLOW_NAMES: Record<string, string> = { 'classic': "Classic Flow Layout", 'bento': "Bento Grid System", 'sticky': "Sticky Scroll Engine", 'editorial': "Editorial Hover Stack", 'accordion': "Interactive Accordion Flow" };

const InstagramIcon = ({ size = 24, ...props }: CustomIconProps) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> );
const FacebookIcon = ({ size = 24, ...props }: CustomIconProps) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> );
const TwitterIcon = ({ size = 24, ...props }: CustomIconProps) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> );
const LinkedinIcon = ({ size = 24, ...props }: CustomIconProps) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> );
const YoutubeIcon = ({ size = 24, ...props }: CustomIconProps) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6C3.9 20 2.5 18.6 2.5 16.9V7.1z"/><path d="m10 15 5-3-5-3v6z"/></svg> );

const SOCIAL_META: Record<string, { base: string; icon: React.ElementType }> = {
  instagram: { base: 'https://instagram.com/', icon: InstagramIcon },
  facebook: { base: 'https://facebook.com/', icon: FacebookIcon },
  twitter: { base: 'https://x.com/', icon: TwitterIcon },
  linkedin: { base: 'https://linkedin.com/in/', icon: LinkedinIcon },
  youtube: { base: 'https://youtube.com/@', icon: YoutubeIcon },
  telegram: { base: 'https://t.me/', icon: Send },
};

export default async function DynamicStorefront({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const resolvedSearchParams = await searchParams;
  const isCanvasMode = resolvedSearchParams?.mode === 'canvas';

  const { data: store, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !store) notFound();

  const isHeroFixed = store.is_hero_fixed === true;
  const hasValidLogo = typeof store.brand_logo === 'string' && store.brand_logo.trim() !== '';

  const theme = THEME_REGISTRY[store.theme_style] || THEME_REGISTRY['industrial'];
  const layout = store.hero_layout || 'center';
  const brandColor = store.brand_color || 'cyan-500';
  
  const accentColorClass = theme.useBrandAccent ? `text-${brandColor}` : '';
  const buttonBgClass = theme.useBrandAccent ? `bg-${brandColor} text-zinc-950 hover:opacity-80 border-none` : `bg-${brandColor} text-zinc-950`;
  const lineAccent = theme.useBrandAccent ? `bg-${brandColor}` : 'bg-current';

  const exploreLink = '#gallery';
  const hasAbout = !!store.about_bio || !!store.about_image || !!store.about_heading;
  const galleryTitle = store.gallery_heading || STOREFRONT_DEFAULTS.GALLERY_HEADING || "Featured Work";
  const heroButtonText = `View ${galleryTitle}`;

  const rawSocialLinks = store.social_links || {};
  const activeSocials: SocialPlatform[] = Object.entries(rawSocialLinks)
    .filter((entry) => !!entry[1]) 
    .map(([platform, handle]) => {
      const meta = SOCIAL_META[platform];
      if (!meta) return null;
      return { name: platform, url: `${meta.base}${handle}`, Icon: meta.icon };
    })
    .filter((item): item is SocialPlatform => item !== null);

  const rawGallery = Array.isArray(store.gallery_items) ? store.gallery_items : [];
  const formattedGalleryItems: FormattedGalleryItem[] = rawGallery.map((item: unknown, index: number) => {
    if (typeof item === 'string') return { id: `gal-${index}`, imageUrl: item };
    const obj = item as Record<string, string | undefined>;
    return { id: obj.id || `gal-${index}`, imageUrl: obj.imageUrl || '', title: obj.title, description: obj.description || obj.category, category: obj.category };
  }).filter((item: FormattedGalleryItem) => item.imageUrl !== ''); 

  return (
    <main className={`min-h-screen flex flex-col selection:bg-cyan-500/30 ${theme.pageBg} relative`}>
      
      <HeroEngine 
        layout={layout}
        store={store}
        theme={theme}
        brandColor={brandColor}
        isHeroFixed={isHeroFixed}
        hasValidLogo={hasValidLogo}
        exploreLink={exploreLink}
        heroButtonText={heroButtonText}
        accentColorClass={accentColorClass}
        buttonBgClass={buttonBgClass}
        lineAccent={lineAccent}
      />

      {hasAbout && (
        <div id="about" className="container mx-auto px-6 py-20">
          <AboutSection 
            data={{
              heading: store.about_heading || STOREFRONT_DEFAULTS.ABOUT_HEADING, 
              bio: store.about_bio,
              imageUrl: store.about_image,
              brandColor: store.brand_color,
              socials: activeSocials, 
              isLightMode: theme.isLightMode, 
              themeStyle: store.theme_style,
              aboutLayout: store.about_layout || 'split'
            }} 
          />
        </div>
      )}

      {isHeroFixed && store.hero_image && (
        <div className="relative w-full h-[30vh] md:h-[40vh] border-y border-white/10 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed opacity-50" style={{ backgroundImage: `url('${store.hero_image}')` }} />
          {theme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1 ${lineAccent} opacity-50`} />}
        </div>
      )}

      <div id="portfolio">
        <ContentEngine 
          layout={store.content_layout || 'classic'}
          themeStyle={store.theme_style}
          brandColor={brandColor}
          isLightMode={theme.isLightMode}
          capabilitiesHeading={store.capabilities_heading || STOREFRONT_DEFAULTS.CAPABILITIES_HEADING} 
          galleryHeading={store.gallery_heading || STOREFRONT_DEFAULTS.GALLERY_HEADING} 
          capabilities={store.capabilities || []}
          galleryItems={formattedGalleryItems}
        />
      </div>

      <StorefrontClientActions store={store} brandColor={brandColor} isLightMode={theme.isLightMode} themeStyle={store.theme_style} />

      <footer className="w-full py-8 px-6 border-t border-white/10 bg-zinc-950 text-[11px] font-mono text-zinc-500 uppercase tracking-widest flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
        <div className="flex items-center gap-4">
          {hasValidLogo && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={store.brand_logo} alt="Brand Icon" className="h-6 w-auto object-contain opacity-50 grayscale" />
            </>
          )}
          <span>&copy; {new Date().getFullYear()} {store.business_name || 'All Rights Reserved'}.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Powered by</span>
          <a href="https://alternativesolutions.io" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-cyan-400 font-bold transition-colors underline decoration-cyan-500/50 underline-offset-4">
            Alternative Solutions
          </a>
        </div>
      </footer>

      {!isCanvasMode && (
        <>
          {store.is_template && <PrototypeTourGuide vibe={store.theme_style || 'industrial'} heroLayout={HERO_NAMES[layout] || layout} journeyLayout={FLOW_NAMES[store.content_layout || 'classic'] || store.content_layout} />}
          {!store.is_template && store.status?.toUpperCase() === 'IN REVIEW' && <StagingReviewOverlay store={store} />}
        </>
      )}
    </main>
  );
}