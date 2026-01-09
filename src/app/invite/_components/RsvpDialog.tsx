'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { submitRSVP } from '@/actions/rsvp';
import { downloadICSFile } from '@/lib/ics';
import { WEDDING_EVENT } from '@/lib/wedding';
import { trackEvent } from '@/components/AnalyticsTracker';

type Props = { guestName?: string; open?: boolean; onOpenChange?: (open: boolean) => void };

export function RsvpDialog({ guestName, open: controlledOpen, onOpenChange }: Props) {
    const [name, setName] = useState(guestName ?? '');
    // store as string so input can be cleared while typing
    const [numberOfPeople, setNumberOfPeople] = useState('1');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [status, setStatus] = useState<'yes' | 'no' | 'maybe'>('yes');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [internalOpen, setInternalOpen] = useState(false);
    const [showCalendarPrompt, setShowCalendarPrompt] = useState(false);
    const t = useTranslations('WeddingInvite');
    const locale = useLocale();

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value);
        } else {
            setInternalOpen(value);
        }
    };

    async function submit() {
        setLoading(true);
        setError(null);
        try {
            const fd = new FormData();
            fd.set('name', name);
            // default to 1 if input is empty or invalid
            const num = parseInt(numberOfPeople, 10);
            const finalNum = Number.isFinite(num) && num >= 1 ? num : 1;
            fd.set('numberOfPeople', String(finalNum));
            fd.set('email', email);
            fd.set('phone', phone);
            fd.set('status', status);
            fd.set('dietaryRestrictions', dietaryRestrictions);
            const res = await submitRSVP(fd);
            if (!res.ok) {
                setError(res.error ?? 'Error');
                return;
            }
            // Set cookies on client side for immediate feedback
            document.cookie = `rsvp_seen=true; path=/; max-age=${60 * 60 * 24 * 365}`;
            document.cookie = `guest_name=${encodeURIComponent(name)}; path=/; max-age=${60 * 60 * 24 * 365}`;
            // Track RSVP submission
            trackEvent('rsvp_submitted', {
                guest_name: name,
                status: status,
                has_plus_one: finalNum > 1,
                number_of_people: finalNum,
                has_dietary_restrictions: !!dietaryRestrictions,
                provided_email: !!email,
                provided_phone: !!phone,
            });


            // Show calendar prompt after successful submission
            setShowCalendarPrompt(true);
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }

    function downloadICS() {
        const start = new Date(WEDDING_EVENT.dateISO);
        const end = new Date(WEDDING_EVENT.endDateISO || start.getTime() + 2 * 60 * 60 * 1000);
        const event = {
            title: t('CALENDAR_EVENT_TITLE', {
                coupleA: WEDDING_EVENT.coupleA,
                coupleB: WEDDING_EVENT.coupleB,
            }),
            description: t('CALENDAR_EVENT_DESCRIPTION', {
                coupleA: WEDDING_EVENT.coupleA,
                coupleB: WEDDING_EVENT.coupleB,
                venue: WEDDING_EVENT.venueName,
        trackEvent('calendar_downloaded', {
            guest_name: name,
        });
            }),
            start,
            end,
            location: WEDDING_EVENT.venueName,
            latitude: WEDDING_EVENT.venueLat,
            longitude: WEDDING_EVENT.venueLng,
        };
        downloadICSFile(event, t('CALENDAR_FILE_NAME'));
    }

    function handleCalendarDownload() {
        downloadICS();
        setShowCalendarPrompt(false);
        setOpen(false);
    }

    function handleSkipCalendar() {
        setShowCalendarPrompt(false);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="px-6">{t('RSVP_OPEN_BUTTON')}</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {showCalendarPrompt
                            ? t('RSVP_SUCCESS_TITLE')
                            : locale === 'ko'
                              ? t('RSVP_SECTION_HEADING')
                              : t('RSVP_DIALOG_TITLE')}
                    </DialogTitle>
                </DialogHeader>

                {showCalendarPrompt ? (
                    <div className="space-y-4">
                        <p className="text-sm text-zinc-600">{t('RSVP_SUCCESS_MESSAGE')}</p>
                        <p className="text-sm text-zinc-600">{t('RSVP_CALENDAR_PROMPT')}</p>
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleCalendarDownload} className="w-full">
                                {t('CALENDAR_ADD_BUTTON')}
                            </Button>
                            <Button onClick={handleSkipCalendar} variant="outline" className="w-full">
                                {t('RSVP_SKIP_CALENDAR')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('RSVP_NAME_LABEL')}</Label>
                            <Input
                                id="name"
                                placeholder={t('RSVP_NAME_PLACEHOLDER')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numberOfPeople">{t('RSVP_NUMBER_OF_PEOPLE_LABEL')}</Label>
                            <Input
                                id="numberOfPeople"
                                type="number"
                                min={1}
                                value={numberOfPeople}
                                onChange={(e) => setNumberOfPeople(e.target.value)}
                            />
                            <span className="text-xs text-zinc-500">{t('RSVP_NUMBER_OF_PEOPLE_HINT')}</span>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('RSVP_EMAIL_LABEL')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('RSVP_EMAIL_PLACEHOLDER')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('RSVP_PHONE_LABEL')}</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder={t('RSVP_PHONE_PLACEHOLDER')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dietary">{t('RSVP_DIETARY_LABEL')}</Label>
                            <textarea
                                id="dietary"
                                placeholder={t('RSVP_DIETARY_PLACEHOLDER')}
                                value={dietaryRestrictions}
                                onChange={(e) => setDietaryRestrictions(e.target.value)}
                                rows={3}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <p className="text-xs font-medium text-zinc-600">{t('RSVP_DEADLINE')}</p>

                        <p className="text-xs text-zinc-500">{t('RSVP_CONTACT_INFO')}</p>

                        <div className="space-y-2">
                            <Label>{t('RSVP_ATTENDANCE_LABEL')}</Label>
                            <div className="flex gap-2">
                                {(['yes', 'maybe', 'no'] as const).map((s) => {
                                    const labelKey =
                                        s === 'yes'
                                            ? 'RSVP_STATUS_YES'
                                            : s === 'maybe'
                                              ? 'RSVP_STATUS_MAYBE'
                                              : 'RSVP_STATUS_NO';
                                    return (
                                        <Button
                                            key={s}
                                            type="button"
                                            variant={status === s ? 'default' : 'outline'}
                                            onClick={() => setStatus(s)}
                                            className="flex-1"
                                        >
                                            {t(labelKey)}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <Button onClick={submit} className="w-full" disabled={loading || !name || (!email && !phone)}>
                            {loading ? '...' : t('RSVP_SUBMIT')}
                        </Button>

                        <Button onClick={() => setOpen(false)} variant="outline" className="w-full">
                            {t('RSVP_ANSWER_LATER')}
                        </Button>

                        {error && <p className="text-xs text-red-600">{error}</p>}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
