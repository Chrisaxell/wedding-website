'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  lat: number;
  lng: number;
  zoom?: number; // 5–20
  title?: string;
  className?: string;
};

export default function GoogleMap({ lat, lng, zoom = 16, title = 'Location', className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) return; // no key -> skip
    if (typeof window === 'undefined') return;

    function init() {
      // @ts-expect-error - Google Maps API is loaded dynamically
      const google = window.google;
      if (!google?.maps) return;
      const center = { lat, lng };
      const map = new google.maps.Map(ref.current!, {
        center,
        zoom,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        mapTypeControl: false,
      });
      new google.maps.Marker({ position: center, map, title });
      setReady(true);
    }

    // If script already present just init
    if (document.getElementById('google-maps-sdk')) {
      init();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-sdk';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.head.appendChild(script);
  }, [apiKey, lat, lng, zoom, title]);

  if (!apiKey) {
    return (
      <div
        className={
          className ??
          'flex aspect-[4/3] w-full items-center justify-center rounded-xl border text-sm text-zinc-500'
        }
      >
        Google Maps API key missing
      </div>
    );
  }

  return (
    <div className={className ?? 'relative aspect-[4/3] w-full rounded-xl border'}>
      <div ref={ref} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500">
          Loading map…
        </div>
      )}
    </div>
  );
}
