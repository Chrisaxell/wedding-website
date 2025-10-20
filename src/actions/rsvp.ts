'use server';
import { prisma } from '@/lib/prisma';
import { setCookie } from '@/lib/cookies';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

const rsvpSchema = z.union([z.literal('yes'), z.literal('no'), z.literal('maybe')]);

export async function submitRSVP(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const plusOne = formData.get('plusOne') === 'true';
  const dietaryRestrictions = String(formData.get('dietaryRestrictions') ?? '').trim();
  const statusRaw = String(formData.get('status') ?? '').trim();
  const inviteIdRaw = String(formData.get('inviteId') ?? '').trim();
  const inviteId = inviteIdRaw || null;

  if (!name) {
    return { ok: false as const, error: 'Missing name' };
  }

  // At least one contact method (email or phone) must be provided
  if (!email && !phone) {
    return { ok: false as const, error: 'Please provide at least email or phone number' };
  }

  const statusParse = rsvpSchema.safeParse(statusRaw);
  if (!statusParse.success) {
    return { ok: false as const, error: 'Invalid status' };
  }
  const status = statusParse.data; // 'yes' | 'no' | 'maybe'

  if (dietaryRestrictions.length > 500) {
    return { ok: false as const, error: 'Dietary restrictions text too long (max 500 chars)' };
  }

  try {
    // Use unchecked create to allow direct inviteId assignment
    const data: Prisma.RsvpUncheckedCreateInput = {
      name,
      email: email || null,
      phone: phone || null,
      plusOne,
      status,
      inviteId, // optional
      dietaryRestrictions: dietaryRestrictions || null,
      createdAt: undefined, // let DB default handle
      id: undefined, // auto uuid
    };

    const created = await prisma.rsvp.create({ data });

    await setCookie('guest_name', name);
    await setCookie('rsvp_status', status);
    await setCookie('rsvp_plus_one', plusOne ? 'true' : 'false');
    await setCookie('rsvp_email', email || '');
    await setCookie('rsvp_phone', phone || '');
    await setCookie('rsvp_dietary', dietaryRestrictions || '');

    const historyCount = await prisma.rsvp.count({ where: { name } });

    return { ok: true as const, historyCount, latestId: created.id };
  } catch (err: unknown) {
    console.error('RSVP submit failed', err);
    return { ok: false as const, error: 'Server error' };
  }
}
