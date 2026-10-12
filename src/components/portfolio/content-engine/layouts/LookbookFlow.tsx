/* src/components/portfolio/content-engine/layouts/LookbookFlow.tsx */
'use client';

import React, { useState } from 'react';
import { ContentLayoutProps } from '../types';
import { getFonts } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { 
  ImageIcon, Maximize2, ArrowRight, Clock, Camera, 
  Package, MapPin, Wand2, Video, Calendar, CheckCircle2, Plus 
} from 'lucide-react';
import ServiceProofModal, { GalleryItem } from '../../ServiceProofModal';
import UniversalLeadModal from '../../UniversalLeadModal';
import GalleryGrid from '../../gallery/GalleryGrid';

interface ExtendedGalleryItem extends GalleryItem {
  addons?: { name: string; price: string }[];
}

interface ModalServiceState {
  title: string;
  images: ExtendedGalleryItem[];
  desc?: string;
  bullets?: string[];
  addons?: { name: string; price: string }[];
}

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
  heroImage, isHeroFixed 
}: ContentLayoutProps) {
  
  const [activeModalService, setActiveModalService] = useState<ModalServiceState | null>(null);
  const [activeBooking, setActiveBooking] = useState<string | null>(null);

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;
  const shapeRadius = theme.radius || 'rounded-none';

  const packages = (capabilities || []).filter(c => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter(c => c.isAlaCarte);

  const getAttachedImages = (serviceTitle: string): ExtendedGalleryItem[] => {
    return (galleryItems || []).filter((item: GalleryItem) => item.category === serviceTitle) as ExtendedGalleryItem[];
  };

  const validGalleryItems = (galleryItems || []).filter(img => img.isVisible !== false);
  const hasGallery = validGalleryItems.length > 0;

  return (
    <div className="w-full bg-inherit pt-24 pb-32">
      
      {/* 1. PORTFOLIO GALLERY (Top) */}
      {hasGallery && (
        <div className="mb-16">
          <GalleryGrid 
            items={validGalleryItems} 
            galleryHeading={galleryHeading || 'Featured Work'} 
            themeStyle={themeStyle} 
            brandColor={brandColor} 
            secondaryBrandColor={secondaryBrandColor} 
            isLightMode={isLightMode}
            layout="structured"
          />
        </div>
      )}

      {/* 2. THE PARALLAX WINDOW GAP (Middle) */}
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
            <div className={`w-full h-px bg-linear-to-r from-transparent via-${brandColor} to-transparent`} />
          </div>
        )
      )}

      {/* 3. LOOKBOOK PACKAGES (Bottom) */}
      <div className="max-w-7xl mx-auto px-6">
        
        {packages.length > 0 && (
          <div className="mb-20">
            <div className="mb-12 text-center">
              <h2 className={`text-4xl md:text-5xl lg:text-6xl tracking-tighter ${brandTextColor} ${fonts.heading}`}>
                {capabilitiesHeading || 'Collections'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {packages.map((cap, i) => {
                const attachedImages = getAttachedImages(cap.title);
                const coverImage = cap.coverImage || (attachedImages.length > 0 ? attachedImages[0].imageUrl : null);
                const packageAddons = attachedImages.flatMap((img: ExtendedGalleryItem) => img.addons || []);
                
                return (
                  <div key={i} className={`flex flex-col h-full group ${isLightMode ? 'bg-white' : 'bg-zinc-900/40'} border ${isLightMode ? 'border-zinc-200' : 'border-white/5'} ${shapeRadius} overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300`}>
                    
                    {/* The image is the only part that triggers the gallery modal */}
                    <div 
                      className="relative w-full aspect-4/3 overflow-hidden cursor-pointer bg-zinc-800 shrink-0"
                      onClick={() => setActiveModalService({ title: cap.title, images: attachedImages, desc: cap.description, bullets: cap.bullets, addons: packageAddons })}
                    >
                      {coverImage ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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
                      
                      <div className="h-12 mb-6 shrink-0">
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

        {/* 4. ADDITIONAL ADD-ONS */}
        {alaCarte.length > 0 && (
          <div className={`mt-20 mb-28 max-w-4xl mx-auto border p-8 md:p-12 shadow-xl backdrop-blur-md ${isLightMode ? 'bg-zinc-50/50 border-zinc-200' : 'bg-black/30 border-zinc-800/80'} ${shapeRadius}`}>
            <div className="text-center mb-10">
               <div className={`inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-mono font-bold uppercase tracking-widest mb-3 ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} ${isLightMode ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                  <Plus size={12} /> Flexible Upgrades
               </div>
               <h3 className={`text-3xl md:text-4xl ${fonts.heading} text-${activeSecondary}`}>Additional Add-ons</h3>
               <p className={`text-xs md:text-sm mt-2 font-light ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                 Customize your shoot with any of these standalone enhancements.
               </p>
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
                        <span className={`text-base font-black shrink-0 px-3 py-1 border font-mono text-${activeSecondary} ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-xl'} ${isLightMode ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                          {cap.price}
                        </span>
                     )}
                  </div>
               ))}
            </div>
          </div>
        )}
      </div>

      <ServiceProofModal
        isOpen={!!activeModalService}
        onClose={() => setActiveModalService(null)}
        title={activeModalService?.title || ''}
        images={activeModalService?.images || []}
        description={activeModalService?.desc}
        bullets={activeModalService?.bullets}
        addons={activeModalService?.addons}
        themeStyle={themeStyle}
        brandColor={brandColor}
        businessName={businessName}
        onBook={() => {
          setActiveBooking(activeModalService?.title || null);
        }}
      />

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