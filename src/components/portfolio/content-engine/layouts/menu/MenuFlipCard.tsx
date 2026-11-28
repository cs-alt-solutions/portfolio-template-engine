/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/menu/MenuFlipCard.tsx */
'use client';

import React, { useState } from 'react';
import { MENU_DEFAULTS } from '@/utils/glossary';
import { UnifiedMenuItem, formatVariantPrice } from './menuHelpers';

interface MenuFlipCardProps {
  item: UnifiedMenuItem;
  isLightMode?: boolean;
  fonts: { heading: string; body: string; accent: string };
  brandColor: string;
  secondaryBrandColor: string;
  brandTextColor: string;
  themeRadius: string;
}

export default function MenuFlipCard({
  item,
  isLightMode,
  fonts,
  brandColor,
  secondaryBrandColor,
  brandTextColor,
  themeRadius,
}: MenuFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isPhoto = item.type === 'photo' && Boolean(item.imageUrl);
  const hasAddons = Boolean(item.addons && item.addons.length > 0);
  const canFlip = Boolean(item.desc || hasAddons);
  const fp = item.focalPoint || { x: 50, y: 50 };

  return (
    <div
      className={`relative aspect-4/3 group perspective-[1000px] w-full h-full ${canFlip ? 'cursor-pointer' : ''}`}
      onClick={() => canFlip && setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-3d ${
          isFlipped ? 'transform-[rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden shadow-xl border ${themeRadius} overflow-hidden ${
            isPhoto
              ? `bg-zinc-900 ${isLightMode ? 'border-zinc-200' : 'border-white/10'}`
              : isLightMode
                ? 'bg-zinc-50 border-zinc-200'
                : 'bg-zinc-900 border-white/10'
          }`}
        >
          {isPhoto ? (
            <>
              <img
                src={item.imageUrl}
                alt={item.title || MENU_DEFAULTS.FALLBACK_ITEM_ALT}
                style={{ objectPosition: `${fp.x}% ${fp.y}%` }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className={`absolute inset-0 bg-linear-to-t ${
                  isLightMode ? 'from-black/85 via-black/20' : 'from-black/90 via-black/30'
                } to-transparent opacity-90`}
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 opacity-[0.02] bg-[url('/grid.svg')] pointer-events-none" />
              <div className={`absolute -top-12 -left-12 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />
            </>
          )}

          <div className="absolute inset-0 p-3 sm:p-4 md:p-5 flex flex-col justify-end">
            <div className="flex justify-between items-end gap-2">
              <div className="flex-1 min-w-0 pr-1">
                {item.title && (
                  <h4
                    className={`text-sm sm:text-base md:text-lg font-black leading-tight text-balance line-clamp-2 ${fonts.heading} ${
                      isPhoto
                        ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                        : isLightMode
                          ? 'text-zinc-900'
                          : 'text-zinc-100'
                    }`}
                  >
                    {item.title}
                    {item.isRaw && <span className="text-rose-500 ml-1 leading-none">*</span>}
                  </h4>
                )}
                {canFlip && (
                  <span
                    className={`text-[8px] sm:text-[9px] uppercase tracking-widest font-bold mt-1 block sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ${
                      isPhoto ? 'text-white/80' : isLightMode ? 'text-zinc-500' : 'text-zinc-400'
                    }`}
                  >
                    {MENU_DEFAULTS.TAP_FOR_INFO}
                  </span>
                )}
              </div>

              {item.price && (
                <div
                  className={`relative z-20 shrink-0 bg-${brandColor} text-zinc-950 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.4)] transform -rotate-3`}
                >
                  <span className={`text-xs sm:text-sm md:text-base font-black tracking-tight tabular-nums ${fonts.body}`}>
                    {item.price}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] shadow-xl border ${
            isLightMode ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'
          } ${themeRadius} relative`}
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')] pointer-events-none rounded-[inherit]" />
          <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />
          <div className={`absolute -bottom-12 -left-12 w-32 h-32 bg-${brandColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />

          <div className="absolute inset-0 p-3 sm:p-5 flex flex-col items-center justify-center overflow-y-auto hide-scrollbar z-10">
            <div className="w-full text-center flex flex-col items-center">
              {item.desc && (
                <>
                  <span
                    className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${brandTextColor} mb-1.5 sm:mb-2 flex items-center justify-center gap-1.5 w-full`}
                  >
                    <span className="w-2 sm:w-3 h-px bg-current opacity-50" />
                    {MENU_DEFAULTS.DETAILS_LABEL}
                    <span className="w-2 sm:w-3 h-px bg-current opacity-50" />
                  </span>
                  <p className={`text-xs sm:text-sm leading-snug sm:leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    {item.desc}
                  </p>
                </>
              )}

              {hasAddons && (
                <div
                  className={`w-full text-left space-y-1.5 pt-3 ${item.desc ? 'mt-3 border-t' : ''} ${
                    isLightMode ? 'border-zinc-200' : 'border-zinc-800/80'
                  } shrink-0`}
                >
                  <span
                    className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-70 block mb-2 ${
                      isLightMode ? 'text-zinc-500' : 'text-zinc-400'
                    }`}
                  >
                    {MENU_DEFAULTS.OPTIONS_LABEL}
                  </span>
                  {item.addons!.map((addon, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center text-[10px] sm:text-[11px] uppercase tracking-wider font-bold border-b pb-1.5 mb-1.5 border-dashed ${
                        isLightMode ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-300'
                      } last:border-0 last:mb-0 last:pb-0`}
                    >
                      <span className="pr-2 truncate">{addon.name}</span>
                      <span
                        className={`shrink-0 px-1.5 py-0.5 rounded bg-${secondaryBrandColor}/10 text-${secondaryBrandColor} border border-${secondaryBrandColor}/20 shadow-sm`}
                      >
                        {formatVariantPrice(addon.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}