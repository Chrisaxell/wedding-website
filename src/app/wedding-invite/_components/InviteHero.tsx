'use client';

import Image from 'next/image';

type Props = {
  heroImage: string;
  coupleA: string;
  coupleB: string;
  dateISO: string; // e.g. "2026-03-29T13:30:00+09:00"
  weekday: string; // SUNDAY
  venueName: string;
};

export function InviteHero({ heroImage, coupleA, coupleB, dateISO, weekday, venueName }: Props) {
  const date = new Date(dateISO);
  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const dd = `${date.getDate()}`.padStart(2, '0');

  return (
    <section className="relative">
      <div className="px-6 pt-8 pb-4 text-center">
        <div className="text-[10px] tracking-[0.3em] text-zinc-400">WEDDING DAY</div>
        <div className="mt-2 font-serif text-2xl text-zinc-700">
          <span className="mr-2">{dd}</span>
          <span className="mr-2">{mm}</span>
          <span>{yyyy}</span>
        </div>
        <div className="text-xs tracking-[0.3em] text-zinc-400">{weekday}</div>
      </div>

      <div className="px-6">
        <div className="overflow-hidden rounded-xl shadow">
          {/* Use next/image if you add the file to /public */}
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
          {yyyy}년 {mm}월 {dd}일 • {venueName}
        </div>
      </div>
    </section>
  );
}
