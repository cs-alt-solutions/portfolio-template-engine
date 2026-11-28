/* src/components/portfolio/content-engine/layouts/lookbook/SmartDeliverable.tsx */
'use client';

import React from 'react';
import {
  Clock,
  Camera,
  Package,
  MapPin,
  Wand2,
  Video,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface SmartDeliverableProps {
  text: string;
  colorClass: string;
  isLightMode: boolean;
  isSharp: boolean;
}

export default function SmartDeliverable({
  text,
  colorClass,
  isLightMode,
  isSharp,
}: SmartDeliverableProps) {
  const lower = text.toLowerCase();
  let Icon = CheckCircle2;

  if (lower.includes('hour') || lower.includes('time') || lower.includes('minute')) Icon = Clock;
  else if (lower.includes('photo') || lower.includes('image') || lower.includes('shot')) Icon = Camera;
  else if (lower.includes('product') || lower.includes('item')) Icon = Package;
  else if (lower.includes('location') || lower.includes('venue') || lower.includes('outfit')) Icon = MapPin;
  else if (lower.includes('edit') || lower.includes('retouch') || lower.includes('resolution')) Icon = Wand2;
  else if (lower.includes('video') || lower.includes('film') || lower.includes('reel')) Icon = Video;
  else if (lower.includes('day') || lower.includes('week') || lower.includes('turnaround')) Icon = Calendar;

  return (
    <div
      className={`flex items-start gap-3 p-3 transition-colors group ${
        isSharp ? 'rounded-none' : 'rounded-xl'
      } ${isLightMode ? 'bg-zinc-100 hover:bg-zinc-200/60' : 'bg-zinc-950/60 hover:bg-zinc-800/80'}`}
    >
      <div
        className={`p-2 bg-current/10 ${colorClass} shrink-0 group-hover:scale-110 transition-transform ${
          isSharp ? 'rounded-none' : 'rounded-lg'
        }`}
      >
        <Icon size={14} strokeWidth={2.5} />
      </div>
      <span className={`text-sm font-medium leading-snug pt-0.5 ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
        {text}
      </span>
    </div>
  );
}