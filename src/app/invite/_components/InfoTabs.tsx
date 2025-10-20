'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { WEDDING_EVENT } from '@/lib/wedding';

export function InfoTabs() {
  const t = useTranslations('WeddingInvite');
  return (
    <Tabs defaultValue="ceremony" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="ceremony">{t('INFO_TAB_CEREMONY')}</TabsTrigger>
        <TabsTrigger value="food">{t('INFO_TAB_FOOD')}</TabsTrigger>
        <TabsTrigger value="parking">{t('INFO_TAB_PARKING')}</TabsTrigger>
      </TabsList>
      <TabsContent value="ceremony" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">{t('INFO_CEREMONY_DESC')}</p>
      </TabsContent>
      <TabsContent value="food" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">
          {t('INFO_FOOD_DESC', { venue: WEDDING_EVENT.venueName, foodTime: '13:30' })}
        </p>
      </TabsContent>
      <TabsContent value="parking" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">{t('INFO_PARKING_DESC')}</p>
      </TabsContent>
    </Tabs>
  );
}
