// src/components/portfolio/ServiceProofModal.tsx
'use client';

import React from 'react';
import { X, ImageIcon } from 'lucide-react';
import { getFonts, getThemeBullet } from './content-engine/utils';
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
  bullets?: string[]; // 🚀 THE FIX: Modal now accepts bullets
  themeStyle?: string;
  brandColor?: string;
}

export default function ServiceProofModal({
  isOpen,
  onClose,
  title,
  images,
  description,
  bullets,
  themeStyle = 'industrial',
  brandColor = 'cyan-500'
}: ServiceProofModalProps) {
  // 🚀 THE FIX: Modal now opens even if there are no images, acting as a package detail popup
  if (!isOpen) return null;

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.radius || 'rounded-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className={`bg-zinc-950 border border-zinc-800 ${shapeRadius} w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} bg-white/10 border border-white/20 text-white`}>
              Package Details
            </span>
            <h3 className={`text-2xl font-black text-white uppercase tracking-tight mt-2 ${fonts.heading}`}>
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

        {/* Modal Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* 🚀 THE FIX: Render Description & Bullets inside the modal! */}
          {(description || (bullets && bullets.length > 0)) && (
            <div className="mb-10 bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
              {description && (
                <p className={`text-zinc-300 text-base font-light ${bullets && bullets.length > 0 ? 'mb-6 pb-6 border-b border-zinc-800' : ''} ${fonts.body}`}>
                  {description}
                </p>
              )}
              
              {bullets && bullets.length > 0 && (
                <ul className="space-y-4">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-4">
                      {getThemeBullet(themeStyle, `text-${brandColor}`)}
                      <span className={`text-base ${fonts.body} text-zinc-200`}>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Gallery Grid */}
          {images && images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className={`group relative aspect-square ${shapeRadius} overflow-hidden bg-zinc-900 border border-zinc-800`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img.imageUrl} 
                    alt={img.title || `${title} work`}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
              <ImageIcon size={48} className="mb-4 opacity-30" />
              <p className="text-sm font-mono uppercase tracking-widest">No gallery images assigned.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest ${shapeRadius} transition-colors`}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}