/* src/components/portfolio/StorewideFaqsSection.tsx */
'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { THEME_REGISTRY } from '@/utils/themes';
import { STOREWIDE_DEFAULTS } from '@/utils/glossary';
import { getFonts } from './content-engine/utils';
import { OperationalTerm } from './content-engine/layouts/hub/PolicyCard';

interface StorewideFaqsSectionProps {
  faqs?: OperationalTerm[];
  themeStyle?: string;
  isLightMode?: boolean;
}

export default function StorewideFaqsSection({
  faqs = [],
  themeStyle = 'industrial',
}: StorewideFaqsSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const validFaqs = Array.isArray(faqs)
    ? faqs.filter((f) => f && f.title?.trim() && f.description?.trim())
    : [];

  if (validFaqs.length === 0) return null;

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const fonts = getFonts(themeStyle);

  return (
    <section className={`py-16 md:py-20 px-6 relative z-20 border-t ${theme.borderColor} ${theme.pageBg || ''}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${theme.controlRadius} ${theme.chipStyle}`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
            <span>{STOREWIDE_DEFAULTS.FAQS_BADGE}</span>
          </div>
          <h2 className={`text-3xl md:text-4xl tracking-tight ${fonts.heading}`}>
            {STOREWIDE_DEFAULTS.FAQS_HEADING}
          </h2>
          <p className={`text-sm max-w-xl ${theme.mutedText} ${fonts.body}`}>
            {STOREWIDE_DEFAULTS.FAQS_SUBTEXT}
          </p>
        </div>

        <div className="space-y-3">
          {validFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border overflow-hidden transition-colors ${theme.surfaceRadius} ${theme.subCardStyle}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className={`text-sm md:text-base font-semibold leading-snug ${fonts.body}`}>
                    {faq.title}
                  </span>
                  <span
                    className={`p-1.5 shrink-0 transition-transform duration-200 ${theme.controlRadius} ${
                      isOpen ? 'rotate-180 bg-brand-primary text-zinc-950' : 'opacity-65'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className={`px-5 pb-5 pt-2 md:px-6 border-t ${theme.borderColor} animate-in fade-in duration-150`}>
                    <p className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap opacity-85 ${fonts.body}`}>
                      {faq.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}