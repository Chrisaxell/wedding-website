'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

type Props = {
  venueName: string;
  address: string;
  lat?: number;
  lng?: number;
};

export default function MapCard({ venueName, address }: Props) {
  const t = useTranslations('WeddingInvite');
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
          <div className="h-60 w-full bg-zinc-100">
            <div className="flex h-full items-center justify-center px-3 text-center text-sm text-zinc-500">
              {t('MAP_PLACEHOLDER')}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-3 grid grid-cols-3 gap-2 px-2 text-center text-xs">
        <a className="rounded-md bg-zinc-100 py-2" href="#" aria-disabled>
          {t('MAP_LINK_NAVER')}
        </a>
        <a className="rounded-md bg-zinc-100 py-2" href="#" aria-disabled>
          {t('MAP_LINK_KAKAO')}
        </a>
        <a className="rounded-md bg-zinc-100 py-2" href="#" aria-disabled>
          {t('MAP_LINK_TMAP')}
        </a>
      </div>
    </section>
  );
}
