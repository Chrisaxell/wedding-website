'use server';
import { prisma } from '@/lib/prisma';
import { setCookie } from '@/lib/cookies';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { sendConfirmationEmail } from '@/lib/email';

const rsvpSchema = z.union([z.literal('yes'), z.literal('no'), z.literal('maybe')]);

export async function submitRSVP(formData: FormData) {
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    // numberOfPeople now determines whether a guest brings a +1
    const numberOfPeopleRaw = String(formData.get('numberOfPeople') ?? '1').trim();
    const parsedNum = parseInt(numberOfPeopleRaw, 10);
    const numberOfPeople = Number.isFinite(parsedNum) && parsedNum >= 1 ? parsedNum : 1;
    const plusOne = numberOfPeople > 1;
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

        // Send a tailored confirmation email if an email address was provided.
        if (email) {
            // Fire-and-forget but await so that any internal logging happens before returning.
            // The email helper catches and logs errors, so this won't throw.
            await sendConfirmationEmail({ to: email, name, status });
        }

        return { ok: true as const, historyCount, latestId: created.id };
    } catch (err: unknown) {
        console.error('RSVP submit failed', err);
        return { ok: false as const, error: 'Server error' };
    }
}
