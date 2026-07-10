// src/app/[slug]/page.tsx
import React, { SVGProps } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { THEME_REGISTRY } from '@/utils/themes';
import AboutSection from '@/components/portfolio/AboutSection';
import ContentEngine from '@/components/portfolio/content-engine';
import { Send } from 'lucide-react';

// Force Next.js to ignore static caching and fetch fresh data every time
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export interface SocialPlatform {
  name: string;
  url: string;
  Icon: React.ElementType;
}

interface CustomIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

interface FormattedGalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string; 
}

const InstagramIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const FacebookIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const LinkedinIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const YoutubeIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6C3.9 20 2.5 18.6 2.5 16.9V7.1z"/><path d="m10 15 5-3-5-3v6z"/></svg>
);

const SOCIAL_META: Record<string, { base: string; icon: React.ElementType }> = {
  instagram: { base: 'https://instagram.com/', icon: InstagramIcon },
  facebook: { base: 'https://facebook.com/', icon: FacebookIcon },
  twitter: { base: 'https://x.com/', icon: TwitterIcon },
  linkedin: { base: 'https://linkedin.com/in/', icon: LinkedinIcon },
  youtube: { base: 'https://youtube.com/@', icon: YoutubeIcon },
  telegram: { base: 'https://t.me/', icon: Send },
};

