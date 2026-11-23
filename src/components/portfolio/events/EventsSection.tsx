/* src/components/portfolio/events/EventsSection.tsx */
'use client';

import React, { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { EVENTS_DEFAULTS } from '@/utils/glossary';
import UniversalLeadModal from '@/components/portfolio/UniversalLeadModal';
import { getFonts } from '@/components/portfolio/content-engine/utils';
import {
  StorefrontEvent,
  filterUpcomingEvents,
  getDateStubParts,
} from './eventHelpers';
import EventTicketCard from './EventTicketCard';

interface EventsSectionProps {
  events?: StorefrontEvent[];
  businessName: string;
  storefrontSlug: string;
  contactEmail: string;
  brandColor: string;
  isLightMode: boolean;
  themeStyle: string;
  inquiryOptions?: string[];
}

export default function EventsSection({
  events,
  businessName,
  storefrontSlug,
  contactEmail,
  brandColor,
  isLightMode,
  themeStyle,
  inquiryOptions,
}: EventsSectionProps) {
  const upcoming = useMemo(() => filterUpcomingEvents(events), [events]);
  const [selectedEvent, setSelectedEvent] = useState<StorefrontEvent | null>(null);

  if (upcoming.length === 0) return null;

  const fonts = getFonts(themeStyle);
  const borderClass = isLightMode ? 'border-zinc-900/10' : 'border-white/10';
  const headingColor = isLightMode ? 'text-zinc-900' : 'text-white';
  const subColor = isLightMode ? 'text-zinc-600' : 'text-zinc-400';

  const hasSingleEvent = upcoming.length === 1;
  const featuredFirst = upcoming.length >= 3 || upcoming[0]?.isFeatured;

  const ctaLabel = selectedEvent
    ? `${EVENTS_DEFAULTS.INQUIRY_PREFIX} ${selectedEvent.title} (${getDateStubParts(selectedEvent.date).full})`
    : EVENTS_DEFAULTS.INQUIRY_PREFIX;

  return (
    <>
      <section id="events" className={`w-full py-20 border-t relative z-20 ${borderClass}`}>
        <div className="container mx-auto px-6 max-w-6xl space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] shadow-sm">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>
                  {EVENTS_DEFAULTS.EYEBROW_PREFIX} · {upcoming.length} {EVENTS_DEFAULTS.EYEBROW_SUFFIX}
                </span>
              </div>
              <h2 className={`text-3xl md:text-5xl font-black tracking-tight ${headingColor} ${fonts.heading}`}>
                {EVENTS_DEFAULTS.HEADING}
              </h2>
            </div>

            <p className={`text-sm max-w-md ${subColor} ${fonts.body}`}>
              Catch {businessName} {EVENTS_DEFAULTS.SUBTEXT_SUFFIX}
            </p>
          </div>

          {hasSingleEvent ? (
            <div className="max-w-3xl">
              <EventTicketCard
                event={upcoming[0]}
                businessName={businessName}
                isSpotlight={true}
                isLightMode={isLightMode}
                themeStyle={themeStyle}
                headingFont={fonts.heading}
                bodyFont={fonts.body}
                onInquire={setSelectedEvent}
              />
            </div>
          ) : featuredFirst ? (
            <div className="space-y-5">
              <EventTicketCard
                event={upcoming[0]}
                businessName={businessName}
                isSpotlight={true}
                isLightMode={isLightMode}
                themeStyle={themeStyle}
                headingFont={fonts.heading}
                bodyFont={fonts.body}
                onInquire={setSelectedEvent}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {upcoming.slice(1).map((ev) => (
                  <EventTicketCard
                    key={ev.id}
                    event={ev}
                    businessName={businessName}
                    isLightMode={isLightMode}
                    themeStyle={themeStyle}
                    headingFont={fonts.heading}
                    bodyFont={fonts.body}
                    onInquire={setSelectedEvent}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {upcoming.map((ev, idx) => (
                <EventTicketCard
                  key={ev.id}
                  event={ev}
                  businessName={businessName}
                  isSpotlight={idx === 0}
                  isLightMode={isLightMode}
                  themeStyle={themeStyle}
                  headingFont={fonts.heading}
                  bodyFont={fonts.body}
                  onInquire={setSelectedEvent}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <UniversalLeadModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        ctaLabel={ctaLabel}
        businessName={businessName}
        storefrontSlug={storefrontSlug}
        contactEmail={contactEmail}
        brandColor={brandColor}
        isLightMode={isLightMode}
        themeStyle={themeStyle}
        inquiryOptions={inquiryOptions}
      />
    </>
  );
}