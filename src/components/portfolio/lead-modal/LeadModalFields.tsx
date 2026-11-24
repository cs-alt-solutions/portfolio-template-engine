/* src/components/portfolio/lead-modal/LeadModalFields.tsx */
'use client';

import React from 'react';
import { CheckCircle2, ChevronDown, CalendarDays, Pencil } from 'lucide-react';
import { ThemeDefinition } from '@/utils/themes';
import { LEAD_MODAL_DEFAULTS } from '@/utils/glossary';
import { AddonOption, getDetailsCopy } from './leadModalStyles';
import PreferredDatePicker from './PreferredDatePicker';

export interface LeadFormState {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  preferredDate: string;
  details: string;
}

interface LeadModalFieldsProps {
  step: 1 | 2;
  hasStepOne: boolean;
  formData: LeadFormState;
  effectiveInquiryType: string;
  inquiryOptions: string[];
  activeAddons: AddonOption[];
  selectedAddons: string[];
  showTimeframeFields: boolean;
  allowSpecificDate?: boolean;
  isLightMode: boolean;
  theme: ThemeDefinition;
  bodyFont: string;
  inputSurface: string;
  inputRadius: string;
  activeSurface: string;
  onFieldChange: (patch: Partial<LeadFormState>) => void;
  onTopicChange: (nextTopic: string) => void;
  onToggleAddon: (addonText: string) => void;
  onEditStepOne: () => void;
}

export default function LeadModalFields({
  step,
  hasStepOne,
  formData,
  effectiveInquiryType,
  inquiryOptions,
  activeAddons,
  selectedAddons,
  showTimeframeFields,
  allowSpecificDate = true,
  isLightMode,
  theme,
  bodyFont,
  inputSurface,
  inputRadius,
  activeSurface,
  onFieldChange,
  onTopicChange,
  onToggleAddon,
  onEditStepOne,
}: LeadModalFieldsProps) {
  const detailsCopy = getDetailsCopy(effectiveInquiryType);

  // Tier 1 Question label: bright, human-readable, distinct from options and footnotes
  const questionLabel = 'flex items-baseline gap-2 text-xs font-semibold tracking-normal mb-2.5';
  const optionalHint = 'text-[11px] font-normal italic opacity-45';
  const fieldLabel = `block text-xs font-semibold tracking-normal mb-1.5 opacity-90 ${bodyFont}`;

  // STEP 1: Interactive Picks & Timing
  if (step === 1) {
    const useTopicPills = inquiryOptions.length > 0 && inquiryOptions.length <= 4;

    return (
      <div className="space-y-5 animate-in fade-in duration-200">
        {inquiryOptions.length > 0 && (
          <div>
            <label className={questionLabel}>
              <span>What can we help you with?</span>
            </label>
            {useTopicPills ? (
              <div className="flex flex-wrap gap-2">
                {inquiryOptions.map((opt) => {
                  const isSelected = effectiveInquiryType === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onTopicChange(opt)}
                      className={`px-3.5 py-2 border text-xs transition-all cursor-pointer ${theme.controlRadius} ${
                        isSelected ? `${activeSurface} font-semibold shadow-sm` : theme.pillStyle
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="relative">
                <select
                  value={effectiveInquiryType}
                  onChange={(e) => onTopicChange(e.target.value)}
                  className={`w-full px-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer ${inputSurface}`}
                >
                  {inquiryOptions.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      className={isLightMode ? 'bg-white text-zinc-900' : 'bg-zinc-950 text-white'}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60" />
              </div>
            )}
          </div>
        )}

        {activeAddons.length > 0 && (
          <div className={`pt-4 border-t ${theme.borderColor}`}>
            <label className={questionLabel}>
              <span>Interested in</span>
              <span className={optionalHint}>select any</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {activeAddons.map((addon, idx) => {
                const itemText =
                  typeof addon === 'string' ? addon : addon.title || addon.name || `Option ${idx + 1}`;
                const itemPrice = typeof addon === 'object' ? addon.price : null;
                const isChecked = selectedAddons.includes(itemText);

                return (
                  <button
                    key={`${itemText}-${idx}`}
                    type="button"
                    onClick={() => onToggleAddon(itemText)}
                    className={`inline-flex items-center gap-2 px-3 py-2 border text-xs transition-all cursor-pointer select-none ${theme.controlRadius} ${
                      isChecked ? `${activeSurface} font-semibold shadow-sm` : theme.pillStyle
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${isChecked ? 'opacity-100' : 'opacity-40'}`}
                    />
                    <span>
                      {itemText}
                      {itemPrice ? ` (${itemPrice})` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showTimeframeFields && (
          <div className={`pt-4 border-t ${theme.borderColor}`}>
            <PreferredDatePicker
              value={formData.preferredDate}
              onChange={(next) => onFieldChange({ preferredDate: next })}
              theme={theme}
              activeSurface={activeSurface}
              inputRadius={inputRadius}
              allowSpecificDate={allowSpecificDate}
            />
          </div>
        )}
      </div>
    );
  }

  // STEP 2: Summary Strip + Contact Details
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {hasStepOne && (
        <div
          className={`px-3.5 py-2.5 border flex items-center justify-between gap-3 ${inputRadius} ${theme.subCardStyle}`}
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-semibold text-brand-primary">{effectiveInquiryType}</span>
              {selectedAddons.length > 0 && (
                <span className="opacity-70">
                  · {selectedAddons.slice(0, 2).join(', ')}
                  {selectedAddons.length > 2 ? ` +${selectedAddons.length - 2}` : ''}
                </span>
              )}
            </div>
            {showTimeframeFields && formData.preferredDate && (
              <div className="flex items-center gap-1.5 text-[11px] opacity-75">
                <CalendarDays className="w-3 h-3 text-brand-primary shrink-0" />
                <span className="truncate">{formData.preferredDate}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onEditStepOne}
            className="inline-flex items-center gap-1 text-[11px] font-medium opacity-65 hover:opacity-100 shrink-0 cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
      )}

      <div>
        <label className={fieldLabel}>Your name *</label>
        <input
          type="text"
          required
          placeholder={LEAD_MODAL_DEFAULTS.NAME_PLACEHOLDER}
          value={formData.name}
          onChange={(e) => onFieldChange({ name: e.target.value })}
          className={`w-full px-4 py-3 text-sm outline-none transition-all ${inputSurface}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className={fieldLabel}>Email address *</label>
          <input
            type="email"
            required
            placeholder={LEAD_MODAL_DEFAULTS.EMAIL_PLACEHOLDER}
            value={formData.email}
            onChange={(e) => onFieldChange({ email: e.target.value })}
            className={`w-full px-4 py-3 text-sm outline-none transition-all ${inputSurface}`}
          />
        </div>
        <div>
          <label className={fieldLabel}>
            Phone <span className={optionalHint}>optional</span>
          </label>
          <input
            type="tel"
            placeholder={LEAD_MODAL_DEFAULTS.PHONE_PLACEHOLDER}
            value={formData.phone}
            onChange={(e) => onFieldChange({ phone: e.target.value })}
            className={`w-full px-4 py-3 text-sm outline-none transition-all ${inputSurface}`}
          />
        </div>
      </div>

      <div>
        <label className={fieldLabel}>{detailsCopy.label}</label>
        <textarea
          rows={3}
          required
          placeholder={detailsCopy.placeholder}
          value={formData.details}
          onChange={(e) => onFieldChange({ details: e.target.value })}
          className={`w-full px-4 py-3 text-sm outline-none resize-none transition-all ${inputSurface}`}
        />
      </div>
    </div>
  );
}