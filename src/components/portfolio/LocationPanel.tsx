/* src/components/portfolio/LocationPanel.tsx */
'use client';

import React from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { THEME_REGISTRY } from '@/utils/themes';
import { getFonts } from './content-engine/utils';
import { OperationalTerm } from './content-engine/layouts/hub/PolicyCard';

interface LocationPanelProps {
  businessName?: string;
  mapEmbedUrl?: string;
  scheduleTerms?: OperationalTerm[];
  themeStyle?: string;
  brandColor?: string;
  isLightMode?: boolean;
  industryTag?: string;
}

const WEEK_ORDER = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const DAY_LABELS: Record<string, string> = {
  sun: 'Sun',
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
};

function formatDayRange(days?: string[]): string {
  if (!Array.isArray(days) || days.length === 0) return '';
  const indices = days
    .map((d) => WEEK_ORDER.indexOf(d.toLowerCase() as (typeof WEEK_ORDER)[number]))
    .filter((i) => i !== -1)
    .sort((a, b) => a - b);

  const unique = Array.from(new Set(indices));
  if (unique.length === 7) return 'Daily';

  const groups: string[] = [];
  let start = unique[0];
  let prev = unique[0];

  for (let i = 1; i <= unique.length; i++) {
    const curr = unique[i];
    if (curr === prev + 1) {
      prev = curr;
      continue;
    }
    if (start === prev) {
      groups.push(DAY_LABELS[WEEK_ORDER[start]]);
    } else if (prev === start + 1) {
      groups.push(`${DAY_LABELS[WEEK_ORDER[start]]}, ${DAY_LABELS[WEEK_ORDER[prev]]}`);
    } else {
      groups.push(`${DAY_LABELS[WEEK_ORDER[start]]} – ${DAY_LABELS[WEEK_ORDER[prev]]}`);
    }
    start = curr;
    prev = curr;
  }

  return groups.join(', ');
}

