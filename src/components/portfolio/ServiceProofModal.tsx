/* eslint-disable @next/next/no-img-element */
// src/components/portfolio/ServiceProofModal.tsx
'use client';

import React, { useState } from 'react';
import { X, ImageIcon, ArrowRight, CheckCircle2, ZoomIn } from 'lucide-react';
import { getFonts, getThemeBullet, ImageWatermark } from './content-engine/utils';
import { THEME_REGISTRY } from '@/utils/themes';

export interface GalleryItem {
  id?: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
}

interface ServiceProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: GalleryItem[];
  description?: string;
  bullets?: string[];
  addons?: { name: string; price: string }[];
  themeStyle?: string;
  brandColor?: string;
  businessName?: string;
  onBook?: (selectedAddons: string[]) => void;
}

export default function ServiceProofModal({
  isOpen,
  onClose,
  title,
  images,
  description,
  bullets,
  addons = [],
  themeStyle = 'industrial',
  brandColor = 'cyan-500',
  businessName,
  onBook
}: ServiceProofModalProps) {
  
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.radius || 'rounded-none';

  const toggleAddon = (addonName: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonName) ? prev.filter(a => a !== addonName) : [...prev, addonName]
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
        <div className={`bg-zinc-950 border border-zinc-800 ${shapeRadius} w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative`}>
          
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
            <div>
              <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} bg-white/10 border border-white/20 text-white`}>
                Project Portfolio
              </span>
              <h3 className={`text-2xl md:text-3xl font-black text-white tracking-tight mt-2 ${fonts.heading}`}>
                {title}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col lg:flex-row gap-8">
            
            {(description || (bullets && bullets.length > 0) || (addons && addons.length > 0)) && (
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                {(description || (bullets && bullets.length > 0)) && (
                  <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
                    {description && (
                      <p className={`text-zinc-300 text-sm font-light ${bullets && bullets.length > 0 ? 'mb-6 pb-6 border-b border-zinc-800' : ''} ${fonts.body}`}>
                        {description}
                      </p>
                    )}
                    
                    {bullets && bullets.length > 0 && (
                      <ul className="space-y-4">
                        {bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-3">
                            {getThemeBullet(themeStyle, `text-${brandColor}`)}
                            <span className={`text-sm ${fonts.body} text-zinc-200`}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {addons && addons.length > 0 && (
                  <div className="bg-black/40 border border-zinc-800 p-6 rounded-2xl">
                    <h4 className={`text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4`}>Available Upgrades</h4>
                    <div className="space-y-3">
                      {addons.map((addon, i) => {
                        const isSelected = selectedAddons.includes(addon.name);
                        return (
                          <div 
                            key={i} 
                            onClick={() => toggleAddon(addon.name)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? `bg-${brandColor}/10 border-${brandColor}/30` : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? `bg-${brandColor} border-${brandColor}` : 'border-zinc-600 bg-zinc-950'}`}>
                                {isSelected && <CheckCircle2 className="w-3 h-3 text-zinc-950" strokeWidth={3} />}
                              </div>
                              <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{addon.name}</span>
                            </div>
                            {addon.price && <span className={`text-[10px] font-mono ${isSelected ? `text-${brandColor}` : 'text-zinc-500'}`}>{addon.price}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="w-full flex-1">
              {images && images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((img, i) => (
                    <button 
                      key={i} 
                      type="button"
                      onClick={() => setZoomedImage(img.imageUrl)}
                      className="flex flex-col group text-left cursor-zoom-in w-full outline-none relative"
                    >
                      <div className={`relative w-full aspect-square ${shapeRadius} overflow-hidden bg-zinc-900 border border-zinc-800 mb-3`}>
                        <img 
                          src={img.imageUrl} 
                          alt={img.title || `${title} work`}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable="false"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none" 
                        />
                        <ImageWatermark text={businessName} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      </div>
                      {(img.title || img.description) && (
                        <div className="px-1">
                          {img.title && <h4 className={`text-sm font-bold text-white mb-1 ${fonts.heading}`}>{img.title}</h4>}
                          {img.description && <p className={`text-xs text-zinc-400 leading-relaxed line-clamp-2 ${fonts.body}`}>{img.description}</p>}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-600 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl h-full">
                  <ImageIcon size={48} className="mb-4 opacity-30" />
                  <p className="text-sm font-mono uppercase tracking-widest">No gallery images assigned.</p>
                </div>
              )}
            </div>

          </div>
          
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 w-full justify-end">
              <button
                onClick={onClose}
                className={`px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest ${shapeRadius} transition-colors`}
              >
                Close
              </button>
              {onBook && (
                <button
                  onClick={() => {
                    onBook(selectedAddons);
                    onClose();
                  }}
                  className={`w-full sm:w-auto px-8 py-3 bg-${brandColor} text-zinc-950 font-black text-xs uppercase tracking-widest ${shapeRadius} shadow-[0_0_15px_rgba(var(--tw-colors-${brandColor}),0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2`}
                >
                  Book Package <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button className="absolute top-6 right-6 p-2 bg-black/50 text-white/50 hover:text-white rounded-full transition-colors border border-white/10 hover:border-white/30 z-10">
            <X size={24} />
          </button>
          
          <div className="relative w-auto h-auto max-w-full max-h-full">
            <img 
              src={zoomedImage} 
              alt="Expanded view"
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
              className="w-full h-full object-contain drop-shadow-2xl rounded-sm select-none pointer-events-none"
            />
            <ImageWatermark text={businessName} />
          </div>
        </div>
      )}
    </>
  );
}