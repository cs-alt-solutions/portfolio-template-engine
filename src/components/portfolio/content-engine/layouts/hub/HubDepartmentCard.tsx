/* src/components/portfolio/content-engine/layouts/hub/HubDepartmentCard.tsx */
'use client';

import React from 'react';
import { ArrowRight, Sparkles, Images, ExternalLink } from 'lucide-react';
import { THEME_REGISTRY, ThemeDefinition } from '@/utils/themes';
import HubCollectionStrip from './HubCollectionStrip';
import {
  HubDepartmentData,
  PhotoCollectionGroup,
  normalizeExternalUrl,
} from './hubCollections';

interface HubDepartmentCardProps {
  department: HubDepartmentData;
  index: number;
  hasDetails: boolean;
  detailsLabel?: string;
  collections?: PhotoCollectionGroup[];
  isLightMode: boolean;
  isLightBrand?: boolean;
  theme?: ThemeDefinition;
  themeStyle?: string;
  fonts: { heading: string; body: string };
  onInquire: () => void;
  onOpenDetails: () => void;
  onSelectCollection?: (collectionName: string) => void;
}

export default function HubDepartmentCard({
  department,
  index,
  hasDetails,
  detailsLabel = 'Photos & Details',
  collections = [],
  isLightMode,
  isLightBrand = false,
  theme: passedTheme,
  themeStyle = 'industrial',
  fonts,
  onInquire,
  onOpenDetails,
  onSelectCollection,
}: HubDepartmentCardProps) {
  const theme = passedTheme || THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];

  const primaryBtn = isLightBrand
    ? 'bg-brand-primary text-zinc-950 border-brand-primary hover:brightness-95 shadow-lg shadow-brand-primary/20'
    : 'bg-brand-primary text-white border-brand-primary hover:brightness-110 shadow-lg shadow-brand-primary/25';

  const priceAccent = isLightMode && isLightBrand ? 'text-zinc-900' : 'text-brand-primary';
  const indexLabel = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
  const ctaText = department.ctaLabel?.trim() || 'Quick Inquiry';
  const bookingHref = normalizeExternalUrl(department.bookingUrl);
  const bookingText = department.bookingLabel?.trim() || 'Book Online';

  return (
    <div
      key={department.title}
      className={`overflow-hidden animate-in fade-in duration-300 ${theme.surfaceRadius} ${theme.surfaceStyle}`}
    >
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${theme.controlRadius} ${theme.chipStyle}`}
              >
                <Sparkles className="w-3 h-3 text-brand-primary" />
                <span>Department {indexLabel}</span>
              </div>

              {department.price && (
                <span
                  className={`px-3 py-1 text-[11px] font-mono font-bold border ${theme.controlRadius} ${priceAccent} ${theme.chipStyle}`}
                >
                  {department.price}
                </span>
              )}
            </div>

            <h3 className={`text-2xl md:text-4xl leading-tight ${fonts.heading}`}>
              {department.title}
            </h3>

            {department.description && (
              <p className={`text-sm md:text-base leading-relaxed ${theme.mutedText} ${fonts.body}`}>
                {department.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onInquire}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs border transition-all cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${primaryBtn}`}
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {bookingHref && (
              <a
                href={bookingHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs border transition-all shadow-sm cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${theme.pillStyle}`}
              >
                <span>{bookingText}</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-primary" />
              </a>
            )}

            {hasDetails && (
              <button
                type="button"
                onClick={onOpenDetails}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs border transition-all shadow-sm cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${theme.pillStyle}`}
              >
                <Images className="w-4 h-4 text-brand-primary" />
                <span>{detailsLabel}</span>
              </button>
            )}
          </div>
        </div>

        <HubCollectionStrip
          bullets={department.bullets || []}
          collections={collections}
          theme={theme}
          themeStyle={themeStyle}
          fonts={fonts}
          onSelectCollection={(name) =>
            onSelectCollection ? onSelectCollection(name) : onOpenDetails()
          }
        />
      </div>
    </div>
  );
}