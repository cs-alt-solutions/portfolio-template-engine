/* src/utils/storefrontHelpers.tsx */
import React, { SVGProps } from 'react';
import { Send } from 'lucide-react';

export interface SocialPlatform {
  name: string;
  url: string;
  Icon: React.ElementType;
}

export interface FormattedGalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  isVisible?: boolean;
  isRaw?: boolean;
  addons?: { name: string; price: string }[];
}

interface CustomIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const HERO_NAMES: Record<string, string> = {
  'center': 'Centered Focus',
  'split-left': 'Split-Left Structure',
  'split-right': 'Split-Right Structure',
  'cinematic': 'Cinematic Frame Layout',
  'glass': 'Frosted Glass Overlay',
  'editorial-frame': 'Editorial Frame',
  'arch-spotlight': 'Arch Spotlight',
  'bento-hero': 'Bento Collage',
  'bottom-dock': 'Bottom Dock',
  'top-dock': 'Top Dock',
  'minimal-type': 'Kinetic Type',
};

export const FLOW_NAMES: Record<string, string> = {
  'classic': 'Classic Flow Layout',
  'bento': 'Bento Grid System',
  'sticky': 'Sticky Scroll Engine',
  'editorial': 'Editorial Hover Stack',
  'accordion': 'Interactive Accordion Flow',
  'menu': 'Culinary Menu',
  'lookbook': 'Lookbook Grid',
  'hub': 'Department Hub',
};

const InstagramIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6C3.9 20 2.5 18.6 2.5 16.9V7.1z" />
    <path d="m10 15 5-3-5-3v6z" />
  </svg>
);

const SOCIAL_META: Record<string, { base: string; icon: React.ElementType }> = {
  instagram: { base: 'https://instagram.com/', icon: InstagramIcon },
  facebook: { base: 'https://facebook.com/', icon: FacebookIcon },
  twitter: { base: 'https://x.com/', icon: TwitterIcon },
  linkedin: { base: 'https://linkedin.com/in/', icon: LinkedinIcon },
  youtube: { base: 'https://youtube.com/@', icon: YoutubeIcon },
  telegram: { base: 'https://t.me/', icon: Send },
};

const LEGACY_COLOR_MAP: Record<string, string> = {
  'cyan-500': '#06b6d4',
  'fuchsia-500': '#d946ef',
  'emerald-500': '#10b981',
  'amber-500': '#f59e0b',
  'rose-500': '#f43f5e',
  'indigo-500': '#6366f1',
  'zinc-500': '#71717a',
};

export function getHexValue(val: string): string {
  if (!val) return '#06b6d4';
  if (val.startsWith('#')) return val;
  return LEGACY_COLOR_MAP[val] || '#06b6d4';
}

export function buildActiveSocials(rawSocialLinks: Record<string, unknown> | null | undefined): SocialPlatform[] {
  return Object.entries(rawSocialLinks || {})
    .filter((entry) => !!entry[1])
    .map(([platform, handle]) => {
      const meta = SOCIAL_META[platform];
      if (!meta) return null;
      return { name: platform, url: `${meta.base}${handle}`, Icon: meta.icon };
    })
    .filter((item): item is SocialPlatform => item !== null);
}

export function formatGalleryItems(rawGallery: unknown): FormattedGalleryItem[] {
  if (!Array.isArray(rawGallery)) return [];
  return rawGallery.map((item: unknown, index: number) => {
    if (typeof item === 'string') return { id: `gal-${index}`, imageUrl: item };
    const obj = item as Partial<FormattedGalleryItem>;
    return {
      id: obj.id || `gal-${index}`,
      imageUrl: obj.imageUrl || '',
      title: obj.title,
      description: obj.description || obj.category,
      category: obj.category,
      price: obj.price,
      isVisible: obj.isVisible,
      isRaw: obj.isRaw,
      addons: obj.addons || [],
    };
  });
}