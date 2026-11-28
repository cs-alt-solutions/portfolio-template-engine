/* src/components/portfolio/staging-review/StagingReviewOverlay.tsx */
'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle2, Minus, ExternalLink, ClipboardCheck } from 'lucide-react';
import type { ReviewStep } from './types';
import StagingAuditCard, { StepDecision } from './StagingAuditCard';
import { submitStagingAudit, ApprovalTarget } from '@/actions/submitStagingAudit';

export interface StorefrontData {
  id?: string;
  slug: string;
  business_name?: string;
  contact_email?: string;
  public_email?: string;
  contact_name?: string;
  is_template?: boolean;
  status?: string;
  plan_tier?: string;
  selected_plan?: string;
  engine_mode?: string;
  content_layout?: string;
  about_bio?: string;
  about_image?: string;
  about_heading?: string;
  [key: string]: unknown;
}

export default function StagingReviewOverlay({ store }: { store: StorefrontData }) {
  const routingEmail =
    (store.public_email as string) ||
    (store.contact_email as string) ||
    'No email provided';
  const ownerEmail = (store.contact_email as string) || routingEmail;
  const isHubMode = store.engine_mode === 'hub' || store.content_layout === 'hub';
  const hasAbout = Boolean(store.about_bio || store.about_image || store.about_heading);

  const reviewSteps = useMemo<ReviewStep[]>(() => {
    const heroStep: ReviewStep = {
      id: 'hero',
      title: 'First Impression',
      description: 'Check your headline, colors, fonts, and overall first-screen vibe.',
      targetId: 'hero',
    };
    const workStep: ReviewStep = {
      id: 'portfolio',
      title: isHubMode ? 'Departments & Galleries' : 'The Work',
      description: isHubMode
        ? 'Tap through your department tabs and galleries to make sure everything feels right.'
        : 'Review your services and gallery layout to make sure it showcases what you do best.',
      targetId: 'gallery',
    };
    const aboutStep: ReviewStep = {
      id: 'about',
      title: 'The Story',
      description: 'Read through your About section. Does the voice and layout feel true to your brand?',
      targetId: 'about',
    };
    const routingStep: ReviewStep = {
      id: 'routing',
      title: 'Lead Routing',
      description: `Customer inquiries currently route to ${routingEmail}. Confirm this is right or tell us where to send them.`,
      targetId: 'contact',
    };

    const ordered = isHubMode
      ? [heroStep, workStep, ...(hasAbout ? [aboutStep] : []), routingStep]
      : [heroStep, ...(hasAbout ? [aboutStep] : []), workStep, routingStep];
    return ordered;
  }, [hasAbout, isHubMode, routingEmail]);

  const [currentStep, setCurrentStep] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, StepDecision>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [approvalTarget, setApprovalTarget] = useState<ApprovalTarget>('CONTENT_ASSEMBLY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultState, setResultState] = useState<'TWEAKS' | 'CONTENT_ASSEMBLY' | 'ACTIVE' | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const activeStep = reviewSteps[currentStep];
  const hasAnyTweaks = reviewSteps.some(
    (s) => decisions[s.id] === 'tweak' || Boolean(notes[s.id]?.trim())
  );

  const portalUrl = store.id
    ? `https://alternativesolutions.io/portal/${store.id}`
    : 'https://alternativesolutions.io/login';

  const handleSelectDecision = (choice: 'ok' | 'tweak') => {
    setDecisions((prev) => ({ ...prev, [activeStep.id]: choice }));
    if (choice === 'ok') {
      setNotes((prev) => ({ ...prev, [activeStep.id]: '' }));
    }
  };

  const handleUpdateNote = (note: string) => {
    setNotes((prev) => ({ ...prev, [activeStep.id]: note }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const sectionNotes: Record<number, string> = {};
      const sectionLabels: Record<number, string> = {};
      const completedSteps: number[] = [];

      reviewSteps.forEach((step, index) => {
        completedSteps.push(index);
        sectionLabels[index] = step.title;
        if (notes[step.id]?.trim()) {
          sectionNotes[index] = notes[step.id].trim();
        }
      });

      const clientApproved = Object.keys(sectionNotes).length === 0;

      const response = await submitStagingAudit({
        storefrontSlug: store.slug,
        businessName: (store.business_name as string) || 'Client',
        contactEmail: ownerEmail,
        contactName: (store.contact_name as string) || 'Client',
        sectionNotes,
        sectionLabels,
        completedSteps,
        status: clientApproved ? 'APPROVED' : 'CHANGES_REQUESTED',
        approvalTarget: clientApproved ? approvalTarget : undefined,
        planTier: (store.plan_tier as string) || (store.selected_plan as string),
      });

      if (!response.success) throw new Error(response.error);

      setResultState(clientApproved ? approvalTarget : 'TWEAKS');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Transmission failed. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Minimized pill (works both during review AND after finishing)
  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 bg-zinc-950/95 border border-cyan-500/50 hover:border-cyan-400 text-white px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer"
      >
        <ClipboardCheck className="w-4 h-4 text-cyan-400" />
        <span>
          {resultState ? 'Review Status' : `Site Review (${currentStep + 1}/${reviewSteps.length})`}
        </span>
      </button>
    );
  }

  // Finished States
  if (resultState) {
    const isLive = resultState === 'ACTIVE';
    const isAssembly = resultState === 'CONTENT_ASSEMBLY';
    const accentBorder = isLive
      ? 'border-emerald-500/50'
      : isAssembly
        ? 'border-cyan-500/50'
        : 'border-fuchsia-500/50';
    const iconTone = isLive
      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
      : isAssembly
        ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
        : 'bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-400';

    return (
      <div className={`fixed bottom-6 right-6 z-50 bg-zinc-950 border ${accentBorder} p-6 rounded-2xl shadow-2xl flex flex-col gap-4 w-82.5 animate-in fade-in slide-in-from-bottom-4`}>
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${iconTone}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm">
              {isLive ? "You're Live!" : isAssembly ? 'Content Assembly' : 'Notes Logged'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
            title="Minimize"
          >
            <Minus size={16} />
          </button>
        </div>

        <p className="text-zinc-300 text-xs leading-relaxed">
          {isLive
            ? 'Awesome — your review is locked in and your storefront is moving straight to Live Production. You can still update photos or text anytime from your portal.'
            : isAssembly
              ? 'Your core layout is approved! Jump into your Client Portal whenever you are ready to drop photos or final details, and we will flip you live.'
              : 'Your tweak notes have been sent straight to Courtney. She will knock out the updates and send a fresh link to your inbox shortly.'}
        </p>

        <div className="flex flex-col gap-2 pt-1">
          {(isAssembly || isLive) && (
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-black py-3 rounded-xl uppercase tracking-widest transition-all"
            >
              <span>Open Client Portal</span>
              <ExternalLink size={13} />
            </a>
          )}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-full bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-bold py-3 rounded-xl uppercase tracking-widest transition-all cursor-pointer"
          >
            Minimize &amp; Browse Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <StagingAuditCard
        step={activeStep}
        currentStepIndex={currentStep}
        totalSteps={reviewSteps.length}
        decision={decisions[activeStep.id] ?? null}
        note={notes[activeStep.id] || ''}
        hasAnyTweaks={hasAnyTweaks}
        approvalTarget={approvalTarget}
        onSelectDecision={handleSelectDecision}
        onUpdateNote={handleUpdateNote}
        onSelectApprovalTarget={setApprovalTarget}
        onNext={() => setCurrentStep((prev) => Math.min(prev + 1, reviewSteps.length - 1))}
        onPrev={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        onMinimize={() => setIsMinimized(true)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}