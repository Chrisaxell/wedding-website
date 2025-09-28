import { Invite, RSVP } from '@/types';

const invites = new Map<string, Invite>([
  [
    '11111111-1111-1111-1111-111111111111',
    {
      id: '11111111-1111-1111-1111-111111111111',
      guestName: 'Chris',
      maxGuests: 2,
      dateISO: '2026-03-29',
      datePretty: 'March 29, 2026',
      venue: 'Busan Hanok Garden',
      address: '123 Hanok-ro, Busan',
      scheduleSummary: 'Ceremony 13:00 → Photos → Dinner 17:00',
      dressCode: 'Semi-formal',
    },
  ],
]);

const rsvps = new Map<string, RSVP[]>();

export async function getInviteById(id: string): Promise<Invite | null> {
  // In production, fetch from your DB
  return invites.get(id) ?? null;
}

export async function saveRSVP(inviteId: string, rsvp: RSVP): Promise<void> {
  const list = rsvps.get(inviteId) ?? [];
  list.push({ ...rsvp, createdAt: new Date().toISOString() });
  rsvps.set(inviteId, list);
  // Replace with DB write
  console.log('RSVP Saved', inviteId, rsvp);
}

// (Optional) helper to fetch RSVPs for admin views
export async function getRSVPs(inviteId: string): Promise<RSVP[]> {
  return rsvps.get(inviteId) ?? [];
}
