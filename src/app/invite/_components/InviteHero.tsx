'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

type Props = {
  heroImage: string;
  coupleA: string;
  coupleB: string;
  dateISO: string; // e.g. "2026-03-29T13:30:00+09:00"
  weekday?: string; // Deprecated in favor of locale formatting
  venueName: string;
};

export function InviteHero({ heroImage, coupleA, coupleB, dateISO, venueName }: Props) {
  const t = useTranslations('WeddingInvite');
  const locale = useLocale();
  const date = new Date(dateISO);
  const yyyy = date.getFullYear();
  const dayNumber = date.getDate();
  const monthNumber = date.getMonth() + 1;
  const weekdayLocalized = new Intl.DateTimeFormat(locale, { weekday: 'long' })
    .format(date)
    .toUpperCase();

  const numericDate = `${String(dayNumber).padStart(2, '0')} ${String(monthNumber).padStart(2, '0')} ${yyyy}`;
  const monthDateString = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
  const eventTime = '13:00';

  return (
    <section className="relative">
      <div className="px-6 pt-8 pb-4 text-center">
        <div className="text-[10px] tracking-[0.3em] text-zinc-400">{t('WEDDING_DAY')}</div>
        <div className="mt-2 text-2xl leading-tight text-zinc-700">{numericDate}</div>
        <div className="text-xs leading-tight tracking-[0.3em] text-zinc-400">
          {weekdayLocalized}
        </div>
      </div>

      <div className="px-6">
        <div className="overflow-hidden shadow">
          {/* removed rounded-xl for sharp corners */}
          <Image src={heroImage} alt="wedding" width={1200} height={1600} className="w-full" />
        </div>
      </div>

      <div className="mt-5 text-center">
        <div className="inline-flex items-center gap-4 text-lg text-black">
          <span>{coupleA}</span>
          <span className="h-4 w-px bg-black/60" />
          <span>{coupleB}</span>
        </div>
        <div className="mt-1 text-sm">
          {monthDateString} • {eventTime} • {venueName}
        </div>
      </div>
    </section>
  );
}
