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
  { id: '11111111-1111-1111-1111-111111111111', guestName: 'Chris', language: 'en' },
  { id: '22222222-2222-2222-2222-222222222222', guestName: 'Scarlett', language: 'ko' },
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
