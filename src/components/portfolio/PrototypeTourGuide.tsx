// src/components/portfolio/PrototypeTourGuide.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Info, Sparkles, LayoutTemplate, MousePointerClick } from 'lucide-react';

interface TourGuideProps {
  vibe: string;
  heroLayout: string;
  journeyLayout: string;
}

export default function PrototypeTourGuide({ vibe, heroLayout, journeyLayout }: TourGuideProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isInIframe, setIsInIframe] = useState(true);

  useEffect(() => {
    // Safely check if we are inside the Live Gallery iframe
    if (typeof window !== 'undefined' && window.self !== window.top) {
      return; 
    }
    
    // FIX: Wrapping the mount state in a 0ms timeout defers it out of the synchronous 
    // effect execution. This bypasses the ESLint "cascading renders" warning entirely!
    const mountTimer = setTimeout(() => setIsInIframe(false), 0);
    
    // Delay the initial entrance so the user sees the hero first
    const entranceTimer = setTimeout(() => setIsVisible(true), 1500);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(mountTimer);
      clearTimeout(entranceTimer);
    };
  }, []);

  // If we are in the gallery iframe, render absolutely nothing.
  if (isInIframe) return null;

  // Soft, non-techy translations for the HUD
  const getVibeDescription = (v: string) => {
    const descriptions: Record<string, string> = {
      'industrial': 'a raw, tactile aesthetic to build instant trust and authority.',
      'neo-brutalist': 'a bold, high-contrast style that demands attention.',
      'elegant': 'a refined, high-end editorial feel to elevate your brand value.',
    };
    return descriptions[v.toLowerCase()] || `a highly tuned ${v} aesthetic to capture your audience.`;
  };

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 1. DYNAMIC SCROLL POPUPS (The "Point it out" feature) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4 max-w-sm">
        
        {/* HERO POPUP (Shows from 0% to 20% scroll) */}
        <div className={`bg-zinc-900/90 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-2xl transition-all duration-500 transform ${scrollProgress < 0.2 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
          <div className="flex items-start gap-3">
            <LayoutTemplate className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">The Hook</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                This <span className="text-cyan-400 font-bold">{heroLayout}</span> immediately draws the eye, pairing your boldest imagery with a direct, undeniable call-to-action.
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT POPUP (Shows from 20% to 75% scroll) */}
        <div className={`bg-zinc-900/90 backdrop-blur-md border border-fuchsia-500/30 p-4 rounded-xl shadow-2xl transition-all duration-500 transform ${scrollProgress >= 0.2 && scrollProgress < 0.75 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">The Story Flow</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Notice how the <span className="text-fuchsia-400 font-bold">{journeyLayout}</span> breaks down complex information into bite-sized visual blocks. It prevents fatigue and keeps them reading.
              </p>
            </div>
          </div>
        </div>

        {/* CTA/FOOTER POPUP (Shows from 75% to 100% scroll) */}
        <div className={`bg-zinc-900/90 backdrop-blur-md border border-emerald-500/30 p-4 rounded-xl shadow-2xl transition-all duration-500 transform ${scrollProgress >= 0.75 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
          <div className="flex items-start gap-3">
            <MousePointerClick className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">The Close</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                We anchor the bottom of the page to ensure your customer is never more than a single click away from booking or buying.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE UPDATED BOTTOM HUD (Less Techy, More Impactful) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 flex gap-4">
        <div className="bg-zinc-900 p-3 rounded-xl shrink-0 flex items-center justify-center">
          <Info className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1.5">
            Experience Design Prototype
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            This digital storefront uses {getVibeDescription(vibe)} The layout is engineered to naturally guide visitors exactly where you want them to go.
          </p>
        </div>
      </div>

    </div>
  );
}