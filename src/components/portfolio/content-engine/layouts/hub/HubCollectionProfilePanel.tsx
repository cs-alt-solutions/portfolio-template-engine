/* src/components/portfolio/content-engine/layouts/hub/HubCollectionProfilePanel.tsx */
'use client';

import React from 'react';
import { ArrowUpRight, Sparkles, UserRound } from 'lucide-react';
import { ThemeDefinition } from '@/utils/themes';
import { getThemeBullet } from '../../utils';
import { MergedSpotlightEntry } from './hubCollections';

interface HubCollectionProfilePanelProps {
  activeEntry?: MergedSpotlightEntry;
  allEntries: MergedSpotlightEntry[];
  isViewingAll: boolean;
  theme: ThemeDefinition;
  themeStyle: string;
  fonts: { heading: string; body: string };
  onSelectEntry: (name: string) => void;
}

export default function HubCollectionProfilePanel({
  activeEntry,
  allEntries,
  isViewingAll,
  theme,
  themeStyle,
  fonts,
  onSelectEntry,
}: HubCollectionProfilePanelProps) {
  // Single Artist / Project Full Spotlight View
  if (!isViewingAll && activeEntry) {
    const hasBio = Boolean(activeEntry.bio);
    const hasHighlights = activeEntry.highlights.length > 0;
    const hasSubtitle = Boolean(activeEntry.subtitle);

    if (!hasBio && !hasHighlights && !hasSubtitle) return null;

    return (
      <div className={`p-5 md:p-6 border space-y-4 ${theme.surfaceRadius} ${theme.subCardStyle}`}>
        <div className="space-y-1">
          {hasSubtitle && (
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-brand-primary">
              <Sparkles className="w-3 h-3" />
              <span>{activeEntry.subtitle}</span>
            </div>
          )}
          <h5 className={`text-xl md:text-2xl leading-tight ${fonts.heading}`}>
            {activeEntry.name}
          </h5>
        </div>

        {hasBio && (
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${theme.mutedText} ${fonts.body}`}>
            {activeEntry.bio}
          </p>
        )}

        {hasHighlights && (
          <div className={`pt-4 border-t ${theme.borderColor} space-y-2.5`}>
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-70 block">
              Highlights & Specialties
            </span>
            <ul className="space-y-2">
              {activeEntry.highlights.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  {getThemeBullet(themeStyle, 'text-brand-primary')}
                  <span className={`text-xs md:text-sm leading-relaxed ${fonts.body}`}>
                    {hl}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // "All" View: Quick-jump Profile Directory
  const entriesWithDetails = allEntries.filter(
    (e) => e.bio || e.subtitle || e.highlights.length > 0
  );

  if (!isViewingAll || entriesWithDetails.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest opacity-80">
        <UserRound className="w-3.5 h-3.5 text-brand-primary" />
        <span>Featured Profiles</span>
      </div>

      <div className="space-y-2.5">
        {entriesWithDetails.map((entry) => (
          <button
            key={entry.name}
            type="button"
            onClick={() => onSelectEntry(entry.name)}
            className={`group w-full text-left p-4 border transition-all hover:border-brand-primary/60 space-y-1.5 cursor-pointer ${theme.controlRadius} ${theme.subCardStyle}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h5 className={`text-sm md:text-base leading-snug truncate ${fonts.heading}`}>
                  {entry.name}
                </h5>
                {entry.subtitle && (
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-primary">
                    {entry.subtitle}
                  </p>
                )}
              </div>
              <ArrowUpRight className="w-4 h-4 text-brand-primary shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            {entry.bio && (
              <p className={`text-xs leading-relaxed line-clamp-2 ${theme.mutedText} ${fonts.body}`}>
                {entry.bio}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}