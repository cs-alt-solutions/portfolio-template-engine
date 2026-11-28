/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/lookbook/LookbookPackageCard.tsx */
'use client';

import React from 'react';
import { ImageIcon, Maximize2, ArrowRight } from 'lucide-react';
import { Capability } from '../../types';
import { LOOKBOOK_DEFAULTS } from '@/utils/glossary';
import { LookbookFonts } from './types';
import SmartDeliverable from './SmartDeliverable';

interface LookbookPackageCardProps {
  capability: Capability;
  coverImage: string | null;
  hasAttachedGallery: boolean;
  themeStyle: string;
  brandTextColor: string;
  activeSecondary: string;
  isLightMode: boolean;
  shapeRadius: string;
  isSharp: boolean;
  fonts: LookbookFonts;
  bookingLabel: string;
  onOpenProof: () => void;
  onBook: () => void;
}

export default function LookbookPackageCard({
  capability,
  coverImage,
  hasAttachedGallery,
  themeStyle,
  brandTextColor,
  activeSecondary,
  isLightMode,
  shapeRadius,
  isSharp,
  fonts,
  bookingLabel,
  onOpenProof,
  onBook,
}: LookbookPackageCardProps) {
  return (
    <div
      className={`flex flex-col h-full group ${
        isLightMode ? 'bg-white border-zinc-200' : 'bg-zinc-900/50 border-white/10'
      } border ${shapeRadius} overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300`}
    >
      <div
        className="relative w-full aspect-4/3 overflow-hidden cursor-pointer bg-zinc-800 shrink-0"
        onClick={onOpenProof}
      >
        {coverImage ? (
          <>
            <img
              src={coverImage}
              alt={capability.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div
              className={`absolute inset-0 bg-${activeSecondary} mix-blend-color opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/50">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">
              {LOOKBOOK_DEFAULTS.NO_COVER_LABEL}
            </span>
          </div>
        )}

        {hasAttachedGallery && (
          <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Maximize2 size={12} className={`text-${activeSecondary}`} />
            <span className="text-[9px] text-white font-bold tracking-widest uppercase">
              {LOOKBOOK_DEFAULTS.VIEW_GALLERY_LABEL}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div
          className={`pb-4 mb-5 border-b shrink-0 ${
            isLightMode ? 'border-zinc-200' : 'border-white/10'
          }`}
        >
          <h3
            className={`text-2xl md:text-[26px] transition-colors duration-300 leading-snug text-balance ${fonts.heading} ${
              isLightMode ? 'text-zinc-900 group-hover:text-zinc-600' : 'text-zinc-100 group-hover:text-white'
            }`}
          >
            {capability.title}
          </h3>
          {capability.price && (
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-2xl font-black tracking-tight tabular-nums ${brandTextColor}`}>
                {capability.price}
              </span>
            </div>
          )}
        </div>

        {capability.description && (
          <p
            className={`text-sm leading-relaxed mb-6 shrink-0 ${fonts.body} ${
              isLightMode ? 'text-zinc-600' : 'text-zinc-400'
            } ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}
          >
            {capability.description}
          </p>
        )}

        {capability.bullets && capability.bullets.length > 0 && (
          <div className="space-y-2 mb-8 flex-1">
            {capability.bullets.map((bullet, idx) => (
              <SmartDeliverable
                key={idx}
                text={bullet}
                colorClass={brandTextColor}
                isLightMode={isLightMode}
                isSharp={isSharp}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onBook}
          className={`w-full py-4 px-4 mt-auto text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border cursor-pointer ${
            isSharp ? 'rounded-none' : 'rounded-xl'
          } ${
            isLightMode
              ? `bg-zinc-950 border-zinc-900 text-white hover:bg-${activeSecondary} hover:text-zinc-950 hover:border-transparent shadow-lg`
              : `bg-white border-white text-zinc-950 hover:bg-${activeSecondary} hover:text-zinc-950 hover:border-transparent shadow-lg`
          }`}
        >
          {bookingLabel} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}