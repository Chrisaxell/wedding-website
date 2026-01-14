'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useText } from '@/components/TranslatedText';

type Props = {
    heroImage: string;
    coupleA: string;
    coupleB: string;
    dateISO: string; // e.g. "2026-03-29T13:30:00+09:00"
    weekday?: string; // Deprecated in favor of locale formatting
    venueName: string;
    className?: string;
};

export function InviteHero({ heroImage, coupleA, coupleB, dateISO, venueName, className }: Props) {
    const locale = useLocale();
    const text = useText();
    const date = new Date(dateISO);
    const yyyy = date.getFullYear();
    const dayNumber = date.getDate();
    const monthNumber = date.getMonth() + 1;
    const weekdayLocalized = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date).toUpperCase();
    const weekdayEnglish = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(date).toUpperCase();

    const numericDate = `${String(dayNumber).padStart(2, '0')}.${String(monthNumber).padStart(2, '0')}.${yyyy}`;

    // Format date and time: Korean format vs simple format for all others
    const dateTimeString =
        locale === 'ko'
            ? // Korean format: 2026년 2월 8일 토요일 오후 12시
              new Intl.DateTimeFormat('ko', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                  hour: 'numeric',
                  hour12: true,
                  timeZone: 'Asia/Seoul',
              }).format(date)
            : // Other locales: 12:00 • 8. February 2026 (day before month)
              `12:00 • ${dayNumber}. ${new Intl.DateTimeFormat(locale, {
                  year: 'numeric',
                  month: 'long',
              }).format(date)}`;

    return (
        <section className={className}>
            <div className="px-6 pt-8 pb-4 text-center">
                <div className="text-[10px] tracking-[0.3em] text-zinc-400">{text('WEDDING_DAY')}</div>
                <div className="text text-zing mt-2 text-2xl leading-tight tracking-[0.06em] text-zinc-700">
                    {numericDate}
                </div>
                <div className="text-xs leading-tight tracking-[0.3em] text-zinc-400">
                    {locale === 'ko' ? weekdayEnglish : weekdayLocalized}
                </div>
            </div>

            <div className="px-6">
                <div className="relative h-[500px] w-full overflow-hidden">
                    <Image
                        src={heroImage}
                        alt="wedding"
                        fill
                        priority
                        className="object-cover object-bottom"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02Ly4vMj1CRUI+PkZGTk5PT09PT09PT09PT09PT09PT0//2wBDARUXFx4aHh4aGh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                </div>
            </div>

            <div className="mt-5 text-center">
                <div className="inline-flex items-center gap-2 text-lg text-black">
                    <span>{coupleA}</span>
                    <span>•</span>
                    <span>{coupleB}</span>
                </div>
                <div className="mt-1 text-sm text-zinc-600">신부 홍정희 • 신랑 크리스티안 악셀</div>
                <br />
                <div className="te mt-1 text-sm">{dateTimeString}</div>
                <div className="mt-1 text-sm">
                    {locale === 'ko' ? (
                        venueName
                    ) : (
                        <>
                            {venueName} • {text('VENUE_LOCATION')}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
