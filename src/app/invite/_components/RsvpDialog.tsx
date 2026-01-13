'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useText } from '@/components/TranslatedText';
import { submitRSVP } from '@/actions/rsvp';
import { downloadICSFile } from '@/lib/ics';
import { WEDDING_EVENT } from '@/lib/wedding';
import { trackEvent } from '@/components/AnalyticsTracker';

type Props = {
    guestName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function RsvpDialog({ guestName, open: controlledOpen, onOpenChange }: Props) {
    const [name, setName] = useState(guestName ?? '');
    const [numberOfPeople, setNumberOfPeople] = useState('1');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [status, setStatus] = useState<'yes' | 'no' | 'maybe'>('yes');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [internalOpen, setInternalOpen] = useState(false);
    const [showCalendarPrompt, setShowCalendarPrompt] = useState(false);
    const [existingRsvp, setExistingRsvp] = useState<{ name: string; status: string } | null>(null);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
    const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const text = useText();
    const locale = useLocale();

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value);
        } else {
            setInternalOpen(value);
        }
    };

    // Check if email already has an RSVP (debounced)
    useEffect(() => {
        if (emailCheckTimeout) {
            clearTimeout(emailCheckTimeout);
        }

        if (!email || !email.includes('@')) {
            setExistingRsvp(null);
            setShowUpdateConfirmation(false);
            setCheckingEmail(false);
            return;
        }

        setCheckingEmail(true);
        const timeout = setTimeout(async () => {
            try {
                const response = await fetch('/api/rsvp/check-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                const data = await response.json();

                if (data.exists) {
                    setExistingRsvp({ name: data.name, status: data.status });
                    setShowUpdateConfirmation(true);

                    // Track identified user by email
                    trackEvent('existing_rsvp_detected', {
                        guest_name: data.name,
                        email: email,
                    });

                    // Update analytics tracking with email-based name
                    document.cookie = `guest_name=${encodeURIComponent(data.name)}; path=/; max-age=${60 * 60 * 24 * 365}`;
                    document.cookie = `guest_email=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 365}`;
                } else {
                    setExistingRsvp(null);
                    setShowUpdateConfirmation(false);
                }
            } catch (error) {
                console.error('Failed to check email:', error);
            } finally {
                setCheckingEmail(false);
            }
        }, 500);

        setEmailCheckTimeout(timeout);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [email]);

    function handleUpdateConfirmation(shouldUpdate: boolean) {
        if (!shouldUpdate) {
            // User doesn't want to update, close the dialog
            setOpen(false);
            setShowUpdateConfirmation(false);
            setExistingRsvp(null);
            setEmail('');
            setName(guestName ?? '');
            trackEvent('rsvp_update_declined', {
                guest_name: existingRsvp?.name || 'unknown',
                email: email,
            });
        } else {
            // User wants to update, dismiss confirmation and allow form editing
            setShowUpdateConfirmation(false);
            if (existingRsvp) {
                setName(existingRsvp.name);
            }
            trackEvent('rsvp_update_confirmed', {
                guest_name: existingRsvp?.name || 'unknown',
                email: email,
            });
        }
    }

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
            if (email) {
                document.cookie = `guest_email=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 365}`;
            }
            // Track RSVP submission
            trackEvent('rsvp_submitted', {
                guest_name: name,
                email: email || 'not_provided',
                status: status,
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
            title: text('CALENDAR_EVENT_TITLE', {
                coupleA: WEDDING_EVENT.coupleA,
                coupleB: WEDDING_EVENT.coupleB,
            }),
            description: text('CALENDAR_EVENT_DESCRIPTION', {
                coupleA: WEDDING_EVENT.coupleA,
                coupleB: WEDDING_EVENT.coupleB,
                venue: WEDDING_EVENT.venueName,
            }),
            start,
            end,
            location: WEDDING_EVENT.venueName,
            latitude: WEDDING_EVENT.venueLat,
            longitude: WEDDING_EVENT.venueLng,
        };
        downloadICSFile(event, text('CALENDAR_FILE_NAME'));
        trackEvent('calendar_downloaded', {
            guest_name: name,
        });
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
                <Button className="px-6">{text('RSVP_OPEN_BUTTON')}</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {showCalendarPrompt
                            ? text('RSVP_SUCCESS_TITLE')
                            : locale === 'ko'
                              ? text('RSVP_SECTION_HEADING')
                              : text('RSVP_DIALOG_TITLE')}
                    </DialogTitle>
                </DialogHeader>

                {showCalendarPrompt ? (
                    <div className="space-y-4">
                        <p className="text-sm text-zinc-600">{text('RSVP_SUCCESS_MESSAGE')}</p>
                        <p className="text-sm text-zinc-600">{text('RSVP_CALENDAR_PROMPT')}</p>
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleCalendarDownload} className="w-full">
                                {text('CALENDAR_ADD_BUTTON')}
                            </Button>
                            <Button onClick={handleSkipCalendar} variant="outline" className="w-full">
                                {text('RSVP_SKIP_CALENDAR')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="relative space-y-4 pb-4">
                        {/* Nested overlay for update confirmation */}
                        {showUpdateConfirmation && existingRsvp && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white/95 p-6 backdrop-blur-sm">
                                <div className="w-full max-w-sm space-y-4">
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-zinc-700">
                                            {text('RSVP_EXISTING_FOUND', { name: existingRsvp.name })}
                                        </p>
                                        <p className="mt-2 text-sm text-zinc-500">{text('RSVP_UPDATE_QUESTION')}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button onClick={() => handleUpdateConfirmation(true)} className="w-full">
                                            {text('RSVP_UPDATE_YES')}
                                        </Button>
                                        <Button
                                            onClick={() => handleUpdateConfirmation(false)}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            {text('RSVP_UPDATE_NO')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">{text('RSVP_NAME_LABEL')}</Label>
                            <Input
                                id="name"
                                placeholder={text('RSVP_NAME_PLACEHOLDER')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numberOfPeople">{text('RSVP_NUMBER_OF_PEOPLE_LABEL')}</Label>
                            <Input
                                id="numberOfPeople"
                                type="number"
                                min={1}
                                value={numberOfPeople}
                                onChange={(e) => setNumberOfPeople(e.target.value)}
                            />
                            <span className="text-xs text-zinc-500">{text('RSVP_NUMBER_OF_PEOPLE_HINT')}</span>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{text('RSVP_EMAIL_LABEL')}</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={text('RSVP_EMAIL_PLACEHOLDER')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {checkingEmail && (
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">{text('RSVP_PHONE_LABEL')}</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder={text('RSVP_PHONE_PLACEHOLDER')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dietary">{text('RSVP_DIETARY_LABEL')}</Label>
                            <textarea
                                id="dietary"
                                placeholder={text('RSVP_DIETARY_PLACEHOLDER')}
                                value={dietaryRestrictions}
                                onChange={(e) => setDietaryRestrictions(e.target.value)}
                                rows={3}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <p className="text-xs font-medium text-zinc-600">{text('RSVP_DEADLINE')}</p>

                        <p className="text-xs text-zinc-500">{text('RSVP_CONTACT_INFO')}</p>

                        <div className="space-y-2">
                            <Label>{text('RSVP_ATTENDANCE_LABEL')}</Label>
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
                                            {text(labelKey)}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <Button onClick={submit} className="w-full" disabled={loading || !name || (!email && !phone)}>
                            {loading ? '...' : text('RSVP_SUBMIT')}
                        </Button>

                        <Button onClick={() => setOpen(false)} variant="outline" className="w-full">
                            {text('RSVP_ANSWER_LATER')}
                        </Button>

                        {error && <p className="text-xs text-red-600">{error}</p>}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
