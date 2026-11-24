/* src/components/portfolio/content-engine/layouts/hub/HubFaqAccordion.tsx */
'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { HUB_DETAILS_DEFAULTS } from '@/utils/glossary';
import { DepartmentFaq } from '../../types';

interface HubFaqAccordionProps {
  faqs: DepartmentFaq[];
  isLightMode: boolean;
  themeStyle?: string;
  cardRadius: string;
  bodyFont: string;
}

export default function HubFaqAccordion({
  faqs,
  isLightMode,
  themeStyle = 'industrial',
  cardRadius,
  bodyFont,
}: HubFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  const isMidnight = themeStyle === 'midnight';
  const itemSurface = isLightMode
    ? 'bg-white/85 border-zinc-900/10 text-zinc-900'
    : isMidnight
      ? 'bg-zinc-950/90 border-white/10 text-white'
      : 'bg-zinc-900/75 border-white/10 text-white';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest opacity-80">
        <HelpCircle className="w-3.5 h-3.5 opacity-80" />
        <span>{HUB_DETAILS_DEFAULTS.FAQS_HEADING}</span>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`border overflow-hidden transition-colors ${cardRadius} ${itemSurface}`}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <span className="text-sm font-bold leading-snug">{faq.question}</span>
                <span
                  className={`p-1 rounded-md shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-brand-primary text-white' : 'opacity-65'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-current/10 animate-in fade-in duration-150">
                  <p className={`text-sm leading-relaxed opacity-85 ${bodyFont}`}>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}