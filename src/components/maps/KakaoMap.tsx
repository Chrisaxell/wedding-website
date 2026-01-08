'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
    lat: number;
    lng: number;
    className?: string;
    zoom?: number; // Kakao uses "level" where higher = more zoomed out
    title?: string;
};

declare global {
    interface Window {
        kakao?: {
            maps: {
                LatLng: new (lat: number, lng: number) => unknown;
                Map: new (container: HTMLElement, options: unknown) => unknown;
                Marker: new (options: unknown) => { setMap: (map: unknown) => void };
                InfoWindow: new (options: { content?: string; removable?: boolean }) => {
                    open: (map: unknown, marker?: unknown) => void;
                    close?: () => void;
                };
                event: {
                    addListener: (target: unknown, eventName: string, handler: (...args: unknown[]) => void) => void;
                };
                load: (callback: () => void) => void;
            };
        };
    }
}

export default function KakaoMap({ lat, lng, className, zoom = 4, title }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);
    const mapInstanceRef = useRef<unknown>(null);
    const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

    useEffect(() => {
        if (!appKey) {
            setError(true);
            return;
        }
        if (typeof window === 'undefined') return;
        if (!ref.current) return;

        function createMap() {
            try {
                const kakao = window.kakao;
                if (!kakao?.maps) {
                    setError(true);
                    return;
                }

                // Clean up existing map instance if it exists
                if (mapInstanceRef.current) {
                    mapInstanceRef.current = null;
                }

                const center = new kakao.maps.LatLng(lat, lng);
                const mapContainer = ref.current;

                if (!mapContainer) return;

                const mapOption = {
                    center: center,
                    level: zoom, // zoom level
                };

                const map = new kakao.maps.Map(mapContainer, mapOption);
                mapInstanceRef.current = map;

                // Add marker
                const markerPosition = new kakao.maps.LatLng(lat, lng);
                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                });
                marker.setMap(map);

                // If a title is provided, show an info window above the marker
                if (typeof title === 'string' && title.trim()) {
                    try {
                        const infowindow = new kakao.maps.InfoWindow({
                            content: `<div style="padding:6px 8px;font-size:12px">${title}</div>`,
                            removable: false,
                        });
                        infowindow.open(map, marker);

                        // Optional: open/close on marker click
                        kakao.maps.event.addListener(marker, 'click', () => {
                            infowindow.open(map, marker);
                        });
                    } catch (err) {
                        // ignore if InfoWindow API differs; still fine without title
                        console.warn('Kakao InfoWindow error', err);
                    }
                }

                setReady(true);
                setError(false);
            } catch (err) {
                console.error('Kakao Map Error:', err);
                setError(true);
            }
        }

        // Check if Kakao Maps is already loaded
        if (window.kakao?.maps) {
            // Small delay to ensure DOM is ready
            const timeoutId = setTimeout(createMap, 100);
            return () => clearTimeout(timeoutId);
        }

        // Check if script is already being loaded
        const existingScript = document.getElementById('kakao-maps-sdk');
        if (existingScript) {
            // Wait for it to load
            const checkInterval = setInterval(() => {
                if (window.kakao?.maps) {
                    clearInterval(checkInterval);
                    createMap();
                }
            }, 100);

            return () => clearInterval(checkInterval);
        }

        // Load the script
        const script = document.createElement('script');
        script.id = 'kakao-maps-sdk';
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (window.kakao?.maps) {
                window.kakao.maps.load(createMap);
            }
        };

        script.onerror = () => {
            console.error('Failed to load Kakao Maps script');
            setError(true);
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup on unmount
            if (mapInstanceRef.current) {
                mapInstanceRef.current = null;
            }
        };
    }, [appKey, lat, lng, zoom, title]);

    if (!appKey || error) {
        return (
            <div
                className={
                    className ??
                    'flex aspect-[4/3] w-full items-center justify-center rounded-xl border text-sm text-zinc-500'
                }
            >
                {!appKey ? 'Kakao Maps app key missing' : 'Failed to load Kakao Map'}
            </div>
        );
    }

    return (
        <div className={className ?? 'relative aspect-[4/3] w-full rounded-xl border'}>
            <div ref={ref} className="absolute inset-0 rounded-xl" />
            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500">
                    Loading map…
                </div>
            )}
        </div>
    );
}
