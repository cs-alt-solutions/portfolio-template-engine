/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/AboutSection.tsx */
import React from 'react';
import { THEME_REGISTRY } from '@/utils/themes';

export interface SocialPlatform {
  name: string;
  url: string;
  Icon: React.ElementType;
}

export interface AboutSectionProps {
  data: {
    heading?: string;
    bio?: string;
    imageUrl?: string;
    brandColor?: string;
    secondaryBrandColor?: string;
    socials?: SocialPlatform[];
    aboutLayout?: string;
    isLightMode?: boolean;
    themeStyle?: string;
  };
}

const SocialLinks = ({
  socials,
  secondaryBrandColor,
  aboutLayout,
  isLight,
}: {
  socials: SocialPlatform[];
  secondaryBrandColor: string;
  aboutLayout: string;
  isLight: boolean;
}) => {
  if (!socials || socials.length === 0) return null;
  const isCentered = ['minimal', 'center', 'card', 'glass', 'glass-card', 'glass_card'].includes(aboutLayout);

  return (
    <div className={`flex gap-6 mt-8 ${isCentered ? 'justify-center' : 'justify-start'}`}>
      {socials.map((social, idx) => {
        const Icon = social.Icon;
        return (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all duration-300 transform hover:-translate-y-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'} hover:text-${secondaryBrandColor}`}
          >
            <Icon size={24} />
          </a>
        );
      })}
    </div>
  );
};

export default function AboutSection({ data }: AboutSectionProps) {
  const {
    heading = 'About Us',
    bio,
    imageUrl,
    brandColor = 'brand-primary',
    secondaryBrandColor = brandColor,
    socials = [],
    aboutLayout = 'split',
    isLightMode,
    themeStyle = 'industrial',
  } = data;

  if (!bio && !imageUrl) return null;

  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const isLight = typeof isLightMode === 'boolean' ? isLightMode : theme.isLightMode;
  const shapeRadius = theme.radius === 'rounded-full' ? 'rounded-3xl' : (theme.radius || 'rounded-none');
  const lineGradient = `bg-linear-to-r from-${brandColor} to-${secondaryBrandColor}`;

  const headingColor = isLight ? 'text-zinc-900' : 'text-zinc-50';
  const bodyColor = isLight ? 'text-zinc-600' : 'text-zinc-300';
  const surfaceBg = isLight
    ? 'bg-white border-zinc-900/10'
    : 'bg-zinc-900/80 border-white/10';
  const fontHeadingClass = theme.primaryText.includes('font-serif') ? 'font-serif' : 'font-sans font-bold tracking-tight';

  if (aboutLayout === 'minimal' || aboutLayout === 'center') {
    return (
      <section className="w-full max-w-4xl mx-auto flex flex-col items-center text-center p-6 md:p-16">
        <h2 className={`text-4xl md:text-5xl mb-6 ${fontHeadingClass} ${headingColor}`}>
          {heading}
        </h2>
        <div className={`w-16 h-1.5 mb-10 ${shapeRadius === 'rounded-none' ? 'rounded-none' : 'rounded-full'} ${lineGradient}`} />

        {imageUrl && (
          <div className={`w-full max-w-2xl aspect-video ${shapeRadius} overflow-hidden shadow-2xl mb-12 relative group mx-auto flex items-center justify-center ${isLight ? 'bg-zinc-100' : 'bg-zinc-900'}`}>
            <img src={imageUrl} alt={heading} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        )}

        <p className={`text-lg md:text-xl leading-relaxed mb-10 whitespace-pre-wrap font-light ${bodyColor} max-w-3xl mx-auto`}>
          {bio}
        </p>
        <SocialLinks socials={socials} secondaryBrandColor={secondaryBrandColor} aboutLayout={aboutLayout} isLight={isLight} />
      </section>
    );
  }

  if (aboutLayout === 'editorial') {
    return (
      <section className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start p-4 md:p-8">
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <h2 className={`text-5xl md:text-6xl leading-none ${fontHeadingClass} ${headingColor}`}>
            {heading}
          </h2>
          <div className={`w-full h-px mt-8 ${lineGradient}`} />
          <SocialLinks socials={socials} secondaryBrandColor={secondaryBrandColor} aboutLayout={aboutLayout} isLight={isLight} />
        </div>
        <div className="w-full lg:w-2/3 space-y-10">
          {imageUrl && (
            <div className={`w-full aspect-video ${shapeRadius} overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700`}>
              <img src={imageUrl} alt={heading} className="w-full h-full object-cover" />
            </div>
          )}
          <p className={`text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-light ${bodyColor}`}>
            {bio}
          </p>
        </div>
      </section>
    );
  }

  if (aboutLayout === 'card' || aboutLayout === 'glass' || aboutLayout === 'glass-card' || aboutLayout === 'glass_card') {
    return (
      <section className={`w-full max-w-6xl mx-auto relative ${shapeRadius} overflow-hidden p-8 md:p-16 lg:p-24 shadow-2xl bg-zinc-950`}>
        {imageUrl && (
          <>
            <div className="absolute inset-0 z-0">
              <img src={imageUrl} alt="Background" className="w-full h-full object-cover opacity-40 scale-110" />
            </div>
            <div className="absolute inset-0 z-0 bg-linear-to-tr from-zinc-950 via-zinc-900/80 to-zinc-950/90" />
          </>
        )}
        <div className={`relative z-10 w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-16 ${shapeRadius} shadow-inner text-center`}>
          <h2 className={`text-4xl md:text-5xl mb-6 text-white drop-shadow-md ${fontHeadingClass}`}>
            {heading}
          </h2>
          <div className={`w-20 h-1 mb-8 mx-auto ${lineGradient}`} />
          <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light text-zinc-200">
            {bio}
          </p>
          <div className="flex justify-center w-full">
            <SocialLinks socials={socials} secondaryBrandColor={secondaryBrandColor} aboutLayout={aboutLayout} isLight={false} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className={`flex flex-col justify-center shadow-xl border p-8 md:p-12 ${surfaceBg} ${shapeRadius}`}>
          <h2 className={`text-4xl md:text-5xl mb-6 ${fontHeadingClass} ${headingColor}`}>
            {heading}
          </h2>
          <div className={`w-16 h-1.5 mb-8 ${lineGradient}`} />

          <p className={`text-lg md:text-xl leading-relaxed mb-8 whitespace-pre-wrap font-light ${bodyColor}`}>
            {bio}
          </p>
          <SocialLinks socials={socials} secondaryBrandColor={secondaryBrandColor} aboutLayout={aboutLayout} isLight={isLight} />
        </div>
        {imageUrl && (
          <div className={`w-full aspect-square md:aspect-4/5 ${shapeRadius} overflow-hidden shadow-2xl relative group mx-auto`}>
            <img src={imageUrl} alt={heading} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className={`absolute inset-0 border-4 border-${secondaryBrandColor} mix-blend-overlay opacity-30 ${shapeRadius} pointer-events-none`} />
          </div>
        )}
      </div>
    </section>
  );
}