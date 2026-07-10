// src/components/portfolio/AboutSection.tsx
import React from 'react';
import { SocialPlatform } from '@/app/[slug]/page';
import { getFonts } from './content-engine/utils'; // Pull in our typography router

interface AboutData {
  heading: string;
  bio: string;
  imageUrl?: string;
  facebookUrl?: string; 
  ctaText?: string;
  brandColor?: string;
  socials?: SocialPlatform[];
  isLightMode?: boolean;
  themeStyle?: string;
}

export default function AboutSection({ data }: { data: AboutData }) {
  const { heading, bio, imageUrl, ctaText, brandColor = 'cyan-500', socials = [], isLightMode, themeStyle = 'industrial' } = data;
  
  const fonts = getFonts(themeStyle);
  
  // 🚨 The Definition Wrapper for Light Mode
  const textContainerClass = isLightMode 
    ? 'bg-white shadow-xl border border-zinc-100 p-8 md:p-12 rounded-[2rem]' 
    : '';

  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Content Column */}
        <div className={`flex flex-col justify-center ${!imageUrl ? 'md:col-span-2 text-center items-center' : ''} ${textContainerClass}`}>
          <h2 className={`text-4xl md:text-5xl mb-6 ${fonts.heading} ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
            {heading}
          </h2>
          
          <div className={`w-16 h-1.5 mb-8 rounded-full bg-${brandColor}`} />
          
          <p className={`text-lg md:text-xl leading-relaxed mb-8 whitespace-pre-wrap ${fonts.body} ${isLightMode ? 'text-zinc-600' : 'font-light opacity-90 text-white'}`}>
            {bio}
          </p>

          {/* DYNAMIC SOCIAL ICONS */}
          {socials.length > 0 && (
            <div className={`flex gap-6 mb-10 ${!imageUrl ? 'justify-center' : 'justify-start'}`}>
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300 transform hover:-translate-y-1 ${isLightMode ? `text-zinc-400 hover:text-${brandColor}` : `text-zinc-500 hover:text-${brandColor}`}`}
                >
                  <social.Icon size={24} />
                </a>
              ))}
            </div>
          )}

          {ctaText && (
            <button className={`px-8 py-4 bg-${brandColor} text-zinc-950 font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-max`}>
              {ctaText}
            </button>
          )}
        </div>

        {/* Image Column */}
        {imageUrl && (
          <div className="w-full aspect-square md:aspect-4/5 rounded-3xl overflow-hidden shadow-2xl relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={heading} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className={`absolute inset-0 border-4 border-${brandColor} mix-blend-overlay opacity-30 rounded-3xl pointer-events-none`} />
          </div>
        )}
      </div>
    </section>
  );
}