/* eslint-disable @next/next/no-img-element */
/* src/app/[slug]/page.tsx */
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { THEME_REGISTRY } from '@/utils/themes';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';
import {
  HERO_NAMES,
  FLOW_NAMES,
  getHexValue,
  buildActiveSocials,
  formatGalleryItems,
} from '@/utils/storefrontHelpers';
import HeroEngine from '@/components/portfolio/hero/HeroEngine';
import HubStage from '@/components/portfolio/HubStage';
import AboutSection from '@/components/portfolio/AboutSection';
import ContentEngine from '@/components/portfolio/content-engine';
import EventsSection from '@/components/portfolio/events/EventsSection';
import PrototypeTourGuide from '@/components/portfolio/PrototypeTourGuide';
import StorefrontClientActions from '../../components/portfolio/StorefrontClientActions';
import StagingReviewOverlay from '@/components/portfolio/staging-review/StagingReviewOverlay';
import StorefrontAnalyticsBeacon from '@/components/portfolio/StorefrontAnalyticsBeacon';

export type { SocialPlatform } from '@/utils/storefrontHelpers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: store } = await supabase
    .from('storefronts')
    .select('business_name, tagline, brand_logo')
    .eq('slug', slug)
    .single();

  if (!store) return { title: 'Not Found' };
  const hasLogo = typeof store.brand_logo === 'string' && store.brand_logo.trim() !== '';

  return {
    title: `${store.business_name || 'Workspace'} | ${store.tagline || 'Custom Solutions'}`,
    description: store.tagline || '',
    icons: hasLogo
      ? [
          { rel: 'icon', url: store.brand_logo },
          { rel: 'apple-touch-icon', url: store.brand_logo },
          { rel: 'shortcut icon', url: store.brand_logo },
        ]
      : undefined,
  };
}

