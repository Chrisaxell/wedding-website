'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { WEDDING_EVENT } from '@/lib/wedding';
import Link from 'next/link';

export function InfoTabs() {
  const t = useTranslations('WeddingInvite');
  return (
    <Tabs defaultValue="dresscode" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dresscode">{t('INFO_TAB_DRESSCODE')}</TabsTrigger>
        <TabsTrigger value="food">{t('INFO_TAB_FOOD')}</TabsTrigger>
        <TabsTrigger value="parking">{t('INFO_TAB_PARKING')}</TabsTrigger>
      </TabsList>
      <TabsContent value="dresscode" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">{t('INFO_DRESSCODE_DESC')}</p>
        <p className="text-sm text-zinc-600">
          <Link href="/dresscode" className="text-zinc-900 underline hover:text-zinc-700">
            {t('INFO_DRESSCODE_LINK')}
          </Link>
        </p>
      </TabsContent>
      <TabsContent value="food" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">
          {t('INFO_FOOD_DESC', {
            venue: WEDDING_EVENT.venueName,
            foodTime: WEDDING_EVENT.foodTime,
          })}
        </p>
      </TabsContent>
      <TabsContent value="parking" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">{t('INFO_PARKING_DESC')}</p>
      </TabsContent>
    </Tabs>
  );
}
