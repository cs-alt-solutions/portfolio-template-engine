/* src/components/portfolio/content-engine/layouts/lookbook/types.ts */
import { GalleryItem } from '../../../ServiceProofModal';

export interface ExtendedGalleryItem extends GalleryItem {
  addons?: { name: string; price: string }[];
}

export interface ModalServiceState {
  title: string;
  images: ExtendedGalleryItem[];
  desc?: string;
  bullets?: string[];
  addons?: { name: string; price: string }[];
}

export interface LookbookOperationalTerm {
  title: string;
  description?: string;
  appliesTo?: string;
  fees?: { name: string; price: string }[];
}

export interface LookbookFonts {
  heading: string;
  body: string;
}