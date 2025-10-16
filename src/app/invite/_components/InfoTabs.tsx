'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';

export function InfoTabs() {
  const t = useTranslations('WeddingInvite');
  return (
    <Tabs defaultValue="photo" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="photo">{t('INFO_TAB_PHOTO')}</TabsTrigger>
        <TabsTrigger value="food">{t('INFO_TAB_FOOD')}</TabsTrigger>
        <TabsTrigger value="parking">{t('INFO_TAB_PARKING')}</TabsTrigger>
      </TabsList>
      <TabsContent value="photo" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">{t('INFO_PHOTO_DESC')}</p>
      </TabsContent>
      <TabsContent value="food" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">{t('INFO_FOOD_DESC')}</p>
      </TabsContent>
      <TabsContent value="parking" className="mt-4 space-y-3">
        <p className="text-sm text-zinc-600">{t('INFO_PARKING_DESC')}</p>
      </TabsContent>
    </Tabs>
  );
}
