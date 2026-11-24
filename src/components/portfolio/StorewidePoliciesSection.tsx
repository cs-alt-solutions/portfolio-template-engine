/* src/components/portfolio/StorewidePoliciesSection.tsx */
'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { THEME_REGISTRY } from '@/utils/themes';
import { getFonts } from './content-engine/utils';
import PolicyCard, { OperationalTerm } from './content-engine/layouts/hub/PolicyCard';

interface StorewidePoliciesSectionProps {
  terms?: OperationalTerm[];
  themeStyle?: string;
  isLightMode?: boolean;
  industryTag?: string;
}

export default function StorewidePoliciesSection({
  terms = [],
  themeStyle = 'industrial',
  isLightMode = false,
  industryTag = 'General',
}: StorewidePoliciesSectionProps) {
  const validTerms = Array.isArray(terms)
    ? terms.filter((t) => t && t.title?.trim())
    : [];

  if (validTerms.length === 0) return null;

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const fonts = getFonts(themeStyle);

  const sectionHeading =
    industryTag === 'Creative'
      ? 'Studio Policies & Good to Know'
      : industryTag === 'Culinary'
        ? 'House Policies & Kitchen Notes'
        : 'Policies & Good to Know';

  const gridCols =
    validTerms.length === 1
      ? 'grid-cols-1 max-w-2xl mx-auto'
      : validTerms.length === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className={`py-14 px-6 relative z-20 border-t ${theme.borderColor}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${theme.controlRadius} ${theme.chipStyle}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
            <span>Storewide Info</span>
          </div>
          <h2 className={`text-2xl md:text-3xl tracking-tight ${fonts.heading}`}>
            {sectionHeading}
          </h2>
        </div>

        <div className={`grid ${gridCols} gap-4`}>
          {validTerms.map((term, idx) => (
            <PolicyCard
              key={idx}
              term={term}
              isLightMode={isLightMode}
              themeStyle={themeStyle}
              bodyFont={fonts.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}