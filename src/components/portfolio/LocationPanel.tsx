// src/components/portfolio/LocationPanel.tsx
'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { getFonts } from './content-engine/utils';
import { THEME_REGISTRY } from '@/utils/themes';

interface LocationPanelProps {
  businessName: string;
  mapEmbedUrl?: string;
  themeStyle?: string;
  brandColor?: string;
  isLightMode?: boolean;
  industryTag?: string; // 🚀 NEW: Catch the industry to adjust the language
}

export default function LocationPanel({
  businessName,
  mapEmbedUrl,
  themeStyle = 'industrial',
  brandColor = 'cyan-500',
  isLightMode = false,
  industryTag = 'General',
}: LocationPanelProps) {
  if (!mapEmbedUrl || mapEmbedUrl.trim() === '') return null;

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  
  const extractUrl = (input: string) => {
    const srcMatch = input.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : input;
  };

  const cleanUrl = extractUrl(mapEmbedUrl);

  const radius = themeStyle === 'elegant' ? 'rounded-sm' : 
                 ['industrial', 'neo', 'cyberpunk', 'editorial'].includes(themeStyle) ? 'rounded-none' : 
                 themeStyle === 'minimal' ? 'rounded-3xl' : 'rounded-2xl';

  // 🚀 DYNAMIC COPY ENGINE: Adapts language based on the business type
  const getDynamicCopy = () => {
    switch (industryTag) {
      case 'Culinary':
        return { heading: "Grab a Bite", subtext: "Swing by for some great food, or check the map to find our local spot." };
      case 'Automotive':
        return { heading: "Pull Into the Shop", subtext: "Bring your ride down to the garage or check our local service area." };
      case 'Wellness':
        return { heading: "Visit Our Sanctuary", subtext: "Step into our space for some peace, or see where we operate." };
      case 'Creative':
        return { heading: "Stop by the Studio", subtext: "Come visit our creative space or check our local operating footprint." };
      case 'Contracting':
      case 'Local Services':
        return { heading: "Our Home Base", subtext: "Stop by the headquarters or check the map to see our active service routes." };
      case 'Consulting':
      case 'Tech & SaaS':
        return { heading: "Let's Connect", subtext: "Stop by the office for a coffee and a chat, or see our primary operating zone." };
      case 'E-Commerce':
        return { heading: "Visit the Flagship", subtext: "Check out our physical storefront or see our local distribution area." };
      default:
        return { heading: "Drop By", subtext: "Swing by the shop, or check the map to see our local service area." };
    }
  };

  const { heading, subtext } = getDynamicCopy();

  return (
    <section className={`py-12 px-6 relative z-20 ${isLightMode ? 'bg-zinc-100 border-t border-zinc-200' : 'bg-zinc-950 border-t border-zinc-900'}`}>
      <div className="max-w-4xl mx-auto">
        
        <div className={`flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-8 shadow-xl transition-all ${
          themeStyle === 'neo' 
            ? 'border-4 border-black bg-white rounded-none' 
            : isLightMode 
              ? 'bg-white border border-zinc-200 rounded-3xl' 
              : 'bg-zinc-900 border border-zinc-800 rounded-3xl'
        }`}>
          
          {/* LEFT: Text & Branding */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className={`inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 ${
              isLightMode ? 'bg-zinc-100 text-zinc-600 rounded-full' : 'bg-black/50 text-zinc-400 rounded-full border border-white/5'
            } ${themeStyle === 'neo' ? 'rounded-none border-2 border-black bg-yellow-300 text-black' : ''}`}>
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </div>
            
            <h2 className={`text-2xl md:text-3xl tracking-tight ${fonts.heading} ${isLightMode || themeStyle === 'neo' ? 'text-zinc-900' : 'text-white'}`}>
              {heading}
            </h2>
            
            <p className={`text-sm max-w-sm mx-auto md:mx-0 ${fonts.body} ${isLightMode || themeStyle === 'neo' ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {subtext}
            </p>
          </div>

          {/* RIGHT: Compact Map Render */}
          <div className={`w-full md:w-1/2 h-48 md:h-56 relative overflow-hidden shrink-0 shadow-inner group ${radius} ${
            themeStyle === 'neo' ? 'border-2 border-black' : ''
          }`}>
            <iframe 
              src={cleanUrl}
              width="100%" 
              height="100%" 
              style={{ 
                border: 0, 
                filter: themeStyle === 'cyberpunk' || themeStyle === 'midnight' || themeStyle === 'industrial' 
                  ? 'invert(90%) hue-rotate(180deg) contrast(0.9)' 
                  : 'contrast(0.95)' 
              }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />
          </div>

        </div>
      </div>
    </section>
  );
}