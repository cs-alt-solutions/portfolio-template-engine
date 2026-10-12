// src/components/portfolio/content-engine/layouts/LookbookFlow.tsx
'use client';

import React, { useState } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { 
  ImageIcon, ArrowRight, Clock, Camera, 
  Package, MapPin, Wand2, Video, Calendar, CheckCircle2, Plus 
} from 'lucide-react';
import UniversalLeadModal from '../../UniversalLeadModal';
import GalleryGrid from '../../gallery/GalleryGrid';

const SmartDeliverable = ({ text, colorClass, isLightMode }: { text: string, colorClass: string, isLightMode: boolean }) => {
  const lower = text.toLowerCase();
  let Icon = CheckCircle2;
  
  if (lower.includes('hour') || lower.includes('time') || lower.includes('minute')) Icon = Clock;
  else if (lower.includes('photo') || lower.includes('image') || lower.includes('shot')) Icon = Camera;
  else if (lower.includes('product') || lower.includes('item')) Icon = Package;
  else if (lower.includes('location') || lower.includes('venue') || lower.includes('outfit')) Icon = MapPin;
  else if (lower.includes('edit') || lower.includes('retouch') || lower.includes('resolution')) Icon = Wand2;
  else if (lower.includes('video') || lower.includes('film') || lower.includes('reel')) Icon = Video;
  else if (lower.includes('day') || lower.includes('week') || lower.includes('turnaround')) Icon = Calendar;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${isLightMode ? 'bg-zinc-100 hover:bg-zinc-200/50' : 'bg-zinc-950/50 hover:bg-zinc-800'}`}>
       <div className={`p-2 rounded-lg bg-current/10 ${colorClass} shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon size={14} strokeWidth={2.5} />
       </div>
       <span className={`text-sm font-medium leading-snug pt-0.5 ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
         {text}
       </span>
    </div>
  );
};

export default function LookbookFlow({
  themeStyle, brandColor, secondaryBrandColor, isLightMode, capabilitiesHeading, galleryHeading, capabilities, galleryItems,
  storefrontSlug, businessName, contactEmail,
  heroImage, isHeroFixed // 🚀 NEW: Catch the hero data
}: ContentLayoutProps) {
  const [activeBooking, setActiveBooking] = useState<string | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;
  const shapeRadius = theme.radius || 'rounded-none';
  
  const hasCaps = capabilities && capabilities.length > 0;
  const packages = (capabilities || []).filter(c => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter(c => c.isAlaCarte);

  const validGalleryItems = (galleryItems || []).filter(img => img.isVisible !== false);
  const hasGallery = validGalleryItems.length > 0;

  return (
    <div className="w-full bg-inherit pt-24 pb-32">
      
      {/* 1. PORTFOLIO GALLERY */}
      {hasGallery && (
        <div className="mb-16">
          <GalleryGrid 
            items={validGalleryItems} 
            galleryHeading={galleryHeading || 'Project Portfolios'} 
            themeStyle={themeStyle} 
            brandColor={brandColor} 
            secondaryBrandColor={secondaryBrandColor} 
            isLightMode={isLightMode} 
            layout="structured"
          />
        </div>
      )}

      {/* --- 🚀 THE NEW PARALLAX WINDOW GAP --- */}
      {hasGallery && packages.length > 0 && (
        isHeroFixed && heroImage ? (
          <div className="relative w-full h-[30vh] md:h-[40vh] border-y border-white/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] mb-20" style={{ clipPath: 'inset(0)' }}>
            <div 
              className="fixed inset-0 w-full h-full bg-cover bg-center opacity-40" 
              style={{ backgroundImage: `url('${heroImage}')`, zIndex: -1 }} 
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto flex items-center justify-center mb-20 opacity-30">
            <div className={`w-full h-px bg-gradient-to-r from-transparent via-${brandColor} to-transparent`} />
          </div>
        )
      )}

      <div className="max-w-7xl mx-auto px-6">
        
        {/* 2. PACKAGES */}
        {packages.length > 0 && (
          <div className="mb-20">
            <div className="mb-12 text-center">
              <span className={`text-xs font-mono font-bold uppercase tracking-[0.3em] ${brandTextColor} block mb-2`}>
                Package Pricing
              </span>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl tracking-tighter ${isLightMode ? 'text-zinc-900' : 'text-white'} ${fonts.heading}`}>
                {capabilitiesHeading || 'Collections'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {packages.map((cap, i) => {
                const attachedImages = validGalleryItems.filter(img => img.category === cap.title);
                const coverImage = cap.coverImage || (attachedImages.length > 0 ? attachedImages[0].imageUrl : null);
                
                return (
                  <div key={i} className={`flex flex-col h-full group ${isLightMode ? 'bg-white' : 'bg-zinc-900/40'} border ${isLightMode ? 'border-zinc-200' : 'border-white/5'} ${shapeRadius} overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300`}>
                    
                    <div className="relative w-full aspect-4/3 overflow-hidden bg-zinc-900/20 shrink-0">
                      {coverImage ? (
                        <img src={coverImage} alt={cap.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500/50 border border-dashed border-zinc-700/50 m-2 rounded-lg">
                          <ImageIcon size={24} className="mb-2 opacity-50" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-2 mb-4 shrink-0">
                        <h3 className={`text-2xl md:text-3xl transition-colors duration-300 leading-tight ${fonts.heading} ${isLightMode ? 'text-zinc-900 group-hover:text-zinc-600' : 'text-zinc-100 group-hover:text-white'}`}>
                          {cap.title}
                        </h3>
                        {cap.price && (
                          <span className={`text-xl font-black shrink-0 mt-1 ${brandTextColor}`}>
                            {cap.price}
                          </span>
                        )}
                      </div>
                      
                      <div className="h-[3rem] mb-6 shrink-0">
                        {cap.description ? (
                          <p className={`text-sm leading-relaxed line-clamp-2 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                            {cap.description}
                          </p>
                        ) : null}
                      </div>

                      {cap.bullets && cap.bullets.length > 0 && (
                        <div className="space-y-2 mb-8 flex-1">
                          {cap.bullets.map((b, bIdx) => (
                             <SmartDeliverable key={bIdx} text={b} colorClass={brandTextColor} isLightMode={isLightMode} />
                          ))}
                        </div>
                      )}

                      <button 
                        type="button"
                        onClick={() => setActiveBooking(cap.title)}
                        className={`w-full py-4 px-4 mt-auto text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border cursor-pointer ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-xl'} ${
                        isLightMode 
                          ? `bg-zinc-950 border-zinc-900 text-white hover:bg-${activeSecondary} hover:text-zinc-950 hover:border-transparent shadow-lg` 
                          : `bg-white border-white text-zinc-950 hover:bg-${activeSecondary} hover:text-zinc-950 hover:border-transparent shadow-lg`
                      }`}>
                        Book This Package <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. ADDITIONAL ADD-ONS */}
        {alaCarte.length > 0 && (
          <div className={`mt-20 mb-28 max-w-4xl mx-auto border p-8 md:p-12 shadow-xl backdrop-blur-md ${isLightMode ? 'bg-zinc-50/50 border-zinc-200' : 'bg-black/30 border-zinc-800/80'} ${shapeRadius}`}>
            <div className="text-center mb-10">
               <div className={`inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-mono font-bold uppercase tracking-widest mb-3 ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} ${isLightMode ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                  <Plus size={12} /> Flexible Upgrades
               </div>
               <h3 className={`text-3xl md:text-4xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>Additional Add-ons</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {alaCarte.map((cap, i) => (
                  <div key={i} className={`flex items-start justify-between p-5 border transition-all shadow-sm ${isLightMode ? 'bg-white border-zinc-200 hover:border-zinc-300' : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'} ${shapeRadius}`}>
                     <div className="space-y-1 pr-4">
                        <h4 className={`text-base font-bold ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                          {cap.title}
                        </h4>
                        {cap.description && (
                          <p className={`text-xs font-light leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                            {cap.description}
                          </p>
                        )}
                     </div>
                     {cap.price && (
                        <span className={`text-base font-black shrink-0 px-3 py-1 border font-mono ${brandTextColor} ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-xl'} ${isLightMode ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                          {cap.price}
                        </span>
                     )}
                  </div>
               ))}
            </div>
          </div>
        )}
      </div>

      <UniversalLeadModal
        isOpen={!!activeBooking}
        onClose={() => setActiveBooking(null)}
        ctaLabel={`Book ${activeBooking}`}
        inquiryOptions={[activeBooking || 'Direct Booking']}
        addonOptions={alaCarte.map(item => ({ title: item.title, price: item.price }))}
        businessName={businessName || 'Our Team'}
        storefrontSlug={storefrontSlug || 'platform-direct'}
        contactEmail={contactEmail || ''}
        brandColor={brandColor}
        isLightMode={isLightMode}
        themeStyle={themeStyle}
      />
    </div>
  );
}