function resolveMapInput(raw?: string): {
  embedSrc: string;
  directionsHref: string;
  displayAddress: string;
} {
  const input = (raw || '').trim();
  if (!input) return { embedSrc: '', directionsHref: '', displayAddress: '' };

  // 1. Pasted <iframe ... src="..."> HTML snippet
  const iframeMatch = input.match(/src=["']([^"']+)["']/i);
  if (iframeMatch?.[1]) {
    return {
      embedSrc: iframeMatch[1],
      directionsHref: '',
      displayAddress: '',
    };
  }

  // 2. Direct embed URL
  if (/^https?:\/\//i.test(input)) {
    if (input.includes('/maps/embed') || input.includes('output=embed')) {
      return { embedSrc: input, directionsHref: '', displayAddress: '' };
    }

    // Standard Google Maps link (e.g. /maps/place/Address/...)
    const placeMatch = input.match(/\/maps\/place\/([^/@?]+)/i);
    if (placeMatch?.[1]) {
      const decoded = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return {
        embedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(decoded)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
        directionsHref: input,
        displayAddress: decoded,
      };
    }

    return {
      embedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(input)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
      directionsHref: input,
      displayAddress: '',
    };
  }

  // 3. Plain street address (e.g., "434 Green Street, Portsmouth, VA 23704")
  return {
    embedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(input)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
    directionsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input)}`,
    displayAddress: input,
  };
}

export default function LocationPanel({
  mapEmbedUrl,
  scheduleTerms = [],
  themeStyle = 'industrial',
  isLightMode = false,
  industryTag = 'General',
}: LocationPanelProps) {
  const mapData = resolveMapInput(mapEmbedUrl);
  const validSchedules = Array.isArray(scheduleTerms)
    ? scheduleTerms.filter((t) => t && (t.title?.trim() || t.scheduleWindow?.trim() || t.description?.trim()))
    : [];

  const hasMap = Boolean(mapData.embedSrc);
  const hasHours = validSchedules.length > 0;

  if (!hasMap && !hasHours) return null;

  const fonts = getFonts(themeStyle);
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];

  const getDynamicCopy = () => {
    switch (industryTag) {
      case 'Culinary':
        return {
          heading: hasMap ? 'Grab a Bite' : 'Serving Hours',
          subtext: 'Swing by for great food or check our hours before heading over.',
        };
      case 'Automotive':
        return {
          heading: hasMap ? 'Pull Into the Shop' : 'Shop Hours',
          subtext: 'Bring your ride by the shop or check our current operating hours.',
        };
      case 'Wellness':
        return {
          heading: hasMap ? 'Visit Our Sanctuary' : 'Hours & Availability',
          subtext: 'Step into our space or check our open hours below.',
        };
      case 'Creative':
        return {
          heading: hasMap ? 'Visit the Studio' : 'Studio Hours',
          subtext: 'Stop by the studio during open hours or reach out to schedule a session.',
        };
      case 'Contracting':
      case 'Local Services':
        return {
          heading: hasMap ? 'Our Home Base' : 'Service Hours',
          subtext: 'Check our primary operating area and current availability below.',
        };
      case 'Consulting':
      case 'Tech & SaaS':
        return {
          heading: hasMap ? "Let's Connect" : 'Office Hours',
          subtext: 'Stop by the office or check our current availability.',
        };
      case 'E-Commerce':
        return {
          heading: hasMap ? 'Visit the Flagship' : 'Store Hours',
          subtext: 'Stop by our storefront or check our current open hours.',
        };
      default:
        return {
          heading: hasMap ? 'Visit Us' : 'Hours of Operation',
          subtext: 'Stop by during open hours or view our location on the map.',
        };
    }
  };

  const { heading, subtext } = getDynamicCopy();

  return (
    <section className={`py-14 px-6 relative z-20 border-t ${theme.borderColor}`}>
      <div className={hasMap ? 'max-w-5xl mx-auto' : 'max-w-3xl mx-auto'}>
        <div
          className={`flex flex-col ${hasMap ? 'md:flex-row' : ''} items-stretch justify-between p-6 md:p-8 gap-8 border transition-all ${theme.surfaceRadius} ${theme.surfaceStyle}`}
        >
          {/* LEFT: Address, Copy & Scannable Hours */}
          <div className="flex-1 flex flex-col justify-center space-y-5">
            <div className="space-y-2.5">
              <div
                className={`inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1 border ${theme.controlRadius} ${theme.chipStyle}`}
              >
                {hasMap ? (
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-brand-primary" />
                )}
                <span>
                  {hasMap && hasHours
                    ? 'Location & Hours'
                    : hasMap
                      ? 'Location'
                      : 'Hours'}
                </span>
              </div>

              <h2 className={`text-2xl md:text-3xl tracking-tight ${fonts.heading}`}>
                {heading}
              </h2>

              {mapData.displayAddress ? (
                <p className={`text-sm md:text-base font-medium leading-relaxed ${fonts.body}`}>
                  {mapData.displayAddress}
                </p>
              ) : (
                <p className={`text-sm max-w-md ${theme.mutedText} ${fonts.body}`}>
                  {subtext}
                </p>
              )}
            </div>

            {/* Scannable Hours of Operation */}
            {hasHours && (
              <div className={`pt-4 border-t ${theme.borderColor} space-y-3`}>
                {validSchedules.map((sched, idx) => {
                  const dayRange = formatDayRange(sched.days);
                  const isBlackout = sched.scheduleMode === 'blackout';

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-widest text-brand-primary">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{sched.title || 'Hours'}</span>
                        </span>

                        {sched.badge?.trim() ? (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono border ${theme.controlRadius} ${theme.chipStyle}`}
                          >
                            {sched.badge}
                          </span>
                        ) : dayRange ? (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono border ${theme.controlRadius} ${theme.chipStyle}`}
                          >
                            {isBlackout ? `Closed: ${dayRange}` : dayRange}
                          </span>
                        ) : null}
                      </div>

                      {sched.scheduleWindow?.trim() && (
                        <p className={`text-sm font-mono opacity-90`}>
                          {isBlackout ? 'Unavailable: ' : ''}
                          {sched.scheduleWindow}
                        </p>
                      )}

                      {sched.description?.trim() && (
                        <p
                          className={`text-xs md:text-sm leading-relaxed whitespace-pre-line ${theme.mutedText} ${fonts.body}`}
                        >
                          {sched.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Direct Directions Button (auto-shown for plain addresses & Maps links) */}
            {mapData.directionsHref && (
              <div className="pt-1">
                <a
                  href={mapData.directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs border transition-all cursor-pointer ${theme.controlRadius} ${theme.uiLabel} ${theme.pillStyle}`}
                >
                  <Navigation className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Get Directions</span>
                </a>
              </div>
            )}
          </div>

          {/* RIGHT: Compact Map Render */}
          {hasMap && (
            <div
              className={`w-full md:w-[48%] min-h-60 md:min-h-64 relative overflow-hidden shrink-0 border ${theme.borderColor} group ${theme.controlRadius}`}
            >
              <iframe
                src={mapData.embedSrc}
                width="100%"
                height="100%"
                title="Location Map"
                style={{
                  border: 0,
                  filter: !isLightMode
                    ? 'invert(90%) hue-rotate(180deg) contrast(0.92)'
                    : 'contrast(0.96)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}