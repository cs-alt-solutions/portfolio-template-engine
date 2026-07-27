// src/components/portfolio/staging-review/StagingReviewOverlay.tsx
'use client';

import React, { useState } from 'react';
import { StorefrontAuditData, AUDIT_ROADMAP } from './types';
import StagingMinimizedBadge from './StagingMinimizedBadge';
import StagingSuccessCard from './StagingSuccessCard';
import StagingAuditCard from './StagingAuditCard';
import { submitStagingAudit } from '@/actions/submitStagingAudit';

export interface StagingReviewOverlayProps {
  store: StorefrontAuditData;
}

export default function StagingReviewOverlay({ store }: StagingReviewOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepChecks, setStepChecks] = useState<{ [step: number]: number[] }>({});
  const [sectionNotes, setSectionNotes] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<'APPROVED' | 'CHANGES_REQUESTED' | null>(null);

  const steps = AUDIT_ROADMAP;

  const scrollToSection = (targetId: string, targetStepIndex: number) => {
    if (targetId === 'hero' || targetStepIndex === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const fallbackOffsets: Record<number, number> = { 0: 0, 1: 800, 2: 1600, 3: 2800 };
      window.scrollTo({ top: fallbackOffsets[targetStepIndex] || 0, behavior: 'smooth' });
    }
  };

  const handleToggleCheck = (checkIndex: number) => {
    setStepChecks(prev => {
      const currentList = prev[currentStep] || [];
      const updatedList = currentList.includes(checkIndex)
        ? currentList.filter(i => i !== checkIndex)
        : [...currentList, checkIndex];
      return { ...prev, [currentStep]: updatedList };
    });
  };

  const handleNextStep = () => {
    const currentChecks = stepChecks[currentStep] || [];
    if (currentChecks.length < steps[currentStep].checks.length) return;

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollToSection(steps[nextStep].targetId, nextStep);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      scrollToSection(steps[prevStep].targetId, prevStep);
    }
  };

  const handleNoteChange = (text: string) => {
    setSectionNotes(prev => ({ ...prev, [currentStep]: text }));
  };

  const handleSubmitAudit = async (status: 'APPROVED' | 'CHANGES_REQUESTED') => {
    setIsSubmitting(true);

    const response = await submitStagingAudit({
      storefrontSlug: store?.slug || 'demo-store',
      businessName: store?.business_name || 'Valued Client',
      contactEmail: store?.contact_email || '',
      sectionNotes: sectionNotes,
      completedSteps: [...completedSteps, currentStep],
      status: status,
    });

    if (response?.warning) {
      console.warn('Staging Audit Notice:', response.warning);
    }

    setIsSubmitting(false);
    setSubmittedStatus(status);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 flex justify-end pointer-events-auto">
      {/* 🚀 FIXED: isMinimized evaluated FIRST so clicking Dismiss actually minimizes the modal! */}
      {isMinimized ? (
        <StagingMinimizedBadge
          completedCount={completedSteps.length}
          totalSteps={steps.length}
          isSubmitted={!!submittedStatus}
          onExpand={() => setIsMinimized(false)}
        />
      ) : submittedStatus ? (
        <StagingSuccessCard status={submittedStatus} onDismiss={() => setIsMinimized(true)} />
      ) : (
        <StagingAuditCard
          step={steps[currentStep]}
          currentStepIndex={currentStep}
          totalSteps={steps.length}
          checkedIndices={stepChecks[currentStep] || []}
          note={sectionNotes[currentStep] || ''}
          isSubmitting={isSubmitting}
          onToggleCheck={handleToggleCheck}
          onNoteChange={handleNoteChange}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onSubmitAudit={handleSubmitAudit}
          onMinimize={() => setIsMinimized(true)}
          completedSteps={completedSteps}
        />
      )}
    </div>
  );
}