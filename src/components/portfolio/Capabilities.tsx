// src/components/portfolio/Capabilities.tsx
import React from 'react';
import { getFonts, getThemeBullet } from './content-engine/utils'; 

interface Capability {
  title: string;
  description: string;
  bullets?: string[]; 
}

interface CapabilitiesProps {
  items?: Capability[];
  themeStyle?: string;
  brandColor?: string;
}

export default function Capabilities({ items, themeStyle = 'industrial', brandColor = 'cyan-500' }: CapabilitiesProps) {
  if (!items || items.length === 0) return null;

  const isLightMode = ['elegant', 'minimal', 'organic', 'editorial'].includes(themeStyle);
  const isNeo = themeStyle === 'neo';
  const isCyber = themeStyle === 'cyberpunk';
  const isIndustrial = themeStyle === 'industrial';
  const isMidnight = themeStyle === 'midnight';
  
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;

  // 1. HELPER: Dictates the Full Card styles based on our precise theme registry
  const getCardStyles = () => {
    if (isNeo) return 'bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none rounded-none';
    if (isIndustrial) return 'bg-zinc-900 border-2 border-zinc-700 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] hover:-translate-y-1 rounded-none';
    if (isMidnight) return 'bg-zinc-900/30 backdrop-blur-2xl border border-white/5 shadow-2xl hover:bg-zinc-900/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-1 rounded-2xl';
    if (isCyber) return `bg-black/60 border border-white/10 hover:border-${brandColor} hover:shadow-[0_0_30px_rgba(var(--${brandColor}),0.2)] rounded-none`;
    if (isLightMode) return 'bg-white/50 border border-stone-200 hover:border-stone-300 hover:shadow-2xl rounded-3xl hover:-translate-y-1';
    
    // Fallback Dark
    return 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-2xl rounded-3xl hover:-translate-y-1';
  };

  // 2. HELPER: Dictates the Mini "Bullet Only" Card styles
  const getMiniCardStyles = () => {
    if (isNeo) return 'bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none';
    if (isIndustrial) return 'bg-zinc-900 border-2 border-zinc-700 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] rounded-none hover:bg-zinc-800';
    if (isMidnight) return 'bg-zinc-900/30 backdrop-blur-2xl border border-white/5 shadow-lg rounded-2xl hover:bg-zinc-900/50';
    if (isCyber) return 'bg-black/60 border border-white/10 rounded-none';
    if (isLightMode) return 'bg-white/50 border border-stone-200 hover:shadow-lg rounded-2xl hover:border-stone-300';
    
    // Fallback Dark
    return 'bg-zinc-900/60 border border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl';
  };

  // 3. HELPER: Determines if the structural shape should be a square or circle
  const isSharpTheme = isIndustrial || isNeo || isCyber || themeStyle === 'editorial';

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => {
          
          const isBulletOnly = !item.description || item.description.trim() === '';

          // Sleek glowing bullet card (If there is no description)
          if (isBulletOnly && (!item.bullets || item.bullets.length === 0)) {
            return (
              <div 
                key={i} 
                className={`flex items-center gap-4 p-6 transition-all duration-300 cursor-default ${getMiniCardStyles()}`}
              >
                {/* Dynamic shape bullet based on theme structure */}
                <div className={`w-3 h-3 shrink-0 shadow-[0_0_15px_currentColor] ${isSharpTheme ? 'rounded-none' : 'rounded-full'} ${isLightMode ? 'text-stone-400 bg-current' : `${brandTextColor} bg-current`}`} />
                <h4 className={`text-xl md:text-2xl leading-tight ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
                  {item.title}
                </h4>
              </div>
            );
          }

          // Full Service Card
          return (
            <div 
              key={i} 
              className={`p-10 flex flex-col transition-all duration-300 ${getCardStyles()}`}
            >
              <h4 className={`text-2xl md:text-3xl mb-4 ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
                {item.title}
              </h4>
              
              {item.description && (
                <p className={`text-lg leading-relaxed mb-6 flex-1 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-300'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                  {item.description}
                </p>
              )}

              {/* 🚨 BULLETS ON THE CARD (Handled by your getThemeBullet helper!) */}
              {item.bullets && item.bullets.length > 0 && (
                <ul className={`mt-auto space-y-4 pt-6 border-t ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'} ${fonts.body}`}>
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-4">
                       {getThemeBullet(themeStyle, brandTextColor)}
                       <span className={`text-lg leading-relaxed ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}