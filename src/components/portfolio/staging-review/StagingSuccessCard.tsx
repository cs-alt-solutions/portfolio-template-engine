// src/components/portfolio/staging-review/StagingSuccessCard.tsx
'use client';

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
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
        isApproved
          ? 'bg-linear-to-tr from-emerald-500 to-cyan-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
          : 'bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-400'
      }`}>         
        {isApproved ? <Sparkles className="w-6 h-6 animate-spin" /> : <Wrench className="w-6 h-6" />}
      </div>       
      
      <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">
        {isApproved ? '🎉 Woohoo! Build Approved & Locked!' : '✍️ Awesome! Adjustments Logged!'}
      </h3>       
      
      <p className="text-zinc-300 text-xs leading-relaxed mb-4 font-normal">         
        {isApproved
          ? 'I received your official sign-off! You just took the biggest step toward getting your business online. A copy of your walkthrough receipt is waiting in your inbox.'
          : 'You just helped make this build 10x better! I received your notes and feedback, and I am ready to dive into the code.'}
      </p>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 mb-6 text-left">
        <p className={`${isApproved ? 'text-cyan-400' : 'text-fuchsia-400'} font-mono text-[10px] font-bold uppercase tracking-wider mb-1`}>
          What happens next?
        </p>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          {isApproved
            ? 'Keep an eye on your inbox for your official activation email! Activating your hosting subscription gets your site live on the Alternative Solutions grid right away (Standard Plan). If you chose the Professional Plan ($15/mo), I will also start guiding you through securing your custom .com domain so I can handle the DNS wiring and get your personal web address live to the world!'
            : 'I am opening up the hood right now to work my magic on your copy adjustments and layout tweaks! Once I have everything looking pristine, I will send an updated link back your way for a final look. As soon as you give me the green light, I will get your hosting plan activated and push your storefront live!'}
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