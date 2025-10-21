'use client';

import { useState, useTransition } from 'react';
import { submitRSVP } from '@/actions/rsvp';

export default function RSVPForm({ inviteId }: { inviteId?: string }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        start(async () => {
          setError(null);
          const res = await submitRSVP(fd);
          if (!res.ok) {
            setError(res.error || 'Error');
          } else {
            setMessage('RSVP submitted!');
            form.reset();
          }
        });
      }}
      className="grid max-w-sm gap-3"
    >
      {inviteId && <input type="hidden" name="inviteId" value={inviteId} />}
      <label className="grid gap-1 text-sm">
        Name
        <input name="name" required placeholder="Your name" className="rounded border px-2 py-1" />
      </label>
      <label className="grid gap-1 text-sm">
        Email
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          className="rounded border px-2 py-1"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Phone
        <input
          name="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          className="rounded border px-2 py-1"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Dietary restrictions / allergies
        <input
          name="dietaryRestrictions"
          placeholder="vegetarian, gluten-free, nut allergy"
          className="rounded border px-2 py-1"
          maxLength={500}
        />
      </label>
      <div className="flex items-center gap-2 text-sm"></div>
      <fieldset className="grid gap-2 text-sm">
        <legend className="font-medium">Attendance</legend>
        <div className="flex gap-2">
          {['yes', 'maybe', 'no'].map((s) => (
            <label key={s} className="flex items-center gap-1">
              <input type="radio" name="status" value={s} defaultChecked={s === 'yes'} /> {s}
            </label>
          ))}
        </div>
      </fieldset>
      <button
        disabled={pending}
        type="submit"
        className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Submitting…' : 'Send RSVP'}
      </button>
      <p className="text-xs text-zinc-500">
        Provide at least email or phone so we can send updates.
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {message && <p className="text-xs text-green-600">{message}</p>}
    </form>
  );
}
