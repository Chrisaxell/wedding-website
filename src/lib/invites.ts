import { notFound } from 'next/navigation';
import { z } from 'zod';

export const inviteIdSchema = z.string().uuid();

export type Invite = {
  id: string;
  guestName?: string;
  language?: 'en' | 'ko' | 'no';
  rsvp?: 'yes' | 'no' | 'maybe';
};

const MOCK_INVITES: Invite[] = [
  { id: '0d44434f-e193-49ea-bdc2-3d3f6deab3ab', guestName: 'Chris', language: 'en' },
  { id: '3663d23a-771b-44c8-b41a-a6ebea727427', guestName: 'Scarlett', language: 'ko' },
  { id: 'f8234976-a9a7-4d86-a02f-9539c0307d33', guestName: 'Vikors', language: 'no' },
];

export async function getInviteOr404(inviteId: string): Promise<Invite> {
  // 1) UUID shape check
  const parsed = inviteIdSchema.safeParse(inviteId);
  if (!parsed.success) notFound();

  // 2) lookup (replace with DB)
  const hit = MOCK_INVITES.find((i) => i.id === inviteId);
  if (!hit) notFound();

  return hit;
}
