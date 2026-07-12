/* src/components/portfolio/PrototypeTourGuide.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Info, Minimize2, Maximize2 } from 'lucide-react';

interface TourGuideProps {
  vibe: string;
  heroLayout: string;
  journeyLayout: string;
}

export default function PrototypeTourGuide({ vibe, heroLayout, journeyLayout }: TourGuideProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isInIframe, setIsInIframe] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) return; 
    const mountTimer = setTimeout(() => setIsInIframe(false), 0);
    const entranceTimer = setTimeout(() => setIsVisible(true), 1500);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(windowHeight > 0 ? totalScroll / windowHeight : 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(mountTimer);
      clearTimeout(entranceTimer);
    };
  }, []);

  if (isInIframe) return null;

  const getVibeDescription = (v: string) => {
    const descriptions: Record<string, string> = {
      'industrial': 'a raw, authentic look that builds instant trust.',
      'neo-brutalist': 'a bold, confident style that demands attention.',
      'elegant': 'a clean, refined feel that makes your brand stand out.',
    };
    return descriptions[v.toLowerCase()] || `a unique ${v} look tailored to your audience.`;
  };

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* MINIMIZE BUTTON */}
      <div className="absolute right-6 top-6 pointer-events-auto">
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="bg-zinc-900 border border-white/10 p-2 rounded-full text-white hover:bg-zinc-800 transition-all"
        >
          {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* DYNAMIC POPUPS */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4 pointer-events-auto max-w-70">
            <div className={`bg-zinc-900/95 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-2xl transition-all ${scrollProgress < 0.3 ? 'opacity-100' : 'opacity-0 scale-95'}`}>
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">First Impression</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                We used a {heroLayout} layout here. It&apos;s designed to keep your work front and center so visitors know who you are in a heartbeat.
              </p>
            </div>

            <div className={`bg-zinc-900/95 backdrop-blur-md border border-fuchsia-500/30 p-4 rounded-xl shadow-2xl transition-all ${scrollProgress >= 0.3 && scrollProgress < 0.7 ? 'opacity-100' : 'opacity-0 scale-95'}`}>
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">The Experience</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                The {journeyLayout} flow organizes info into bite-sized blocks, so your customers can explore without getting overwhelmed.
              </p>
            </div>
          </div>

          {/* BOTTOM HUD */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 p-4 rounded-2xl shadow-2xl w-[90%] max-w-lg pointer-events-auto">
            <div className="flex items-start gap-3">
              <div className="bg-zinc-900 p-2 rounded-lg text-white">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">
                  Design Notes
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  This build uses {getVibeDescription(vibe)} It&apos;s designed to be friendly and easy for your customers to navigate.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}