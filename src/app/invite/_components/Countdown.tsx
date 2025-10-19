'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

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
  const [t, setT] = useState(() => getParts(dateISO));

  useEffect(() => {
    const id = setInterval(() => setT(getParts(dateISO)), 1000);
    return () => clearInterval(id);
  }, [dateISO]);

  // Closest whole days remaining (rounded to nearest day)
  const daysLeft = Math.max(0, Math.round((new Date(dateISO).getTime() - Date.now()) / 86400000));

  return (
    <section className="px-6 pt-8 pb-10">
      <Card className="bg-zinc-50">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="flex items-stretch justify-center gap-4">
              {(() => {
                const daysStr = padDays ? t.days.toString().padStart(2, '0') : t.days.toString();
                const dayLabel = showPlural ? (t.days === 1 ? 'Day' : 'Days') : 'Day';
                return <TimeBlock label={dayLabel} value={daysStr} />;
              })()}
              {(() => {
                const hoursStr = padTime ? t.hours.toString().padStart(2, '0') : t.hours.toString();
                const hourLabel = showPlural ? (t.hours === 1 ? 'Hour' : 'Hours') : 'Hour';
                return <TimeBlock label={hourLabel} value={hoursStr} />;
              })()}
              {(() => {
                const minsStr = padTime ? t.mins.toString().padStart(2, '0') : t.mins.toString();
                const minLabel = showPlural ? (t.mins === 1 ? 'Min' : 'Mins') : 'Min';
                return <TimeBlock label={minLabel} value={minsStr} />;
              })()}
              {(() => {
                const secsStr = padTime ? t.secs.toString().padStart(2, '0') : t.secs.toString();
                const secLabel = showPlural ? (t.secs === 1 ? 'Sec' : 'Secs') : 'Sec';
                return <TimeBlock label={secLabel} value={secsStr} />;
              })()}
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-zinc-600">Wedding {daysLeft} days left!</p>
        </CardContent>
      </Card>
    </section>
  );
}

function TimeBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-[58px] flex-col items-center justify-center rounded-md border border-zinc-200 bg-white px-2 py-2 font-sans shadow-sm">
      <span className="flex h-8 items-center text-2xl leading-none font-semibold lining-nums tabular-nums">
        {value}
      </span>
      <span className="mt-1 text-[9px] tracking-wide text-zinc-500 uppercase">{label}</span>
    </div>
  );
}
