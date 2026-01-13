'use client';

import { useLocale } from 'next-intl';
import GoogleMap from '@/components/maps/GoogleMap';
import KakaoMap from '@/components/maps/KakaoMap';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useText, useRichText } from '@/components/TranslatedText';

type Props = {
    venueName: string;
    address: string;
    lat?: number;
    lng?: number;
};

export default function MapCard({ venueName, address, lat, lng }: Props) {
    const locale = useLocale();
    const text = useText();
    const richText = useRichText();
    const canRender = typeof lat === 'number' && typeof lng === 'number';

    const [value, setValue] = useState<'google' | 'kakao'>('kakao');

    // Calculate locale-dependent values
    const isKorean = locale === 'ko';
    const googleZoom = isKorean ? 12 : 8;
    const kakaoZoom = isKorean ? 7 : 11;

    // Set default tab after mount to avoid hydration mismatch
    // Default to Kakao Maps to avoid Google Maps billing issues
    useEffect(() => {
        setValue('kakao');
    }, []);

    // Kakao Map links
    // Jeungsan Station coordinates: 35.3122, 129.0347
    const jeungsanStationKakaoLink = 'https://place.map.kakao.com/PSS240';
    const jeungsanStationNaverLink = 'https://naver.me/xVAJTMJh ';
    const jeungsanStationGoogleLink = 'https://maps.app.goo.gl/r9MrYyKBFVrQBxQk7';

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
                <p className="text-[10px] tracking-[0.3em] text-zinc-400">LOCATION</p>
                <h3 className="text-lg font-medium">{text('LOCATION_HEADING')}</h3>
            </div>
            <div className="mt-4 text-center">
                <div className="text-base font-medium text-black">{venueName}</div>
                <div className="text-sm text-zinc-500">{address}</div>
                {text('VENUE_ADDRESS_FULL') && (
                    <div className="mt-1 text-xs text-zinc-400">{text('VENUE_ADDRESS_FULL')}</div>
                )}
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
                                        {text('MAP_PLACEHOLDER')}
                                    </div>
                                )}
                            </div>
                            <div className={value === 'kakao' ? 'block' : 'hidden'}>
                                {canRender ? (
                                    <KakaoMap
                                        lat={lat!}
                                        lng={lng!}
                                        zoom={kakaoZoom}
                                        title={venueName}
                                        className="aspect-[4/3] w-full"
                                    />
                                ) : (
                                    <div className="flex aspect-[4/3] items-center justify-center text-sm text-zinc-500">
                                        {text('MAP_PLACEHOLDER')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs Below Map - Full Width */}
                    <TabsList className="grid w-full grid-cols-2 rounded-t-none rounded-b-lg">
                        <TabsTrigger value="google">{text('MAP_TAB_GOOGLE')}</TabsTrigger>
                        <TabsTrigger value="kakao">{text('MAP_TAB_KAKAO')}</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Transportation Options Accordion */}
                <div className="mt-6">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="public-transport">
                            <AccordionTrigger className="text-sm font-medium">
                                {text('TRANSPORT_PUBLIC_TITLE')}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-zinc-600">
                                <p className="mb-3">{richText('TRANSPORT_PUBLIC_DESC')}</p>
                                <div className="space-y-2">
                                    <div>
                                        <Link
                                            href={jeungsanStationKakaoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-900 underline hover:text-zinc-700"
                                        >
                                            {text('TRANSPORT_PUBLIC_LINK')}
                                        </Link>
                                    </div>
                                    <div>
                                        <Link
                                            href={jeungsanStationNaverLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-900 underline hover:text-zinc-700"
                                        >
                                            {text('TRANSPORT_PUBLIC_NAVER')}
                                        </Link>
                                    </div>
                                    {!isKorean && (
                                        <div>
                                            <Link
                                                href={jeungsanStationGoogleLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-zinc-900 underline hover:text-zinc-700"
                                            >
                                                {text('TRANSPORT_PUBLIC_GOOGLE')}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-3 text-xs text-zinc-500">{text('TRANSPORT_NOTE')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="driving">
                            <AccordionTrigger className="text-sm font-medium">
                                {text('TRANSPORT_DRIVING_TITLE')}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-zinc-600">
                                <p className="mb-3">{richText('TRANSPORT_DRIVING_DESC')}</p>
                                <div className="space-y-2">
                                    <div>
                                        <Link
                                            href={venueKakaoNaviLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-900 underline hover:text-zinc-700"
                                        >
                                            {text('TRANSPORT_DRIVING_LINK')}
                                        </Link>
                                    </div>
                                    <div>
                                        <Link
                                            href={venueNaverLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-900 underline hover:text-zinc-700"
                                        >
                                            {text('TRANSPORT_DRIVING_NAVER')}
                                        </Link>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-zinc-500">{text('TRANSPORT_DRIVING_PARKING')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Hide taxi section for Korean locale */}
                        {isKorean !== true && (
                            <AccordionItem value="taxi">
                                <AccordionTrigger className="text-sm font-medium">
                                    {text('TRANSPORT_TAXI_TITLE')}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-zinc-600">
                                    <p className="mb-3">{text('TRANSPORT_TAXI_DESC')}</p>
                                    <Link
                                        href="https://kride.kakaomobility.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-900 underline hover:text-zinc-700"
                                    >
                                        {text('TRANSPORT_TAXI_LINK')}
                                    </Link>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
