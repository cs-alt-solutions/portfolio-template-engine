/* src/components/portfolio/content-engine/layouts/hub/PolicyCard.tsx */
'use client';

import React from 'react';
import { CalendarDays, Truck, ShieldCheck, Tag, AlertTriangle, Clock } from 'lucide-react';

export type RuleType = 'schedule' | 'travel' | 'booking' | 'rates' | 'notice';

export interface OperationalTerm {
  title: string;
  description: string;
  appliesTo?: string;
  type?: RuleType;
  badge?: string;
  days?: string[];
  scheduleMode?: 'active' | 'blackout';
  scheduleWindow?: string;
  fees?: { name: string; price: string }[];
}

const WEEK_DAYS = [
  { key: 'sun', label: 'Sun' },
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
];

const TYPE_ICONS: Record<RuleType, React.ElementType> = {
  schedule: CalendarDays,
  travel: Truck,
  booking: ShieldCheck,
  rates: Tag,
  notice: AlertTriangle,
};

interface PolicyCardProps {
  term: OperationalTerm;
  isLightMode: boolean;
  bodyFont: string;
}

export default function PolicyCard({ term, isLightMode, bodyFont }: PolicyCardProps) {
  const Icon = TYPE_ICONS[term.type || 'booking'] || ShieldCheck;
  const subCardSurface = isLightMode
    ? 'bg-zinc-50 border-zinc-900/10 text-zinc-800'
    : 'bg-zinc-900/70 border-white/10 text-zinc-200';
  const chipSurface = isLightMode
    ? 'bg-zinc-100 border-zinc-900/10 text-zinc-700'
    : 'bg-white/5 border-white/10 text-zinc-200';
  const mutedDaySurface = isLightMode
    ? 'bg-zinc-200/60 border-zinc-900/5 text-zinc-400'
    : 'bg-black/30 border-white/5 text-zinc-600';

  const days = Array.isArray(term.days) ? term.days : [];
  const isBlackout = term.scheduleMode === 'blackout';
  const hasScheduleStrip = days.length > 0 || !!term.scheduleWindow?.trim();

  return (
    <div className={`p-4 rounded-2xl border space-y-2.5 ${subCardSurface}`}>
      {/* Title Row + Quick Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-brand-primary/15 text-brand-primary shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-brand-primary truncate">
            {term.title}
          </h5>
        </div>

        {term.badge?.trim() && (
          <span className="px-2 py-0.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-[10px] font-mono font-bold text-brand-primary shrink-0">
            {term.badge}
          </span>
        )}
      </div>

      {/* Visual 7-Day Schedule Strip */}
      {hasScheduleStrip && (
        <div className="space-y-1.5 pt-0.5">
          {days.length > 0 && (
            <div className="grid grid-cols-7 gap-1">
              {WEEK_DAYS.map((day) => {
                const isMarked = days.includes(day.key);
                const pillStyle = isMarked
                  ? isBlackout
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 line-through'
                    : 'bg-brand-primary border-brand-primary text-white shadow-sm'
                  : mutedDaySurface;

                return (
                  <div
                    key={day.key}
                    className={`py-1 rounded-md border text-center text-[9px] font-mono font-bold uppercase ${pillStyle}`}
                  >
                    {day.label}
                  </div>
                );
              })}
            </div>
          )}

          {term.scheduleWindow?.trim() && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono opacity-80">
              <Clock className="w-3 h-3 text-brand-primary shrink-0" />
              <span>
                {isBlackout ? 'Unavailable: ' : ''}
                {term.scheduleWindow}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {term.description && (
        <p className={`text-xs leading-relaxed opacity-85 ${bodyFont}`}>{term.description}</p>
      )}

      {/* Rate Chips */}
      {term.fees && term.fees.length > 0 && (
        <div className="pt-1 flex flex-wrap gap-2">
          {term.fees.map((fee, fIdx) => (
            <span
              key={fIdx}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono ${chipSurface}`}
            >
              <span>{fee.name}</span>
              {fee.price && <strong className="text-brand-primary">{fee.price}</strong>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}