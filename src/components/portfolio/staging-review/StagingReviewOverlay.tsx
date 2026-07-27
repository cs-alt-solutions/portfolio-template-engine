// src/components/portfolio/staging-review/StagingReviewOverlay.tsx
'use client';

import React, { useState } from 'react';
import { StorefrontAuditData, AUDIT_ROADMAP } from './types';
import StagingMinimizedBadge from './StagingMinimizedBadge';
import StagingSuccessCard from './StagingSuccessCard';
import StagingAuditCard from './StagingAuditCard';

export interface StagingReviewOverlayProps {
  store: StorefrontAuditData;
}

export default function StagingReviewOverlay({ }: StagingReviewOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Track individual checkbox selections per step: { [stepIndex]: [checkedItemIndices] }
  const [stepChecks, setStepChecks] = useState<{ [step: number]: number[] }>({});
  const [sectionNotes, setSectionNotes] = useState<{ [key: number]: string }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = AUDIT_ROADMAP;

  const scrollToSection = (targetId: string) => {
    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const fallbackOffsets: { [key: number]: number } = { 0: 0, 1: 700, 2: 1500, 3: 2400 };
      window.scrollTo({ top: fallbackOffsets[currentStep] || 0, behavior: 'smooth' });
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
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollToSection(steps[nextStep].targetId);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      scrollToSection(steps[prevStep].targetId);
    }
  };

  const handleNoteChange = (text: string) => {
    setSectionNotes(prev => ({ ...prev, [currentStep]: text }));
  };

  const handleSubmitAudit = async () => {
    setIsSubmitting(true);
    // Transmit audit data payload to backend/Supabase
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 flex justify-end pointer-events-auto">
      {isSubmitted ? (
        <StagingSuccessCard onDismiss={() => setIsMinimized(true)} />
      ) : isMinimized ? (
        <StagingMinimizedBadge
          completedCount={completedSteps.length}
          totalSteps={steps.length}
          onExpand={() => setIsMinimized(false)}
        />
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