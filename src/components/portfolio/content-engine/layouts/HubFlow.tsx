/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/content-engine/layouts/HubFlow.tsx */
'use client';

import React, { useState } from 'react';
import { ContentLayoutProps, GalleryItem } from '../types';
import { getFonts, getThemeBullet, ImageWatermark } from '../utils';
import { THEME_REGISTRY } from '@/utils/themes';
import { Layers, ArrowRight, Sparkles, ZoomIn, X, CheckCircle2 } from 'lucide-react';
import UniversalLeadModal from '../../UniversalLeadModal';

export default function HubFlow({
  themeStyle = 'industrial',
  brandColor = 'cyan-500',
  secondaryBrandColor,
  isLightMode = false,
  capabilitiesHeading,
  capabilities = [],
  galleryItems = [],
  storefrontSlug,
  businessName,
  contactEmail,
}: ContentLayoutProps) {
  const departments = (capabilities || []).filter((c) => !c.isAlaCarte);
  const alaCarte = (capabilities || []).filter((c) => c.isAlaCarte);

  const [activeDeptIndex, setActiveDeptIndex] = useState<number>(0);
  const [activeBookingDept, setActiveBookingDept] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (!departments || departments.length === 0) return null;

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.radius || 'rounded-2xl';
  const brandTextColor = `text-${brandColor}`;
  const activeSecondary = secondaryBrandColor || brandColor;

  const activeDepartment = departments[activeDeptIndex] || departments[0];

  const getDepartmentItems = (deptTitle: string): GalleryItem[] => {
    return (galleryItems || []).filter(
      (item) => item.category === deptTitle && item.isVisible !== false
    );
  };

  const activeItems = getDepartmentItems(activeDepartment.title);
  const activePhotos = activeItems.filter((item) => item.imageUrl && item.imageUrl.trim() !== '');

  // Pick a cover image for the active department stage banner
  const activeCoverImage =
    activeDepartment.coverImage ||
    (activePhotos.length > 0 ? activePhotos[0].imageUrl : null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative">
      
      {/* 1. UMBRELLA SECTION HEADER */}
      <div className="text-center mb-10 md:mb-14">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 text-[10px] font-mono font-bold uppercase tracking-widest border ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} ${isLightMode ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
          <Layers size={12} className={brandTextColor} />
          <span>Explore Our Departments</span>
        </div>
        <h2 className={`text-4xl sm:text-5xl md:text-6xl tracking-tight ${brandTextColor} ${fonts.heading}`}>
          {capabilitiesHeading || 'Choose Your Experience'}
        </h2>
        <div className={`w-24 h-1.5 mx-auto mt-5 bg-${brandColor} ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} />
      </div>

      {/* 2. THE DEPARTMENT GATEWAY CARDS (Interactive Switcher) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${departments.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 md:gap-6 mb-12 md:mb-16`}>
        {departments.map((dept, idx) => {
          const isSelected = idx === activeDeptIndex;
          const deptItems = getDepartmentItems(dept.title);
          const deptCover =
            dept.coverImage ||
            deptItems.find((img) => img.imageUrl && img.imageUrl.trim() !== '')?.imageUrl;

          return (
            <button
              key={dept.title}
              type="button"
              onClick={() => setActiveDeptIndex(idx)}
              className={`group relative text-left h-40 sm:h-48 w-full overflow-hidden transition-all duration-500 cursor-pointer flex flex-col justify-end p-5 sm:p-6 ${shapeRadius} ${
                isSelected
                  ? `ring-4 ring-${brandColor} shadow-2xl -translate-y-1`
                  : `opacity-75 hover:opacity-100 border ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'} hover:-translate-y-0.5`
              }`}
            >
              {/* Background Image or Gradient Fallback */}
              {deptCover ? (
                <>
                  <img
                    src={deptCover}
                    alt={dept.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                  />
                  <div className={`absolute inset-0 bg-linear-to-t ${isSelected ? 'from-black/95 via-black/50 to-black/10' : 'from-black/90 via-black/60 to-black/30'}`} />
                </>
              ) : (
                <div className={`absolute inset-0 ${isLightMode ? 'bg-zinc-900' : 'bg-zinc-900'} bg-linear-to-br from-zinc-900 via-zinc-900 to-black`} />
              )}

              {/* Active Department Pill Badge */}
              <div className="relative z-10 flex items-center justify-between w-full mb-auto">
                <span className={`px-2.5 py-1 text-[9px] font-mono font-black uppercase tracking-widest ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} transition-colors ${
                  isSelected
                    ? `bg-${brandColor} text-zinc-950 shadow-md`
                    : 'bg-black/60 text-zinc-300 border border-white/15 backdrop-blur-md'
                }`}>
                  {isSelected ? 'Active Department' : `0${idx + 1}`}
                </span>

                {dept.price && (
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold text-white bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                    {dept.price}
                  </span>
                )}
              </div>

              {/* Department Title & Count */}
              <div className="relative z-10">
                <h3 className={`text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md ${fonts.heading}`}>
                  {dept.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${isSelected ? `text-${brandColor}` : 'text-zinc-400'}`}>
                    {isSelected ? 'Viewing Department' : 'Click to Explore'}
                  </span>
                  <ArrowRight size={12} className={`transition-transform duration-300 ${isSelected ? `translate-x-1 text-${brandColor}` : 'text-zinc-400 group-hover:translate-x-1'}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. THE ISOLATED DEPARTMENT STAGE (Renders ONLY the active department) */}
      <div
        key={activeDepartment.title}
        className={`w-full border shadow-2xl overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${shapeRadius} ${
          isLightMode ? 'bg-white border-zinc-200' : 'bg-zinc-950/90 border-zinc-800/90 backdrop-blur-xl'
        }`}
      >
        {/* TOP STAGE: Department Overview, Bullets & Direct Booking CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 md:p-12 items-center border-b border-current/10">
          
          <div className={`${activeCoverImage ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} bg-${brandColor}/15 text-${brandColor} border border-${brandColor}/30`}>
                Department Spotlight
              </span>
              {activeDepartment.price && (
                <span className={`text-lg font-black font-mono text-${activeSecondary}`}>
                  {activeDepartment.price}
                </span>
              )}
            </div>

            <h3 className={`text-3xl sm:text-4xl md:text-5xl leading-tight ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
              {activeDepartment.title}
            </h3>

            {activeDepartment.description && (
              <p className={`text-base sm:text-lg leading-relaxed whitespace-pre-wrap ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-300'}`}>
                {activeDepartment.description}
              </p>
            )}

            {/* Department Highlights / Deliverables Bullets */}
            {activeDepartment.bullets && activeDepartment.bullets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeDepartment.bullets.map((bullet, bIdx) => (
                  <div
                    key={bIdx}
                    className={`flex items-start gap-3 p-3.5 border ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-xl'} ${
                      isLightMode ? 'bg-zinc-50 border-zinc-200/80' : 'bg-zinc-900/60 border-zinc-800/80'
                    }`}
                  >
                    {getThemeBullet(themeStyle, brandTextColor)}
                    <span className={`text-sm sm:text-base leading-snug ${fonts.body} ${isLightMode ? 'text-zinc-800' : 'text-zinc-200'}`}>
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Dedicated Department Inquiry Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setActiveBookingDept(activeDepartment.title)}
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-xl hover:scale-105 ${
                  shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-xl'
                } bg-${brandColor} text-zinc-950`}
              >
                <Sparkles size={15} />
                <span>Inquire About {activeDepartment.title}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Featured Department Hero Image */}
          {activeCoverImage && (
            <div className="lg:col-span-5">
              <div
                onClick={() => setZoomedImage(activeCoverImage)}
                className={`relative w-full aspect-4/3 overflow-hidden shadow-2xl group cursor-zoom-in border ${
                  isLightMode ? 'border-zinc-200' : 'border-white/10'
                } ${shapeRadius}`}
              >
                <img
                  src={activeCoverImage}
                  alt={activeDepartment.title}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
                />
                <ImageWatermark text={businessName} />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STAGE: Department Offerings, Store Items, or Photo Gallery */}
        {activeItems.length > 0 && (
          <div className={`p-6 sm:p-10 md:p-12 ${isLightMode ? 'bg-zinc-50/60' : 'bg-black/30'}`}>
            <div className="flex items-center justify-between mb-8">
              <h4 className={`text-xl sm:text-2xl ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                {activeDepartment.title} — Offerings & Media
              </h4>
              <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                {activeItems.length} {activeItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {activeItems.map((item, idx) => {
                const hasPhoto = !!(item.imageUrl && item.imageUrl.trim() !== '');
                const formattedPrice =
                  item.price && String(item.price).trim() !== ''
                    ? String(item.price).trim().startsWith('$')
                      ? String(item.price).trim()
                      : `$${String(item.price).trim()}`
                    : null;

                return (
                  <div
                    key={item.id || idx}
                    className={`flex flex-col justify-between overflow-hidden border transition-all duration-300 shadow-lg hover:shadow-xl ${shapeRadius} ${
                      isLightMode ? 'bg-white border-zinc-200' : 'bg-zinc-900/90 border-zinc-800'
                    }`}
                  >
                    {hasPhoto && (
                      <div
                        onClick={() => setZoomedImage(item.imageUrl)}
                        className="relative w-full aspect-4/3 overflow-hidden bg-zinc-950 group cursor-zoom-in"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title || activeDepartment.title}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable="false"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
                        />
                        <ImageWatermark text={businessName} />
                        {formattedPrice && (
                          <div className={`absolute bottom-3 right-3 z-20 bg-${brandColor} text-zinc-950 px-2.5 py-1 rounded-lg font-black text-xs sm:text-sm shadow-lg`}>
                            {formattedPrice}
                          </div>
                        )}
                      </div>
                    )}

                    {(item.title || item.description || (!hasPhoto && formattedPrice) || (item.addons && item.addons.length > 0)) && (
                      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            {item.title && (
                              <h5 className={`text-base sm:text-lg font-bold leading-snug ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                                {item.title}
                              </h5>
                            )}
                            {!hasPhoto && formattedPrice && (
                              <span className={`shrink-0 bg-${brandColor} text-zinc-950 px-2.5 py-1 rounded-lg font-black text-xs`}>
                                {formattedPrice}
                              </span>
                            )}
                          </div>

                          {item.description && item.description !== item.category && (
                            <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                              {item.description}
                            </p>
                          )}
                        </div>

                        {item.addons && item.addons.length > 0 && (
                          <div className={`pt-3 mt-2 border-t space-y-1.5 ${isLightMode ? 'border-zinc-200' : 'border-zinc-800'}`}>
                            {item.addons.map((addon, aIdx) => (
                              <div key={aIdx} className="flex items-center justify-between text-[11px] font-mono">
                                <span className={isLightMode ? 'text-zinc-600' : 'text-zinc-400'}>
                                  <CheckCircle2 size={11} className={`inline mr-1.5 text-${activeSecondary}`} />
                                  {addon.name}
                                </span>
                                {addon.price && (
                                  <span className={`font-bold text-${activeSecondary}`}>{addon.price}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. LIGHTBOX IMAGE ZOOM */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button className="absolute top-6 right-6 p-2 bg-black/50 text-white/70 hover:text-white rounded-full transition-colors border border-white/10 z-10">
            <X size={24} />
          </button>
          <div className="relative w-auto h-auto max-w-full max-h-full">
            <img
              src={zoomedImage}
              alt="Expanded view"
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
              className="w-full h-full max-h-[85vh] object-contain drop-shadow-2xl rounded-sm select-none pointer-events-none"
            />
            <ImageWatermark text={businessName} />
          </div>
        </div>
      )}

      {/* 5. DEPARTMENT-SPECIFIC LEAD MODAL */}
      <UniversalLeadModal
        isOpen={!!activeBookingDept}
        onClose={() => setActiveBookingDept(null)}
        ctaLabel={`Inquire: ${activeBookingDept}`}
        inquiryOptions={departments.map((d) => d.title)}
        addonOptions={alaCarte.map((item) => ({ title: item.title, price: item.price }))}
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