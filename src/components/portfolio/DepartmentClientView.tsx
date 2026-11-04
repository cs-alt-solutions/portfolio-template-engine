/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/DepartmentClientView.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Layers, Sparkles } from 'lucide-react';
import UniversalLeadModal from './UniversalLeadModal';
import { getFonts } from './content-engine/utils';
import { THEME_REGISTRY } from '@/utils/themes';

interface DepartmentItem {
  title?: string;
  description?: string;
  price?: string;
  bullets?: string[];
  addons?: Array<{ title?: string; name?: string; price?: string } | string>;
  coverImage?: string;
}

interface DepartmentClientViewProps {
  store: {
    slug: string;
    business_name?: string;
    contact_email?: string;
    hero_image?: string;
    brand_logo?: string;
    [key: string]: unknown;
  };
  department: {
    title: string;
    description?: string;
    price?: string;
    bullets?: string[];
    addons?: Array<{ title?: string; name?: string; price?: string } | string>;
    coverImage?: string;
  };
  allDepartments: DepartmentItem[];
  departmentGallery: Array<{
    id: string;
    imageUrl?: string;
    title?: string;
    description?: string;
    price?: string;
  }>;
  themeStyle: string;
  brandColor: string;
  isLightMode: boolean;
}

export default function DepartmentClientView({
  store,
  department,
  allDepartments,
  departmentGallery,
  themeStyle,
  brandColor,
  isLightMode,
}: DepartmentClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];

  const coverImage =
    department.coverImage ||
    departmentGallery.find((g) => g.imageUrl)?.imageUrl ||
    store.hero_image;

  const inquiryTopics = [
    department.title,
    ...allDepartments.map((d) => d.title).filter((t): t is string => !!t && t !== department.title),
  ];

  const slugify = (text: string) =>
    (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const validAddons = (department.addons || [])
    .map((addon) => (typeof addon === 'string' ? addon : addon.title || addon.name))
    .filter((label): label is string => !!label && label.trim() !== '');

  return (
    <div className={`flex-1 flex flex-col ${theme.pageBg || 'bg-zinc-950'}`}>
      
      {/* 1. STICKY TOP COMMAND BAR + VISUAL DEPARTMENT SWITCHER */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-zinc-950/90 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Top Row: Back Link & Direct Inquiry */}
          <div className="py-3 flex items-center justify-between gap-4 border-b border-white/5">
            <Link
              href={`/${store.slug}#gallery`}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-brand-primary" />
              <span>Back to {store.business_name || 'Main Page'}</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest bg-brand-primary text-white border border-white/25 shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Inquire Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Row: Sticky Visual Department Cards (No Pills, No Scrollbars) */}
          {allDepartments.length > 1 && (
            <div className="py-2.5 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {allDepartments.map((dept, idx) => {
                if (!dept.title) return null;
                const isCurrent = dept.title === department.title;
                return (
                  <Link
                    key={idx}
                    href={`/${store.slug}/${slugify(dept.title)}`}
                    prefetch={true}
                    className={`group relative overflow-hidden rounded-lg border px-3.5 py-2.5 flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-brand-primary bg-zinc-900 ring-1 ring-brand-primary shadow-md'
                        : 'border-white/10 bg-zinc-900/40 opacity-65 hover:opacity-100 hover:border-white/25'
                    }`}
                  >
                    {dept.coverImage && (
                      <div className="absolute inset-0 z-0">
                        <img
                          src={dept.coverImage}
                          alt={dept.title}
                          className="w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/40" />
                      </div>
                    )}
                    <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isCurrent ? 'bg-brand-primary' : 'bg-zinc-600'
                        }`}
                      />
                      <span className={`text-xs font-bold text-white truncate ${fonts.heading}`}>
                        {dept.title}
                      </span>
                    </div>
                    <ArrowRight
                      className={`relative z-10 w-3.5 h-3.5 shrink-0 transition-transform ${
                        isCurrent
                          ? 'text-brand-primary'
                          : 'text-zinc-500 group-hover:text-white group-hover:translate-x-0.5'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </header>

      {/* 2. OPEN FULL-BLEED HERO SECTION (Not trapped in a box!) */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-b border-white/10 overflow-hidden">
        {coverImage && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={coverImage}
              alt=""
              className="w-full h-full object-cover opacity-10 blur-xl scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-b from-zinc-950/80 via-zinc-950/95 to-zinc-950" />
          </div>
        )}

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Open Editorial Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{store.business_name}</span>
            </div>

            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] ${fonts.heading}`}>
              {department.title}
            </h1>

            {department.price && (
              <div className="inline-block text-sm font-mono font-bold text-brand-primary px-3.5 py-1.5 rounded-md bg-white/5 border border-white/10">
                {department.price}
              </div>
            )}

            {department.description && (
              <p className={`text-lg md:text-xl text-zinc-300 leading-relaxed max-w-2xl ${fonts.body}`}>
                {department.description}
              </p>
            )}

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-brand-primary text-white border border-white/25 hover:brightness-110 transition-all cursor-pointer shadow-xl"
              >
                <span>Inquire About {department.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Feature Media Frame */}
          <div className="lg:col-span-5">
            {coverImage && (
              <div className="aspect-4/3 w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900">
                <img
                  src={coverImage}
                  alt={department.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. FULL-WIDTH HIGHLIGHTS & OPTIONS SECTIONS */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-20">
        
        {/* What's Included - Open 3-Column Feature Layout */}
        {department.bullets && department.bullets.filter(Boolean).length > 0 && (
          <div className="space-y-8">
            <div className="border-l-2 border-brand-primary pl-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                Department Details
              </span>
              <h2 className={`text-2xl md:text-3xl font-black text-white ${fonts.heading}`}>
                What&apos;s Included &amp; Highlights
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {department.bullets.filter(Boolean).map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-6 md:p-8 rounded-2xl bg-zinc-900/35 border border-white/10 flex flex-col justify-between gap-4 hover:border-white/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                  </div>
                  <p className={`text-sm md:text-base text-zinc-200 leading-relaxed ${fonts.body}`}>
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiry Options Strip (If options exist on this department) */}
        {validAddons.length > 0 && (
          <div className="p-8 md:p-10 rounded-2xl bg-zinc-900/50 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-primary">
                <Layers className="w-4 h-4" />
                <span>Custom Inquiry Options</span>
              </div>
              <h3 className={`text-xl md:text-2xl font-bold text-white ${fonts.heading}`}>
                Tailor Your Request
              </h3>
              <p className={`text-sm text-zinc-400 ${fonts.body}`}>
                Click any option below to open the inquiry form and include it with your request:
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {validAddons.map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/15 bg-zinc-950 hover:border-brand-primary text-zinc-100 transition-all cursor-pointer flex items-center gap-2 shadow-md"
                >
                  <span className="text-brand-primary">+</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Department Gallery / Offerings Grid (If images are assigned to this department) */}
        {departmentGallery.length > 0 && (
          <div className="space-y-8 pt-4 border-t border-white/10">
            <div className="border-l-2 border-brand-primary pl-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                Visual Showcase
              </span>
              <h2 className={`text-2xl md:text-3xl font-black text-white ${fonts.heading}`}>
                {department.title} Gallery &amp; Offerings
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentGallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden border flex flex-col bg-zinc-900/40 border-white/10 hover:border-white/25 transition-all"
                >
                  {item.imageUrl && (
                    <div className="aspect-video w-full bg-zinc-900 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title || department.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {(item.title || item.description || item.price) && (
                    <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        {item.title && (
                          <h3 className={`font-bold text-base text-white ${fonts.heading}`}>
                            {item.title}
                          </h3>
                        )}
                        {item.price && (
                          <span className="text-xs font-mono font-bold text-brand-primary">
                            {item.price}
                          </span>
                        )}
                      </div>
                      {item.description && item.description !== department.title && (
                        <p className={`text-xs text-zinc-400 leading-relaxed ${fonts.body}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      <UniversalLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessName={store.business_name || 'Business'}
        storefrontSlug={store.slug}
        contactEmail={store.contact_email}
        brandColor={brandColor}
        isLightMode={isLightMode}
        themeStyle={themeStyle}
        inquiryOptions={inquiryTopics}
        addonOptions={validAddons}
      />
    </div>
  );
}