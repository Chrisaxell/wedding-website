'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WEDDING_EVENT } from '@/lib/wedding';
import Link from 'next/link';
import { useText, useRichText } from '@/components/TranslatedText';

export function InfoTabs() {
    const text = useText();
    const richText = useRichText();

    return (
        <Tabs defaultValue="dresscode" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dresscode">{text('INFO_TAB_DRESSCODE')}</TabsTrigger>
                <TabsTrigger value="food">{text('INFO_TAB_FOOD')}</TabsTrigger>
                <TabsTrigger value="parking">{text('INFO_TAB_PARKING')}</TabsTrigger>
            </TabsList>
            <TabsContent value="dresscode" className="mt-4 space-y-3">
                <p className="text-sm text-zinc-600">{richText('INFO_DRESSCODE_DESC')}</p>
                <p className="text-sm text-zinc-600">
                    <Link href="/dresscode" className="text-zinc-900 underline hover:text-zinc-700">
                        {text('INFO_DRESSCODE_LINK')}
                    </Link>
                </p>
            </TabsContent>
            <TabsContent value="food" className="mt-4 space-y-3">
                <p className="text-sm text-zinc-600">
                    {richText('INFO_FOOD_DESC', {
                        venue: WEDDING_EVENT.venueName,
                        foodTime: WEDDING_EVENT.foodTime,
                    })}
                </p>
            </TabsContent>
            <TabsContent value="parking" className="mt-4 space-y-3">
                <p className="text-sm text-zinc-600">{richText('INFO_PARKING_DESC')}</p>
            </TabsContent>
        </Tabs>
    );
}
