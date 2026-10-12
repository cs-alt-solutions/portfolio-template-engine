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

// 🚀 NEW: Dynamic SVG Watermark Overlay
export const ImageWatermark = ({ text = "PROTECTED" }: { text?: string }) => {
  const safeText = text || "PROTECTED";
  const patternId = `wm-${safeText.replace(/[^a-zA-Z0-9]/g, '') || 'default'}`;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden select-none opacity-20 mix-blend-overlay">
      <svg width="100%" height="100%">
        <defs>
          <pattern id={patternId} x="0" y="0" width="250" height="150" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" className="text-lg font-black uppercase tracking-[0.2em]">
              {safeText}
            </text>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};