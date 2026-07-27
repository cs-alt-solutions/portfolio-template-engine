// src/components/portfolio/staging-review/StagingSuccessCard.tsx
'use client';

// 🚀 FIXED: Removed unused CheckCircle import to satisfy ESLint!
import React from 'react';
import { Sparkles, Wrench } from 'lucide-react';

interface Props {
  status: 'APPROVED' | 'CHANGES_REQUESTED';
  onDismiss: () => void;
}

export default function StagingSuccessCard({ status, onDismiss }: Props) {
  const isApproved = status === 'APPROVED';

  return (     
    <div className={`bg-zinc-950 border-2 rounded-2xl p-6 shadow-2xl text-center animate-in fade-in slide-in-from-bottom-5 max-w-md w-full ${
      isApproved ? 'border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]' : 'border-fuchsia-500/50 shadow-[0_0_50px_rgba(192,38,213,0.3)]'
    }`}>       
      {/* 🚀 FIXED: Using Tailwind v4 canonical bg-linear-to-tr syntax! */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
        isApproved
          ? 'bg-linear-to-tr from-emerald-500 to-cyan-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
          : 'bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-400'
      }`}>         
        {isApproved ? <Sparkles className="w-6 h-6 animate-spin" /> : <Wrench className="w-6 h-6 animate-bounce" />}
      </div>       
      
      <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">
        {isApproved ? 'Build Approved & Locked!' : 'Tweak List Transmitted!'}
      </h3>       
      
      <p className="text-zinc-300 text-xs leading-relaxed mb-4 font-normal">         
        {isApproved
          ? 'I have received your official sign-off! Your interactive walkthrough receipt has been sent to your inbox.'
          : 'I have received your requested adjustments! I am reviewing your notes right now.'}
      </p>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 mb-6 text-left">
        <p className={`${isApproved ? 'text-cyan-400' : 'text-fuchsia-400'} font-mono text-[10px] font-bold uppercase tracking-wider mb-1`}>
          What happens next?
        </p>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          {isApproved
            ? 'Be on the lookout for a follow-up email containing your $5/month live hosting link. Once activated, your custom domain will be unlocked and pushed live to the world!'
            : 'I will apply your requested copy tweaks and layout adjustments to the build. Once polished, I will notify you so I can get your professional domain live!'}
        </p>
      </div>       
      
      <button         
        onClick={onDismiss}         
        className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl border border-zinc-700 transition-all cursor-pointer"       
      >         
        Dismiss & Browse Canvas       
      </button>     
    </div>   
  ); 
}