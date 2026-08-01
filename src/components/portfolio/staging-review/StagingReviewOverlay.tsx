'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
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
  [key: string]: unknown; // Safely allows other db columns without throwing errors
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
    // 1. Define your universal base link (stored securely in your .env file)
    const foundationLink = process.env.NEXT_PUBLIC_STRIPE_FOUNDATION_LINK || '#';
    
    // 2. Identify the tier based on the application data
    const isPro = store.plan_tier?.toUpperCase() === 'PROFESSIONAL' || store.selected_plan?.toUpperCase() === 'PROFESSIONAL';
    const isCustom = store.plan_tier?.toUpperCase() === 'CUSTOM' || store.selected_plan?.toUpperCase() === 'CUSTOM';
    
    // 3. The Engine determines the correct checkout path
    let checkoutUrl = foundationLink; // Default to $5/mo base for both Foundation AND Pro
    
    if (isCustom && store.stripe_payment_url) {
      checkoutUrl = store.stripe_payment_url;
    }

    return (
      <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 border border-emerald-500/30 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 w-[340px] animate-in fade-in slide-in-from-bottom-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <h3 className="text-white font-bold tracking-wide text-lg">Sweet. I got your notes!</h3>
        
        <div className="text-zinc-300 text-sm text-center font-light leading-relaxed space-y-4">
          <p>I&apos;ll look these over and get any final tweaks fixed up ASAP.</p>
          
          {isPro ? (
            <div className="space-y-3">
              <p>To authorize your launch, please activate your <strong>base hosting</strong> below.</p>
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-[10px] text-cyan-400 font-mono text-left leading-relaxed">
                  <strong>PRO TIER SETUP:</strong> We will coordinate your custom domain setup next. You will not be upgraded to the $15/mo Professional tier until your domain is completely live.
                </p>
              </div>
            </div>
          ) : isCustom ? (
            <p>To authorize your launch and lock in your build, please complete your custom setup below.</p>
          ) : (
            <p>To authorize your launch and lock in your build, activate your $5 monthly hosting below.</p>
          )}
        </div>

        <a 
          href={checkoutUrl}
          className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black py-3 px-4 rounded-lg transition-all text-center uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transform active:scale-95"
        >
          Activate Base Hosting
        </a>
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