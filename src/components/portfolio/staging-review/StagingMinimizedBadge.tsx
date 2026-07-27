// src/components/portfolio/staging-review/StagingMinimizedBadge.tsx
'use client';

import React from 'react';
import { Sparkles, ChevronUp, CheckCircle2 } from 'lucide-react';

interface Props {
  completedCount: number;
  totalSteps: number;
  isSubmitted?: boolean;
  onExpand: () => void;
}

export default function StagingMinimizedBadge({ completedCount, totalSteps, isSubmitted = false, onExpand }: Props) {
  if (isSubmitted) {
    return (
      <button
        onClick={onExpand}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-400 flex items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4 text-cyan-300 animate-pulse" />
        <span>Walkthrough Complete • View Status</span>
        <ChevronUp className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={onExpand}
      className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-full shadow-[0_0_25px_rgba(192,38,213,0.4)] border border-fuchsia-400 flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
    >
      <Sparkles className="w-4 h-4 animate-spin" />
      <span>Resume Staging QA ({completedCount}/{totalSteps})</span>
      <ChevronUp className="w-4 h-4" />
    </button>
  );
}