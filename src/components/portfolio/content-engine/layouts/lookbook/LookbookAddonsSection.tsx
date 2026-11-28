/* src/components/portfolio/content-engine/layouts/lookbook/LookbookAddonsSection.tsx */
'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Capability } from '../../types';
import { LOOKBOOK_DEFAULTS } from '@/utils/glossary';
import { LookbookFonts } from './types';

interface LookbookAddonsSectionProps {
  items: Capability[];
  activeSecondary: string;
  isLightMode: boolean;
  shapeRadius: string;
  isSharp: boolean;
  fonts: LookbookFonts;
}

export default function LookbookAddonsSection({
  items,
  activeSecondary,
  isLightMode,
  shapeRadius,
  isSharp,
  fonts,
}: LookbookAddonsSectionProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={`mt-20 mb-12 max-w-5xl mx-auto border p-8 md:p-12 shadow-xl backdrop-blur-md ${
        isLightMode ? 'bg-zinc-50/70 border-zinc-200' : 'bg-black/40 border-zinc-800/80'
      } ${shapeRadius}`}
    >
      <div className="text-center mb-10">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-mono font-bold uppercase tracking-widest mb-3 ${
            isSharp ? 'rounded-none' : 'rounded-full'
          } ${isLightMode ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
        >
          <Plus size={12} /> {LOOKBOOK_DEFAULTS.ADDONS_BADGE}
        </div>
        <h3 className={`text-3xl md:text-4xl ${fonts.heading} text-${activeSecondary}`}>
          {LOOKBOOK_DEFAULTS.ADDONS_HEADING}
        </h3>
        <p className={`text-xs md:text-sm mt-2 font-light ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
          {LOOKBOOK_DEFAULTS.ADDONS_SUBTEXT}
        </p>
      </div>

      <div className={`grid gap-4 ${items.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
        {items.map((cap, i) => {
          const isOrphanLast = items.length > 1 && items.length % 2 === 1 && i === items.length - 1;

          return (
            <div
              key={i}
              className={`flex items-start justify-between gap-4 p-5 md:p-6 border transition-all shadow-sm ${
                isOrphanLast ? 'md:col-span-2' : ''
              } ${
                isLightMode
                  ? 'bg-white border-zinc-200 hover:border-zinc-300'
                  : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
              } ${shapeRadius}`}
            >
              <div className="space-y-1.5 min-w-0">
                <h4 className={`text-base font-bold leading-snug ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                  {cap.title}
                </h4>
                {cap.description && (
                  <p className={`text-xs font-light leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    {cap.description}
                  </p>
                )}
              </div>
              {cap.price && (
                <span
                  className={`text-sm md:text-base font-black shrink-0 whitespace-nowrap px-3 py-1.5 border font-mono tabular-nums text-${activeSecondary} ${
                    isSharp ? 'rounded-none' : 'rounded-xl'
                  } ${isLightMode ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}
                >
                  {cap.price}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}