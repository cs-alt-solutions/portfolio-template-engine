/* src/components/portfolio/content-engine/layouts/lookbook/LookbookLogisticsModal.tsx */
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { LOOKBOOK_DEFAULTS } from '@/utils/glossary';
import { LookbookFonts, LookbookOperationalTerm } from './types';

interface LookbookLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  terms: LookbookOperationalTerm[];
  brandTextColor: string;
  isLightMode: boolean;
  shapeRadius: string;
  isSharp: boolean;
  fonts: LookbookFonts;
}

export default function LookbookLogisticsModal({
  isOpen,
  onClose,
  terms,
  brandTextColor,
  isLightMode,
  shapeRadius,
  isSharp,
  fonts,
}: LookbookLogisticsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar p-6 md:p-10 shadow-2xl ${shapeRadius} ${
          isLightMode ? 'bg-zinc-100 border border-zinc-300' : 'bg-zinc-950 border border-zinc-800'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 transition-colors cursor-pointer ${
            isSharp ? 'rounded-none' : 'rounded-full'
          } ${isLightMode ? 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}
        >
          <X size={20} />
        </button>

        <div className="mb-8 pr-12 text-center md:text-left">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest mb-4 border ${
              isSharp ? 'rounded-none' : 'rounded-full'
            } ${isLightMode ? 'bg-white border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
          >
            {LOOKBOOK_DEFAULTS.LOGISTICS_BADGE}
          </div>
          <h3 className={`text-3xl md:text-4xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
            {LOOKBOOK_DEFAULTS.LOGISTICS_HEADING}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {terms.map((term, i) => (
            <div
              key={i}
              className={`p-6 border flex flex-col ${shapeRadius} shadow-sm ${
                isLightMode ? 'bg-white border-zinc-200' : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <h4 className={`text-base font-bold uppercase tracking-wide mb-4 ${fonts.heading} ${brandTextColor}`}>
                {term.title}
              </h4>

              {term.fees && term.fees.length > 0 && (
                <div className="space-y-2 mb-4">
                  {term.fees.map((fee, fIdx) => (
                    <div
                      key={fIdx}
                      className={`flex items-center justify-between gap-3 p-2.5 border ${
                        isSharp ? 'rounded-none' : 'rounded-lg'
                      } ${isLightMode ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-950 border-zinc-800 text-zinc-200'}`}
                    >
                      <span className={`text-xs font-medium ${fonts.body}`}>{fee.name}</span>
                      <span className={`text-xs font-mono font-bold tracking-tight whitespace-nowrap ${brandTextColor}`}>
                        {fee.price}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {term.description && (
                <p className={`text-xs leading-relaxed mt-auto ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {term.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}