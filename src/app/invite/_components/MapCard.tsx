'use client';

import { useTranslations, useLocale } from 'next-intl';
import GoogleMap from '@/components/maps/GoogleMap';
import KakaoMap from '@/components/maps/KakaoMap';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Props = {
    venueName: string;
    address: string;
    lat?: number;
    lng?: number;
};

export default function MapCard({ venueName, address, lat, lng }: Props) {
    const t = useTranslations('WeddingInvite');
    const locale = useLocale();
    const canRender = typeof lat === 'number' && typeof lng === 'number';

    const [value, setValue] = useState<'google' | 'kakao'>('google');

    // Calculate locale-dependent values
    const isKorean = locale === 'ko';
    const googleZoom = isKorean ? 12 : 8;
    const kakaoZoom = isKorean ? 7 : 11;

    // Set default tab after mount to avoid hydration mismatch
    useEffect(() => {
        setValue(isKorean ? 'kakao' : 'google');
    }, [isKorean]);

    // Kakao Map links
    // Yangsan Station coordinates: 35.3394, 128.9921
    const yangsanStationKakaoLink = 'https://map.kakao.com/link/to/양산역,35.3394,128.9921';
    const yangsanStationNaverLink =
        'https://map.naver.com/p/directions/-/14133887.169213826,4208233.114070937,양산역,PLACE_POI/-/transit';

    // Kakao Map navigation to venue
    const venueKakaoNaviLink =
        lat && lng ? `https://map.kakao.com/link/to/${encodeURIComponent(venueName)},${lat},${lng}` : '#';

    // Naver Map navigation to venue
    const venueNaverLink =
        lat && lng
            ? `https://map.naver.com/p/directions/-/${lng},${lat},${encodeURIComponent(venueName)},PLACE_POI/-/transit`
            : '#';

    return (
        <section className="px-4 py-10">
            <div className="text-center">
                <p className="text-[10px] tracking-[0.3em] text-zinc-400">{t('LOCATION_LABEL')}</p>
                <h3 className="text-lg font-medium">{t('LOCATION_HEADING')}</h3>
            </div>
            <div className="mt-4 text-center">
                <div className="text-base font-medium text-black">{venueName}</div>
                <div className="text-sm text-zinc-500">{address}</div>
            </div>

            <div className="mx-auto mt-6 max-w-md">
                <Tabs value={value} onValueChange={(v) => setValue(v as 'google' | 'kakao')} className="w-full">
                    {/* Map Container */}
                    <div className="overflow-hidden rounded-t-lg shadow-md">
                        <div className="relative">
                            <div className={value === 'google' ? 'block' : 'hidden'}>
                                {canRender ? (
                                    <GoogleMap
                                        lat={lat!}
                                        lng={lng!}
                                        zoom={googleZoom}
                                        title={venueName}
                                        className="aspect-[4/3] w-full"
                                    />
                                ) : (
                                    <div className="flex aspect-[4/3] items-center justify-center text-sm text-zinc-500">
                                        {t('MAP_PLACEHOLDER')}
                                    </div>
                                )}
                            </div>
                            <div className={value === 'kakao' ? 'block' : 'hidden'}>
                                {canRender ? (
                                    <KakaoMap lat={lat!} lng={lng!} zoom={kakaoZoom} className="aspect-[4/3] w-full" />
                                ) : (
                                    <div className="flex aspect-[4/3] items-center justify-center text-sm text-zinc-500">
                                        {t('MAP_PLACEHOLDER')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs Below Map - Full Width */}
                    <TabsList className="grid w-full grid-cols-2 rounded-t-none rounded-b-lg">
                        <TabsTrigger value="google">{t('MAP_TAB_GOOGLE')}</TabsTrigger>
                        <TabsTrigger value="kakao">{t('MAP_TAB_KAKAO')}</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Transportation Options Accordion */}
                <div className="mt-6">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="public-transport">
                            <AccordionTrigger className="text-sm font-medium">
                                {t('TRANSPORT_PUBLIC_TITLE')}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-zinc-600">
                                <p className="mb-3">{t('TRANSPORT_PUBLIC_DESC')}</p>
                                <div className="space-y-2">
                                    <div>
                                        <Link
                                            href={yangsanStationKakaoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-900 underline hover:text-zinc-700"
                                        >
                                            {t('TRANSPORT_PUBLIC_LINK')}
                                        </Link>
                                    </div>
                                    <div>
                                        <Link
                                            href={yangsanStationNaverLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-900 underline hover:text-zinc-700"
                                        >
                                            {t('TRANSPORT_PUBLIC_NAVER')}
                                        </Link>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-zinc-500">{t('TRANSPORT_NOTE')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="driving">
                            <AccordionTrigger className="text-sm font-medium">
                                {t('TRANSPORT_DRIVING_TITLE')}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-zinc-600">
                                <p className="mb-3">{t('TRANSPORT_DRIVING_DESC')}</p>
                                <div className="space-y-2">
                                    <div>
                                        <Link
                                            href={venueKakaoNaviLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-900 underline hover:text-zinc-700"
                                        >
                                            {t('TRANSPORT_DRIVING_LINK')}
                                        </Link>
                                    </div>
                                    <div>
                                        <Link
                                            href={venueNaverLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-900 underline hover:text-zinc-700"
                                        >
                                            {t('TRANSPORT_DRIVING_NAVER')}
                                        </Link>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-zinc-500">{t('TRANSPORT_DRIVING_PARKING')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="taxi">
                            <AccordionTrigger className="text-sm font-medium">
                                {t('TRANSPORT_TAXI_TITLE')}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-zinc-600">
                                <p className="mb-3">{t('TRANSPORT_TAXI_DESC')}</p>
                                <Link
                                    href="https://taxi.kakao.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-900 underline hover:text-zinc-700"
                                >
                                    {t('TRANSPORT_TAXI_LINK')}
                                </Link>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
