// src/components/staging-review/StagingReviewOverlay.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle2, Minus } from 'lucide-react';
import type { ReviewStep } from './types';
import StagingAuditCard from './StagingAuditCard';
import { submitStagingAudit } from '@/actions/submitStagingAudit';

// Strict typing interface to replace 'any'
export interface StorefrontData {
  id?: string; // Required for the approval API trigger!
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
  const [isApproved, setIsApproved] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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

      const hasNotes = Object.keys(sectionNotes).length > 0;
      const clientApproved = !hasNotes;
      setIsApproved(clientApproved);

      // 1. ALWAYS submit the audit ledger first so we have legal proof of sign-off
      const response = await submitStagingAudit({
        storefrontSlug: store.slug,
        businessName: (store.business_name as string) || 'Client',
        contactEmail: contactEmail,
        sectionNotes: sectionNotes,
        completedSteps: completedSteps,
        status: clientApproved ? 'APPROVED' : 'CHANGES_REQUESTED',
        planTier: store.plan_tier || store.selected_plan
      });

      if (!response.success) throw new Error(response.error);

      // 2. THE OMNI-CHANNEL TELEPORT (If Approved)
      if (clientApproved) {
        setIsFinished(true); // Triggers the "Approving Architecture" loading UI
        
        const storeId = store.id || store.slug;
        const targetUrl = process.env.NODE_ENV === 'development' 
            ? `http://localhost:3000/api/storefronts/approve?id=${storeId}`
            : `https://alternativesolutions.io/api/storefronts/approve?id=${storeId}`;
            
        // We leave isSubmitting as true so the loader keeps spinning while Stripe thinks
        window.location.href = targetUrl;
        return; 
      }

      // 3. If they left notes, show the standard "Changes Requested" UI
      setIsFinished(true);
      setIsSubmitting(false);

    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Transmission failed. Please ensure your connection is stable and try again.');
      setIsSubmitting(false);
    } 
  };

  // --- FINISHED STATES UI ---
  if (isFinished) {
    // STATE A: They Approved it (Waiting for Stripe)
    if (isApproved) {
       return (
         <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 border border-emerald-500/50 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 w-80 animate-in fade-in slide-in-from-bottom-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
               <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse" />
             </div>
             <h3 className="text-white font-black uppercase tracking-widest text-sm">Approving Layout...</h3>
           </div>
           <p className="text-zinc-400 text-xs font-light leading-relaxed">
             Legal sign-off recorded. Generating your secure Stripe checkout link. Please wait...
           </p>
         </div>
       );
    }

    // STATE B: They Requested Changes (Minimized state)
    if (isMinimized) {
      return (
        <button 
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-fuchsia-500/50 hover:bg-zinc-800 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse" />
          Review Status
        </button>
      );
    }

    // STATE C: They Requested Changes (Expanded state)
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-5 w-80 animate-in fade-in slide-in-from-bottom-4">
        
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-500" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm">Notes Logged</h3>
          </div>
          <button onClick={() => setIsMinimized(true)} className="text-zinc-500 hover:text-white transition-colors p-1" title="Minimize & Browse">
            <Minus size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          <p className="text-zinc-400 text-sm font-light">
            Your requested adjustments have been securely logged to the engineering bay.
          </p>
          
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <p className="text-[11px] text-fuchsia-400 font-mono leading-relaxed">
              <strong>NEXT STEPS:</strong> Courtney will review these tweaks, execute the updates, and dispatch a fresh review link to your inbox shortly.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button 
            onClick={() => setIsMinimized(true)}
            className="w-full bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest transition-all"
          >
            Minimize & Browse Site
          </button>
        </div>
      </div>
    );
  }

  // --- DEFAULT WIDGET UI ---
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* NEW: Dynamic Sign-Off Disclaimer that only appears on the very last step! */}
      {currentStep === REVIEW_STEPS.length - 1 && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 w-80 sm:w-100">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-cyan-500/20 rounded-lg shrink-0">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-cyan-400 font-bold tracking-widest text-sm uppercase mb-1">
                Architecture Sign-Off
              </h4>
              <p className="text-zinc-300 text-xs leading-relaxed">
                By clicking &quot;Finish Review&quot;, you are officially signing off on this build. You will be securely routed to Stripe to activate your <strong>$5/mo hosting &amp; infrastructure subscription</strong>. Once activated, we will flip the switch and your site will be live.
              </p>
            </div>
          </div>
        </div>
      )}

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