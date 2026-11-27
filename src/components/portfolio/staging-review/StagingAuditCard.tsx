/* src/components/portfolio/staging-review/StagingAuditCard.tsx */
'use client';

import React, { useEffect } from 'react';
import { Check, X, ArrowRight, CheckCircle2, Minus, FolderUp, Rocket } from 'lucide-react';
import type { ReviewStep } from './types';
import type { ApprovalTarget } from '@/actions/submitStagingAudit';

export type StepDecision = 'ok' | 'tweak' | null;

interface StagingAuditCardProps {
  step: ReviewStep;
  currentStepIndex: number;
  totalSteps: number;
  decision: StepDecision;
  note: string;
  hasAnyTweaks: boolean;
  approvalTarget: ApprovalTarget;
  onSelectDecision: (decision: 'ok' | 'tweak') => void;
  onUpdateNote: (note: string) => void;
  onSelectApprovalTarget: (target: ApprovalTarget) => void;
  onNext: () => void;
  onPrev: () => void;
  onMinimize: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function StagingAuditCard({
  step,
  currentStepIndex,
  totalSteps,
  decision,
  note,
  hasAnyTweaks,
  approvalTarget,
  onSelectDecision,
  onUpdateNote,
  onSelectApprovalTarget,
  onNext,
  onPrev,
  onMinimize,
  onSubmit,
  isSubmitting = false,
}: StagingAuditCardProps) {
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isCleanApproval = isLastStep && decision === 'ok' && !hasAnyTweaks;
  const canAdvance = decision === 'ok' || (decision === 'tweak' && note.trim().length > 0);

  useEffect(() => {
    if (!step.targetId) return;
    const element = document.getElementById(step.targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step.targetId]);

  const submitLabel = isSubmitting
    ? 'Sending...'
    : !isCleanApproval
      ? 'Submit Tweaks'
      : approvalTarget === 'ACTIVE'
        ? 'Approve & Go Live'
        : 'Approve & Add Content';

  const submitClasses = !isCleanApproval
    ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'
    : approvalTarget === 'ACTIVE'
      ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
      : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]';

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden pointer-events-auto w-[330px] sm:w-[360px]">
      {/* Header */}
      <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between gap-2 border-b border-zinc-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold border border-cyan-500/30 shrink-0">
            {currentStepIndex + 1}
          </div>
          <span className="text-white font-bold text-sm tracking-wide truncate">{step.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-zinc-500">
            {currentStepIndex + 1}/{totalSteps}
          </span>
          <button
            type="button"
            onClick={onMinimize}
            title="Minimize to browse site"
            className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4">
        <p className="text-sm text-zinc-300 leading-relaxed font-light">{step.description}</p>

        <div className="flex flex-col gap-3">
          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
            How does this look?
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSelectDecision('ok')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                decision === 'ok'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" /> Looks Great
            </button>
            <button
              type="button"
              onClick={() => onSelectDecision('tweak')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                decision === 'tweak'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <X className="w-3.5 h-3.5" /> Needs a Tweak
            </button>
          </div>

          {decision === 'tweak' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <textarea
                value={note}
                onChange={(e) => onUpdateNote(e.target.value)}
                placeholder="Tell us what you'd like adjusted here..."
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 resize-none h-24"
              />
            </div>
          )}

          {decision === 'ok' && !isLastStep && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">Marked as good to go.</span>
            </div>
          )}

          {/* Final step with tweaks from this or earlier steps */}
          {isLastStep && decision !== null && hasAnyTweaks && (
            <div className="p-3.5 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl">
              <h4 className="text-fuchsia-400 font-bold tracking-widest text-[10px] uppercase mb-1">
                Tweaks Queued
              </h4>
              <p className="text-zinc-300 text-xs leading-relaxed">
                Submitting will send all of your section notes straight to Courtney so she can dial them in and send an updated link.
              </p>
            </div>
          )}

          {/* Final step with zero tweaks: 2-way Next Step Choice */}
          {isCleanApproval && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
              <span className="block text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                What&apos;s your next move?
              </span>

              <button
                type="button"
                onClick={() => onSelectApprovalTarget('CONTENT_ASSEMBLY')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  approvalTarget === 'CONTENT_ASSEMBLY'
                    ? 'bg-cyan-500/10 border-cyan-500/60'
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <FolderUp className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Still Adding Photos / Content</p>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Layout looks great — move me to Content Assembly so I can drop assets in my portal.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectApprovalTarget('ACTIVE')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  approvalTarget === 'ACTIVE'
                    ? 'bg-emerald-500/10 border-emerald-500/60'
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Rocket className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Ready to Go Live!</p>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Everything is dialed in — flip the switch to Live Production.
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            className="text-xs text-zinc-500 font-mono uppercase tracking-widest hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            Back
          </button>

          {!isLastStep ? (
            <button
              type="button"
              onClick={onNext}
              disabled={!canAdvance}
              className="flex items-center gap-2 text-xs text-cyan-400 font-mono font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors disabled:opacity-30 cursor-pointer"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting || !canAdvance}
              className={`flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-40 tracking-widest uppercase cursor-pointer ${submitClasses}`}
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}