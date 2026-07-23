// src/components/portfolio/AboutSection.tsx
/* eslint-disable @next/next/no-img-element */
import React from 'react';

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
    socials?: SocialPlatform[];
    aboutLayout?: string;
    isLightMode?: boolean;
    themeStyle?: string;
  };
}

const SocialLinks = ({ socials, brandColor, aboutLayout }: { 
  socials: SocialPlatform[], 
  brandColor: string,
  aboutLayout: string 
}) => {
  if (!socials || socials.length === 0) return null;
  
  // Center the icons for any of the centered layouts
  const isCentered = ['minimal', 'center', 'card', 'glass', 'glass-card', 'glass_card'].includes(aboutLayout);
  
  return (
    <div className={`flex gap-6 mt-8 ${isCentered ? 'justify-center' : 'justify-start'}`}>
       {socials.map((social, idx) => {
          const Icon = social.Icon;
          return (
            <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className={`transition-all duration-300 transform hover:-translate-y-1 text-zinc-400 hover:text-${brandColor}`}>
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
    brandColor = 'cyan-500', 
    socials = [], 
    aboutLayout = 'split'
  } = data;

  if (!bio && !imageUrl) return null;

  // LAYOUT 1: MINIMAL CENTER
  if (aboutLayout === 'minimal' || aboutLayout === 'center') {
    return (
      <section className="w-full max-w-4xl mx-auto flex flex-col items-center text-center p-8 md:p-16">
        <h2 className="text-4xl md:text-5xl mb-6 font-serif tracking-normal text-zinc-900 dark:text-zinc-50">
          {heading}
        </h2>
        <div className={`w-16 h-1.5 mb-10 rounded-full bg-${brandColor}`} />
        
        {imageUrl && (
          <div className="w-full max-w-2xl aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 relative group">
            <img src={imageUrl} alt={heading} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        )}
        
        <p className="text-lg md:text-xl leading-relaxed mb-10 whitespace-pre-wrap font-light text-zinc-600 dark:text-zinc-300">
          {bio}
        </p>

        <SocialLinks socials={socials} brandColor={brandColor} aboutLayout={aboutLayout} />
      </section>
    );
  }

  // LAYOUT 2: EDITORIAL
  if (aboutLayout === 'editorial') {
     return (
       <section className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start p-8">
         <div className="w-full lg:w-1/3 sticky top-24">
           <h2 className="text-5xl md:text-6xl font-serif tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none">
             {heading}
           </h2>
           <div className={`w-full h-px mt-8 bg-${brandColor}`} />
           <SocialLinks socials={socials} brandColor={brandColor} aboutLayout={aboutLayout} />
         </div>
         <div className="w-full lg:w-2/3 space-y-12">
           {imageUrl && (
            <div className="w-full aspect-video rounded-none overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700">
              <img src={imageUrl} alt={heading} className="w-full h-full object-cover" />
            </div>
           )}
           <p className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-serif font-light text-zinc-700 dark:text-zinc-300">
            {bio}
           </p>
         </div>
       </section>
     );
  }

  // LAYOUT 3: GLASS CARD
  if (aboutLayout === 'card' || aboutLayout === 'glass' || aboutLayout === 'glass-card' || aboutLayout === 'glass_card') {
    return (
      <section className="w-full max-w-6xl mx-auto relative rounded-4xl overflow-hidden p-8 md:p-16 lg:p-24 shadow-2xl">
         {imageUrl && (
           <>
             <div className="absolute inset-0 z-0">
               <img src={imageUrl} alt="Background" className="w-full h-full object-cover opacity-40 scale-110" />
             </div>
             <div className="absolute inset-0 z-0 bg-linear-to-tr from-zinc-950 via-zinc-900/80 to-zinc-950/90" />
           </>
         )}
         <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-4xl shadow-inner text-center">
            <h2 className="text-4xl md:text-5xl mb-6 font-bold tracking-tight text-white drop-shadow-md">
              {heading}
            </h2>
            <div className={`w-20 h-1 mb-8 mx-auto rounded-full bg-${brandColor}`} />
            <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light text-zinc-200">
              {bio}
            </p>
            <div className="flex justify-center w-full">
              <SocialLinks socials={socials} brandColor={brandColor} aboutLayout={aboutLayout} />
            </div>
         </div>
      </section>
    );
  }

  // DEFAULT LAYOUT: CLASSIC SPLIT
  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="flex flex-col justify-center bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-12 rounded-4xl">
          <h2 className="text-4xl md:text-5xl mb-6 font-serif tracking-normal font-normal text-zinc-900 dark:text-zinc-50">
            {heading}
          </h2>
          <div className={`w-16 h-1.5 mb-8 rounded-full bg-${brandColor}`} />
          
          <p className="text-lg md:text-xl leading-relaxed mb-8 whitespace-pre-wrap font-serif font-light text-zinc-600 dark:text-zinc-400">
            {bio}
          </p>

          <SocialLinks socials={socials} brandColor={brandColor} aboutLayout={aboutLayout} />
        </div>
        {imageUrl && (
          <div className="w-full aspect-square md:aspect-4/5 rounded-3xl overflow-hidden shadow-2xl relative group">
            <img src={imageUrl} alt={heading} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className={`absolute inset-0 border-4 border-${brandColor} mix-blend-overlay opacity-30 rounded-3xl pointer-events-none`} />
          </div>
        )}
      </div>
    </section>
  );
}