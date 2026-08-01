'use client';

import React, { useState } from 'react';
import { CheckCircle2, Minus, ArrowRight } from 'lucide-react';
import type { ReviewStep } from './types';
import StagingAuditCard from './StagingAuditCard';
import { submitStagingAudit } from '@/actions/submitStagingAudit';

// Strict typing interface to replace 'any'
export interface StorefrontData {
  slug: string;
  business_name?: string;
  contact_email?: string;
  is_template?: boolean;
  status?: string;
  stripe_payment_url?: string;
  plan_tier?: string;
  selected_plan?: string;
  [key: string]: unknown;
}

export default function StagingReviewOverlay({ store }: { store: StorefrontData }) {
  const contactEmail = (store.contact_email as string) || 'No email provided';

  const REVIEW_STEPS: ReviewStep[] = [
    {
       id: 'hero',
       title: 'First Impression',
       description: 'This is the first thing your customers will see. Check the main image, colors, and headline.',
       targetId: 'hero'
     },
    {
       id: 'about',
       title: 'The Story',
       description: 'Read through the About section. Does the vibe and text feel accurate to your brand?',
       targetId: 'about'
     },
    {
       id: 'portfolio',
       title: 'The Work',
       description: 'Review your services or gallery. Make sure the layout showcases what you do best.',
       targetId: 'portfolio'
     },
    {
      id: 'routing',
      title: 'Lead Routing',
      description: `Customer inquiries will currently be sent to: ${contactEmail}. Is this correct? If not, let us know where to send them.`,
      targetId: 'contact'
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // Controls the new sleek floating button

  const handleUpdateNote = (note: string) => {
    setNotes(prev => ({ ...prev, [REVIEW_STEPS[currentStep].id]: note }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const sectionNotes: Record<number, string> = {};
      const completedSteps: number[] = [];
      
      REVIEW_STEPS.forEach((step, index) => {
        completedSteps.push(index);
        if (notes[step.id] && notes[step.id].trim() !== '') {
          sectionNotes[index] = notes[step.id].trim();
        }
      });

      const newStatus = Object.keys(sectionNotes).length > 0 ? 'CHANGES_REQUESTED' : 'APPROVED';

      const response = await submitStagingAudit({
        storefrontSlug: store.slug,
        businessName: (store.business_name as string) || 'Client',
        contactEmail: contactEmail,
        sectionNotes: sectionNotes,
        completedSteps: completedSteps,
        status: newStatus
      });

      if (!response.success) throw new Error(response.error);

      setIsFinished(true);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Transmission failed. Please ensure your connection is stable and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    const foundationLink = process.env.NEXT_PUBLIC_STRIPE_FOUNDATION_LINK || '#';
    const isPro = store.plan_tier?.toUpperCase() === 'PROFESSIONAL' || store.selected_plan?.toUpperCase() === 'PROFESSIONAL';
    const isCustom = store.plan_tier?.toUpperCase() === 'CUSTOM' || store.selected_plan?.toUpperCase() === 'CUSTOM';
    
    let checkoutUrl = foundationLink; 
    if (isCustom && store.stripe_payment_url) {
      checkoutUrl = store.stripe_payment_url;
    }

    // THE MINIMIZED STATE (Floating Button)
    if (isMinimized) {
      return (
        <button 
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-emerald-500/50 hover:bg-zinc-800 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Setup Subscription
        </button>
      );
    }

    // THE MAXIMIZED STATE (Streamlined Box)
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-5 w-85 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm">Review Submitted</h3>
          </div>
          <button onClick={() => setIsMinimized(true)} className="text-zinc-500 hover:text-white transition-colors p-1" title="Minimize & Browse">
            <Minus size={16} />
          </button>
        </div>
        
        {/* Clean, punchy body */}
        <div className="space-y-3">
          <p className="text-zinc-400 text-sm font-light">
            I&apos;ve got your notes! Let&apos;s get your subscription set up so we can authorize the launch.
          </p>
          
          {isPro && (
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <p className="text-[11px] text-cyan-400 font-mono leading-relaxed">
                <strong>PRO SETUP:</strong> You are only locking in the $5 base rate today. The $15 upgrade will not trigger until your custom domain is live.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <a 
            href={checkoutUrl}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black py-3.5 px-4 rounded-xl transition-all text-center uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)] flex justify-center items-center gap-2"
          >
            Secure Subscription <ArrowRight size={14} />
          </a>
          <button 
            onClick={() => setIsMinimized(true)}
            className="w-full bg-transparent text-zinc-500 hover:text-white text-[10px] font-bold py-2 uppercase tracking-widest transition-colors"
          >
            Minimize & Browse Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <StagingAuditCard
        step={REVIEW_STEPS[currentStep]}
        currentStepIndex={currentStep}
        totalSteps={REVIEW_STEPS.length}
        note={notes[REVIEW_STEPS[currentStep].id] || ''}
        onUpdateNote={handleUpdateNote}
        onNext={() => setCurrentStep(prev => Math.min(prev + 1, REVIEW_STEPS.length - 1))}
        onPrev={() => setCurrentStep(prev => Math.max(prev - 0, 0))}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}