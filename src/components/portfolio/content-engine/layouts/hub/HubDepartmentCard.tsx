/* src/components/portfolio/content-engine/layouts/hub/HubDepartmentCard.tsx */
'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Images } from 'lucide-react';
import { Capability } from '../../types';

interface HubDepartmentCardProps {
  department: Capability;
  index: number;
  hasDetails: boolean;
  detailsLabel?: string;
  isLightMode: boolean;
  isLightBrand?: boolean;
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
  fonts,
  onInquire,
  onOpenDetails,
}: HubDepartmentCardProps) {
  const panelSurface = isLightMode
    ? 'bg-white/95 border-zinc-900/10 text-zinc-900 shadow-xl'
    : 'bg-zinc-950/90 border-white/10 text-white shadow-2xl';
  const mutedText = isLightMode ? 'text-zinc-600' : 'text-zinc-300';
  const secondaryBtn = isLightMode
    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-900/10'
    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border-white/15';
  const chipSurface = isLightMode
    ? 'bg-zinc-100 border-zinc-900/10 text-zinc-700'
    : 'bg-white/5 border-white/10 text-zinc-200';
  const subCardSurface = isLightMode
    ? 'bg-zinc-50 border-zinc-900/10 text-zinc-800'
    : 'bg-black/35 border-white/10 text-zinc-200';

  const primaryBtn = isLightBrand
    ? 'bg-brand-primary text-zinc-950 border-zinc-950/15 hover:brightness-95 shadow-lg shadow-brand-primary/20'
    : 'bg-brand-primary text-white border-white/15 hover:brightness-110 shadow-lg shadow-brand-primary/25';

  const priceAccent = isLightMode && isLightBrand ? 'text-zinc-900' : 'text-brand-primary';
  const indexLabel = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
  const visibleBullets = (department.bullets || []).filter(Boolean).slice(0, 3);

  return (
    <div
      key={department.title}
      className={`rounded-3xl border backdrop-blur-2xl overflow-hidden animate-in fade-in duration-300 ${panelSurface}`}
    >
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border ${chipSurface}`}>
                <Sparkles className="w-3 h-3 text-brand-primary" />
                <span>Department {indexLabel}</span>
              </div>

              {department.price && (
                <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${priceAccent} ${chipSurface}`}>
                  {department.price}
                </span>
              )}
            </div>

            <h3 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${fonts.heading}`}>
              {department.title}
            </h3>

            {department.description && (
              <p className={`text-sm md:text-base leading-relaxed ${mutedText} ${fonts.body}`}>
                {department.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onInquire}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer ${primaryBtn}`}
            >
              <span>Quick Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {hasDetails && (
              <button
                type="button"
                onClick={onOpenDetails}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all shadow-sm cursor-pointer ${secondaryBtn}`}
              >
                <Images className="w-4 h-4 text-brand-primary" />
                <span>{detailsLabel}</span>
              </button>
            )}
          </div>
        </div>

        {visibleBullets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-current/10">
            {visibleBullets.map((bullet, bIdx) => (
              <div
                key={bIdx}
                className={`p-4 rounded-2xl border flex items-start gap-3 ${subCardSurface}`}
              >
                <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
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