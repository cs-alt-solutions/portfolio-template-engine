// src/components/portfolio/content-engine/utils.tsx
import React from 'react';
import { Check, ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';

export const getFonts = (style: string) => {
  if (['elegant', 'organic', 'editorial'].includes(style)) {
    return {
      heading: 'font-serif tracking-normal font-normal',
      body: 'font-serif font-light',
      accent: 'font-serif italic tracking-widest text-sm'
    };
  }
  if (['cyberpunk', 'blueprint', 'industrial'].includes(style)) {
    return {
      heading: 'font-mono uppercase font-bold tracking-tighter',
      body: 'font-mono text-sm',
      accent: 'font-mono uppercase tracking-[0.2em] font-bold text-xs'
    };
  }
  if (['neo', 'retropop'].includes(style)) {
    return {
      heading: 'font-sans font-black tracking-tighter uppercase',
      body: 'font-sans font-medium',
      accent: 'font-sans font-black uppercase tracking-widest text-xs'
    };
  }
  return {
    heading: 'font-sans font-bold tracking-tight',
    body: 'font-sans font-light',
    accent: 'font-sans font-bold uppercase tracking-[0.2em] text-xs'
  };
};

export const getThemeBullet = (style: string, colorClass: string) => {
  if (['cyberpunk', 'blueprint', 'industrial'].includes(style)) {
    return <ChevronRight className={`shrink-0 mt-1 ${colorClass}`} size={20} strokeWidth={3} />;
  }
  if (['neo', 'retropop'].includes(style)) {
    return <ArrowRight className={`shrink-0 mt-1 text-black`} size={20} strokeWidth={4} />;
  }
  if (['elegant', 'organic', 'editorial'].includes(style)) {
    return <Check className={`shrink-0 mt-1 ${colorClass}`} size={22} strokeWidth={1.5} />;
  }
  return <CheckCircle2 className={`shrink-0 mt-1 ${colorClass}`} size={20} strokeWidth={2} />;
};