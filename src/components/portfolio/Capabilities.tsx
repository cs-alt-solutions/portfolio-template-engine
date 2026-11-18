/* src/components/portfolio/Capabilities.tsx */
'use client';

import React, { useState } from 'react';
import { THEME_REGISTRY } from '@/utils/themes';
import { STOREFRONT_DEFAULTS } from '@/utils/glossary';
import { Eye, Sparkles } from 'lucide-react';
import ServiceProofModal, { GalleryItem } from './ServiceProofModal';

export interface Capability {
  title: string;
  description: string;
  price?: string;
  bullets?: string[];
  isAlaCarte?: boolean;
}

interface CapabilitiesProps {
  heading?: string;
  items: (string | Capability)[];
  galleryItems?: GalleryItem[];
  themeStyle?: string;
  brandColor?: string;
  secondaryBrandColor?: string;
  businessName?: string; 
}

export default function Capabilities({ 
  heading, 
  items, 
  galleryItems = [],
  themeStyle = 'industrial', 
  brandColor = 'cyan-500',
  secondaryBrandColor,
  businessName = 'Client' 
}: CapabilitiesProps) {
  const [selectedServiceForProof, setSelectedServiceForProof] = useState<string | null>(null);

  if (!items || items.length === 0) return null;

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const isLightMode = Boolean(theme.isLightMode);

  const activeSecondary = secondaryBrandColor || brandColor;
  const isCustomHex = activeSecondary.startsWith('#');
  const secHex = isCustomHex ? activeSecondary : undefined;

  const isBrutalist = themeStyle?.startsWith('neo');
  const isEditorial = themeStyle === 'editorial';

  const secAccent = (isBrutalist || isEditorial)
    ? (isLightMode ? 'text-black' : 'text-white')
    : (isCustomHex ? 'text-(--sec-brand-hex)' : `text-${activeSecondary}`);

  const secBorder = (isBrutalist || isEditorial)
    ? (isLightMode ? 'border-black' : 'border-white')
    : (isCustomHex ? 'border-(--sec-brand-hex)' : `border-${activeSecondary}`);

  const cardSurface = (theme as unknown as { cardStyle?: string; cardBg?: string }).cardStyle || 
                      (theme as unknown as { cardBg?: string }).cardBg || 
                      (isLightMode ? 'bg-white border border-zinc-200 rounded-2xl' : 'bg-zinc-900/60 border border-white/10 rounded-2xl');

  const normalizedItems: Capability[] = items.map(item => 
    typeof item === 'string' ? { title: item, description: '' } : item
  );

  const packages = normalizedItems.filter(item => !item.isAlaCarte);
  const addons = normalizedItems.filter(item => item.isAlaCarte);

  const parsedGallery: GalleryItem[] = galleryItems.map(item => 
    typeof item === 'string' ? { imageUrl: item, title: '', description: '', category: '' } : item
  );

  const activeProofImages = selectedServiceForProof 
    ? parsedGallery.filter(img => img.category?.toLowerCase() === selectedServiceForProof.toLowerCase())
    : [];

  // Build props safely for ServiceProofModal regardless of which prop signature it expects
  const modalProps = {
    isOpen: !!selectedServiceForProof,
    onClose: () => setSelectedServiceForProof(null),
    serviceName: selectedServiceForProof || '',
    serviceTitle: selectedServiceForProof || '',
    images: activeProofImages,
    themeStyle,
    brandColor: activeSecondary,
    isLightMode,
    businessName,
    theme,
  };

  const SafeServiceProofModal = ServiceProofModal as unknown as React.ComponentType<typeof modalProps>;

  return (
    <section className={`py-24 px-6 border-t border-white/5 relative z-10 ${theme.pageBg}`}>
      <div className="max-w-7xl mx-auto">
        {heading && (
          <div className="flex flex-col items-center text-center mb-16">
            <h2 
              className={`${theme.accentText} ${secAccent} mb-4 flex items-center justify-center gap-3`}
              style={secHex ? { color: secHex } : undefined}
            >
              <div className="w-2 h-2 rounded-full bg-current opacity-70" />
              {STOREFRONT_DEFAULTS.CAPABILITIES_HEADING || 'What We Do'}
              <div className="w-2 h-2 rounded-full bg-current opacity-70" />
            </h2>
            <h3 className={`text-4xl md:text-5xl ${theme.primaryText}`}>{heading}</h3>
          </div>
        )}

        {/* 1. CORE PACKAGES GRID */}
        {packages.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {packages.map((item, idx) => {
              const matchingImages = parsedGallery.filter(
                img => img.category && img.category.toLowerCase() === item.title.toLowerCase()
              );
              const hasProof = matchingImages.length > 0;
              const hasBullets = item.bullets && item.bullets.filter(b => b.trim() !== '').length > 0;

              return (
                <div 
                  key={idx} 
                  onClick={() => { if (hasProof) setSelectedServiceForProof(item.title); }}
                  style={hasProof && secHex ? { borderColor: secHex } : undefined}
                  className={`w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] p-8 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${cardSurface} ${
                    hasProof ? `cursor-pointer group hover:-translate-y-1 hover:${secBorder}` : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div 
                        className={`text-xs font-mono opacity-40 px-2.5 py-1 rounded border border-current ${secAccent}`}
                        style={secHex ? { color: secHex, borderColor: secHex } : undefined}
                      >
                        0{idx + 1}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.price && (
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border border-current/20 bg-current/5 ${secAccent}`}
                            style={secHex ? { color: secHex, borderColor: `${secHex}40`, backgroundColor: `${secHex}10` } : undefined}
                          >
                            {item.price}
                          </span>
                        )}
                        {hasProof && (
                          <div 
                            className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-current/20 bg-current/5 opacity-70 group-hover:opacity-100 transition-opacity ${secAccent}`}
                            style={secHex ? { color: secHex, borderColor: `${secHex}40`, backgroundColor: `${secHex}10` } : undefined}
                          >
                            <Eye size={12} /> Proof ({matchingImages.length})
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className={`text-xl font-bold mb-3 ${theme.primaryText} transition-colors`}>
                      {item.title}
                    </h4>
                    
                    {item.description && (
                      <p className={`text-sm leading-relaxed ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {hasBullets && (
                    <ul className="mt-6 space-y-2.5 border-t border-current/10 pt-5">
                      {item.bullets!.filter(b => b.trim() !== '').map((bullet, bIdx) => (
                        <li key={bIdx} className={`text-xs flex items-start gap-2.5 ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
                          <span 
                            className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0 ${secAccent}`} 
                            style={secHex ? { backgroundColor: secHex } : undefined}
                          />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 2. FLEXIBLE UPGRADES (ADD-ONS) GRID */}
        {addons.length > 0 && (
          <div className="mt-16 pt-16 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className={`w-4 h-4 ${secAccent}`} style={secHex ? { color: secHex } : undefined} />
              <h4 className={`text-sm font-bold uppercase tracking-widest ${theme.primaryText}`}>Flexible Upgrades & Add-ons</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {addons.map((addon, idx) => (
                <div key={idx} className={`p-5 rounded-xl border border-white/5 flex flex-col justify-between gap-3 ${cardSurface} opacity-90 hover:opacity-100 transition-opacity`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-bold text-sm ${theme.primaryText}`}>{addon.title}</span>
                    {addon.price && (
                      <span 
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-current/10 shrink-0 ${secAccent}`}
                        style={secHex ? { color: secHex, backgroundColor: `${secHex}15` } : undefined}
                      >
                        {addon.price}
                      </span>
                    )}
                  </div>
                  {addon.description && (
                    <p className={`text-xs leading-relaxed ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {addon.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SafeServiceProofModal {...modalProps} />
    </section>
  );
}