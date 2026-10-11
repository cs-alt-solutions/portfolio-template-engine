'use client';

import React, { useState } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { 
  ImageIcon, Maximize2, ArrowRight, Clock, Camera, 
  Package, MapPin, Wand2, Video, Calendar, CheckCircle2 
} from 'lucide-react';
import ServiceProofModal, { GalleryItem } from '../../ServiceProofModal';
import UniversalLeadModal from '../../UniversalLeadModal';

interface ModalServiceState {
  title: string;
  images: GalleryItem[];
  desc?: string;
}

const parseItemData = (rawText: string = '') => {
  const match = rawText.match(/(.+?)(?:\s*[-|: ]*\s*)(\$[\d.]+)$/);
  if (match) return { text: match[1].trim(), price: match[2] };
  return { text: rawText.trim(), price: null };
};

// 🧠 SMART DELIVERABLE ENGINE: Reads the text and assigns a cool visual icon
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
  storefrontSlug, businessName, contactEmail
}: ContentLayoutProps) {
  const [activeModalService, setActiveModalService] = useState<ModalServiceState | null>(null);
  
  // NEW: State to trigger the direct inquiry modal
  const [activeBooking, setActiveBooking] = useState<string | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;
  const shapeRadius = theme.radius || 'rounded-none';
  
  const hasCaps = capabilities && capabilities.length > 0;
  const packages = (capabilities || []).filter(c => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter(c => c.isAlaCarte);

  const getAttachedImages = (serviceTitle: string): GalleryItem[] => {
    return (galleryItems || []).filter((item: GalleryItem) => item.category === serviceTitle);
  };

  const unattachedGallery = (galleryItems || []).filter(img => !img.category || img.category.trim() === '');
  const hasUnattachedGallery = unattachedGallery.length > 0;

  return (
    <div className="w-full bg-inherit pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* LOOKBOOK: 3-COLUMN PACKAGES */}
        {packages.length > 0 && (
          <div className="mb-24">
            <div className="mb-12 text-center">
              <h2 className={`text-4xl md:text-5xl lg:text-6xl tracking-tighter ${brandTextColor} ${fonts.heading}`}>
                {capabilitiesHeading || 'Collections'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {packages.map((cap, i) => {
                const attachedImages = getAttachedImages(cap.title);
                const coverImage = attachedImages.length > 0 ? attachedImages[0].imageUrl : null;
                
                return (
                  <div key={i} className={`flex flex-col h-full group ${isLightMode ? 'bg-white' : 'bg-zinc-900/40'} border ${isLightMode ? 'border-zinc-200' : 'border-white/5'} ${shapeRadius} overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300`}>
                    
                    {/* Visual Gallery Trigger */}
                    <div 
                      className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer bg-zinc-800 shrink-0"
                      onClick={() => setActiveModalService({ title: cap.title, images: attachedImages, desc: cap.description })}
                    >
                      {coverImage ? (
                        <>
                          <img src={coverImage} alt={cap.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                          <div className={`absolute inset-0 bg-${activeSecondary} mix-blend-color opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/50">
                          <ImageIcon size={32} className="mb-2 opacity-50" />
                          <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">No Cover</span>
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Maximize2 size={12} className={`text-${activeSecondary}`} />
                        <span className="text-[9px] text-white font-bold tracking-widest uppercase">View Gallery</span>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex flex-col xl:flex-row xl:items-baseline justify-between gap-2 mb-4">
                        <h3 className={`text-2xl md:text-3xl transition-colors duration-300 ${fonts.heading} ${isLightMode ? 'text-zinc-900 group-hover:text-zinc-600' : 'text-zinc-100 group-hover:text-white'}`}>
                          {cap.title}
                        </h3>
                        {cap.price && (
                          <span className={`text-xl font-black shrink-0 ${brandTextColor}`}>
                            {cap.price}
                          </span>
                        )}
                      </div>
                      
                      {cap.description && (
                        <p className={`text-sm leading-relaxed mb-6 ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>
                          {cap.description}
                        </p>
                      )}

                      {/* 🚀 THE FRONT-FACING DELIVERABLES GRID */}
                      {cap.bullets && cap.bullets.length > 0 && (
                        <div className="space-y-2 mb-8 flex-1">
                          {cap.bullets.map((b, bIdx) => (
                             <SmartDeliverable key={bIdx} text={b} colorClass={brandTextColor} isLightMode={isLightMode} />
                          ))}
                        </div>
                      )}

                      {/* 🚀 DIRECT INQUIRY TRIGGER */}
                      <button 
                        onClick={() => setActiveBooking(cap.title)}
                        className={`w-full py-4 px-4 mt-auto text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-xl'} ${
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

        {/* À LA CARTE MENU */}
        {alaCarte.length > 0 && (
          <div className="mt-24 mb-32 max-w-4xl mx-auto">
            {alaCarte.map((cap, i) => (
              <div key={i} className="mb-16">
                <div className="text-center mb-12">
                   <h3 className={`text-3xl md:text-4xl ${fonts.heading} ${brandTextColor}`}>{cap.title}</h3>
                   {cap.description && <p className={`mt-4 text-sm md:text-base max-w-2xl mx-auto ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} ${['elegant', 'organic'].includes(themeStyle) ? 'italic' : ''}`}>{cap.description}</p>}
                </div>
                
                <div className="space-y-4">
                   {cap.bullets?.map((b, bIdx) => {
                      const { text, price } = parseItemData(b);
                      return (
                         <div key={bIdx} className={`flex items-end justify-between gap-4 border-b ${isLightMode ? 'border-zinc-200' : 'border-zinc-800/60'} pb-4 transition-colors hover:border-current/30`}>
                            <span className={`text-base md:text-lg ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>{text}</span>
                            {price && <span className={`text-base md:text-lg font-bold tracking-tight ${brandTextColor}`}>{price}</span>}
                         </div>
                      );
                   })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* UNATTACHED GALLERY GRID */}
        {hasUnattachedGallery && (
          <div className={`mt-24 pt-24 ${hasCaps || alaCarte.length > 0 ? `border-t ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'}` : ''}`}>
            <h3 className={`text-3xl md:text-5xl mb-12 text-center ${brandTextColor} ${fonts.heading}`}>
              {galleryHeading || 'Portfolio'}
            </h3>
            
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {unattachedGallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative break-inside-avoid overflow-hidden shadow-lg group cursor-pointer ${shapeRadius}`}
                  onClick={() => setActiveModalService({ title: galleryHeading || 'Portfolio', images: unattachedGallery, desc: '' })}
                >
                  <img src={img.imageUrl} alt={img.title || `Gallery Image ${idx}`} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  
                  {img.title && (
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-6">
                      <h4 className={`text-lg font-bold text-white ${fonts.heading}`}>{img.title}</h4>
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 bg-${activeSecondary} mix-blend-color opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VISUAL PROOF MODAL */}
      <ServiceProofModal
        isOpen={!!activeModalService}
        onClose={() => setActiveModalService(null)}
        title={activeModalService?.title || ''}
        images={activeModalService?.images || []}
        description={activeModalService?.desc}
        themeStyle={themeStyle}
        brandColor={brandColor}
      />

      {/* 🚀 DIRECT INQUIRY MODAL: Pre-filled with the exact package they selected! */}
      <UniversalLeadModal
        isOpen={!!activeBooking}
        onClose={() => setActiveBooking(null)}
        ctaLabel={`Book ${activeBooking}`}
        inquiryOptions={[activeBooking || 'Direct Booking']}
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