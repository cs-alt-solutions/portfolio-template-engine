/* src/components/portfolio/content-engine/layouts/hub/hubCollections.ts */
import { Capability } from '../../types';
import { HubPhoto } from './HubStoryGallery';

export interface HubCollectionPhoto extends HubPhoto {
  collection?: string;
}

export interface CollectionProfile {
  name: string;
  subtitle?: string;
  bio?: string;
  highlights?: string[];
}

export interface HubDepartmentData extends Capability {
  tabLabel?: string;
  ctaLabel?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  collectionProfiles?: CollectionProfile[];
}

export interface PhotoCollectionGroup {
  name: string;
  count: number;
  coverPhoto?: HubCollectionPhoto;
}

export interface MergedSpotlightEntry {
  name: string;
  subtitle: string;
  bio: string;
  highlights: string[];
  photoCount: number;
  coverPhoto?: HubCollectionPhoto;
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

export function getValidProfiles(profiles?: CollectionProfile[]): CollectionProfile[] {
  if (!Array.isArray(profiles)) return [];
  return profiles.filter((p) => p && p.name?.trim());
}

export function findCollectionProfile(
  profiles: CollectionProfile[] | undefined,
  name: string
): CollectionProfile | undefined {
  const target = name.trim().toLowerCase();
  if (!target) return undefined;
  return getValidProfiles(profiles).find(
    (p) => p.name.trim().toLowerCase() === target
  );
}

export function mergeCollectionsWithProfiles(
  collections: PhotoCollectionGroup[],
  profiles?: CollectionProfile[]
): MergedSpotlightEntry[] {
  const validProfiles = getValidProfiles(profiles);
  const collectionMap = new Map<string, PhotoCollectionGroup>();

  for (const col of collections) {
    collectionMap.set(col.name.trim().toLowerCase(), col);
  }

  const seen = new Set<string>();
  const merged: MergedSpotlightEntry[] = [];

  // 1. Respect explicit HQ profile order first (e.g., Amie Grant -> Joseph Menicocci)
  for (const profile of validProfiles) {
    const key = profile.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const matchedCol = collectionMap.get(key);
    merged.push({
      name: profile.name.trim(),
      subtitle: profile.subtitle?.trim() || '',
      bio: profile.bio?.trim() || '',
      highlights: (profile.highlights || []).map((h) => h.trim()).filter(Boolean),
      photoCount: matchedCol?.count || 0,
      coverPhoto: matchedCol?.coverPhoto,
    });
  }

  // 2. Append any photo-only collections that don't have a profile yet
  for (const col of collections) {
    const key = col.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    merged.push({
      name: col.name.trim(),
      subtitle: '',
      bio: col.coverPhoto?.description?.trim() || '',
      highlights: [],
      photoCount: col.count,
      coverPhoto: col.coverPhoto,
    });
  }

  return merged;
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