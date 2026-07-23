// src/components/portfolio/UniversalLeadModal.tsx
'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { getFonts } from './content-engine/utils';
import { submitStorefrontLead } from '@/actions/submitLead';

interface UniversalLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ctaLabel: string;
  businessName: string;
  storefrontSlug?: string; // 🚨 MADE OPTIONAL: Solves the page.tsx TS Error!
  contactEmail?: string;   // 🚨 MADE OPTIONAL: Solves email prop errors!
  brandColor?: string;
  isLightMode?: boolean;
  themeStyle?: string;
}

export default function UniversalLeadModal({
  isOpen,
  onClose,
  ctaLabel = 'Get in Touch',
  businessName = 'Our Team',
  storefrontSlug = 'platform-direct', // 🚨 FALLBACK: Routes general inquiries cleanly!
  contactEmail = '',
  brandColor = 'cyan-500', 
  isLightMode = false,
  themeStyle = 'industrial',
}: UniversalLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const response = await submitStorefrontLead({
      storefrontSlug,
      businessName,
      contactEmail,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      details: formData.details,
    });

    setIsSubmitting(false);

    if (response.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(response.error || 'Failed to send request.');
    }
  };

  const fonts = getFonts(themeStyle);
  const isSharpTheme = ['industrial', 'neo', 'cyberpunk', 'editorial'].includes(themeStyle);
  const isNeo = themeStyle === 'neo';
  const isCyber = themeStyle === 'cyberpunk';
  const isMidnight = themeStyle === 'midnight';
  const radius = isSharpTheme ? 'rounded-none' : themeStyle === 'minimal' ? 'rounded-3xl' : 'rounded-2xl';
  const inputRadius = isSharpTheme ? 'rounded-none' : 'rounded-xl';

  const getModalStyles = () => {
    if (isNeo) return 'bg-white text-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]';
    if (isCyber) return 'bg-black/95 text-white border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] font-mono';
    if (isMidnight) return 'bg-zinc-950/90 text-white backdrop-blur-2xl border border-white/10 shadow-2xl';
    if (isLightMode) return 'bg-white text-slate-900 border border-slate-200 shadow-2xl';
    return 'bg-zinc-900 text-white border-2 border-zinc-800 shadow-2xl';
  };

  const getInputStyles = () => {
    if (isNeo) return `bg-white border-2 border-black text-black focus:bg-yellow-100 ${inputRadius}`;
    if (isCyber) return `bg-black/80 border border-white/20 text-white focus:border-${brandColor} font-mono ${inputRadius}`;
    if (isLightMode) return `bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white ${inputRadius}`;
    return `bg-zinc-950 border border-zinc-800 text-white focus:bg-zinc-900 ${inputRadius}`;
  };

  const getSubmitStyles = () => {
    if (isNeo) return `bg-white text-black border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 ${inputRadius}`;
    if (isCyber) return `bg-black text-white border border-current shadow-[0_0_15px_currentColor] hover:bg-white hover:text-black font-mono font-bold ${inputRadius}`;
    
    const isDarkTone = ['blue-500', 'indigo-500', 'violet-500', 'fuchsia-500', 'pink-500', 'red-500', 'rose-500', 'orange-500', 'slate-500', 'zinc-700', 'zinc-800', 'stone-700'].includes(brandColor);
    const textClass = isDarkTone ? 'text-white font-black' : 'text-zinc-950 font-black';
    return `bg-${brandColor} ${textClass} border border-white/20 shadow-lg hover:opacity-90 active:scale-[0.99] ${inputRadius}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg p-6 md:p-8 transition-all ${radius} ${getModalStyles()}`}>
        
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 transition-colors ${isNeo ? 'text-black hover:bg-black hover:text-white border-2 border-black rounded-none' : 'text-zinc-400 hover:text-white rounded-full'}`}
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 animate-bounce" />
            <h3 className={`text-2xl font-bold ${fonts.heading}`}>Request Received!</h3>
            <p className={`text-sm opacity-80 max-w-xs mx-auto ${fonts.body}`}>
              Thank you, {formData.name}. {businessName} has logged your details and will be in touch shortly.
            </p>
            <button
              onClick={() => { setIsSubmitted(false); onClose(); }}
              className={`mt-6 px-6 py-2.5 font-medium transition-all text-xs uppercase tracking-wider ${isNeo ? 'bg-black text-white border-2 border-black rounded-none font-bold' : 'bg-zinc-800 text-white hover:bg-zinc-700 rounded-xl'}`}
            >
              Back to Website
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Inquiry</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${fonts.heading}`}>{ctaLabel}</h2>
              <p className={`text-xs md:text-sm opacity-80 ${fonts.body}`}>
                Fill out the details below to connect directly with {businessName}.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1.5 opacity-70 ${fonts.body}`}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Jordan Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 text-sm outline-none transition-all ${getInputStyles()}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1.5 opacity-70 ${fonts.body}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 text-sm outline-none transition-all ${getInputStyles()}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1.5 opacity-70 ${fonts.body}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 text-sm outline-none transition-all ${getInputStyles()}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1.5 opacity-70 ${fonts.body}`}>
                  Project Details & Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us what you're looking for, ideal dates, or any specific questions..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className={`w-full px-4 py-3 text-sm outline-none resize-none transition-all ${getInputStyles()}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 text-xs uppercase tracking-widest ${getSubmitStyles()}`}
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <span>Submit Request</span>
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