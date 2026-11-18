// src/components/portfolio/content-engine/types.ts

export interface Capability {
  title: string;
  description: string;
  price?: string;
  bullets?: string[];
  isAlaCarte?: boolean; 
  coverImage?: string;
  addons?: { title: string; price?: string; description?: string }[]; 
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
  orderingUrl?: string;
  storefrontSlug?: string;
  contactEmail?: string;
  businessName?: string;
  heroImage?: string;
  isHeroFixed?: boolean;
  operationalTerms?: { title: string; description: string; fees?: { name: string; price: string }[] }[];
  industryTag?: string;
}