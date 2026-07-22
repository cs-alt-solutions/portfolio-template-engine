// src/utils/themes.ts

export interface ThemeDefinition {
  isLightMode: boolean;
  pageBg: string;
  primaryText: string;
  accentText: string;
  bodyText: string;
  cardStyle: string;
  overlayFade: string;
  buttonStyle: string;
  prefix: string;
  useBrandAccent: boolean;
  useBrandTint: boolean;
  radius: string; // <-- NEW: Dictates the structural shape of elements (cards, bullets, inputs)
}

export const THEME_REGISTRY: Record<string, ThemeDefinition> = {
  industrial: {
    isLightMode: false,
    pageBg: "bg-zinc-950",
    primaryText: "text-zinc-100 font-sans font-bold", // Brighter contrast against dark gunmetal
    accentText: "font-mono tracking-[0.4em] uppercase text-xl md:text-2xl font-black",
    bodyText: "text-zinc-300 font-mono", // Switched to mono for a technical, drafted feel
    cardStyle: "bg-zinc-900 border-2 border-zinc-700 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] rounded-none", // Heavy, tactile borders
    overlayFade: "from-zinc-950/10 via-zinc-950/60 to-zinc-950",
    buttonStyle: "bg-transparent border-2 border-current text-white font-black tracking-widest uppercase text-sm py-4 px-12 rounded-none transition-all hover:bg-current hover:text-zinc-950",
    prefix: "",
    useBrandAccent: true,
    useBrandTint: true,
    radius: "rounded-none" // Brutal, sharp angles
  },
  midnight: {
    isLightMode: false,
    pageBg: "bg-black", // Pure void black
    primaryText: "text-white font-sans tracking-tight drop-shadow-sm",
    accentText: "text-white font-medium tracking-tight text-xl md:text-3xl",
    bodyText: "text-zinc-400 font-light", // Sleek, moody gray
    cardStyle: "bg-zinc-900/30 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl", // Glassy, premium curves
    overlayFade: "from-black/20 via-black/80 to-black",
    buttonStyle: "bg-white text-zinc-950 hover:bg-zinc-200 font-bold tracking-wide rounded-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] px-12 py-4 uppercase text-sm",
    prefix: "",
    useBrandAccent: false, 
    useBrandTint: false,
    radius: "rounded-2xl" // Soft, high-end curves
  },
  neo: {
    isLightMode: true,
    pageBg: "bg-yellow-400",
    primaryText: "text-black font-black tracking-tighter",
    accentText: "text-black font-black uppercase bg-white px-4 py-2 border-4 border-black inline-block text-xl md:text-3xl shadow-[4px_4px_0_0_#000]",
    bodyText: "text-black font-medium",
    cardStyle: "bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    overlayFade: "from-yellow-400/10 via-yellow-400/80 to-yellow-400",
    buttonStyle: "font-black uppercase text-sm py-4 px-12 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all bg-white text-black",
    prefix: "",
    useBrandAccent: false,
    useBrandTint: false,
    radius: "rounded-none" // Keep buttons and UI elements blocky
  },
  cyberpunk: {
    isLightMode: false,
    pageBg: "bg-[#0a0a0c] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]", 
    primaryText: "text-white font-black italic tracking-tighter",
    accentText: "font-mono tracking-widest uppercase animate-pulse text-xl md:text-2xl font-black",
    bodyText: "text-zinc-400 font-light",
    cardStyle: "bg-black/80 backdrop-blur-sm border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] rounded-none",
    overlayFade: "from-[#0a0a0c]/10 via-[#0a0a0c]/80 to-[#0a0a0c]",
    buttonStyle: "text-black font-mono font-bold tracking-widest uppercase text-sm py-4 px-12 rounded-none border border-current shadow-[0_0_15px_currentColor] transition-all",
    prefix: ">> ",
    useBrandAccent: true,
    useBrandTint: true,
    radius: "rounded-none" // Aggressive, digital lines
  },
  minimal: {
    isLightMode: true,
    pageBg: "bg-zinc-50",
    primaryText: "text-zinc-900 font-sans tracking-tighter",
    accentText: "font-sans uppercase tracking-[0.3em] text-sm md:text-base font-bold",
    bodyText: "text-zinc-500 font-light",
    cardStyle: "bg-transparent border-none shadow-none rounded-3xl", 
    overlayFade: "from-zinc-50/5 via-zinc-50/80 to-zinc-50",
    buttonStyle: "font-bold tracking-widest uppercase text-xs py-4 px-10 transition-all duration-300 rounded-full text-white shadow-xl hover:scale-105",
    prefix: "",
    useBrandAccent: true,
    useBrandTint: false,
    radius: "rounded-full" // Welcoming, soft, app-like
  },
  elegant: {
    isLightMode: true,
    pageBg: "bg-[#FAFAFA]", 
    primaryText: "text-zinc-900 font-serif",
    accentText: "font-serif italic tracking-widest text-xl md:text-3xl",
    bodyText: "text-stone-500 font-light",
    cardStyle: "bg-white border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-sm p-10", 
    overlayFade: "from-[#FAFAFA]/10 via-[#FAFAFA]/90 to-[#FAFAFA]",
    buttonStyle: "font-serif tracking-widest uppercase text-xs py-4 px-12 text-white transition-opacity shadow-lg rounded-none hover:opacity-90",
    prefix: "",
    useBrandAccent: true,
    useBrandTint: false,
    radius: "rounded-sm" // Very slight softening, like high-end print media
  },
  organic: {
    isLightMode: true,
    pageBg: "bg-[#F4F1EA]", 
    primaryText: "text-[#2C3B2D] font-serif", 
    accentText: "font-sans font-black tracking-widest uppercase text-lg md:text-xl", 
    bodyText: "text-[#4A5D4E] font-light text-lg", // Slightly larger text for an open, breathing feel
    cardStyle: "bg-[#EAE5D9] shadow-xl rounded-[40px] rounded-tl-none rounded-br-none p-12 border border-[#4A5D4E]/10", 
    overlayFade: "from-[#F4F1EA]/10 via-[#F4F1EA]/90 to-[#F4F1EA]",
    buttonStyle: "font-serif tracking-wide text-sm py-4 px-10 text-white hover:scale-105 transition-transform shadow-md rounded-full",
    prefix: "",
    useBrandAccent: true,
    useBrandTint: false,
    radius: "rounded-[30px]" // Highly organic, flowing shapes
  },
  editorial: {
    isLightMode: true,
    pageBg: "bg-[#EAE8E3]", 
    primaryText: "text-black font-serif tracking-tighter",
    accentText: "font-sans font-black tracking-widest uppercase text-xl md:text-2xl border-b-2 pb-2 inline-block border-current",
    bodyText: "text-zinc-800 font-serif leading-relaxed",
    cardStyle: "bg-transparent border-t-2 border-b-2 border-black py-8 rounded-none", 
    overlayFade: "from-[#EAE8E3]/10 via-[#EAE8E3]/80 to-[#EAE8E3]",
    buttonStyle: "font-sans font-black tracking-[0.2em] uppercase text-xs py-4 px-12 text-white hover:opacity-80 transition-opacity rounded-none",
    prefix: "",
    useBrandAccent: true,
    useBrandTint: false,
    radius: "rounded-none" // Strict grid alignments, pure print aesthetic
  }
};