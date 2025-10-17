'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { submitRSVP } from '@/actions/rsvp';
import { downloadICSFile } from '@/lib/ics';
import { WEDDING_EVENT } from '@/lib/wedding';

type Props = { guestName?: string; autoOpen?: boolean };

export function RsvpDialog({ guestName, autoOpen = false }: Props) {
  const [name, setName] = useState(guestName ?? '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plusOne, setPlusOne] = useState(false);
  const [status, setStatus] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [showCalendarPrompt, setShowCalendarPrompt] = useState(false);
  const t = useTranslations('WeddingInvite');

  useEffect(() => {
    if (autoOpen) {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [autoOpen]);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set('name', name);
      fd.set('email', email);
      fd.set('phone', phone);
      fd.set('plusOne', String(plusOne));
      fd.set('status', status);
      const res = await submitRSVP(fd);
      if (!res.ok) {
        setError(res.error ?? 'Error');
        return;
      }
      // Set cookies on client side for immediate feedback
      document.cookie = `rsvp_seen=true; path=/; max-age=${60 * 60 * 24 * 365}`;
      document.cookie = `guest_name=${encodeURIComponent(name)}; path=/; max-age=${60 * 60 * 24 * 365}`;

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showCalendarPrompt ? t('RSVP_SUCCESS_TITLE') : t('RSVP_DIALOG_TITLE')}
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
          <div className="space-y-4">
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

            <p className="text-xs text-zinc-500">{t('RSVP_CONTACT_INFO')}</p>

            <div className="flex items-center gap-2">
              <input
                id="plusOne"
                type="checkbox"
                checked={plusOne}
                onChange={(e) => setPlusOne(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="plusOne" className="cursor-pointer font-normal">
                {t('RSVP_PLUS_ONE_LABEL')}
              </Label>
            </div>

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

            <Button
              onClick={submit}
              className="w-full"
              disabled={loading || !name || (!email && !phone)}
            >
              {loading ? '...' : t('RSVP_SUBMIT')}
            </Button>

            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
