// src/components/portfolio/content-engine/types.ts
export interface Capability {
  title: string;
  description: string;
  bullets?: string[];
  price?: string; 
  isAlaCarte?: boolean; // 🚀 THE FIX: Tells TS this flag exists
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
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
}