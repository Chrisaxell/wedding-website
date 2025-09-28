// src/components/KakaoMap.tsx
"use client";

import React from "react";
import Script from "next/script";

declare global {
    interface Window {
        kakao?: any;
    }
}

type Props = {
    lat: number;
    lng: number;
    appKey?: string; // falls back to NEXT_PUBLIC_KAKAO_JS_KEY or VITE_KAKAO_JS_KEY
    level?: number; // zoom level (lower = closer), default 3
    marker?: boolean; // default true
    draggable?: boolean; // default true
    scrollwheel?: boolean; // default true
    showZoomControl?: boolean; // default true
    showMapTypeControl?: boolean; // default false
    className?: string;
    style?: React.CSSProperties;
    onReady?: (ctx: { kakao: any; map: any }) => void;
};

type State = { sdkReady: boolean };

const SDK_ID = "kakao-maps-sdk";
const READY_EVENT = "kakao-ready";

// Fire a global event once the SDK is ready (coexists across many instances)
function dispatchKakaoReady() {
    if (typeof window === "undefined") return;
    document.dispatchEvent(new Event(READY_EVENT));
}

export default class KakaoMap extends React.PureComponent<Props, State> {
    containerRef = React.createRef<HTMLDivElement>();
    map: any | null = null;
    defaultMarker: any | null = null;
    readyListener?: (e: Event) => void;

    state: State = { sdkReady: false };

    get appKey(): string {
        return (
            this.props.appKey ||
            (process as any)?.env?.NEXT_PUBLIC_KAKAO_JS_KEY ||
            (import.meta as any)?.env?.VITE_KAKAO_JS_KEY ||
            ""
        );
    }

    componentDidMount() {
        if (typeof window === "undefined") return;

        // If SDK is already present, we're ready
        if (window.kakao?.maps) {
            this.setState({ sdkReady: true }, () => this.initOrUpdateMap());
            return;
        }

        // Otherwise wait for our global ready event
        this.readyListener = () => {
            this.setState({ sdkReady: true }, () => this.initOrUpdateMap());
        };
        document.addEventListener(READY_EVENT, this.readyListener);
    }

    componentDidUpdate() {
        this.initOrUpdateMap();
    }

    componentWillUnmount() {
        if (this.readyListener) {
            document.removeEventListener(READY_EVENT, this.readyListener);
            this.readyListener = undefined;
        }
        if (this.defaultMarker) {
            try {
                this.defaultMarker.setMap(null);
            } catch {}
            this.defaultMarker = null;
        }
        this.map = null; // removing the DOM node is enough for Kakao
    }

    initOrUpdateMap() {
        const {
            lat,
            lng,
            level = 3,
            marker = true,
            draggable = true,
            scrollwheel = true,
            showZoomControl = true,
            showMapTypeControl = false,
            onReady,
        } = this.props;

        if (!this.state.sdkReady || !this.containerRef.current) return;
        const kakao = window.kakao;
        if (!kakao?.maps) return;

        const center = new kakao.maps.LatLng(lat, lng);

        if (!this.map) {
            // create map
            this.map = new kakao.maps.Map(this.containerRef.current, {
                center,
                level,
                draggable,
                scrollwheel,
            });

            // controls
            if (showZoomControl) {
                const z = new kakao.maps.ZoomControl();
                this.map.addControl(z, kakao.maps.ControlPosition.RIGHT);
            }
            if (showMapTypeControl) {
                const t = new kakao.maps.MapTypeControl();
                this.map.addControl(t, kakao.maps.ControlPosition.TOPRIGHT);
            }

            // default marker
            if (marker) {
                this.defaultMarker = new kakao.maps.Marker({ position: center, map: this.map });
            }

            onReady?.({ kakao, map: this.map });
            return;
        }

        // update existing map
        this.map.setCenter(center);
        this.map.setLevel(level);
        this.map.setDraggable(draggable);
        this.map.setZoomable(scrollwheel);

        if (marker) {
            if (!this.defaultMarker) {
                this.defaultMarker = new kakao.maps.Marker({ position: center, map: this.map });
            } else {
                this.defaultMarker.setPosition(center);
                this.defaultMarker.setMap(this.map);
            }
        } else if (this.defaultMarker) {
            this.defaultMarker.setMap(null);
            this.defaultMarker = null;
        }
    }

    render() {
        const { className, style } = this.props;
        const appKey = this.appKey;

        return (
            <div style={{ width: "100%", height: 400, ...style }} className={className}>
                {/* Load SDK once. Using a stable id prevents duplicates. */}
                {appKey && (
                    <Script
                        id={SDK_ID}
                        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
                            appKey
                        )}&autoload=false`}
                        strategy="afterInteractive"
                        onReady={() => {
                            try {
                                // Initialize Kakao and notify all listeners
                                window.kakao?.maps?.load
                                    ? window.kakao.maps.load(() => dispatchKakaoReady())
                                    : dispatchKakaoReady();
                            } catch {
                                // let initOrUpdateMap handle absence
                            }
                        }}
                    />
                )}
                <div ref={this.containerRef} style={{ width: "100%", height: "100%" }} />
                {!appKey && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 12,
                            fontSize: 14,
                        }}
                    >
                        Missing Kakao JavaScript key. Pass <code>appKey</code> or set{" "}
                        <code>NEXT_PUBLIC_KAKAO_JS_KEY</code>.
                    </div>
                )}
            </div>
        );
    }
}
