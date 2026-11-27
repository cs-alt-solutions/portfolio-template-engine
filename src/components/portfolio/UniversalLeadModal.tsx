/* src/components/portfolio/UniversalLeadModal.tsx */
'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { getFonts } from './content-engine/utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { submitStorefrontLead } from '@/actions/submitLead';
import { LEAD_MODAL_DEFAULTS } from '@/utils/glossary';
import {
  AddonOption,
  AddonSelectionMode,
  TopicConfig,
  getLeadBrandHex,
  getLeadModalClasses,
} from './lead-modal/leadModalStyles';
import LeadModalFields, { LeadFormState } from './lead-modal/LeadModalFields';

export type { TopicConfig } from './lead-modal/leadModalStyles';

interface UniversalLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ctaLabel?: string;
  businessName: string;
  storefrontSlug?: string;
  contactEmail?: string;
  brandColor?: string;
  isLightMode?: boolean;
  themeStyle?: string;
  inquiryOptions?: string[];
  addonOptions?: AddonOption[];
  addonSelectionMode?: AddonSelectionMode;
  showTimeframeFields?: boolean;
  allowSpecificDate?: boolean;
  topicConfigs?: Record<string, TopicConfig>;
}

export default function UniversalLeadModal({
  isOpen,
  onClose,
  ctaLabel = 'Get in Touch',
  businessName = 'Our Team',
  storefrontSlug = 'platform-direct',
  contactEmail = '',
  brandColor = 'cyan-500',
  isLightMode = false,
  themeStyle = 'industrial',
  inquiryOptions = ['General Inquiry', 'Request a Quote'],
  addonOptions = [],
  addonSelectionMode = 'multiple',
  showTimeframeFields = false,
  allowSpecificDate = true,
  topicConfigs,
}: UniversalLeadModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [formData, setFormData] = useState<LeadFormState>({
    name: '',
    email: '',
    phone: '',
    inquiryType: inquiryOptions[0] || 'General Inquiry',
    preferredDate: '',
    details: '',
  });

  const effectiveInquiryType =
    inquiryOptions && inquiryOptions.length > 0
      ? inquiryOptions.includes(formData.inquiryType)
        ? formData.inquiryType
        : inquiryOptions[0]
      : 'General Inquiry';

  if (!isOpen) return null;

  const activeTopicConfig = topicConfigs?.[effectiveInquiryType];
  const activeAddons = activeTopicConfig ? activeTopicConfig.addons || [] : addonOptions;
  const activeSelectionMode: AddonSelectionMode =
    activeTopicConfig?.addonSelectionMode || addonSelectionMode || 'multiple';

  const resolvedMode = activeTopicConfig?.timeframeMode;
  const shouldAskTimeframe = activeTopicConfig
    ? resolvedMode
      ? resolvedMode !== 'off'
      : !!activeTopicConfig.askTimeframe
    : showTimeframeFields;

  const shouldAllowSpecificDate = activeTopicConfig
    ? resolvedMode
      ? resolvedMode === 'calendar'
      : true
    : allowSpecificDate;

  // Auto-skip Step 1 if there are no topics/options/date choices to configure
  const hasStepOne =
    (inquiryOptions?.length || 0) > 1 || activeAddons.length > 0 || shouldAskTimeframe;
  const activeStep: 1 | 2 = hasStepOne ? step : 2;

  const activeThemeKey = themeStyle || 'industrial';
  const fonts = getFonts(activeThemeKey);
  const theme = THEME_REGISTRY[activeThemeKey] || THEME_REGISTRY['industrial'];
  const styles = getLeadModalClasses(activeThemeKey, isLightMode, brandColor || '');

  const handleClose = () => {
    setStep(1);
    setErrorMessage('');
    onClose();
  };

  const handleTopicChange = (nextTopic: string) => {
    const nextCfg = topicConfigs?.[nextTopic];
    const nextAllowsDate = nextCfg?.timeframeMode
      ? nextCfg.timeframeMode === 'calendar'
      : true;

    setFormData((prev) => ({
      ...prev,
      inquiryType: nextTopic,
      preferredDate:
        !nextAllowsDate && prev.preferredDate && !prev.preferredDate.startsWith('Flexible')
          ? ''
          : prev.preferredDate,
    }));
    setSelectedAddons([]);
  };

  const toggleAddon = (addonText: string) => {
    setSelectedAddons((prev) => {
      if (activeSelectionMode === 'single') {
        return prev.includes(addonText) ? [] : [addonText];
      }
      return prev.includes(addonText)
        ? prev.filter((a) => a !== addonText)
        : [...prev, addonText];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep === 1 && hasStepOne) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    let combinedDetails = `[INQUIRY TYPE: ${effectiveInquiryType.toUpperCase()}]\n\n`;
    if (selectedAddons.length > 0) {
      combinedDetails += `SELECTED OPTIONS:\n${selectedAddons.map((a) => `- ${a}`).join('\n')}\n\n`;
    }
    if (shouldAskTimeframe && formData.preferredDate.trim()) {
      combinedDetails += `PREFERRED DATE: ${formData.preferredDate.trim()}\n\n`;
    }
    combinedDetails += formData.details;

    try {
      const response = await submitStorefrontLead({
        storefrontSlug,
        businessName,
        contactEmail,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: combinedDetails,
        brandColorHex: getLeadBrandHex(brandColor || ''),
        ctaLabel,
        inquiryType: effectiveInquiryType,
        selectedOptions: selectedAddons,
        preferredDate: shouldAskTimeframe ? formData.preferredDate.trim() : '',
        notes: formData.details.trim(),
      });

      if (response.success) setIsSubmitted(true);
      else setErrorMessage(response.error || 'Failed to send request.');
    } catch (err) {
      console.error('Transmission Error:', err);
      setErrorMessage('System timeout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-lg p-6 md:p-7 transition-all max-h-[90vh] overflow-y-auto custom-scrollbar ${theme.surfaceRadius} ${styles.modalSurface}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className={`absolute top-5 right-5 p-2 border transition-colors cursor-pointer ${theme.controlRadius} ${theme.pillStyle}`}
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500 animate-bounce" />
            <h3 className={`text-2xl md:text-3xl ${fonts.heading}`}>
              {LEAD_MODAL_DEFAULTS.SUCCESS_HEADING}
            </h3>
            <p className={`text-sm opacity-80 max-w-xs mx-auto ${fonts.body}`}>
              Thank you, {formData.name}. {businessName} has logged your details and will be in touch shortly.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                handleClose();
              }}
              className={`mt-6 px-6 py-2.5 border transition-all text-xs cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${theme.pillStyle}`}
            >
              {LEAD_MODAL_DEFAULTS.SUCCESS_BTN}
            </button>
          </div>
        ) : (
          <div>
            {/* Clean Minimal Header */}
            <div className="mb-5 pr-10 space-y-1">
              <p className="text-[11px] font-medium tracking-wide text-brand-primary">
                {businessName}
              </p>
              <h2 className={`text-2xl md:text-3xl ${fonts.heading}`}>{ctaLabel}</h2>
            </div>

            {/* Sleek Visual 2-Bar Step Indicator */}
            {hasStepOne && (
              <div className="flex items-center gap-2 mb-6" aria-label={`Step ${activeStep} of 2`}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  aria-label="Step 1"
                  className="h-1 flex-1 bg-brand-primary transition-all cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  aria-label="Step 2"
                  className={`h-1 flex-1 transition-all cursor-pointer ${
                    activeStep === 2 ? 'bg-brand-primary' : 'bg-current/15 hover:bg-current/30'
                  }`}
                />
                <span className="text-[10px] font-mono opacity-45 pl-1 shrink-0">
                  {activeStep}/2
                </span>
              </div>
            )}

            {errorMessage && (
              <div
                className={`mb-4 p-3 bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400 font-mono ${theme.controlRadius}`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <LeadModalFields
                step={activeStep}
                hasStepOne={hasStepOne}
                formData={formData}
                effectiveInquiryType={effectiveInquiryType}
                inquiryOptions={inquiryOptions || []}
                activeAddons={activeAddons}
                selectedAddons={selectedAddons}
                addonSelectionMode={activeSelectionMode}
                showTimeframeFields={shouldAskTimeframe}
                allowSpecificDate={shouldAllowSpecificDate}
                isLightMode={isLightMode}
                theme={theme}
                bodyFont={fonts.body}
                inputSurface={styles.inputSurface}
                inputRadius={styles.inputRadius}
                activeSurface={styles.activeSurface}
                onFieldChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
                onTopicChange={handleTopicChange}
                onToggleAddon={toggleAddon}
                onEditStepOne={() => setStep(1)}
              />

              {activeStep === 1 && hasStepOne ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`w-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer ${styles.submitSurface}`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2.5 pt-1">
                  {hasStepOne && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`px-4 py-3.5 border transition-all flex items-center justify-center gap-1.5 text-xs shrink-0 cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${theme.pillStyle}`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3.5 px-6 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs cursor-pointer ${styles.submitSurface}`}
                  >
                    {isSubmitting ? (
                      <span>{LEAD_MODAL_DEFAULTS.SUBMITTING_BTN}</span>
                    ) : (
                      <>
                        <span>{LEAD_MODAL_DEFAULTS.SUBMIT_BTN}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}