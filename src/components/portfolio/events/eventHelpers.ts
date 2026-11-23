/* src/components/portfolio/events/eventHelpers.ts */
import { EVENTS_DEFAULTS } from '@/utils/glossary';

export type EventCategory =
  | 'festival'
  | 'appearance'
  | 'popup'
  | 'truck'
  | 'session'
  | 'live'
  | 'special';

export interface StorefrontEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  category?: EventCategory;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
}

export function parseLocalDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function filterUpcomingEvents(events?: StorefrontEvent[]): StorefrontEvent[] {
  if (!Array.isArray(events)) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    .filter((ev) => {
      if (!ev || ev.isVisible === false || !ev.title?.trim()) return false;
      const d = parseLocalDate(ev.date);
      return !!d && d >= today;
    })
    .sort((a, b) => {
      const da = parseLocalDate(a.date)?.getTime() || 0;
      const db = parseLocalDate(b.date)?.getTime() || 0;
      if (da !== db) return da - db;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
}

export function getCountdownBadge(dateStr: string): { label: string; isUrgent: boolean } | null {
  const target = parseLocalDate(dateStr);
  if (!target) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: EVENTS_DEFAULTS.TODAY_BADGE, isUrgent: true };
  if (diffDays === 1) return { label: EVENTS_DEFAULTS.TOMORROW_BADGE, isUrgent: true };
  if (diffDays <= 14) return { label: `In ${diffDays} Days`, isUrgent: false };
  return null;
}

export function getDateStubParts(dateStr: string) {
  const d = parseLocalDate(dateStr);
  if (!d) return { month: 'TBD', day: '--', weekday: '', full: '' };
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()).padStart(2, '0'),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  };
}

export function buildMapsUrl(event: StorefrontEvent): string | null {
  const query = [event.location, event.address].filter(Boolean).join(', ').trim();
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildGoogleCalendarUrl(event: StorefrontEvent, businessName: string): string {
  const cleanDate = (event.date || '').replace(/-/g, '');
  const d = parseLocalDate(event.date);
  let nextDayStr = cleanDate;
  if (d) {
    const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    nextDayStr = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}`;
  }

  const timeLine = [event.startTime, event.endTime].filter(Boolean).join(' – ');
  const details = [timeLine ? `Time: ${timeLine}` : '', event.description || '', `Hosted by ${businessName}`]
    .filter(Boolean)
    .join('\n\n');
  const loc = [event.location, event.address].filter(Boolean).join(', ');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} — ${businessName}`,
    dates: `${cleanDate}/${nextDayStr}`,
    details,
    location: loc,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event: StorefrontEvent, businessName: string) {
  const cleanDate = (event.date || '').replace(/-/g, '');
  const loc = [event.location, event.address].filter(Boolean).join(', ');
  const timeLine = [event.startTime, event.endTime].filter(Boolean).join(' - ');
  const desc = [timeLine ? `Time: ${timeLine}` : '', event.description || ''].filter(Boolean).join(' | ');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Alternative Solutions//Storefront Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@alternativesolutions.io`,
    `DTSTART;VALUE=DATE:${cleanDate}`,
    `SUMMARY:${event.title} (${businessName})`,
    loc ? `LOCATION:${loc}` : '',
    desc ? `DESCRIPTION:${desc}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}