/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/AboutSection.tsx */
import React from 'react';
import { THEME_REGISTRY } from '@/utils/themes';
import { getRawBgColor } from './hero/core/heroHelpers';

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
  centered,
  mutedText,
}: {
  socials: SocialPlatform[];
  secondaryBrandColor: string;
  centered: boolean;
  mutedText: string;
}) => {
  if (!socials || socials.length === 0) return null;

  return (
    <div className={`flex gap-6 mt-8 ${centered ? 'justify-center' : 'justify-start'}`}>
      {socials.map((social, idx) => {
        const Icon = social.Icon;
        return (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all duration-300 transform hover:-translate-y-1 ${mutedText} hover:text-${secondaryBrandColor}`}
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
  const rawBgColor = getRawBgColor(theme.pageBg || '', isLight);
  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  const lineGradient = `bg-linear-to-r from-${brandColor} to-${secondaryBrandColor}`;

  const fontHeadingClass = theme.primaryText.includes('font-cinzel')
    ? 'font-cinzel font-normal tracking-[0.06em]'
    : theme.primaryText.includes('font-serif')
      ? 'font-serif font-normal'
      : 'font-sans font-bold tracking-tight';

  const headingTone = theme.primaryText
    .split(' ')
    .filter((cls) => cls.startsWith('text-'))
    .join(' ');

  // 1. GALLERY MANIFESTO (Centered, no photo required, open canvas + fine rule)
  if (aboutLayout === 'manifesto') {
    return (
      <section className="w-full max-w-4xl mx-auto flex flex-col items-center text-center py-12 md:py-20 px-6">
        <h2 className={`text-4xl md:text-6xl leading-tight text-balance ${fontHeadingClass} ${headingTone}`}>
          {heading}
        </h2>

        <div className="w-full max-w-md flex items-center justify-center gap-4 my-8">
          <div className={`h-px flex-1 opacity-45 ${lineGradient}`} />
          <div className={`w-1.5 h-1.5 rotate-45 opacity-85 ${lineGradient}`} />
          <div className={`h-px flex-1 opacity-45 ${lineGradient}`} />
        </div>

        <p className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light max-w-3xl mx-auto ${theme.mutedText}`}>
          {bio}
        </p>

        <SocialLinks
          socials={socials}
          secondaryBrandColor={secondaryBrandColor}
          centered={true}
          mutedText={theme.mutedText}
        />
      </section>
    );
  }

  // 2. ATMOSPHERIC WASH (Full-width subtle backdrop twin to Masthead Wash, zero heavy card box)
  if (aboutLayout === 'wash') {
    return (
      <section className={`w-full relative overflow-hidden py-20 md:py-28 px-6 border-y ${theme.borderColor}`}>
        {imageUrl && (
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <img
              src={imageUrl}
              alt=""
              className={`w-full h-full object-cover ${isLight ? 'opacity-[0.10] saturate-50' : 'opacity-[0.18]'}`}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, transparent 15%, ${rawBgColor} 95%), linear-gradient(to bottom, ${rawBgColor} 0%, transparent 25%, transparent 75%, ${rawBgColor} 100%)`,
              }}
            />
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          <h2 className={`text-4xl md:text-6xl leading-tight text-balance ${fontHeadingClass} ${headingTone}`}>
            {heading}
          </h2>

          <div className="w-full max-w-sm flex items-center justify-center gap-4 my-8">
            <div className={`h-px flex-1 opacity-45 ${lineGradient}`} />
            <div className={`w-1.5 h-1.5 rotate-45 opacity-85 ${lineGradient}`} />
            <div className={`h-px flex-1 opacity-45 ${lineGradient}`} />
          </div>

          <p className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light max-w-3xl mx-auto ${theme.mutedText}`}>
            {bio}
          </p>

          <SocialLinks
            socials={socials}
            secondaryBrandColor={secondaryBrandColor}
            centered={true}
            mutedText={theme.mutedText}
          />
        </div>
      </section>
    );
  }

  // 3. FRAMED PLAQUE (Exhibition wall frame — works cleanly with zero photo)
  if (aboutLayout === 'plaque') {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <div className={`relative border p-8 md:p-14 lg:p-16 ${shapeRadius} ${theme.subCardStyle}`}>
          <span className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-${brandColor} pointer-events-none`} />
          <span className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-${brandColor} pointer-events-none`} />
          <span className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-${secondaryBrandColor} pointer-events-none`} />
          <span className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-${secondaryBrandColor} pointer-events-none`} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <h2 className={`text-3xl md:text-5xl leading-tight text-balance ${fontHeadingClass} ${headingTone}`}>
                {heading}
              </h2>
              <div className={`w-20 h-px mt-6 opacity-70 ${lineGradient}`} />
              <SocialLinks
                socials={socials}
                secondaryBrandColor={secondaryBrandColor}
                centered={false}
                mutedText={theme.mutedText}
              />
            </div>
            <div className="lg:col-span-7">
              <p className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light ${theme.mutedText}`}>
                {bio}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 4. GALLERY PORTRAIT (Framed portrait paired with open, unboxed editorial copy)
  if (aboutLayout === 'portrait') {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <div className={`grid grid-cols-1 ${imageUrl ? 'md:grid-cols-12' : ''} gap-10 lg:gap-16 items-center`}>
          {imageUrl && (
            <div className="md:col-span-5">
              <div className={`p-2.5 border ${shapeRadius} ${theme.subCardStyle}`}>
                <div className={`w-full aspect-3/4 ${shapeRadius} overflow-hidden shadow-2xl relative group`}>
                  <img
                    src={imageUrl}
                    alt={heading}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          )}

          <div className={`${imageUrl ? 'md:col-span-7' : 'max-w-3xl mx-auto text-center'} flex flex-col justify-center`}>
            <h2 className={`text-4xl md:text-5xl mb-6 leading-tight ${fontHeadingClass} ${headingTone}`}>
              {heading}
            </h2>
            <div className={`w-24 h-px mb-8 opacity-70 ${imageUrl ? '' : 'mx-auto'} ${lineGradient}`} />
            <p className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light ${theme.mutedText}`}>
              {bio}
            </p>
            <SocialLinks
              socials={socials}
              secondaryBrandColor={secondaryBrandColor}
              centered={!imageUrl}
              mutedText={theme.mutedText}
            />
          </div>
        </div>
      </section>
    );
  }

  // --- CORE 4 STORY ARCHETYPES ---
  if (aboutLayout === 'minimal' || aboutLayout === 'center') {
    return (
      <section className="w-full max-w-4xl mx-auto flex flex-col items-center text-center p-6 md:p-16">
        <h2 className={`text-4xl md:text-5xl mb-6 ${fontHeadingClass} ${headingTone}`}>
          {heading}
        </h2>
        <div className={`w-20 h-px mb-10 opacity-75 ${lineGradient}`} />

        {imageUrl && (
          <div className={`w-full max-w-2xl aspect-video ${shapeRadius} overflow-hidden shadow-2xl mb-12 relative group mx-auto flex items-center justify-center border ${theme.subCardStyle}`}>
            <img src={imageUrl} alt={heading} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        )}

        <p className={`text-lg md:text-xl leading-relaxed mb-10 whitespace-pre-wrap font-light ${theme.mutedText} max-w-3xl mx-auto`}>
          {bio}
        </p>
        <SocialLinks
          socials={socials}
          secondaryBrandColor={secondaryBrandColor}
          centered={true}
          mutedText={theme.mutedText}
        />
      </section>
    );
  }

  if (aboutLayout === 'editorial') {
    return (
      <section className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start p-4 md:p-8">
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <h2 className={`text-5xl md:text-6xl leading-none ${fontHeadingClass} ${headingTone}`}>
            {heading}
          </h2>
          <div className={`w-full h-px mt-8 opacity-75 ${lineGradient}`} />
          <SocialLinks
            socials={socials}
            secondaryBrandColor={secondaryBrandColor}
            centered={false}
            mutedText={theme.mutedText}
          />
        </div>
        <div className="w-full lg:w-2/3 space-y-10">
          {imageUrl && (
            <div className={`w-full aspect-video ${shapeRadius} overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700 border ${theme.borderColor}`}>
              <img src={imageUrl} alt={heading} className="w-full h-full object-cover" />
            </div>
          )}
          <p className={`text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-light ${theme.mutedText}`}>
            {bio}
          </p>
        </div>
      </section>
    );
  }

  if (aboutLayout === 'card' || aboutLayout === 'glass' || aboutLayout === 'glass-card' || aboutLayout === 'glass_card') {
    return (
      <section className={`w-full max-w-6xl mx-auto relative ${shapeRadius} overflow-hidden p-8 md:p-16 lg:p-24 shadow-2xl ${theme.pageBg}`}>
        {imageUrl && (
          <>
            <div className="absolute inset-0 z-0">
              <img src={imageUrl} alt="Background" className="w-full h-full object-cover opacity-35 scale-110" />
            </div>
            <div
              className="absolute inset-0 z-0"
              style={{
                background: `linear-gradient(to top right, ${rawBgColor}F2, ${rawBgColor}B8, ${rawBgColor}E6)`,
              }}
            />
          </>
        )}
        <div className={`relative z-10 w-full max-w-3xl mx-auto p-10 md:p-16 ${shapeRadius} shadow-inner text-center border ${theme.surfaceStyle}`}>
          <h2 className={`text-4xl md:text-5xl mb-6 ${fontHeadingClass} ${headingTone}`}>
            {heading}
          </h2>
          <div className={`w-24 h-px mb-8 mx-auto opacity-75 ${lineGradient}`} />
          <p className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light ${theme.mutedText}`}>
            {bio}
          </p>
          <div className="flex justify-center w-full">
            <SocialLinks
              socials={socials}
              secondaryBrandColor={secondaryBrandColor}
              centered={true}
              mutedText={theme.mutedText}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className={`flex flex-col justify-center border p-8 md:p-12 ${theme.surfaceStyle} ${shapeRadius}`}>
          <h2 className={`text-4xl md:text-5xl mb-6 ${fontHeadingClass} ${headingTone}`}>
            {heading}
          </h2>
          <div className={`w-20 h-px mb-8 opacity-75 ${lineGradient}`} />

          <p className={`text-lg md:text-xl leading-relaxed mb-8 whitespace-pre-wrap font-light ${theme.mutedText}`}>
            {bio}
          </p>
          <SocialLinks
            socials={socials}
            secondaryBrandColor={secondaryBrandColor}
            centered={false}
            mutedText={theme.mutedText}
          />
        </div>
        {imageUrl && (
          <div className={`w-full aspect-square md:aspect-4/5 ${shapeRadius} overflow-hidden shadow-2xl relative group mx-auto border ${theme.borderColor}`}>
            <img src={imageUrl} alt={heading} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className={`absolute inset-0 border border-${secondaryBrandColor}/30 ${shapeRadius} pointer-events-none`} />
          </div>
        )}
      </div>
    </section>
  );
}