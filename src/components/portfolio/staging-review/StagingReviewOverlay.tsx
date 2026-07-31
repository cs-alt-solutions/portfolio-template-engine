'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { CheckCircle2 } from 'lucide-react';
import type { ReviewStep } from './types';
import StagingAuditCard from './StagingAuditCard';

interface OverlayProps {
  storefrontId: string;
  contactEmail: string;
}

export default function StagingReviewOverlay({ storefrontId, contactEmail }: OverlayProps) {
  
  // We moved the steps inside so we can dynamically inject their actual email address
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
      description: `Currently, customer inquiries will be sent to: ${contactEmail}. Is this the correct email address? If not, let us know where to send them.`,
      targetId: 'contact' // Scrolls to the bottom/contact form
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
      const { data: storeData } = await supabase
        .from('storefronts')
        .select('audit_notes')
        .eq('id', storefrontId)
        .single();

      const existingNotes = storeData?.audit_notes || [];

      const newNotes = Object.entries(notes)
        .filter((entry) => entry[1].trim() !== '') 
        .map(([stepId, text]) => ({
          id: crypto.randomUUID(),
          section: REVIEW_STEPS.find(s => s.id === stepId)?.title || stepId,
          note: text.trim(),
          status: 'pending',
          timestamp: new Date().toISOString(),
        }));

      const newStatus = newNotes.length > 0 ? 'REVISIONS_REQUESTED' : 'APPROVED';

      const { error } = await supabase
        .from('storefronts')
        .update({ 
          audit_notes: [...existingNotes, ...newNotes],
          status: newStatus 
        })
        .eq('id', storefrontId);

      if (error) throw error;
      
      setIsFinished(true);

    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 border border-emerald-500/30 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3 w-[320px]">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        <h3 className="text-white font-bold">Review Complete</h3>
        <p className="text-zinc-400 text-sm text-center">
          Thanks! We&apos;ve logged your feedback and will get to work. You can close this window.
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