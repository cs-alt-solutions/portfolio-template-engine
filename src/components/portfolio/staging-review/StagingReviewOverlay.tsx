'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { MessageSquare, Send, X, CheckCircle2 } from 'lucide-react';

interface StagingReviewOverlayProps {
  storefrontId: string;
  clientName: string;
}

export default function StagingReviewOverlay({ storefrontId, clientName }: StagingReviewOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Fetch existing audit notes first so we don't overwrite them
      const { data: storeData, error: fetchError } = await supabase
        .from('storefronts')
        .select('audit_notes')
        .eq('id', storefrontId)
        .single();

      if (fetchError) throw fetchError;

      const existingNotes = storeData.audit_notes || [];
      
      // 2. Create the new note object
      const newNote = {
        id: crypto.randomUUID(),
        note: note.trim(),
        status: 'pending', // You will change this to 'resolved' in your dashboard
        timestamp: new Date().toISOString(),
      };

      // 3. Push the merged array back to Supabase and update status
      const { error: updateError } = await supabase
        .from('storefronts')
        .update({ 
          audit_notes: [...existingNotes, newNote],
          status: 'REVISIONS_REQUESTED' // Alerts your dashboard
        })
        .eq('id', storefrontId);

      if (updateError) throw updateError;

      setSuccess(true);
      setNote('');
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-900 text-white px-4 py-3 rounded-full shadow-2xl border border-zinc-700 hover:border-cyan-500 transition-colors"
      >
        <MessageSquare className="w-5 h-5 text-cyan-400" />
        <span className="font-mono text-sm">Add Feedback</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 px-4 py-3 flex justify-between items-center border-b border-zinc-800">
        <div>
          <h3 className="text-white font-bold text-sm tracking-wide">Staging Audit</h3>
          <p className="text-zinc-400 text-xs font-mono">{clientName}</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-emerald-400">
            <CheckCircle2 className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Feedback Sent</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
              Request a Change:
            </label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Can we make the hero background darker?"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none h-24"
            />
            <button 
              type="submit"
              disabled={isSubmitting || !note.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Submit Request'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}