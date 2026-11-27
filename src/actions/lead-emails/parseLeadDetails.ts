/* src/actions/lead-emails/parseLeadDetails.ts */

export interface LeadPayload {
  storefrontSlug: string;
  businessName: string;
  contactEmail: string;
  name: string;
  email: string;
  phone?: string;
  details: string;
  brandColorHex?: string;
  packagePrice?: string;
  // Structured fields passed by UniversalLeadModal (optional for backward compatibility)
  ctaLabel?: string;
  inquiryType?: string;
  selectedOptions?: string[];
  preferredDate?: string;
  notes?: string;
}

export interface ParsedLeadSummary {
  inquiryType: string;
  selectedOptions: string[];
  preferredDate: string;
  notes: string;
  packagePrice: string;
  ctaLabel: string;
}

export function escapeHtml(input: string): string {
  return (input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeHex(hex?: string, fallback = '#0ea5e9'): string {
  if (!hex) return fallback;
  const trimmed = hex.trim();
  return /^#[0-9a-fA-F]{3,6}$/.test(trimmed) ? trimmed : fallback;
}

/** Returns dark ink for light accents (e.g. gold/cyan) and white ink for darker accents. */
export function getContrastTextColor(hex: string): string {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#09090b' : '#ffffff';
}

function formatFallbackTitle(raw: string): string {
  const cleaned = raw.trim();
  if (!cleaned) return 'Direct Inquiry';
  if (cleaned === cleaned.toUpperCase()) {
    return cleaned.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return cleaned;
}

export function parseLeadDetails(payload: LeadPayload): ParsedLeadSummary {
  const raw = payload.details || '';

  const inquiryMatch = raw.match(/\[INQUIRY TYPE:\s*(.*?)\]/i);
  const parsedInquiry = inquiryMatch ? formatFallbackTitle(inquiryMatch[1]) : 'Direct Inquiry';

  const optionsMatch = raw.match(/SELECTED (?:OPTIONS|ADD-ONS):\n([\s\S]*?)(?:\n\n|$)/i);
  const parsedOptions = optionsMatch
    ? optionsMatch[1]
        .split('\n')
        .map((line) => line.replace(/^- /, '').trim())
        .filter(Boolean)
    : [];

  const dateMatch = raw.match(/PREFERRED DATE:\s*(.*?)(?:\n\n|\n|$)/i);
  const parsedDate = dateMatch ? dateMatch[1].trim() : '';

  const strippedNotes = raw
    .replace(/\[INQUIRY TYPE:\s*.*?\]\s*/i, '')
    .replace(/SELECTED (?:OPTIONS|ADD-ONS):\n[\s\S]*?(?:\n\n|$)/i, '')
    .replace(/PREFERRED DATE:\s*.*?(?:\n\n|\n|$)/i, '')
    .trim();

  return {
    inquiryType: payload.inquiryType?.trim() || parsedInquiry,
    selectedOptions:
      Array.isArray(payload.selectedOptions) && payload.selectedOptions.length > 0
        ? payload.selectedOptions
        : parsedOptions,
    preferredDate: payload.preferredDate?.trim() || parsedDate,
    notes: payload.notes !== undefined ? payload.notes.trim() : strippedNotes,
    packagePrice: payload.packagePrice?.trim() || '',
    ctaLabel: payload.ctaLabel?.trim() || '',
  };
}