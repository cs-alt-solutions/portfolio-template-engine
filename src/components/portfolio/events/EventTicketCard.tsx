/* eslint-disable @next/next/no-img-element */
/* src/components/portfolio/events/EventTicketCard.tsx */
'use client';

import React from 'react';
import { Clock, MapPin, CalendarPlus, Download, ExternalLink, MessageSquare, Sparkles } from 'lucide-react';
import { EVENTS_DEFAULTS } from '@/utils/glossary';
import {
  StorefrontEvent,
  getCountdownBadge,
  getDateStubParts,
  buildMapsUrl,
  buildGoogleCalendarUrl,
  downloadIcsFile,
} from './eventHelpers';

interface EventTicketCardProps {
  event: StorefrontEvent;
  businessName: string;
  isSpotlight?: boolean;
  isLightMode: boolean;
  themeStyle: string;
  headingFont: string;
  bodyFont: string;
  onInquire: (event: StorefrontEvent) => void;
}

export default function EventTicketCard({
  event,
  businessName,
  isSpotlight = false,
  isLightMode,
  themeStyle,
  headingFont,
  bodyFont,
  onInquire,
}: EventTicketCardProps) {
  const stub = getDateStubParts(event.date);
  const countdown = getCountdownBadge(event.date);
  const mapsUrl = buildMapsUrl(event);
  const gcalUrl = buildGoogleCalendarUrl(event, businessName);
  const categoryLabel =
    EVENTS_DEFAULTS.CATEGORY_LABELS[event.category || 'special'] || EVENTS_DEFAULTS.CATEGORY_LABELS.special;
  const timeRange = [event.startTime, event.endTime].filter(Boolean).join(' – ');

  const isNeo = themeStyle === 'neo';
  const isMidnight = themeStyle === 'midnight';
  const isSharp = ['industrial', 'industrial-light', 'neo', 'neo-dark', 'editorial', 'cyberpunk', 'cyberpunk-light'].includes(
    themeStyle
  );
  const radiusClass = isSharp ? 'rounded-none' : 'rounded-2xl';

  const cardSurface = isNeo
    ? 'bg-white border-4 border-black text-black shadow-[8px_8px_0_0_#000]'
    : isLightMode
      ? 'bg-white border border-zinc-900/12 text-zinc-900 shadow-lg hover:border-brand-primary/60'
      : isMidnight
        ? 'bg-zinc-950/90 border border-white/10 text-white shadow-2xl hover:border-white/25'
        : 'bg-zinc-900/75 border border-white/10 text-white shadow-xl hover:border-white/25';

  const subtleBtnClass = isLightMode
    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-900/10'
    : 'bg-white/5 hover:bg-white/12 text-zinc-200 border-white/10';

  const dividerClass = isLightMode ? 'border-zinc-900/10' : 'border-white/10';

  return (
    <article
      className={`group relative overflow-hidden transition-all duration-300 flex flex-col sm:flex-row ${radiusClass} ${cardSurface} ${
        isSpotlight ? 'ring-1 ring-brand-primary/50' : ''
      }`}
    >
      {/* Left Tear-Off Date Stub */}
      <div className="sm:w-28 shrink-0 p-4 sm:p-5 flex sm:flex-col items-center justify-between sm:justify-center gap-2 bg-brand-primary text-white border-b sm:border-b-0 sm:border-r border-dashed border-white/25 relative">
        <div className="flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0.5 text-center">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase opacity-90">
            {stub.month}
          </span>
          <span className={`text-3xl sm:text-4xl font-black leading-none tracking-tight ${headingFont}`}>
            {stub.day}
          </span>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-80 sm:mt-1">
            {stub.weekday}
          </span>
        </div>

        {isSpotlight && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/25 text-[9px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5" /> {EVENTS_DEFAULTS.NEXT_UP_BADGE}
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4 min-w-0">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                isLightMode
                  ? 'bg-zinc-100 border-zinc-900/10 text-zinc-700'
                  : 'bg-white/8 border-white/15 text-zinc-200'
              }`}
            >
              {categoryLabel}
            </span>

            {countdown && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  countdown.isUrgent
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'bg-brand-primary text-white'
                }`}
              >
                {countdown.isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-ping" />}
                {countdown.label}
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-snug ${headingFont}`}>
                {event.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono opacity-80">
                {timeRange && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    {timeRange}
                  </span>
                )}
                {(event.location || event.address) && mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 underline decoration-dotted underline-offset-4 hover:opacity-100 transition-opacity"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{event.location || event.address}</span>
                  </a>
                )}
              </div>
            </div>

            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className={`w-16 h-16 sm:w-20 sm:h-20 object-cover shrink-0 border ${dividerClass} ${
                  isSharp ? 'rounded-none' : 'rounded-xl'
                }`}
              />
            )}
          </div>

          {event.description && (
            <p className={`text-sm leading-relaxed opacity-80 ${bodyFont}`}>{event.description}</p>
          )}
        </div>

        <div className={`pt-3.5 border-t flex flex-wrap items-center justify-between gap-2.5 ${dividerClass}`}>
          <div className="flex items-center gap-1.5">
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-colors ${subtleBtnClass}`}
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>{EVENTS_DEFAULTS.GOOGLE_CAL_BTN}</span>
            </a>

            <button
              type="button"
              onClick={() => downloadIcsFile(event, businessName)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-colors cursor-pointer ${subtleBtnClass}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{EVENTS_DEFAULTS.ICS_BTN}</span>
            </button>
          </div>

          {event.linkUrl?.trim() ? (
            <a
              href={event.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider bg-brand-primary text-white hover:brightness-110 transition-all shadow-md ${
                isSharp ? 'rounded-none' : 'rounded-xl'
              }`}
            >
              <span>{EVENTS_DEFAULTS.DETAILS_BTN}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onInquire(event)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider bg-brand-primary text-white hover:brightness-110 transition-all shadow-md cursor-pointer ${
                isSharp ? 'rounded-none' : 'rounded-xl'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{EVENTS_DEFAULTS.RSVP_BTN}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}