// src/components/portfolio/staging-review/StagingChecklist.tsx
'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  checks: string[];
  checkedIndices: number[];
  onToggleCheck: (index: number) => void;
}

export default function StagingChecklist({ checks, checkedIndices, onToggleCheck }: Props) {
  return (
    <div className="space-y-2.5 mb-5 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
      <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block mb-2">
        Quick Review Checkpoints:
      </span>
      {checks.map((checkText, idx) => {
        const isChecked = checkedIndices.includes(idx);
        return (
          <div
            key={idx}
            onClick={() => onToggleCheck(idx)}
            className="flex items-start gap-3 cursor-pointer group select-none"
          >
            <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all shrink-0 ${
              isChecked
                ? 'bg-fuchsia-500 border-fuchsia-400 text-white shadow-[0_0_8px_rgba(192,38,213,0.4)]'
                : 'border-zinc-700 bg-zinc-950 group-hover:border-zinc-500'
            }`}>
              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className={`text-xs transition-colors ${
              isChecked ? 'text-zinc-300 font-medium' : 'text-zinc-400 group-hover:text-zinc-200'
            }`}>
              {checkText}
            </span>
          </div>
        );
      })}
    </div>
  );
}