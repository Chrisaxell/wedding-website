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
    className?: string;
};

export function InviteHero({ heroImage, coupleA, coupleB, dateISO, venueName, className }: Props) {
    const t = useTranslations('WeddingInvite');
    const locale = useLocale();
    const date = new Date(dateISO);
    const yyyy = date.getFullYear();
    const dayNumber = date.getDate();
    const monthNumber = date.getMonth() + 1;
    const weekdayLocalized = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date).toUpperCase();

    const numericDate = `${String(dayNumber).padStart(2, '0')}-${String(monthNumber).padStart(2, '0')}-${yyyy}`;

    // Format date and time based on locale
    let dateTimeString;
    if (locale === 'ko') {
        // Korean format: 2026년 3월 28일 토요일 오후 12시
        const weekdayKo = new Intl.DateTimeFormat('ko', { weekday: 'long', timeZone: 'Asia/Seoul' }).format(date);

        // Get hour in Korea timezone
        const koreaHour = parseInt(
            new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                hour12: false,
                timeZone: 'Asia/Seoul',
            }).format(date),
        );

        const period = koreaHour >= 12 ? '오후' : '오전';
        const displayHour = koreaHour === 0 ? 12 : koreaHour > 12 ? koreaHour - 12 : koreaHour;
        dateTimeString = `${yyyy}년 ${monthNumber}월 ${dayNumber}일 ${weekdayKo} ${period} ${displayHour}시`;
    } else {
        // Other locales: use standard formatting
        const monthDateString = new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
        const eventTime = '12:00';
        dateTimeString = `${eventTime} • ${monthDateString}`;
    }

    return (
        <section className={className}>
            <div className="px-6 pt-8 pb-4 text-center">
                <div className="text-[10px] tracking-[0.3em] text-zinc-400">{t('WEDDING_DAY')}</div>
                <div className="mt-2 text-2xl leading-tight text-zinc-700">{numericDate}</div>
                <div className="text-xs leading-tight tracking-[0.3em] text-zinc-400">{weekdayLocalized}</div>
            </div>

            <div className="px-6">
                <Image src={heroImage} alt="wedding" width={1000} height={1600} />
            </div>

            <div className="mt-5 text-center">
                <div className="inline-flex items-center gap-2 text-lg text-black">
                    <span>{coupleA}</span>
                    <span>•</span>
                    <span>{coupleB}</span>
                </div>
                <div className="mt-1 text-sm text-zinc-600">신부 홍정희 • 신랑 크리스티안 악셀</div>
                <div className="mt-1 text-sm">{dateTimeString}</div>
                <div className="mt-1 text-sm">{venueName}</div>
            </div>
        </section>
    );
}
