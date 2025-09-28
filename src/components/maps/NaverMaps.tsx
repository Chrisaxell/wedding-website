"use client";

import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        naver?: any;
    }
}

type Props = {
    lat: number;
    lng: number;
    zoom?: number; // 5–20 (approx; Naver uses 0–21, 0 = far)
    title?: string;
    className?: string;
};

export default function NaverMap({ lat, lng, zoom = 16, title = "Location", className }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [loaded, setLoaded] = useState<boolean>(!!window.naver?.maps);

    useEffect(() => {
        if (loaded) return;

        const existing = document.querySelector<HTMLScriptElement>('script[data-naver-maps="1"]');
        if (existing) {
            existing.addEventListener("load", () => setLoaded(true), { once: true });
            return;
        }

        const clientId = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID!;
        const script = document.createElement("script");
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        script.async = true;
        script.defer = true;
        script.dataset.naverMaps = "1";
        script.onload = () => setLoaded(true);
        document.head.appendChild(script);
    }, [loaded]);

    useEffect(() => {
        if (!loaded || !containerRef.current || !window.naver?.maps) return;

        const { maps } = window.naver;
        const center = new maps.LatLng(lat, lng);

        const map = new maps.Map(containerRef.current, {
            center,
            zoom,
            zoomControl: true,
            zoomControlOptions: { position: maps.Position.TOP_RIGHT },
            mapDataControl: false,
        });

        new maps.Marker({
            position: center,
            map,
            title,
        });

        // optional: label bubble
        const info = new maps.InfoWindow({
            content: `<div style="padding:6px 10px;font-size:12px;">${title ?? "Location"}</div>`,
        });
        info.open(map, new maps.Marker({ position: center }));

        return () => {
            // Naver Maps doesn’t expose a destroy method; GC will clean up when element unmounts.
        };
    }, [loaded, lat, lng, zoom, title]);

    return (
        <div
            ref={containerRef}
            className={className ?? "w-full aspect-[4/3] rounded-xl border"}
            role="img"
            aria-label={`Naver Maps — ${title}`}
        />
    );
}