export default async function DynamicStorefront({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch store data
  const { data: store, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !store) {
    notFound();
  }

  const theme = THEME_REGISTRY[store.theme_style] || THEME_REGISTRY['industrial'];
  const layout = store.hero_layout || 'center';
  const brandColor = store.brand_color || 'cyan-500';

  const accentColorClass = theme.useBrandAccent ? `text-${brandColor}` : '';
  const buttonBgClass = theme.useBrandAccent ? `bg-${brandColor} text-zinc-950 hover:opacity-80 border-none` : `bg-${brandColor} text-zinc-950`;
  const lineAccent = theme.useBrandAccent ? `bg-${brandColor}` : 'bg-current';

  const contactLink = store.contact_email ? `mailto:${store.contact_email}` : '#contact';
  const hasAbout = !!store.about_bio || !!store.about_image || !!store.about_heading;
  
  const rawSocialLinks = store.social_links || {};
  const activeSocials: SocialPlatform[] = Object.entries(rawSocialLinks)
    .filter((entry) => !!entry[1]) 
    .map(([platform, handle]) => {
      const meta = SOCIAL_META[platform];
      if (!meta) return null;
      return {
        name: platform,
        url: `${meta.base}${handle}`,
        Icon: meta.icon,
      };
    })
    .filter((item): item is SocialPlatform => item !== null);

  const rawGallery = Array.isArray(store.gallery_items) ? store.gallery_items : [];
  const formattedGalleryItems: FormattedGalleryItem[] = rawGallery.map((item: unknown, index: number) => {
    if (typeof item === 'string') {
      return { id: `gal-${index}`, imageUrl: item };
    }
    const obj = item as Record<string, string | undefined>;
    return {
      id: obj.id || `gal-${index}`,
      imageUrl: obj.imageUrl || '',
      title: obj.title,
      description: obj.description || obj.category 
    };
  }).filter((item: FormattedGalleryItem) => item.imageUrl !== ''); 

  return (
    <main className={`min-h-screen flex flex-col selection:bg-cyan-500/30 ${theme.pageBg}`}>
      
      {/* LAYOUT 1: CENTERED */}
      {layout === 'center' && (
        <section className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={store.hero_image} alt={store.business_name} className="w-full h-full object-cover object-center scale-105 opacity-50" />
          </div>
          
          {theme.useBrandTint && <div className={`absolute inset-0 z-0 opacity-40 bg-${brandColor} mix-blend-color`} />}
          <div className={`absolute inset-0 z-0 bg-linear-to-b ${theme.overlayFade}`} />

          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center mt-12">
            <div className={`w-full max-w-4xl text-center p-8 md:p-16 relative overflow-hidden group ${theme.cardStyle}`}>
              {theme.useBrandAccent && <div className={`absolute top-0 left-0 w-full h-1.5 ${lineAccent}`} />}
              
              <h2 className={`${theme.accentText} ${accentColorClass} mb-6 drop-shadow-md`}>
                {theme.prefix}{store.business_name}
              </h2>
              <h1 className={`${theme.primaryText} text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter mb-8 drop-shadow-2xl`}>
                {store.tagline}
              </h1>
              <p className={`text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto opacity-90 ${theme.bodyText}`}>
                {store.subtext}
              </p>
              <a href={contactLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>
                {store.primary_cta}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* LAYOUT 2: SPLIT-LEFT */}
      {layout === 'split-left' && (
        <section className={`relative min-h-[90vh] w-full flex flex-col md:flex-row ${theme.pageBg}`}>
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10">
            <div className="w-full max-w-xl text-left">
              <h2 className={`${theme.accentText} ${accentColorClass} mb-4 flex items-center gap-4`}>
                <div className={`h-px w-12 ${lineAccent}`} /> 
                {theme.prefix}{store.business_name}
              </h2>
              <h1 className={`${theme.primaryText} text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6`}>
                {store.tagline}
              </h1>
              <p className={`text-lg mb-10 leading-relaxed ${theme.bodyText}`}>
                {store.subtext}
              </p>
              <div className="flex gap-4">
                <a href={contactLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>
                  {store.primary_cta}
                </a>
                {store.secondary_cta && (
                  <button className={`bg-transparent border border-${brandColor} text-${brandColor} hover:bg-${brandColor}/10 font-bold tracking-widest uppercase text-xs py-4 px-8 rounded transition-all`}>
                    {store.secondary_cta}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={store.hero_image} alt={store.business_name} className="absolute inset-0 w-full h-full object-cover object-center" />
             <div className={`absolute inset-0 bg-linear-to-r from-${theme.pageBg.replace('bg-', '')} via-transparent to-transparent opacity-50 hidden md:block`} />
          </div>
        </section>
      )}

      {/* LAYOUT 3: SPLIT-RIGHT */}
      {layout === 'split-right' && (
        <section className={`relative min-h-[90vh] w-full flex flex-col md:flex-row-reverse ${theme.pageBg}`}>
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10">
            <div className="w-full max-w-xl text-left">
              <h2 className={`${theme.accentText} ${accentColorClass} mb-4 flex items-center gap-4`}>
                <div className={`h-px w-12 ${lineAccent}`} /> 
                {theme.prefix}{store.business_name}
              </h2>
              <h1 className={`${theme.primaryText} text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6`}>
                {store.tagline}
              </h1>
              <p className={`text-lg mb-10 leading-relaxed ${theme.bodyText}`}>
                {store.subtext}
              </p>
              <div className="flex gap-4">
                <a href={contactLink} className={`inline-block ${theme.buttonStyle} ${buttonBgClass}`}>
                  {store.primary_cta}
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={store.hero_image} alt={store.business_name} className="absolute inset-0 w-full h-full object-cover object-center" />
             <div className={`absolute inset-0 bg-linear-to-l from-${theme.pageBg.replace('bg-', '')} via-transparent to-transparent opacity-50 hidden md:block`} />
          </div>
        </section>
      )}

      {/* LAYOUT 4: CINEMATIC */}
      {layout === 'cinematic' && (
        <section className="relative min-h-screen w-full flex items-end justify-start overflow-hidden pb-20">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={store.hero_image} alt={store.business_name} className="w-full h-full object-cover object-center scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-90" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className={`max-w-3xl ${theme.cardStyle === 'bg-transparent border-none shadow-none' ? '' : `p-8 backdrop-blur-sm bg-black/20 border-l-4 ${theme.useBrandAccent ? `border-${brandColor}` : 'border-white'}`}`}>
              <h2 className={`${theme.accentText} ${accentColorClass} mb-4`}>
                {theme.prefix}{store.business_name}
              </h2>
              <h1 className="text-white font-sans text-5xl md:text-7xl leading-none tracking-tighter mb-6 font-black">
                {store.tagline}
              </h1>
              <p className="text-xl mb-10 leading-relaxed font-light text-zinc-300 max-w-xl">
                {store.subtext}
              </p>
              
              <a href={contactLink} className={`inline-block ${theme.buttonStyle}`}>
                {store.primary_cta}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* --- ABOUT SECTION --- */}
      {hasAbout && (
        <div className="container mx-auto px-6 py-20">
          <AboutSection 
            data={{
              heading: store.about_heading || 'About Us',
              bio: store.about_bio,
              imageUrl: store.about_image,
              facebookUrl: store.social_url,
              ctaText: store.secondary_cta,
              brandColor: store.brand_color,
              socials: activeSocials,
              isLightMode: theme.isLightMode, 
              themeStyle: store.theme_style
            }} 
          />
        </div>
      )}

      {/* --- THE CONTENT ENGINE --- */}
      <ContentEngine 
        layout={store.content_layout || 'classic'}
        themeStyle={store.theme_style}
        brandColor={brandColor}
        isLightMode={theme.isLightMode}
        capabilitiesHeading={store.capabilities_heading || 'My Services'}
        galleryHeading={store.gallery_heading || 'Featured Work'}
        capabilities={store.capabilities || []}
        galleryItems={formattedGalleryItems}
      />
      
    </main>
  );
}