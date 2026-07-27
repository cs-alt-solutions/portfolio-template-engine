// src/components/portfolio/staging-review/StagingAuditCard.tsx
'use client';

import React from 'react';
import { ChevronDown, MessageSquare, ArrowRight, ArrowLeft, Sparkles, Send } from 'lucide-react';
import { AuditStep } from './types';
import StagingChecklist from './StagingChecklist';

interface Props {
  step: AuditStep;
  currentStepIndex: number;
  totalSteps: number;
  checkedIndices: number[];
  note: string;
  isSubmitting: boolean;
  onToggleCheck: (index: number) => void;
  onNoteChange: (val: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmitAudit: (status: 'APPROVED' | 'CHANGES_REQUESTED') => void;
  onMinimize: () => void;
  completedSteps: number[];
}

export default function StagingAuditCard({
  step,
  currentStepIndex,
  totalSteps,
  checkedIndices,
  note,
  isSubmitting,
  onToggleCheck,
  onNoteChange,
  onNextStep,
  onPrevStep,
  onSubmitAudit,
  onMinimize,
  completedSteps
}: Props) {
  const isFinalStep = currentStepIndex === totalSteps - 1;
  const hasPrevStep = currentStepIndex > 0;
  const canProceedNext = checkedIndices.length === step.checks.length;
  const isApproved = isFinalStep && checkedIndices.includes(step.checks.length - 1);

  return (
    <div className="bg-zinc-950/95 backdrop-blur-xl border-2 border-fuchsia-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-w-md w-full">
      
      {/* HEADER */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-500"></span>
          </span>
          <span className="text-white font-black text-xs uppercase tracking-widest">
            Staging Walkthrough • Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>
        <button
          onClick={onMinimize}
          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Minimize to browse freely"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-zinc-900 h-1.5 flex">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`h-full flex-1 transition-all duration-500 border-r border-zinc-950 ${
              completedSteps.includes(idx)
                ? 'bg-fuchsia-500 shadow-[0_0_10px_rgba(192,38,213,0.8)]'
                : idx === currentStepIndex
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {/* BODY CONTENT */}
      <div className="p-5 flex-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="mb-4">
          <span className="text-fuchsia-400 font-mono text-[10px] font-bold uppercase tracking-widest block mb-1">
            Section: {step.title}
          </span>
          <p className="text-zinc-200 text-sm leading-relaxed font-normal mb-3">
            {step.description}
          </p>
        </div>

        <StagingChecklist
          checks={step.checks}
          checkedIndices={checkedIndices}
          onToggleCheck={onToggleCheck}
        />

        {/* TWEAK NOTES */}
        <div className="mb-5">
          <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-cyan-400" />
            <span>
              {isFinalStep
                ? "What Adjustments or Changes Do You Need? (Optional)"
                : "Any changes or adjustments for this section? (Optional)"}
            </span>
          </label>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={
              isFinalStep
                ? `e.g., "I need to tweak the wording in the About section, or swap out one photo before we launch..."`
                : `e.g., "Love the layout! Just change the headline wording slightly..."`
            }
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none h-20"
          />
        </div>

        {/* STEP NAVIGATION DECK */}
        {!isFinalStep ? (
          <div className="flex items-center gap-2">
            {hasPrevStep && (
              <button
                onClick={onPrevStep}
                className="px-3.5 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-800 transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                title="Go to previous step"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={onNextStep}
              disabled={!canProceedNext}
              className={`flex-1 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group ${
                canProceedNext
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
              }`}
            >
              <span>
                {canProceedNext
                  ? 'Looks Good • Next Section'
                  : `Check Boxes to Proceed (${checkedIndices.length}/${step.checks.length})`}
              </span>
              {canProceedNext && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </div>
        ) : (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <span className="text-zinc-400 text-[10px] font-mono uppercase tracking-wider block text-center mb-1">
              {isApproved
                ? "Build Approved • Ready For Live Hosting"
                : "Feedback Mode • I Will Apply Your Adjustments"}
            </span>
            
            {isApproved ? (
              <button
                onClick={() => onSubmitAudit('APPROVED')}
                disabled={isSubmitting}
                className="w-full font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer hover:scale-[1.02] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>
                  {isSubmitting
                    ? 'Activating Onboarding...'
                    : 'Approve Build & Activate $5/mo Hosting'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => onSubmitAudit('CHANGES_REQUESTED')}
                disabled={isSubmitting}
                className="w-full font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(192,38,213,0.3)] cursor-pointer hover:scale-[1.02] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Sending Feedback...'
                    : 'Submit Adjustments & Feedback'}
                </span>
              </button>
            )}

            {hasPrevStep && (
              <button
                onClick={onPrevStep}
                disabled={isSubmitting}
                className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-[10px] font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to previous section</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-zinc-950 border-t border-zinc-900 px-5 py-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-600">
        <span>Powered by Alternative Solutions</span>
        <span className="text-cyan-500/70">Interactive QA Engine v1.0</span>
      </div>
    </div>
  );
}