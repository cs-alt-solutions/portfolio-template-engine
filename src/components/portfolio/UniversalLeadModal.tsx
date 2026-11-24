/* src/components/portfolio/UniversalLeadModal.tsx */
'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { getFonts } from './content-engine/utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { submitStorefrontLead } from '@/actions/submitLead';
import { LEAD_MODAL_DEFAULTS } from '@/utils/glossary';
import {
  AddonOption,
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
  showTimeframeFields?: boolean;
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
  showTimeframeFields = false,
  topicConfigs,
}: UniversalLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [formData, setFormData] = useState<LeadFormState>({
    name: '',
    email: '',
    phone: '',
    inquiryType: inquiryOptions[0] || 'General Inquiry',
    preferredTimeframe: '',
    backupTimeframe: '',
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
  const shouldAskTimeframe = activeTopicConfig ? !!activeTopicConfig.askTimeframe : showTimeframeFields;

  const activeThemeKey = themeStyle || 'industrial';
  const fonts = getFonts(activeThemeKey);
  const theme = THEME_REGISTRY[activeThemeKey] || THEME_REGISTRY['industrial'];
  const styles = getLeadModalClasses(activeThemeKey, isLightMode, brandColor || '');

  const handleTopicChange = (nextTopic: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: nextTopic }));
    setSelectedAddons([]);
  };

  const toggleAddon = (addonText: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonText) ? prev.filter((a) => a !== addonText) : [...prev, addonText]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    let combinedDetails = `[INQUIRY TYPE: ${effectiveInquiryType.toUpperCase()}]\n\n`;
    if (selectedAddons.length > 0) {
      combinedDetails += `SELECTED OPTIONS:\n${selectedAddons.map((a) => `- ${a}`).join('\n')}\n\n`;
    }
    if (shouldAskTimeframe && (formData.preferredTimeframe.trim() || formData.backupTimeframe.trim())) {
      if (formData.preferredTimeframe.trim()) {
        combinedDetails += `PREFERRED TIMEFRAME: ${formData.preferredTimeframe.trim()}\n`;
      }
      if (formData.backupTimeframe.trim()) {
        combinedDetails += `BACKUP WINDOW: ${formData.backupTimeframe.trim()}\n`;
      }
      combinedDetails += '\n';
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
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg p-6 md:p-8 transition-all max-h-[90vh] overflow-y-auto custom-scrollbar ${theme.surfaceRadius} ${styles.modalSurface}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-4 right-4 p-2 border transition-colors cursor-pointer ${theme.controlRadius} ${theme.pillStyle}`}
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500 animate-bounce" />
            <h3 className={`text-2xl md:text-3xl ${fonts.heading}`}>{LEAD_MODAL_DEFAULTS.SUCCESS_HEADING}</h3>
            <p className={`text-sm opacity-80 max-w-xs mx-auto ${fonts.body}`}>
              Thank you, {formData.name}. {businessName} has logged your details and will be in touch shortly.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className={`mt-6 px-6 py-2.5 border transition-all text-xs cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${theme.pillStyle}`}
            >
              {LEAD_MODAL_DEFAULTS.SUCCESS_BTN}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1.5 pr-8">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-primary text-zinc-950 text-[10px] font-mono font-bold uppercase tracking-widest ${theme.controlRadius}`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{LEAD_MODAL_DEFAULTS.EYEBROW}</span>
              </div>
              <h2 className={`text-2xl md:text-3xl ${fonts.heading}`}>{ctaLabel}</h2>
              <p className={`text-xs md:text-sm opacity-80 ${fonts.body}`}>
                {LEAD_MODAL_DEFAULTS.SUBTEXT_PREFIX} {businessName}.
              </p>
            </div>

            {errorMessage && (
              <div
                className={`mb-4 p-3 bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400 font-mono ${theme.controlRadius}`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <LeadModalFields
                formData={formData}
                effectiveInquiryType={effectiveInquiryType}
                inquiryOptions={inquiryOptions || []}
                activeAddons={activeAddons}
                selectedAddons={selectedAddons}
                showTimeframeFields={shouldAskTimeframe}
                isLightMode={isLightMode}
                bodyFont={fonts.body}
                inputSurface={styles.inputSurface}
                inputRadius={theme.controlRadius}
                onFieldChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
                onTopicChange={handleTopicChange}
                onToggleAddon={toggleAddon}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 text-xs cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${styles.submitSurface}`}
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
            </form>
          </div>
        )}
      </div>
    </div>
  );
}