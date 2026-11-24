/* src/components/portfolio/lead-modal/PreferredDatePicker.tsx */
'use client';

import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { ThemeDefinition } from '@/utils/themes';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const TIME_WINDOWS = ['Morning', 'Afternoon', 'Evening', 'Anytime'];
const FLEXIBLE_CHIPS = [
  'Next 2 Weeks',
  'This Month',
  'Weekends Only',
  'Weekdays Only',
  'Whenever Works',
];

interface PreferredDatePickerProps {
  value: string;
  onChange: (formattedValue: string) => void;
  theme: ThemeDefinition;
  activeSurface: string;
  inputRadius: string;
  allowSpecificDate?: boolean;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PreferredDatePicker({
  value,
  onChange,
  theme,
  activeSurface,
  inputRadius,
  allowSpecificDate = true,
}: PreferredDatePickerProps) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Default to "Flexible" so the modal opens light and compact
  const [mode, setMode] = useState<'flexible' | 'calendar'>(() =>
    allowSpecificDate && value && !value.startsWith('Flexible') ? 'calendar' : 'flexible'
  );
  const [viewYear, setViewYear] = useState(todayStart.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayStart.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeWindow, setTimeWindow] = useState<string>('');
  const [flexibleChoice, setFlexibleChoice] = useState<string>(() =>
    value.startsWith('Flexible — ') ? value.replace('Flexible — ', '') : ''
  );

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const isAtCurrentMonth =
    viewYear === todayStart.getFullYear() && viewMonth === todayStart.getMonth();

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    if (
      next.getFullYear() < todayStart.getFullYear() ||
      (next.getFullYear() === todayStart.getFullYear() && next.getMonth() < todayStart.getMonth())
    ) {
      return;
    }
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const commitCalendar = (date: Date | null, windowLabel: string) => {
    if (!date) {
      onChange('');
      return;
    }
    const base = formatDateLabel(date);
    onChange(windowLabel ? `${base} (${windowLabel})` : base);
  };

  const handleSelectDay = (day: number) => {
    const picked = new Date(viewYear, viewMonth, day);
    if (picked < todayStart) return;
    setSelectedDate(picked);
    commitCalendar(picked, timeWindow);
  };

  const handleSelectWindow = (win: string) => {
    const next = timeWindow === win ? '' : win;
    setTimeWindow(next);
    if (selectedDate) commitCalendar(selectedDate, next);
  };

  const handleSelectFlexible = (chip: string) => {
    const next = flexibleChoice === chip ? '' : chip;
    setFlexibleChoice(next);
    onChange(next ? `Flexible — ${next}` : '');
  };

  const handleSwitchMode = (nextMode: 'flexible' | 'calendar') => {
    setMode(nextMode);
    if (nextMode === 'calendar') {
      commitCalendar(selectedDate, timeWindow);
    } else {
      onChange(flexibleChoice ? `Flexible — ${flexibleChoice}` : '');
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    setTimeWindow('');
    setFlexibleChoice('');
    onChange('');
  };

  return (
    <div className="space-y-2.5">
      {/* Tier 1: Clear Question Row + Compact Mode Switch (never wraps) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarDays className="w-3.5 h-3.5 text-brand-primary shrink-0" />
          <span className="text-xs font-semibold tracking-normal">
            Preferred timing
          </span>
          <span className="text-[11px] italic opacity-45">optional</span>
        </div>

        {allowSpecificDate && (
          <div className={`flex items-center p-0.5 border shrink-0 ${theme.borderColor} ${theme.controlRadius}`}>
            <button
              type="button"
              onClick={() => handleSwitchMode('flexible')}
              className={`px-2.5 py-1 text-[10px] font-semibold tracking-wide transition-all cursor-pointer ${theme.controlRadius} ${
                mode === 'flexible' ? activeSurface : 'opacity-60 hover:opacity-100'
              }`}
            >
              I&apos;m Flexible
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('calendar')}
              className={`px-2.5 py-1 text-[10px] font-semibold tracking-wide transition-all cursor-pointer ${theme.controlRadius} ${
                mode === 'calendar' ? activeSurface : 'opacity-60 hover:opacity-100'
              }`}
            >
              Pick a Date
            </button>
          </div>
        )}
      </div>

      {/* Tier 2: Interactive Options Panel */}
      <div className={`p-3.5 border space-y-3 ${inputRadius} ${theme.subCardStyle}`}>
        {mode === 'flexible' || !allowSpecificDate ? (
          <div className="flex flex-wrap gap-2 animate-in fade-in duration-150">
            {FLEXIBLE_CHIPS.map((chip) => {
              const active = flexibleChoice === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSelectFlexible(chip)}
                  className={`px-3 py-2 text-xs border transition-all cursor-pointer ${theme.controlRadius} ${
                    active ? `${activeSurface} font-semibold shadow-sm` : theme.pillStyle
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={isAtCurrentMonth}
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
                className={`p-1.5 border transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${theme.controlRadius} ${theme.pillStyle}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold tracking-wide">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
                className={`p-1.5 border transition-all cursor-pointer ${theme.controlRadius} ${theme.pillStyle}`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-[10px] font-medium opacity-40 pb-1"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`pad-${idx}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const cellDate = new Date(viewYear, viewMonth, dayNum);
                const isPast = cellDate < todayStart;
                const isToday = cellDate.getTime() === todayStart.getTime();
                const isSelected =
                  selectedDate !== null && cellDate.getTime() === selectedDate.getTime();

                return (
                  <button
                    key={dayNum}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-8 text-xs font-mono transition-all border cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${theme.controlRadius} ${
                      isSelected
                        ? `${activeSurface} font-bold shadow-sm`
                        : isToday
                          ? 'border-brand-primary/60 font-bold hover:border-brand-primary'
                          : 'border-transparent hover:border-current/25 hover:bg-current/5'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            {/* Time-of-Day Chips + Inline Clear */}
            {selectedDate && (
              <div className={`pt-2.5 border-t ${theme.borderColor} space-y-2 animate-in fade-in duration-150`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-80">
                    <Clock className="w-3 h-3 text-brand-primary" />
                    <span>{formatDateLabel(selectedDate)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1 text-[10px] opacity-55 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {TIME_WINDOWS.map((win) => {
                    const active = timeWindow === win;
                    return (
                      <button
                        key={win}
                        type="button"
                        onClick={() => handleSelectWindow(win)}
                        className={`py-1.5 px-2 text-[11px] border transition-all cursor-pointer ${theme.controlRadius} ${
                          active ? `${activeSurface} font-semibold` : theme.pillStyle
                        }`}
                      >
                        {win}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tier 3: Quiet, Visually Distinct Footnote */}
      <p className="text-[11px] italic opacity-45 leading-snug">
        Not a final booking — we&apos;ll confirm exact availability with you.
      </p>
    </div>
  );
}