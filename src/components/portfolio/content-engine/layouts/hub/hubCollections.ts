/* src/components/portfolio/content-engine/layouts/hub/hubCollections.ts */
import { Capability } from '../../types';
import { HubPhoto } from './HubStoryGallery';

export interface HubCollectionPhoto extends HubPhoto {
  collection?: string;
}

export interface HubDepartmentData extends Capability {
  tabLabel?: string;
  ctaLabel?: string;
  bookingUrl?: string;
  bookingLabel?: string;
}

export interface PhotoCollectionGroup {
  name: string;
  count: number;
  coverPhoto: HubCollectionPhoto;
}

export interface ParsedCollectionBullet {
  title: string;
  body: string;
}

export function extractCollections(photos: HubCollectionPhoto[]): PhotoCollectionGroup[] {
  const map = new Map<string, PhotoCollectionGroup>();

  for (const photo of photos) {
    const raw = photo.collection?.trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, {
        name: raw,
        count: 1,
        coverPhoto: photo,
      });
    }
  }

  return Array.from(map.values());
}

export function matchBulletToCollection(
  bullet: string,
  collections: PhotoCollectionGroup[]
): PhotoCollectionGroup | null {
  const lowerBullet = bullet.toLowerCase();
  return (
    collections.find((col) => lowerBullet.includes(col.name.toLowerCase())) || null
  );
}

export function parseCollectionBullet(
  bullet: string,
  collectionName: string
): ParsedCollectionBullet {
  const trimmed = bullet.trim();
  const lowerBullet = trimmed.toLowerCase();
  const lowerName = collectionName.toLowerCase();

  if (lowerBullet.startsWith(lowerName)) {
    const remainder = trimmed
      .slice(collectionName.length)
      .replace(/^[\s—–\-:|•]+/, '')
      .trim();
    if (remainder) {
      return { title: collectionName, body: remainder };
    }
  }

  return { title: collectionName, body: trimmed };
}

export function normalizeExternalUrl(raw?: string): string {
  const trimmed = raw?.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}