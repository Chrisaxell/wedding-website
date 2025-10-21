'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { AddCalendarButton } from './AddCalendarButton';

function getParts(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const now = Date.now();
  let diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000);
  diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);
  return { days, hours, mins, secs };
}

export interface CountdownProps {
  dateISO: string;
  padDays?: boolean; // whether to zero-pad the days value
  padTime?: boolean; // whether to zero-pad hours/mins/secs
  showPlural?: boolean; // whether to pluralize unit labels
}

export function Countdown({
  dateISO,
  padDays = true,
  padTime = true,
  showPlural = true,
}: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Pre-format date header (weekday, date, time) in Korea timezone
  const dateObj = new Date(dateISO);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Seoul' });
  const datePart = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  });

  // Manually format time to ensure 24-hour format in Korea timezone
  const formatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  });
  const timePart = formatter.format(dateObj);

  useEffect(() => {
    setMounted(true);
    setT(getParts(dateISO));
    const id = setInterval(() => setT(getParts(dateISO)), 1000);
    return () => clearInterval(id);
  }, [dateISO]);

  return (
    <section className="px-6 pt-8 pb-6">
      <Card className="bg-zinc-50">
        <CardContent className="p-6">
          <div className="mb-4 text-center text-sm font-medium tracking-wide text-zinc-600">
            {weekday}, {datePart} • {timePart}
          </div>
          <div className="flex justify-center">
            <div className="flex items-stretch justify-center gap-4">
              {(() => {
                const daysStr = padDays ? t.days.toString().padStart(2, '0') : t.days.toString();
                const dayLabel = showPlural ? (t.days === 1 ? 'Day' : 'Days') : 'Day';
                return <TimeBlock label={dayLabel} value={daysStr} mounted={mounted} />;
              })()}
              {(() => {
                const hoursStr = padTime ? t.hours.toString().padStart(2, '0') : t.hours.toString();
                const hourLabel = showPlural ? (t.hours === 1 ? 'Hour' : 'Hours') : 'Hour';
                return <TimeBlock label={hourLabel} value={hoursStr} mounted={mounted} />;
              })()}
              {(() => {
                const minsStr = padTime ? t.mins.toString().padStart(2, '0') : t.mins.toString();
                const minLabel = showPlural ? (t.mins === 1 ? 'Min' : 'Mins') : 'Min';
                return <TimeBlock label={minLabel} value={minsStr} mounted={mounted} />;
              })()}
              {(() => {
                const secsStr = padTime ? t.secs.toString().padStart(2, '0') : t.secs.toString();
                const secLabel = showPlural ? (t.secs === 1 ? 'Sec' : 'Secs') : 'Sec';
                return <TimeBlock label={secLabel} value={secsStr} mounted={mounted} />;
              })()}
            </div>
          </div>
          <div className="mt-6">
            <AddCalendarButton />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function TimeBlock({ label, value, mounted }: { label: string; value: string; mounted: boolean }) {
  return (
    <div className="flex min-w-[58px] flex-col items-center justify-center rounded-md border border-zinc-200 bg-white px-2 py-2 font-sans shadow-sm">
      <span className="flex h-8 items-center text-2xl leading-none font-semibold lining-nums tabular-nums">
        {mounted ? value : '00'}
      </span>
      <span className="mt-1 text-[9px] tracking-wide text-zinc-500 uppercase">{label}</span>
    </div>
  );
}
