import { notFound } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { Invite as InviteModel } from '@prisma/client';

export const inviteIdSchema = z.string().uuid();

export type Invite = {
  id: string;
  guestName?: string; // nulls normalized to undefined
  language?: 'en' | 'ko' | 'no';
  rsvp?: 'yes' | 'no' | 'maybe';
};

export async function getInviteOr404(inviteId: string): Promise<Invite> {
  const parsed = inviteIdSchema.safeParse(inviteId);
  if (!parsed.success) notFound();

  const record = await prisma.invite.findUnique({ where: { id: inviteId } });
  if (!record) notFound();
  return {
    id: record.id,
    guestName: record.guestName ?? undefined,
    language: (record.language as Invite['language']) ?? undefined,
    rsvp: (record.rsvpStatus as Invite['rsvp']) ?? undefined,
  };
}

export async function listInvites(): Promise<Invite[]> {
  const rows: InviteModel[] = await prisma.invite.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map((r) => ({
    id: r.id,
    guestName: r.guestName ?? undefined,
    language: (r.language as Invite['language']) ?? undefined,
    rsvp: (r.rsvpStatus as Invite['rsvp']) ?? undefined,
  }));
}
