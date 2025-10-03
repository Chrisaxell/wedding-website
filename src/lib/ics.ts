// Simple reusable ICS generation utilities (client-safe)
// Can be extended with more fields (alarms, organizer, etc.) later.
export interface CalendarEvent {
  uid?: string;
  title: string;
  description?: string;
  start: Date; // Local date object (will convert to UTC)
  end: Date; // Local date object (will convert to UTC)
  location?: string;
  latitude?: number;
  longitude?: number;
  productId?: string; // PRODID override
}

function formatDateUTC(d: Date) {
  // toISOString gives YYYY-MM-DDTHH:mm:ss.sssZ -> strip punctuation and ms
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function buildICS(event: CalendarEvent): string {
  const {
    uid,
    title,
    description = '',
    start,
    end,
    location,
    latitude,
    longitude,
    productId = '-//Wedding Website//ICS Export//EN',
  } = event;

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${productId}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid || `${formatDateUTC(start)}-${Math.random().toString(36).slice(2)}@event.local`}`,
    `DTSTAMP:${formatDateUTC(new Date())}`,
    `DTSTART:${formatDateUTC(start)}`,
    `DTEND:${formatDateUTC(end)}`,
    `SUMMARY:${escapeText(title)}`,
  ];

  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`);
  if (location) {
    const locExtra = latitude != null && longitude != null ? ` (${latitude}, ${longitude})` : '';
    lines.push(`LOCATION:${escapeText(location + locExtra)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICSFile(event: CalendarEvent, fileName: string) {
  const ics = buildICS(event);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 0);
}

function escapeText(input: string) {
  // Escape commas, semicolons, and newlines per RFC 5545
  return input
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}
