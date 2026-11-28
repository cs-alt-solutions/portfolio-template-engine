/* src/components/portfolio/content-engine/shared/CapabilityActionButtons.tsx */
'use client';

import React from 'react';
import { ArrowRight, ExternalLink, Info } from 'lucide-react';
import { Capability } from '../types';
import { resolveCapabilityBookingLink } from './capabilityHelpers';

interface CapabilityActionButtonsProps {
  capability: Capability;
  hasDetails: boolean;
  detailsLabel: string;
  ctaLabel: string;
  brandTextColor: string;
  activeSecondary: string;
  isLightMode: boolean;
  isSharp: boolean;
  variant?: 'solid' | 'overlay';
  compact?: boolean;
  onOpenDetails: () => void;
  onInquire: () => void;
}

export default function CapabilityActionButtons({
  capability,
  hasDetails,
  detailsLabel,
  ctaLabel,
  brandTextColor,
  activeSecondary,
  isLightMode,
  isSharp,
  variant = 'solid',
  compact = false,
  onOpenDetails,
  onInquire,
}: CapabilityActionButtonsProps) {
  const directBooking = resolveCapabilityBookingLink(capability);
  const btnRadius = isSharp ? 'rounded-none' : 'rounded-xl';
  const sizeClass = compact ? 'py-2.5 px-4 text-[10px]' : 'py-3 px-5 text-[11px]';
  const isOverlay = variant === 'overlay';

  const primaryClass = isOverlay
    ? `bg-white border-white text-zinc-950 hover:bg-${activeSecondary} hover:border-transparent`
    : isLightMode
      ? `bg-zinc-950 border-zinc-900 text-white hover:bg-${activeSecondary} hover:text-zinc-950 hover:border-transparent`
      : `bg-white border-white text-zinc-950 hover:bg-${activeSecondary} hover:text-zinc-950 hover:border-transparent`;

  const secondaryClass = isOverlay
    ? 'bg-black/50 border-white/25 text-white hover:bg-black/75 backdrop-blur-md'
    : isLightMode
      ? 'bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200'
      : 'bg-white/5 border-white/15 text-zinc-200 hover:bg-white/10 hover:text-white';

  return (
    <div
      className="flex flex-wrap items-center gap-2.5"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onInquire}
        className={`inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest border transition-all shadow-md cursor-pointer ${sizeClass} ${btnRadius} ${primaryClass}`}
      >
        <span>{ctaLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
      </button>

      {directBooking && (
        <a
          href={directBooking.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest border transition-all cursor-pointer ${sizeClass} ${btnRadius} ${secondaryClass}`}
        >
          <span>{directBooking.label}</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
      )}

      {hasDetails && (
        <button
          type="button"
          onClick={onOpenDetails}
          className={`inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest border transition-all cursor-pointer ${sizeClass} ${btnRadius} ${secondaryClass}`}
        >
          <Info className={`w-3.5 h-3.5 shrink-0 ${isOverlay ? `text-${activeSecondary}` : brandTextColor}`} />
          <span>{detailsLabel}</span>
        </button>
      )}
    </div>
  );
}