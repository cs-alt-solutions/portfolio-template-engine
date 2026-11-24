/* src/components/portfolio/content-engine/layouts/hub/HubFaqAccordion.tsx */
'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { THEME_REGISTRY } from '@/utils/themes';
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
  themeStyle = 'industrial',
  cardRadius,
  bodyFont,
}: HubFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const containerRadius = cardRadius || theme.surfaceRadius;

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
            <div
              key={idx}
              className={`border overflow-hidden transition-colors ${containerRadius} ${theme.subCardStyle}`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <span className="text-sm font-medium leading-snug">{faq.question}</span>
                <span
                  className={`p-1 shrink-0 transition-transform duration-200 ${theme.controlRadius} ${
                    isOpen ? 'rotate-180 bg-brand-primary text-zinc-950' : 'opacity-65'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className={`px-4 pb-4 pt-2 border-t ${theme.borderColor} animate-in fade-in duration-150`}>
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