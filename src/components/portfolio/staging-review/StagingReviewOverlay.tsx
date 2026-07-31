'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { ReviewStep } from './types';
import StagingAuditCard from './StagingAuditCard';
import { submitStagingAudit } from '@/actions/submitStagingAudit';

// FIXED: Strict typing interface to replace 'any'
export interface StorefrontData {
  slug: string;
  business_name?: string;
  contact_email?: string;
  is_template?: boolean;
  status?: string;
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
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 border border-emerald-500/30 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3 w-[320px]">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        <h3 className="text-white font-bold tracking-wide">Walkthrough Complete</h3>
        <p className="text-zinc-400 text-sm text-center font-light leading-relaxed">
          Your feedback has been securely transmitted to the architect. You can now close this window.
        </p>
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
        onPrev={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}