/* src/components/portfolio/lead-modal/LeadModalFields.tsx */
'use client';

import React from 'react';
import { CheckCircle2, ChevronDown, CalendarClock } from 'lucide-react';
import { LEAD_MODAL_DEFAULTS } from '@/utils/glossary';
import { AddonOption, getDetailsCopy } from './leadModalStyles';

export interface LeadFormState {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  preferredTimeframe: string;
  backupTimeframe: string;
  details: string;
}

interface LeadModalFieldsProps {
  formData: LeadFormState;
  effectiveInquiryType: string;
  inquiryOptions: string[];
  activeAddons: AddonOption[];
  selectedAddons: string[];
  showTimeframeFields: boolean;
  isLightMode: boolean;
  bodyFont: string;
  inputSurface: string;
  inputRadius: string;
  onFieldChange: (patch: Partial<LeadFormState>) => void;
  onTopicChange: (nextTopic: string) => void;
  onToggleAddon: (addonText: string) => void;
}

export default function LeadModalFields({
  formData,
  effectiveInquiryType,
  inquiryOptions,
  activeAddons,
  selectedAddons,
  showTimeframeFields,
  isLightMode,
  bodyFont,
  inputSurface,
  inputRadius,
  onFieldChange,
  onTopicChange,
  onToggleAddon,
}: LeadModalFieldsProps) {
  const detailsCopy = getDetailsCopy(effectiveInquiryType);
  const labelClass = `block text-[10px] font-mono uppercase tracking-wider mb-1.5 opacity-75 ${bodyFont}`;
  const timeframeBox = isLightMode
    ? 'bg-zinc-50 border-zinc-900/10'
    : 'bg-white/[0.03] border-white/10';

  return (
    <>
      {inquiryOptions.length > 0 && (
        <div>
          <label className={labelClass}>{LEAD_MODAL_DEFAULTS.TOPIC_LABEL}</label>
          <div className="relative">
            <select
              value={effectiveInquiryType}
              onChange={(e) => onTopicChange(e.target.value)}
              className={`w-full px-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer ${inputSurface}`}
            >
              {inquiryOptions.map((opt) => (
                <option key={opt} value={opt} className={isLightMode ? 'bg-white text-zinc-900' : 'bg-zinc-950 text-white'}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-zinc-500" />
          </div>
        </div>
      )}

      {activeAddons.length > 0 && (
        <div className="pt-1 pb-1">
          <label className={`block text-[10px] font-mono uppercase tracking-wider mb-2 opacity-75 ${bodyFont}`}>
            {LEAD_MODAL_DEFAULTS.OPTIONS_LABEL}
          </label>
          <div className="flex flex-wrap gap-2">
            {activeAddons.map((addon, idx) => {
              const itemText = typeof addon === 'string' ? addon : addon.title || addon.name || `Option ${idx + 1}`;
              const itemPrice = typeof addon === 'object' ? addon.price : null;
              const isChecked = selectedAddons.includes(itemText);

              return (
                <button
                  key={`${itemText}-${idx}`}
                  type="button"
                  onClick={() => onToggleAddon(itemText)}
                  className={`inline-flex items-center gap-2 px-3 py-2 border text-xs font-semibold transition-all cursor-pointer select-none ${inputRadius} ${
                    isChecked
                      ? 'bg-brand-primary border-brand-primary text-white shadow-sm'
                      : isLightMode
                        ? 'bg-zinc-50 border-zinc-300 text-zinc-800 hover:border-zinc-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isChecked ? 'text-white' : 'opacity-40'}`} />
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
        <div className={`p-3.5 border space-y-2.5 ${inputRadius} ${timeframeBox}`}>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider">
              <CalendarClock className="w-3.5 h-3.5 shrink-0 opacity-85" />
              <span>{LEAD_MODAL_DEFAULTS.TIMEFRAME_HEADING}</span>
            </div>
            <p className="text-[11px] opacity-65 leading-snug">{LEAD_MODAL_DEFAULTS.TIMEFRAME_NOTE}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{LEAD_MODAL_DEFAULTS.PREFERRED_DATE_LABEL}</label>
              <input
                type="text"
                placeholder={LEAD_MODAL_DEFAULTS.PREFERRED_DATE_PLACEHOLDER}
                value={formData.preferredTimeframe}
                onChange={(e) => onFieldChange({ preferredTimeframe: e.target.value })}
                className={`w-full px-3 py-2.5 text-xs outline-none transition-all ${inputSurface}`}
              />
            </div>
            <div>
              <label className={labelClass}>{LEAD_MODAL_DEFAULTS.BACKUP_DATE_LABEL}</label>
              <input
                type="text"
                placeholder={LEAD_MODAL_DEFAULTS.BACKUP_DATE_PLACEHOLDER}
                value={formData.backupTimeframe}
                onChange={(e) => onFieldChange({ backupTimeframe: e.target.value })}
                className={`w-full px-3 py-2.5 text-xs outline-none transition-all ${inputSurface}`}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>{LEAD_MODAL_DEFAULTS.NAME_LABEL}</label>
        <input
          type="text"
          required
          placeholder={LEAD_MODAL_DEFAULTS.NAME_PLACEHOLDER}
          value={formData.name}
          onChange={(e) => onFieldChange({ name: e.target.value })}
          className={`w-full px-4 py-3 text-sm outline-none transition-all ${inputSurface}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{LEAD_MODAL_DEFAULTS.EMAIL_LABEL}</label>
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
          <label className={labelClass}>{LEAD_MODAL_DEFAULTS.PHONE_LABEL}</label>
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
        <label className={labelClass}>{detailsCopy.label}</label>
        <textarea
          rows={3}
          required
          placeholder={detailsCopy.placeholder}
          value={formData.details}
          onChange={(e) => onFieldChange({ details: e.target.value })}
          className={`w-full px-4 py-3 text-sm outline-none resize-none transition-all ${inputSurface}`}
        />
      </div>
    </>
  );
}