export default async function DynamicStorefront({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isCanvasMode = resolvedSearchParams?.mode === 'canvas';
  const isAuditMode = resolvedSearchParams?.mode === 'audit';

  const { data: store, error } = await supabase.from('storefronts').select('*').eq('slug', slug).single();
  if (error || !store) notFound();

  const isHubMode = store.engine_mode === 'hub' || store.content_layout === 'hub';
  const isHeroFixed = store.is_hero_fixed === true;
  const hasValidLogo = typeof store.brand_logo === 'string' && store.brand_logo.trim() !== '';

  const themeStyle = store.theme_style || 'industrial';
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const layout = store.hero_layout || 'center';
  const isLightMode = theme.isLightMode || false;

  const brandColor = 'brand-primary';
  const secondaryBrandColor = 'brand-secondary';
  const primaryHex = getHexValue(store.brand_color || 'cyan-500');
  const secondaryHex = getHexValue(store.secondary_brand_color || store.brand_color || 'cyan-500');

  const accentColorClass = theme.useBrandAccent ? `text-${brandColor}` : isLightMode ? 'text-zinc-900' : 'text-white';
  const buttonBgClass = theme.useBrandAccent
    ? `bg-linear-to-r from-${brandColor} to-${secondaryBrandColor} text-zinc-950 hover:scale-105 transition-all shadow-lg shadow-${secondaryBrandColor}/20 border-none`
    : isLightMode
      ? 'border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white shadow-sm'
      : 'border-2 border-white text-white hover:bg-white hover:text-zinc-950 shadow-sm';
  const lineAccent = theme.useBrandAccent
    ? `bg-linear-to-r from-${brandColor} to-${secondaryBrandColor}`
    : isLightMode ? 'bg-zinc-900' : 'bg-white';

  const galleryTitle = store.gallery_heading || STOREFRONT_DEFAULTS?.GALLERY_HEADING || 'Featured Work';
  const heroButtonText = isHubMode ? 'Explore Departments' : `View ${galleryTitle}`;
  const hasAbout = !!store.about_bio || !!store.about_image || !!store.about_heading;
  const formattedGalleryItems = formatGalleryItems(store.gallery_items);

  const hubDeptTitles: string[] = Array.isArray(store.capabilities)
    ? store.capabilities
        .filter((c: { title?: string; isAlaCarte?: boolean }) => c && c.title && !c.isAlaCarte)
        .map((c: { title: string }) => c.title)
    : [];

  const hubStoreActions = {
    ...store,
    lead_inquiry_types:
      Array.isArray(store.lead_inquiry_types) && store.lead_inquiry_types.length > 0
        ? store.lead_inquiry_types
        : hubDeptTitles,
  };

  const sharedHeroProps = {
    layout,
    store,
    theme,
    brandColor,
    secondaryBrandColor,
    isHeroFixed,
    hasValidLogo,
    exploreLink: '#gallery',
    heroButtonText,
    accentColorClass,
    buttonBgClass,
    lineAccent,
    galleryItems: formattedGalleryItems,
  };

  const aboutData = {
    heading: store.about_heading || STOREFRONT_DEFAULTS?.ABOUT_HEADING || 'About Us',
    bio: store.about_bio,
    imageUrl: store.about_image,
    brandColor,
    secondaryBrandColor,
    socials: buildActiveSocials(store.social_links),
    isLightMode,
    themeStyle,
    aboutLayout: store.about_layout || 'split',
  };

  const eventsSection = (
    <EventsSection
      events={store.events}
      businessName={store.business_name || 'Our Team'}
      storefrontSlug={store.slug}
      contactEmail={store.public_email || store.contact_email || ''}
      brandColor={brandColor}
      isLightMode={isLightMode}
      themeStyle={themeStyle}
      inquiryOptions={store.lead_inquiry_types}
    />
  );

  const parallaxDivider = isHeroFixed && store.hero_image && (
    <div className="relative w-full h-[30vh] md:h-[40vh] border-y border-white/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" style={{ clipPath: 'inset(0)' }}>
      <div className="fixed inset-0 w-full h-full bg-cover bg-center opacity-50 pointer-events-none" style={{ backgroundImage: `url('${store.hero_image}')` }} />
      {theme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1 z-10 ${lineAccent} opacity-50`} />}
    </div>
  );

  return (
    <main
      className={`min-h-screen flex flex-col selection:bg-${secondaryBrandColor}/30 ${theme.pageBg || 'bg-zinc-950'} relative`}
      style={{ '--brand-primary': primaryHex, '--brand-secondary': secondaryHex } as React.CSSProperties}
    >
      <StorefrontAnalyticsBeacon storefrontId={store.id} slug={store.slug} isCanvasMode={isCanvasMode} isAuditMode={isAuditMode} />

      {isHubMode ? (
        <>
          <HubStage
            heroProps={sharedHeroProps}
            capabilities={store.capabilities || []}
            galleryItems={formattedGalleryItems}
            operationalTerms={store.operational_terms}
            themeStyle={themeStyle}
            brandColor={brandColor}
            secondaryBrandColor={secondaryBrandColor}
            isLightMode={isLightMode}
            businessName={store.business_name}
            storefrontSlug={store.slug}
            contactEmail={store.contact_email}
          />
          {parallaxDivider}
          {eventsSection}
          {hasAbout && (
            <div id="about" className={`w-full py-24 border-t ${isLightMode ? 'border-zinc-900/10 bg-black/2' : 'border-white/10 bg-zinc-950/50'}`}>
              <div className="container mx-auto px-6">
                <AboutSection data={aboutData} />
              </div>
            </div>
          )}
          <StorefrontClientActions store={hubStoreActions} brandColor={brandColor} secondaryBrandColor={secondaryBrandColor} isLightMode={isLightMode} themeStyle={themeStyle} />
        </>
      ) : (
        <>
          <HeroEngine {...sharedHeroProps} isHubMode={false} />
          {parallaxDivider}
          {hasAbout && (
            <div id="about" className="container mx-auto px-6 py-20">
              <AboutSection data={aboutData} />
            </div>
          )}
          <div id="gallery">
            <ContentEngine
              layout={store.content_layout || 'classic'}
              themeStyle={themeStyle}
              brandColor={brandColor}
              secondaryBrandColor={secondaryBrandColor}
              isLightMode={isLightMode}
              capabilitiesHeading={store.capabilities_heading || STOREFRONT_DEFAULTS?.CAPABILITIES_HEADING || 'Services'}
              galleryHeading={galleryTitle}
              capabilities={store.capabilities || []}
              galleryItems={formattedGalleryItems}
              orderingUrl={store.ordering_url}
              storefrontSlug={store.slug}
              businessName={store.business_name}
              contactEmail={store.contact_email}
              heroImage={store.hero_image}
              isHeroFixed={isHeroFixed}
              operationalTerms={store.operational_terms}
              industryTag={store.industry_tag}
            />
          </div>
          {eventsSection}
          <StorefrontClientActions store={store} brandColor={brandColor} secondaryBrandColor={secondaryBrandColor} isLightMode={isLightMode} themeStyle={themeStyle} />
        </>
      )}

      <footer className="w-full py-8 px-6 border-t border-white/10 bg-zinc-950 text-[11px] font-mono text-zinc-500 uppercase tracking-widest flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
        <div className="flex items-center gap-4">
          {hasValidLogo && <img src={store.brand_logo} alt="Brand Icon" className="h-6 w-auto object-contain opacity-50 grayscale" />}
          <span>&copy; {new Date().getFullYear()} {store.business_name || 'All Rights Reserved'}.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Powered by</span>
          <a href="https://alternativesolutions.io" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-cyan-400 font-bold transition-colors underline decoration-cyan-500/50 underline-offset-4">Alternative Solutions</a>
        </div>
      </footer>

      {!isCanvasMode && (
        <>
          {store.is_template && (
            <PrototypeTourGuide
              vibe={themeStyle}
              heroLayout={HERO_NAMES[layout] || layout}
              journeyLayout={FLOW_NAMES[store.content_layout || 'classic'] || store.content_layout}
            />
          )}
          {!store.is_template && store.status?.toUpperCase() === 'IN REVIEW' && <StagingReviewOverlay store={store} />}
        </>
      )}
    </main>
  );
}