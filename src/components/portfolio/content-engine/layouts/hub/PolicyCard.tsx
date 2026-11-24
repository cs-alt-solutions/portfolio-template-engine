/* src/components/portfolio/content-engine/layouts/hub/PolicyCard.tsx */
'use client';

import React from 'react';
import { CalendarDays, Truck, ShieldCheck, Tag, AlertTriangle, Clock } from 'lucide-react';
import { THEME_REGISTRY } from '@/utils/themes';

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
  themeStyle?: string;
  bodyFont: string;
}

export default function PolicyCard({ term, isLightMode, themeStyle = 'industrial', bodyFont }: PolicyCardProps) {
  const Icon = TYPE_ICONS[term.type || 'booking'] || ShieldCheck;
  const theme = THEME_REGISTRY[themeStyle] || THEME_REGISTRY['industrial'];

  const mutedDaySurface = isLightMode
    ? 'bg-zinc-200/70 border-zinc-900/5 text-zinc-400'
    : 'bg-black/40 border-white/5 text-zinc-600';

  const days = Array.isArray(term.days) ? term.days : [];
  const isBlackout = term.scheduleMode === 'blackout';
  const hasScheduleStrip = days.length > 0 || !!term.scheduleWindow?.trim();

  return (
    <div className={`p-5 border space-y-3 ${theme.surfaceRadius} ${theme.subCardStyle}`}>
      {/* Title Row + Brand Badge */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 bg-brand-primary text-zinc-950 shrink-0 ${theme.controlRadius}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <h5 className={`text-sm truncate ${theme.uiLabel}`}>{term.title}</h5>
        </div>

        {term.badge?.trim() && (
          <span
            className={`px-2.5 py-0.5 bg-brand-primary text-zinc-950 text-[10px] font-mono font-bold shrink-0 shadow-sm ${theme.controlRadius}`}
          >
            {term.badge}
          </span>
        )}
      </div>

      {/* Visual 7-Day Schedule Strip */}
      {hasScheduleStrip && (
        <div className="space-y-2 pt-0.5">
          {days.length > 0 && (
            <div className="grid grid-cols-7 gap-1.5">
              {WEEK_DAYS.map((day) => {
                const isMarked = days.includes(day.key);
                const pillStyle = isMarked
                  ? isBlackout
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 line-through'
                    : 'bg-brand-primary border-brand-primary text-zinc-950 shadow-sm'
                  : mutedDaySurface;

                return (
                  <div
                    key={day.key}
                    className={`py-1.5 border text-center text-[10px] font-mono font-bold uppercase ${theme.controlRadius} ${pillStyle}`}
                  >
                    {day.label}
                  </div>
                );
              })}
            </div>
          )}

          {term.scheduleWindow?.trim() && (
            <div className="flex items-center gap-1.5 text-xs font-mono opacity-85">
              <Clock className="w-3.5 h-3.5 opacity-75 shrink-0" />
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
        <p className={`text-sm leading-relaxed opacity-85 ${bodyFont}`}>{term.description}</p>
      )}

      {/* Rate Chips */}
      {term.fees && term.fees.length > 0 && (
        <div className="pt-1 flex flex-wrap gap-2">
          {term.fees.map((fee, fIdx) => (
            <span
              key={fIdx}
              className={`inline-flex items-center gap-2 px-3 py-1 border text-xs font-mono ${theme.controlRadius} ${theme.chipStyle}`}
            >
              <span>{fee.name}</span>
              {fee.price && (
                <strong className={`px-1.5 py-0.5 bg-brand-primary text-zinc-950 text-[11px] ${theme.controlRadius}`}>
                  {fee.price}
                </strong>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}