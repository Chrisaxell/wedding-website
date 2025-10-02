'use server';
import { prisma } from '@/lib/prisma';
import { inviteIdSchema } from '@/lib/invites';
import { z } from 'zod';

const rsvpSchema = z.union([z.literal('yes'), z.literal('no'), z.literal('maybe')]);

export async function submitRSVP(formData: FormData) {
  const inviteId = String(formData.get('inviteId') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const statusRaw = String(formData.get('status') ?? '').trim();

  if (!inviteIdSchema.safeParse(inviteId).success) {
    return { ok: false as const, error: 'Invalid invite id' };
  }
  if (!name) {
    return { ok: false as const, error: 'Missing name' };
  }
  const statusParse = rsvpSchema.safeParse(statusRaw);
  if (!statusParse.success) {
    return { ok: false as const, error: 'Invalid status' };
  }
  const status = statusParse.data; // now definitely 'yes' | 'no' | 'maybe'

  try {
    const updated = await prisma.invite.update({
      where: { id: inviteId },
      data: { guestName: name, rsvpStatus: status },
    });

    await prisma.rsvp.create({ data: { inviteId: updated.id, name, status } });

    return { ok: true as const };
  } catch (err: unknown) {
    let code: string | undefined;
    if (typeof err === 'object' && err !== null && 'code' in err) {
      code = (err as { code?: string }).code;
    }
    if (code === 'P2025') {
      return { ok: false as const, error: 'Invite not found' };
    }
    console.error('RSVP submit failed', err);
    return { ok: false as const, error: 'Server error' };
  }
}
