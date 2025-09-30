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

type Props = { inviteId: string; guestName?: string };

export function RsvpDialog({ inviteId, guestName }: Props) {
  const [name, setName] = useState(guestName ?? '');
  const [status, setStatus] = useState<'yes' | 'no' | 'maybe'>('yes');
  const t = useTranslations('WeddingInvite');

  async function submit() {
    console.log({ inviteId, name, status });
    alert(t('RSVP_ALERT'));
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
          <Button onClick={submit} className="w-full">
            {t('RSVP_SUBMIT')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
