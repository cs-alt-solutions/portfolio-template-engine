/* src/components/portfolio/lead-modal/leadModalStyles.ts */
import { THEME_REGISTRY } from '@/utils/themes';

export type AddonOption = { title?: string; name?: string; price?: string } | string;

export interface TopicConfig {
  addons?: AddonOption[];
  askTimeframe?: boolean;
}

export function getLeadBrandHex(val: string): string {
  if (!val) return '#06b6d4';
  if (val.startsWith('#')) return val;
  const legacyMap: Record<string, string> = {
    'cyan-500': '#06b6d4',
    'fuchsia-500': '#d946ef',
    'emerald-500': '#10b981',
    'amber-500': '#f59e0b',
    'rose-500': '#f43f5e',
    'indigo-500': '#6366f1',
    'zinc-500': '#71717a',
  };
  return legacyMap[val] || '#06b6d4';
}

export function getLeadModalClasses(themeStyle: string, isLightMode: boolean, brandColor: string) {
  const isNeo = themeStyle === 'neo';
  const isCyber = themeStyle === 'cyberpunk';
  const isMidnight = themeStyle === 'midnight';
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const shapeRadius = theme.radius || 'rounded-none';

  const inputRadius =
    themeStyle === 'elegant'
      ? 'rounded-sm'
      : ['industrial', 'neo', 'cyberpunk', 'editorial'].includes(themeStyle)
        ? 'rounded-none'
        : 'rounded-xl';

  const modalSurface =
    themeStyle === 'elegant'
      ? 'bg-white text-zinc-900 border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'
      : isNeo
        ? 'bg-white text-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
        : isCyber
          ? 'bg-black/95 text-white border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] font-mono'
          : isMidnight
            ? 'bg-zinc-950/95 text-white backdrop-blur-2xl border border-white/10 shadow-2xl'
            : isLightMode
              ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl'
              : 'bg-zinc-900 text-white border-2 border-zinc-800 shadow-2xl';

  const inputSurface =
    themeStyle === 'elegant'
      ? `bg-zinc-50 border border-zinc-300 text-zinc-900 focus:bg-white focus:border-zinc-800 ${inputRadius}`
      : isNeo
        ? `bg-white border-2 border-black text-black focus:bg-yellow-100 ${inputRadius}`
        : isCyber
          ? `bg-black/80 border border-white/20 text-white focus:border-brand-primary font-mono ${inputRadius}`
          : isLightMode
            ? `bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white ${inputRadius}`
            : `bg-zinc-950 border border-zinc-800 text-white focus:bg-zinc-900 ${inputRadius}`;

  const isLightBrandTone = ['yellow-400', 'lime-400', 'amber-500', 'cyan-500', 'emerald-500'].includes(brandColor);
  const submitSurface =
    themeStyle === 'elegant'
      ? `bg-zinc-950 text-white hover:bg-zinc-800 font-serif tracking-widest shadow-md ${inputRadius}`
      : isNeo
        ? `bg-white text-black border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 ${inputRadius}`
        : isCyber
          ? `bg-black text-white border border-current shadow-[0_0_15px_currentColor] hover:bg-white hover:text-black font-mono font-bold ${inputRadius}`
          : `bg-brand-primary ${isLightBrandTone ? 'text-zinc-950' : 'text-white'} font-black border border-white/25 shadow-lg hover:brightness-110 active:scale-[0.99] ${inputRadius}`;

  return { isNeo, shapeRadius, inputRadius, modalSurface, inputSurface, submitSurface };
}

export function getDetailsCopy(inquiryType: string) {
  if (inquiryType === 'Job Application / Hiring') {
    return {
      label: 'Experience & Background *',
      placeholder: "Tell us about your experience and the position you're looking for...",
    };
  }
  if (inquiryType === 'General Inquiry') {
    return { label: 'How can we help? *', placeholder: 'How can we help you today?' };
  }
  if (inquiryType === 'Other') {
    return { label: 'How can we help? *', placeholder: 'Tell us more about what you need...' };
  }
  return {
    label: 'Project Details & Notes *',
    placeholder: "Tell us what you're looking for, ideal dates, or any specific questions...",
  };
}