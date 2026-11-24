/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/hub/HubCollectionStrip.tsx */
'use client';

import React from 'react';
import { ArrowUpRight, Images } from 'lucide-react';
import { ThemeDefinition } from '@/utils/themes';
import { getThemeBullet } from '../../utils';
import {
  PhotoCollectionGroup,
  matchBulletToCollection,
  parseCollectionBullet,
} from './hubCollections';

interface HubCollectionStripProps {
  bullets: string[];
  collections: PhotoCollectionGroup[];
  theme: ThemeDefinition;
  themeStyle: string;
  fonts: { heading: string; body: string };
  onSelectCollection: (collectionName: string) => void;
}

function getGridClass(count: number): string {
  if (count <= 1) return 'grid-cols-1 max-w-xl';
  if (count === 2 || count === 4) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-3';
}

export default function HubCollectionStrip({
  bullets,
  collections,
  theme,
  themeStyle,
  fonts,
  onSelectCollection,
}: HubCollectionStripProps) {
  const cleanBullets = (bullets || []).filter(Boolean);

  // Standard department (no sub-collections): render up to 4 clean highlight cards
  if (collections.length === 0) {
    const visibleBullets = cleanBullets.slice(0, 4);
    if (visibleBullets.length === 0) return null;

    return (
      <div className={`grid ${getGridClass(visibleBullets.length)} gap-3 pt-5 border-t ${theme.borderColor}`}>
        {visibleBullets.map((bullet, bIdx) => (
          <div
            key={bIdx}
            className={`p-4 border flex items-start gap-3 ${theme.controlRadius} ${theme.subCardStyle}`}
          >
            {getThemeBullet(themeStyle, 'text-brand-primary')}
            <span className={`text-xs md:text-sm leading-relaxed ${fonts.body}`}>
              {bullet}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Option B: Pair any matching bullets (e.g. Artist bios / Build specs) with their collection
  const matchedCollectionKeys = new Set<string>();
  const unmatchedBullets: string[] = [];

  const spotlightItems: Array<{
    collection: PhotoCollectionGroup;
    title: string;
    body: string;
  }> = [];

  for (const bullet of cleanBullets) {
    const matched = matchBulletToCollection(bullet, collections);
    if (matched && !matchedCollectionKeys.has(matched.name.toLowerCase())) {
      matchedCollectionKeys.add(matched.name.toLowerCase());
      const parsed = parseCollectionBullet(bullet, matched.name);
      spotlightItems.push({
        collection: matched,
        title: parsed.title,
        body: parsed.body,
      });
    } else {
      unmatchedBullets.push(bullet);
    }
  }

  // Any remaining collections without bullets still appear as clickable visual cards
  for (const col of collections) {
    if (!matchedCollectionKeys.has(col.name.toLowerCase())) {
      spotlightItems.push({
        collection: col,
        title: col.name,
        body: col.coverPhoto.description || '',
      });
    }
  }

  return (
    <div className={`pt-5 border-t ${theme.borderColor} space-y-4`}>
      <div className={`grid ${getGridClass(spotlightItems.length)} gap-3.5`}>
        {spotlightItems.map(({ collection, title, body }) => {
          const { coverPhoto } = collection;
          const fp = coverPhoto.focalPoint || { x: 50, y: 50 };
          const isContain = coverPhoto.imageFit === 'contain';
          const zoom = !isContain && coverPhoto.imageZoom ? coverPhoto.imageZoom : 1;

          return (
            <button
              key={collection.name}
              type="button"
              onClick={() => onSelectCollection(collection.name)}
              className={`group text-left p-4 border transition-all duration-300 hover:border-brand-primary/60 flex flex-col sm:flex-row items-start gap-4 cursor-pointer ${theme.controlRadius} ${theme.subCardStyle}`}
            >
              {/* Cover Thumbnail (respects Drop Vault framing) */}
              <div
                className={`relative w-full sm:w-24 aspect-16/10 sm:aspect-square shrink-0 overflow-hidden border ${theme.borderColor} bg-black/30 ${theme.controlRadius}`}
              >
                <img
                  src={coverPhoto.url}
                  alt={title}
                  className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                    isContain ? 'object-contain' : 'object-cover'
                  }`}
                  style={{
                    objectPosition: `${fp.x}% ${fp.y}%`,
                    transform: zoom > 1 ? `scale(${zoom})` : undefined,
                  }}
                />
              </div>

              {/* Details & Clickable Portfolio Cue */}
              <div className="min-w-0 flex-1 flex flex-col justify-between gap-2 self-stretch">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm md:text-base leading-snug truncate ${fonts.heading}`}>
                      {title}
                    </h4>
                    <ArrowUpRight className="w-4 h-4 text-brand-primary shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {body && (
                    <p className={`text-xs leading-relaxed line-clamp-3 ${theme.mutedText} ${fonts.body}`}>
                      {body}
                    </p>
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-brand-primary pt-1">
                  <Images className="w-3 h-3" />
                  <span>
                    View Work ({collection.count})
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render any remaining unmatched highlights cleanly underneath */}
      {unmatchedBullets.length > 0 && (
        <div className={`grid ${getGridClass(unmatchedBullets.slice(0, 3).length)} gap-3`}>
          {unmatchedBullets.slice(0, 3).map((bullet, idx) => (
            <div
              key={idx}
              className={`p-3.5 border flex items-start gap-2.5 ${theme.controlRadius} ${theme.subCardStyle}`}
            >
              {getThemeBullet(themeStyle, 'text-brand-primary')}
              <span className={`text-xs leading-relaxed ${fonts.body}`}>{bullet}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}