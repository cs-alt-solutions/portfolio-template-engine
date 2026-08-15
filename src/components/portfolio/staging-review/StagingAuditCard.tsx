'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ReviewStep } from './types';

interface StagingAuditCardProps {
  step: ReviewStep;
  currentStepIndex: number;
  totalSteps: number;
  note: string;
  onUpdateNote: (note: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function StagingAuditCard({
  step,
  currentStepIndex,
  totalSteps,
  note,
  onUpdateNote,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting = false
}: StagingAuditCardProps) {
  const [needsRevision, setNeedsRevision] = useState<boolean | null>(note.length > 0 ? true : null);

  useEffect(() => {
    if (step.targetId) {
      const element = document.getElementById(step.targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [step.targetId]);

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden pointer-events-auto w-[320px] sm:w-87.5">
      
      <div className="bg-zinc-900 px-4 py-3 flex items-center gap-3 border-b border-zinc-800">
        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold border border-cyan-500/30">
          {currentStepIndex + 1}
        </div>
        <span className="text-white font-bold text-sm tracking-wide">{step.title}</span>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <p className="text-sm text-zinc-300 leading-relaxed font-light">
          {step.description}
        </p>

        <div className="flex flex-col gap-3">
          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
            How does this look?
          </label>
          
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setNeedsRevision(false);
                onUpdateNote(''); 
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${needsRevision === false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'}`}
            >
              <Check className="w-3.5 h-3.5" />
              Looks Great
            </button>
            <button 
              onClick={() => setNeedsRevision(true)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${needsRevision === true ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'}`}
            >
              <X className="w-3.5 h-3.5" />
              Needs a Tweak
            </button>
          </div>

          {/* Conditional Note Area */}
          {needsRevision === true && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <textarea
                value={note}
                onChange={(e) => onUpdateNote(e.target.value)}
                placeholder="What should we adjust here?"
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 resize-none h-24"
              />

              {/* Only show this revision warning on the final step */}
              {currentStepIndex === totalSteps - 1 && (
                <div className="mt-4 p-4 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl">
                  <h4 className="text-fuchsia-400 font-bold tracking-widest text-[10px] uppercase mb-1">
                    Revision Mode
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Clicking &quot;Submit Tweaks&quot; will securely route your notes directly to our engineering bay.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Conditional Success/Checkout Boxes */}
          {needsRevision === false && currentStepIndex < totalSteps - 1 && (
              <div className="mt-2 flex items-center gap-2 text-emerald-500 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-medium">Marked as good to go.</span>
              </div>
          )}

          {/* Only show this checkout box if they click 'Looks Great' on the FINAL step */}
          {needsRevision === false && currentStepIndex === totalSteps - 1 && (
             <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl animate-in fade-in duration-300">
               <h4 className="text-cyan-400 font-bold tracking-widest text-[10px] uppercase mb-1">
                 Checkout &amp; Portal Access
               </h4>
               <p className="text-zinc-300 text-xs leading-relaxed">
                 Clicking &quot;Approve &amp; Activate&quot; will securely route you to Stripe. Once your payment clears, you&apos;ll instantly unlock your private client portal.
               </p>
             </div>
          )}
        </div>

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
                if (needsRevision !== null) {
                  setNeedsRevision(null);
                  onNext();
                }
              }}
              disabled={needsRevision === null}
              className="flex items-center gap-2 text-xs text-cyan-400 font-mono font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors disabled:opacity-30"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              onClick={onSubmit}
              disabled={isSubmitting || needsRevision === null}
              className={`flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 tracking-widest uppercase ${
                needsRevision === false 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(8,145,178,0.3)]' 
                  : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'
              }`}
            >
              {isSubmitting ? 'Transmitting...' : (needsRevision === false ? 'Approve & Activate' : 'Submit Tweaks')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}