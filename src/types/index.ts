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

export type RSVP = {
  name: string;
  attending: boolean;
  guests: number;
  note?: string;
  createdAt?: string;
};
