'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ReviewStep } from './types';

interface StagingAuditCardProps {
  step: ReviewStep;
  currentStepIndex: number;
  totalSteps: number;
  note: string;
  isExpanded: boolean;
  onUpdateNote: (note: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleExpand: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function StagingAuditCard({
  step,
  currentStepIndex,
  totalSteps,
  note,
  isExpanded,
  onUpdateNote,
  onNext,
  onPrev,
  onToggleExpand,
  onSubmit,
  isSubmitting = false
}: StagingAuditCardProps) {
  // New state to track if the user wants to make a revision for this specific step
  const [needsRevision, setNeedsRevision] = useState<boolean | null>(note.length > 0 ? true : null);

  // The Auto-Scroll Hijack
  useEffect(() => {
    if (step.targetId) {
      const element = document.getElementById(step.targetId);
      if (element) {
        // Scroll the target element to the center of the viewport smoothly
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [step.targetId]);

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden pointer-events-auto w-[320px]">
      
      {/* HEADER */}
      <button 
        onClick={onToggleExpand}
        className="w-full bg-zinc-900 px-4 py-3 flex items-center justify-between hover:bg-zinc-800 transition-colors border-b border-zinc-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold border border-cyan-500/30">
            {currentStepIndex + 1}
          </div>
          <span className="text-white font-bold text-sm tracking-wide">{step.title}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
      </button>

      {/* BODY */}
      {isExpanded && (
        <div className="p-5 flex flex-col gap-5">
          <p className="text-sm text-zinc-300 leading-relaxed font-light">
            {step.description}
          </p>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
              Does this look good?
            </label>
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setNeedsRevision(false);
                  onUpdateNote(''); // Clear the note if they say it's good
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${needsRevision === false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'}`}
              >
                <Check className="w-3.5 h-3.5" />
                Yes, perfect
              </button>
              <button 
                onClick={() => setNeedsRevision(true)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${needsRevision === true ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'}`}
              >
                <X className="w-3.5 h-3.5" />
                Needs Tweaks
              </button>
            </div>

            {/* CONDITIONAL TEXT BOX: Only shows if they hit "Needs Tweaks" */}
            {needsRevision === true && (
              <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <textarea
                  value={note}
                  onChange={(e) => onUpdateNote(e.target.value)}
                  placeholder="What should we adjust?"
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none h-24"
                />
              </div>
            )}
            
            {/* SUCCESS INDICATOR: Shows if they hit "Yes, perfect" */}
            {needsRevision === false && (
                <div className="mt-2 flex items-center gap-2 text-emerald-500 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 animate-in fade-in duration-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium">Marked as approved.</span>
                </div>
            )}

          </div>

          {/* NAVIGATION FOOTER */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 mt-2">
            <button 
              onClick={onPrev}
              disabled={currentStepIndex === 0}
              className="text-xs text-zinc-500 font-mono uppercase tracking-widest hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              Back
            </button>
            
            {currentStepIndex < totalSteps - 1 ? (
              <button 
                onClick={() => {
                  setNeedsRevision(null); // Reset toggle for next view
                  onNext();
                }}
                className="flex items-center gap-2 text-xs text-cyan-400 font-mono font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button 
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-1.5 px-4 rounded transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'SENDING...' : 'FINISH AUDIT'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}