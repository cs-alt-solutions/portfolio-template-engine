// src/components/portfolio/Capabilities.tsx
'use client';

import React, { useState } from 'react';
import { getFonts, getThemeBullet } from './content-engine/utils'; 
import { Info, Image as ImageIcon, X, ArrowRight } from 'lucide-react';

// 1. STRICT INTERFACES TO REPLACE 'ANY'
export interface GalleryItem {
  id?: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
}

export interface Capability {
  title: string;
  description: string;
  bullets?: string[]; 
}

interface ModalServiceState {
  title: string;
  images: GalleryItem[];
  desc?: string;
}

interface CapabilitiesProps {
  items?: Capability[];
  galleryItems?: GalleryItem[];
  themeStyle?: string;
  brandColor?: string;
}

export default function Capabilities({ 
  items, 
  galleryItems = [], 
  themeStyle = 'industrial', 
  brandColor = 'cyan-500' 
}: CapabilitiesProps) {
  const [activeModalService, setActiveModalService] = useState<ModalServiceState | null>(null);

  if (!items || items.length === 0) return null;

  const isLightMode = ['elegant', 'minimal', 'organic', 'editorial'].includes(themeStyle);
  const isNeo = themeStyle === 'neo';
  const isCyber = themeStyle === 'cyberpunk';
  const isIndustrial = themeStyle === 'industrial';
  const isMidnight = themeStyle === 'midnight';
  
  const fonts = getFonts(themeStyle);
  const brandTextColor = `text-${brandColor}`;

  // HELPER: Dictates the Full Card styles based on our precise theme registry
  const getCardStyles = () => {
    if (isNeo) return 'bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none rounded-none';
    if (isIndustrial) return 'bg-zinc-900 border-2 border-zinc-700 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] hover:-translate-y-1 rounded-none';
    if (isMidnight) return 'bg-zinc-900/30 backdrop-blur-2xl border border-white/5 shadow-2xl hover:bg-zinc-900/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-1 rounded-2xl';
    if (isCyber) return `bg-black/60 border border-white/10 hover:border-${brandColor} hover:shadow-[0_0_30px_rgba(var(--${brandColor}),0.2)] rounded-none`;
    if (isLightMode) return 'bg-white/50 border border-stone-200 hover:border-stone-300 hover:shadow-2xl rounded-3xl hover:-translate-y-1';
    
    // Fallback Dark
    return 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-2xl rounded-3xl hover:-translate-y-1';
  };

  // HELPER: Dictates the Mini "Bullet Only" Card styles
  const getMiniCardStyles = () => {
    if (isNeo) return 'bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none';
    if (isIndustrial) return 'bg-zinc-900 border-2 border-zinc-700 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] rounded-none hover:bg-zinc-800';
    if (isMidnight) return 'bg-zinc-900/30 backdrop-blur-2xl border border-white/5 shadow-lg rounded-2xl hover:bg-zinc-900/50';
    if (isCyber) return 'bg-black/60 border border-white/10 rounded-none';
    if (isLightMode) return 'bg-white/50 border border-stone-200 hover:shadow-lg rounded-2xl hover:border-stone-300';
    
    // Fallback Dark
    return 'bg-zinc-900/60 border border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl';
  };

  // HELPER: Determines if the structural shape should be a sharp square or circle
  const isSharpTheme = isIndustrial || isNeo || isCyber || themeStyle === 'editorial';

  // HELPER: Finds images tagged to a specific capability title
  const getAttachedImages = (serviceTitle: string): GalleryItem[] => {
    return (galleryItems || []).filter((item: GalleryItem) => item.category === serviceTitle);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => {
          const isBulletOnly = !item.description || item.description.trim() === '';
          const attachedImages = getAttachedImages(item.title);
          const hasProof = attachedImages.length > 0;

          // Sleek glowing bullet card (If there is no description)
          if (isBulletOnly && (!item.bullets || item.bullets.length === 0)) {
            return (
              <div 
                key={i} 
                className={`flex items-center justify-between p-6 transition-all duration-300 ${getMiniCardStyles()} ${hasProof ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={hasProof ? () => setActiveModalService({ title: item.title, images: attachedImages, desc: item.description }) : undefined}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 shrink-0 shadow-[0_0_15px_currentColor] ${isSharpTheme ? 'rounded-none' : 'rounded-full'} ${isLightMode ? 'text-stone-400 bg-current' : `${brandTextColor} bg-current`}`} />
                  <h4 className={`text-xl md:text-2xl leading-tight ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
                    {item.title}
                  </h4>
                </div>

                {hasProof && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${isLightMode ? 'bg-zinc-100 border-zinc-300 text-zinc-700' : 'bg-white/10 border-white/20 text-white'}`}>
                    <Info className="w-3 h-3" />
                    {attachedImages.length}
                  </span>
                )}
              </div>
            );
          }

          // Full Service Card
          return (
            <div 
              key={i} 
              className={`p-10 flex flex-col justify-between transition-all duration-300 ${getCardStyles()}`}
            >
              <div>
                {/* Header Row: Title + Interactive Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h4 className={`text-2xl md:text-3xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-zinc-100'}`}>
                    {item.title}
                  </h4>

                  {hasProof && (
                    <button
                      onClick={() => setActiveModalService({ title: item.title, images: attachedImages, desc: item.description })}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-sm shrink-0 hover:scale-105 ${
                        isLightMode 
                          ? 'bg-zinc-900 text-white hover:bg-zinc-700' 
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black'
                      }`}
                      title="Click to view visual proof of work"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Proof ({attachedImages.length})</span>
                    </button>
                  )}
                </div>
                
                {item.description && (
                  <p className={`text-lg leading-relaxed mb-6 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-300'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                    {item.description}
                  </p>
                )}

                {/* Bullets on Card (Handled by your getThemeBullet helper!) */}
                {item.bullets && item.bullets.length > 0 && (
                  <ul className={`space-y-4 pt-6 border-t ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'} ${fonts.body} mb-6`}>
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-4">
                         {getThemeBullet(themeStyle, brandTextColor)}
                         <span className={`text-lg leading-relaxed ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Button at base of Card if proof exists */}
              {hasProof && (
                <button
                  onClick={() => setActiveModalService({ title: item.title, images: attachedImages, desc: item.description })}
                  className={`w-full mt-auto py-3 px-4 border rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    isLightMode
                      ? 'bg-zinc-100 hover:bg-zinc-900 border-zinc-300 hover:border-zinc-900 text-zinc-800 hover:text-white'
                      : 'bg-black/40 hover:bg-white/10 border-white/10 hover:border-white/30 text-zinc-300 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> View Work Gallery <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* THE POP-OUT PROOF OF WORK MODAL */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
              <div>
                <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white`}>
                  Service Portfolio
                </span>
                <h3 className={`text-2xl font-black text-white uppercase tracking-tight mt-2 ${fonts.heading}`}>
                  {activeModalService.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalService(null)}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Gallery Grid */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {activeModalService.desc && (
                <p className={`text-zinc-400 text-base font-light mb-6 max-w-2xl ${fonts.body}`}>
                  {activeModalService.desc}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeModalService.images.map((img: GalleryItem, i: number) => (
                  <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={img.imageUrl} 
                      alt={img.title || `${activeModalService.title} work`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {img.title && (
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className={`text-sm font-bold text-white ${fonts.heading}`}>{img.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex justify-end">
              <button
                onClick={() => setActiveModalService(null)}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
              >
                Close Gallery
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}