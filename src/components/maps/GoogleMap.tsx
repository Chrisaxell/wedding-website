'use client';

type Props = {
  lat: number;
  lng: number;
  zoom?: number; // 5–20
  title?: string;
  className?: string;
};

export default function GoogleMap({ lat, lng, zoom = 16, title = 'Location', className }: Props) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  // Place mode centers the map at lat,lng; no Places ID needed.
  const src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${lat},${lng}&zoom=${zoom}`;
  return (
    <iframe
      title={`Google Maps — ${title}`}
      aria-label={`Google Maps — ${title}`}
      className={className ?? 'aspect-[4/3] w-full rounded-xl border'}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={src}
    />
  );
}
