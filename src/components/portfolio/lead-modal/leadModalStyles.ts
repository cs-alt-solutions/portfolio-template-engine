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
    'yellow-400': '#facc15',
    'lime-400': '#a3e635',
  };
  return legacyMap[val] || '#06b6d4';
}

function isLightHex(hex: string): boolean {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  if (full.length !== 6) return false;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 130;
}

export function getLeadModalClasses(themeStyle: string, _isLightMode: boolean, brandColor: string) {
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];
  const isNeo = themeStyle.startsWith('neo');

  const shapeRadius = theme.surfaceRadius || theme.radius || 'rounded-none';
  // Keep multi-line textareas & selects clean on pill-button themes (minimal / organic)
  const inputRadius = theme.controlRadius === 'rounded-full' ? 'rounded-xl' : theme.controlRadius;

  const modalSurface = theme.surfaceStyle;
  const inputSurface = `${theme.subCardStyle} focus:border-brand-primary placeholder:opacity-45 ${inputRadius}`;

  const resolvedHex = getLeadBrandHex(brandColor);
  const isLightBrand = isLightHex(resolvedHex);
  const activeText = isLightBrand ? 'text-zinc-950' : 'text-white';
  const activeSurface = `bg-brand-primary border-brand-primary ${activeText}`;
  const submitSurface = `${activeSurface} shadow-lg hover:brightness-110 active:scale-[0.99] ${theme.controlRadius} ${theme.uiLabel}`;

  return {
    isNeo,
    isLightBrand,
    activeText,
    activeSurface,
    shapeRadius,
    inputRadius,
    modalSurface,
    inputSurface,
    submitSurface,
  };
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
    placeholder: "Tell us about your idea, placement/size, or any questions...",
  };
}