/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/hub/HubCollectionStrip.tsx */
'use client';

import React from 'react';
import { ArrowUpRight, Images, UserRound } from 'lucide-react';
import { ThemeDefinition } from '@/utils/themes';
import { getThemeBullet } from '../../utils';
import {
  CollectionProfile,
  PhotoCollectionGroup,
  mergeCollectionsWithProfiles,
  matchBulletToCollection,
  parseCollectionBullet,
} from './hubCollections';

interface HubCollectionStripProps {
  bullets: string[];
  collections: PhotoCollectionGroup[];
  profiles?: CollectionProfile[];
  theme: ThemeDefinition;
  themeStyle: string;
  fonts: { heading: string; body: string };
  onSelectCollection: (collectionName: string) => void;
}

function getGridClass(count: number): string {
  if (count <= 1) return 'grid-cols-1 max-w-2xl';
  if (count === 2 || count === 4) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-3';
}

export default function HubCollectionStrip({
  bullets,
  collections,
  profiles = [],
  theme,
  themeStyle,
  fonts,
  onSelectCollection,
}: HubCollectionStripProps) {
  const cleanBullets = (bullets || []).filter(Boolean);
  const mergedEntries = mergeCollectionsWithProfiles(collections, profiles);

  // Standard department (no sub-collections or profiles): up to 4 clean highlight cards
  if (mergedEntries.length === 0) {
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

  // Backwards-compatible bullet fallback if a collection has no dedicated profile bio yet
  const matchedBulletIndices = new Set<number>();
  const spotlightCards = mergedEntries.map((entry) => {
    let bio = entry.bio;
    if (!bio && cleanBullets.length > 0) {
      const idx = cleanBullets.findIndex(
        (b, i) => !matchedBulletIndices.has(i) && b.toLowerCase().includes(entry.name.toLowerCase())
      );
      if (idx !== -1) {
        matchedBulletIndices.add(idx);
        const colMatch = matchBulletToCollection(cleanBullets[idx], collections);
        bio = parseCollectionBullet(cleanBullets[idx], colMatch?.name || entry.name).body;
      }
    }
    return { ...entry, bio };
  });

  const remainingBullets = cleanBullets.filter((_, idx) => !matchedBulletIndices.has(idx));

  return (
    <div className={`pt-5 border-t ${theme.borderColor} space-y-4`}>
      <div className={`grid ${getGridClass(spotlightCards.length)} gap-4`}>
        {spotlightCards.map((card) => {
          const cover = card.coverPhoto;
          const fp = cover?.focalPoint || { x: 50, y: 50 };
          const isContain = cover?.imageFit === 'contain';
          const zoom = !isContain && cover?.imageZoom ? cover.imageZoom : 1;
          const previewHighlights = card.highlights.slice(0, 3);
          const extraHighlightCount = Math.max(0, card.highlights.length - previewHighlights.length);

          const ctaCue =
            card.photoCount > 0 && card.bio
              ? `Bio & Work (${card.photoCount})`
              : card.photoCount > 0
                ? `View Work (${card.photoCount})`
                : 'Read Full Bio';

          return (
            <button
              key={card.name}
              type="button"
              onClick={() => onSelectCollection(card.name)}
              className={`group text-left p-4 md:p-5 border transition-all duration-300 hover:border-brand-primary/60 flex flex-col gap-3.5 cursor-pointer ${theme.controlRadius} ${theme.subCardStyle}`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
                {cover && (
                  <div
                    className={`relative w-full sm:w-24 aspect-16/10 sm:aspect-square shrink-0 overflow-hidden border ${theme.borderColor} bg-black/30 ${theme.controlRadius}`}
                  >
                    <img
                      src={cover.url}
                      alt={card.name}
                      className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                        isContain ? 'object-contain' : 'object-cover'
                      }`}
                      style={{
                        objectPosition: `${fp.x}% ${fp.y}%`,
                        transform: zoom > 1 ? `scale(${zoom})` : undefined,
                      }}
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className={`text-base md:text-lg leading-snug truncate ${fonts.heading}`}>
                        {card.name}
                      </h4>
                      {card.subtitle && (
                        <p className="text-[10px] font-mono uppercase tracking-widest text-brand-primary mt-0.5 truncate">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-primary shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {card.bio && (
                    <p className={`text-xs leading-relaxed line-clamp-3 ${theme.mutedText} ${fonts.body}`}>
                      {card.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Grouped Highlights / Specialties specific to this Artist or Project */}
              {previewHighlights.length > 0 && (
                <div className={`flex flex-wrap items-center gap-1.5 pt-2.5 border-t ${theme.borderColor}`}>
                  {previewHighlights.map((hl, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] border ${theme.controlRadius} ${theme.chipStyle} ${fonts.body}`}
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-primary shrink-0" />
                      <span className="truncate max-w-52">{hl}</span>
                    </span>
                  ))}
                  {extraHighlightCount > 0 && (
                    <span className="text-[10px] font-mono opacity-65 px-1">
                      +{extraHighlightCount} more
                    </span>
                  )}
                </div>
              )}

              {/* Action Footer */}
              <div className="mt-auto inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-brand-primary pt-1">
                {card.photoCount > 0 ? <Images className="w-3 h-3" /> : <UserRound className="w-3 h-3" />}
                <span>{ctaCue}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* General Department Highlights (optional, shown cleanly underneath Spotlight Cards) */}
      {remainingBullets.length > 0 && (
        <div className={`grid ${getGridClass(remainingBullets.slice(0, 4).length)} gap-3`}>
          {remainingBullets.slice(0, 4).map((bullet, idx) => (
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