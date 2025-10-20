'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import GoogleMap from '@/components/maps/GoogleMap';
import KakaoMap from '@/components/maps/KakaoMap';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

type Props = {
  venueName: string;
  address: string;
  lat?: number;
  lng?: number;
};

export default function MapCard({ venueName, address, lat, lng }: Props) {
  const t = useTranslations('WeddingInvite');
  const canRender = typeof lat === 'number' && typeof lng === 'number';
  const [value, setValue] = useState<'google' | 'kakao'>('google');
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
      <Card className="mx-2 mt-4">
        <CardContent className="p-0">
          <Tabs
            value={value}
            onValueChange={(v) => setValue(v as 'google' | 'kakao')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="google">{t('MAP_TAB_GOOGLE')}</TabsTrigger>
              <TabsTrigger value="kakao">{t('MAP_TAB_KAKAO')}</TabsTrigger>
            </TabsList>
            <div className="relative">
              <div
                role="tabpanel"
                aria-labelledby="google"
                className={value === 'google' ? 'block' : 'hidden'}
              >
                {canRender ? (
                  <GoogleMap
                    lat={lat!}
                    lng={lng!}
                    title={venueName}
                    className="aspect-[4/3] w-full"
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center text-sm text-zinc-500">
                    {t('MAP_PLACEHOLDER')}
                  </div>
                )}
              </div>
              <div
                role="tabpanel"
                aria-labelledby="kakao"
                className={value === 'kakao' ? 'block' : 'hidden'}
              >
                {canRender ? (
                  <KakaoMap
                    lat={lat!}
                    lng={lng!}
                    title={venueName}
                    venueName={venueName}
                    className="aspect-[4/3] w-full"
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center text-sm text-zinc-500">
                    {t('MAP_PLACEHOLDER')}
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
