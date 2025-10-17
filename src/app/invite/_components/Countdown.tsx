'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

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

export function Countdown({ dateISO }: { dateISO: string }) {
  const [t, setT] = useState(() => getParts(dateISO));
  const tr = useTranslations('WeddingInvite');
  useEffect(() => {
    const id = setInterval(() => setT(getParts(dateISO)), 1000);
    return () => clearInterval(id);
  }, [dateISO]);

  return (
    <section className="px-6 pt-8 pb-10">
      <Card className="bg-zinc-50">
        <CardContent className="p-6 text-center">
          <div className="text-sm text-zinc-600">{tr('COUNTDOWN_LABEL')}</div>
          <div className="mt-3 flex items-end justify-center gap-2 font-serif text-xl leading-tight tabular-nums">
            <span className="rounded-md bg-white px-3 py-2 shadow">{t.days}</span>
            {tr('COUNTDOWN_DAYS')}
            <span>:</span>
            <span className="rounded-md bg-white px-3 py-2 shadow">{t.hours}</span>
            {tr('COUNTDOWN_H')}
            <span>:</span>
            <span className="rounded-md bg-white px-3 py-2 shadow">{t.mins}</span>
            {tr('COUNTDOWN_M')}
            <span>:</span>
            <span className="rounded-md bg-white px-3 py-2 shadow">{t.secs}</span>
            {tr('COUNTDOWN_S')}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
