// filepath: c:\dev\wedding-website\src\app\invite\_components\AddCalendarButton.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { downloadICSFile } from '@/lib/ics';
import { WEDDING_EVENT } from '@/lib/wedding';

export function AddCalendarButton() {
  const t = useTranslations('WeddingInvite');
  function handleClick() {
    const start = new Date(WEDDING_EVENT.dateISO);
    const end = new Date(WEDDING_EVENT.endDateISO || start.getTime() + 2 * 60 * 60 * 1000);
    downloadICSFile(
      {
        title: t('CALENDAR_EVENT_TITLE', {
          coupleA: WEDDING_EVENT.coupleA,
          coupleB: WEDDING_EVENT.coupleB,
        }),
        description: t('CALENDAR_EVENT_DESCRIPTION', {
          coupleA: WEDDING_EVENT.coupleA,
          coupleB: WEDDING_EVENT.coupleB,
          venue: WEDDING_EVENT.venueAddress, // use address instead of name
        }),
        start,
        end,
        location: WEDDING_EVENT.venueAddress, // changed to address
        latitude: WEDDING_EVENT.venueLat,
        longitude: WEDDING_EVENT.venueLng,
      },
      t('CALENDAR_FILE_NAME'),
    );
  }
  return (
    <Button onClick={handleClick} variant="outline" className="mt-4 w-full">
      {t('CALENDAR_ADD_BUTTON')}
    </Button>
  );
}
