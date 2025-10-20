export type Invite = {
  id: string;
  guestName: string;
  maxGuests?: number;
  dateISO: string;
  datePretty: string;
  venue: string;
  address: string;
  scheduleSummary: string;
  dressCode?: string;
};

// Updated RSVP type to match Prisma model fields used in UI
export type RSVP = {
  id?: string;
  name: string;
  status: 'yes' | 'no' | 'maybe';
  plusOne: boolean;
  email?: string | null;
  phone?: string | null;
  createdAt?: string;
  dietaryRestrictions?: string | null;
};
