'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  lat: number;
  lng: number;
  title?: string;
  className?: string;
  venueName?: string;
};

declare global {
  interface Window {
    kakao?: any;
  }
}

export default function KakaoMap({ lat, lng, title = 'Location', venueName, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAPS_APP_KEY;

  useEffect(() => {
    if (!appKey) return;
    if (typeof window === 'undefined') return;

    function createMap() {
      const kakao = window.kakao;
      if (!kakao?.maps) return;
      const center = new kakao.maps.LatLng(lat, lng);
      const map = new kakao.maps.Map(ref.current!, { center, level: 4 }); // level ~ zoom
      // Remove zoom / other controls (not added by default unless created)
      const marker = new kakao.maps.Marker({ position: center });
      marker.setMap(map);
      setReady(true);
    }

    if (window.kakao?.maps) {
      createMap();
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-maps-sdk';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(createMap);
    };
    document.head.appendChild(script);
  }, [appKey, lat, lng]);

  if (!appKey) {
    return (
      <div
        className={
          className ??
          'flex aspect-[4/3] w-full items-center justify-center rounded-xl border text-sm text-zinc-500'
        }
      >
        Kakao Maps app key missing
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
