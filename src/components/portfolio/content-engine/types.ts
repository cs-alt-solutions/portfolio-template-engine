// src/components/portfolio/content-engine/types.ts
export interface Capability {
  title: string;
  description: string;
  bullets?: string[];
  price?: string;
  isAlaCarte?: boolean;
  coverImage?: string;
}

export interface GalleryItem {
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

export interface ContentLayoutProps {
  themeStyle: string;
  brandColor: string;
  secondaryBrandColor?: string;
  isLightMode: boolean;
  capabilitiesHeading: string;
  galleryHeading: string;
  capabilities: Capability[];
  galleryItems: GalleryItem[];
  contentLayout?: 'classic' | 'bento' | 'sticky' | 'accordion' | 'editorial' | 'menu' | 'lookbook';
  aboutLayout?: 'split' | 'editorial' | 'minimal' | 'card';
  orderingUrl?: string;
  storefrontSlug?: string;
  businessName?: string;
  contactEmail?: string;
  heroImage?: string;
  isHeroFixed?: boolean;
  operationalTerms?: { title: string; description: string; fees?: { name: string; price: string }[] }[];
}