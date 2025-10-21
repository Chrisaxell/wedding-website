// Global wedding event constants for easy centralized updates
// Adjust date/time, venue, and coordinates here as needed.
export const WEDDING_EVENT = {
  coupleB: 'Christian Axell',
  coupleA: 'JeongHee Hong',
  // Event start (local Korea time UTC+9)
  dateISO: '2026-03-28T12:00:00+09:00',
  // Approximate end time (4h after start)
  endDateISO: '2026-03-28T16:00:00+09:00',
  foodTime: '13:30',
  venueName: 'Hanok Hwaje', // corrected spelling per user request
  venueAddress: 'Busan, South Korea', // updated location with city and country
  venueLat: 35.36410463760984,
  venueLng: 128.99068710998083,
  timezone: 'Asia/Seoul',
  heroImage: '/images/gallery photos/16 완(볼 제거 + 택 제거)-3.jpg',
  outroImage: '/images/gallery photos/21 완-3.jpg',
  musicUrl: '/music/Time (from Inception) _ Hans Zimmer _ Jacobs Piano.mp3', // Hans Zimmer - Time from Inception
};

export type WeddingEvent = typeof WEDDING_EVENT;
