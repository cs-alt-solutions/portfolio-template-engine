/* src/components/portfolio/content-engine/types.ts */

export type TimeframeMode = 'off' | 'flexible' | 'calendar';
export type AddonSelectionMode = 'single' | 'multiple';

export interface DepartmentFaq {
  question: string;
  answer: string;
}

export interface CapabilityCollectionProfile {
  name: string;
  subtitle?: string;
  bio?: string;
  highlights?: string[];
}

export interface Capability {
  title: string;
  description?: string;
  price?: string;
  bullets?: string[];
  isAlaCarte?: boolean;
  coverImage?: string;
  addons?: Array<{ title?: string; name?: string; price?: string; description?: string } | string>;
  faqs?: DepartmentFaq[];
  askTimeframe?: boolean;
  timeframeMode?: TimeframeMode;
  addonSelectionMode?: AddonSelectionMode;
  tabLabel?: string;
  ctaLabel?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  detailsLabel?: string;
  collectionProfiles?: CapabilityCollectionProfile[];
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
  collection?: string;
  price?: string;
  isVisible?: boolean;
  isRaw?: boolean;
  focalPoint?: { x: number; y: number };
  imageFit?: 'cover' | 'contain';
  imageZoom?: number;
  addons?: { name: string; price: string }[];
}

export interface CapabilityOperationalTerm {
  title: string;
  description?: string;
  type?: 'policy' | 'schedule' | string;
  appliesTo?: string;
  fees?: { name: string; price: string }[];
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
  operationalTerms?: CapabilityOperationalTerm[];
  industryTag?: string;
}