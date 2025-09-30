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

type Props = { inviteId: string; guestName?: string };

export function RsvpDialog({ inviteId, guestName }: Props) {
  const [name, setName] = useState(guestName ?? '');
  const [status, setStatus] = useState<'yes' | 'no' | 'maybe'>('yes');

  async function submit() {
    // TODO: POST to /api/rsvp (Neon/Prisma)
    console.log({ inviteId, name, status });
    alert('Thanks! RSVP saved (mock).');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-6">참석 의사 전달하기</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>RSVP</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-2">
            {(['yes', 'maybe', 'no'] as const).map((s) => (
              <Button
                key={s}
                variant={status === s ? 'default' : 'outline'}
                onClick={() => setStatus(s)}
                className="flex-1"
              >
                {s.toUpperCase()}
              </Button>
            ))}
          </div>
          <Button onClick={submit} className="w-full">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
