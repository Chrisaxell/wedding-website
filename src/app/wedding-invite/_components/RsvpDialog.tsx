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
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitRSVP } from '@/actions/rsvp';
import { downloadICSFile } from '@/lib/ics';
import { WEDDING_EVENT } from '@/lib/wedding';

type Props = { inviteId: string; guestName?: string };

export function RsvpDialog({ inviteId, guestName }: Props) {
  const [name, setName] = useState(guestName ?? '');
  const [status, setStatus] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('WeddingInvite');

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set('inviteId', inviteId);
      fd.set('name', name);
      fd.set('status', status);
      const res = await submitRSVP(fd);
      if (!res.ok) {
        setError(res.error ?? 'Error');
        return;
      }
      alert(t('RSVP_ALERT'));
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-6">{t('RSVP_OPEN_BUTTON')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('RSVP_DIALOG_TITLE')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder={t('RSVP_NAME_PLACEHOLDER')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <Button onClick={submit} className="w-full" disabled={loading || !name}>
            {loading ? '...' : t('RSVP_SUBMIT')}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={downloadICS}>
            {t('CALENDAR_ADD_BUTTON')}
          </Button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
