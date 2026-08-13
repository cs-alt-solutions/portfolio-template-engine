// src/components/storefronts/ScrollLogo.tsx
'use client';

import React, { useEffect, useState } from 'react';

export default function ScrollLogo() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // MATHEMATICS OF THE SCROLL:
  const scale = 1 + scrollY * 0.0015;
  const opacity = Math.max(0.01, 0.05 - scrollY * 0.00005);

  return (
    // 'pointer-events-none' ensures this massive image never intercepts clicks meant for your cards
    // 'z-0' explicitly forces it to the back layer
    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/logo.png" 
        alt="Alternative Solutions Background"
        style={{ 
          transform: `scale(${scale})`, 
          opacity: opacity 
        }}
        className="w-[150vw] md:w-[80vw] object-contain grayscale mix-blend-screen transition-transform duration-75 ease-out"
      />
    </div>
  );
}