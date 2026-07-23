'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle, Sparkles } from 'lucide-react';

interface UniversalLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ctaLabel: string; // e.g., "Book a Shoot" or "Request a Quote"
  businessName: string;
  brandColor?: string;
  isLightMode?: boolean;
}

export default function UniversalLeadModal({
  isOpen,
  onClose,
  ctaLabel = 'Get in Touch',
  businessName = 'Our Team',
  brandColor = '#3b82f6', // Fallback blue
  isLightMode = false,
}: UniversalLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

    // TODO: Wire this to your server action to send Resend email / save to Supabase
    // await submitStorefrontLead({ ...formData, businessName });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const bgClass = isLightMode ? 'bg-white text-slate-900 border-slate-200' : 'bg-slate-900 text-white border-slate-800';
  const inputBgClass = isLightMode ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-white focus:bg-slate-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 md:p-8 shadow-2xl ${bgClass}`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="py-12 text-center space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 animate-bounce" />
            <h3 className="text-2xl font-bold">Request Received!</h3>
            <p className="text-sm opacity-80 max-w-xs mx-auto">
              Thank you, {formData.name}. {businessName} has received your details and will be in touch shortly.
            </p>
            <button
              onClick={() => { setIsSubmitted(false); onClose(); }}
              className="mt-6 px-6 py-2.5 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition-all text-sm"
            >
              Back to Website
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <div>
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Inquiry</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">{ctaLabel}</h2>
              <p className="text-xs md:text-sm opacity-70">
                Fill out the details below to connect directly with {businessName}.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 opacity-80">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Jordan Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputBgClass}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 opacity-80">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputBgClass}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 opacity-80">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputBgClass}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 opacity-80">
                  Project Details & Notes *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you're looking for, ideal dates, or any specific questions..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all ${inputBgClass}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: brandColor }}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
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