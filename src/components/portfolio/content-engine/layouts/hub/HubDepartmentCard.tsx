/* src/components/portfolio/content-engine/layouts/hub/HubDepartmentCard.tsx */
'use client';

import React from 'react';
import { ArrowRight, Sparkles, Images } from 'lucide-react';
import { THEME_REGISTRY, ThemeDefinition } from '@/utils/themes';
import { getThemeBullet } from '../../utils';
import { Capability } from '../../types';

interface HubDepartmentCardProps {
  department: Capability;
  index: number;
  hasDetails: boolean;
  detailsLabel?: string;
  isLightMode: boolean;
  isLightBrand?: boolean;
  theme?: ThemeDefinition;
  themeStyle?: string;
  fonts: { heading: string; body: string };
  onInquire: () => void;
  onOpenDetails: () => void;
}

export default function HubDepartmentCard({
  department,
  index,
  hasDetails,
  detailsLabel = 'Photos & Details',
  isLightMode,
  isLightBrand = false,
  theme: passedTheme,
  themeStyle = 'industrial',
  fonts,
  onInquire,
  onOpenDetails,
}: HubDepartmentCardProps) {
  const theme = passedTheme || THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];

  const primaryBtn = isLightBrand
    ? 'bg-brand-primary text-zinc-950 border-brand-primary hover:brightness-95 shadow-lg shadow-brand-primary/20'
    : 'bg-brand-primary text-white border-brand-primary hover:brightness-110 shadow-lg shadow-brand-primary/25';

  const priceAccent = isLightMode && isLightBrand ? 'text-zinc-900' : 'text-brand-primary';
  const indexLabel = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
  const visibleBullets = (department.bullets || []).filter(Boolean).slice(0, 3);

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
              <span>Quick Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>

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

        {visibleBullets.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-5 border-t ${theme.borderColor}`}>
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
        )}
      </div>
    </div>
  );
}