// filepath: c:\dev\wedding-website\src\app\invite\_components\AddCalendarButton.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useText } from '@/components/TranslatedText';
import { downloadICSFile } from '@/lib/ics';
import { WEDDING_EVENT } from '@/lib/wedding';

export function AddCalendarButton() {
    const text = useText();
    function handleClick() {
        const start = new Date(WEDDING_EVENT.dateISO);
        const end = new Date(WEDDING_EVENT.endDateISO);
        const venueLocation = text('VENUE_LOCATION');
        downloadICSFile(
            {
                title: text('CALENDAR_EVENT_TITLE', {
                    coupleA: WEDDING_EVENT.coupleA,
                    coupleB: WEDDING_EVENT.coupleB,
                }),
                description: text('CALENDAR_EVENT_DESCRIPTION', {
                    coupleA: WEDDING_EVENT.coupleA,
                    coupleB: WEDDING_EVENT.coupleB,
                    venue: venueLocation,
                }),
                start,
                end,
                location: venueLocation,
                latitude: WEDDING_EVENT.venueLat,
                longitude: WEDDING_EVENT.venueLng,
            },
            text('CALENDAR_FILE_NAME'),
        );
    }
    return (
        <Button onClick={handleClick} variant="outline" className="mt-4 w-full">
            {text('CALENDAR_ADD_BUTTON')}
        </Button>
    );
}
