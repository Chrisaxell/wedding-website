'use client';

import { useState, useTransition } from 'react';
import { submitRSVP } from '@/actions/rsvp';

export default function RSVPForm({ inviteId, maxGuests }: { inviteId: string; maxGuests: number }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        start(async () => {
          const res = await submitRSVP(formData);
          setMessage(res ? 'Thanks! Your RSVP was recorded.' : (res ?? 'Something went wrong.'));
          if (res) form.reset();
        });
      }}
      style={{ display: 'grid', gap: 12, maxWidth: 480 }}
    >
      <input type="hidden" name="inviteId" value={inviteId} />
      <label>
        Your name
        <input name="name" required placeholder="Full name" />
      </label>

      <fieldset>
        <legend>Will you attend?</legend>
        <label>
          <input type="radio" name="attending" value="yes" defaultChecked /> Yes
        </label>{' '}
        <label>
          <input type="radio" name="attending" value="no" /> No
        </label>
      </fieldset>

      <label>
        Number of guests (incl. you)
        <input name="guests" type="number" min={0} max={maxGuests} defaultValue={1} required />
      </label>

      <label>
        Note / allergies
        <textarea name="note" rows={3} placeholder="Anything we should know?" />
      </label>

      <button disabled={pending} type="submit">
        {pending ? 'Submitting…' : 'Send RSVP'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
