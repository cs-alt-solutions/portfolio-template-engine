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
  category?: string; // Added to support category filtering later
}

export interface ContentLayoutProps {
  themeStyle: string;
  brandColor: string;
  isLightMode: boolean;
  capabilitiesHeading: string;
  galleryHeading: string;
  capabilities: Capability[];
  galleryItems: GalleryItem[];
  
  // 🚨 ADDED: These allow the Engine to adapt to your new dashboard choices
  contentLayout?: 'classic' | 'bento' | 'sticky' | 'accordion' | 'editorial';
  aboutLayout?: 'split' | 'editorial' | 'minimal' | 'card';
}