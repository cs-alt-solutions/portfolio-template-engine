// src/components/portfolio/content-engine/types.ts

export interface Capability {
  title: string;
  description: string;
  bullets?: string[];
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
  isLightMode: boolean;
  capabilitiesHeading: string;
  galleryHeading: string;
  capabilities: Capability[];
  galleryItems: GalleryItem[];
  // 🚀 ADDED 'menu' to the available layouts
  contentLayout?: 'classic' | 'bento' | 'sticky' | 'accordion' | 'editorial' | 'menu';
  aboutLayout?: 'split' | 'editorial' | 'minimal' | 'card';
}