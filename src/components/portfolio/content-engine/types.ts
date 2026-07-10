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
}

export interface ContentLayoutProps {
  themeStyle: string;
  brandColor: string;
  isLightMode: boolean;
  capabilitiesHeading: string;
  galleryHeading: string;
  capabilities: Capability[];
  galleryItems: GalleryItem[];
}