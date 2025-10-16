'use server';
import { prisma } from '@/lib/prisma';
import { setCookie } from '@/lib/cookies';
import { z } from 'zod';

const rsvpSchema = z.union([z.literal('yes'), z.literal('no'), z.literal('maybe')]);

export async function submitRSVP(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const statusRaw = String(formData.get('status') ?? '').trim();

  if (!name) {
    return { ok: false as const, error: 'Missing name' };
  }
  const statusParse = rsvpSchema.safeParse(statusRaw);
  if (!statusParse.success) {
    return { ok: false as const, error: 'Invalid status' };
  }
  const status = statusParse.data; // now definitely 'yes' | 'no' | 'maybe'

  try {
    // Create a new RSVP entry without needing an invite
    await prisma.rsvp.create({
      data: {
        name,
        status,
        inviteId: null, // Allow null inviteId
      },
    });

    // Store guest name in cookies for future visits
    await setCookie('guest_name', name);

    return { ok: true as const };
  } catch (err: unknown) {
    console.error('RSVP submit failed', err);
    return { ok: false as const, error: 'Server error' };
  }
}
