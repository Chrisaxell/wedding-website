// src/components/WeddingCard.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ---------- Minimal Kakao typings ----------
declare global {
    interface Window {
        kakao?: any;
    }
}

// ---------- Types ----------
export type BankAccount = {
    bank: string;
    owner: string;
    number: string;
    note?: string;
};

export type GalleryImage = {
    src: string; // local / CDN url
    alt?: string;
};

export type ScheduleItem = {
    time: string; // "13:00"
    title: string; // "Ceremony"
    desc?: string;
    icon?: string; // emoji or small text
};

export type Contact = {
    label: string;
    tel?: string; // tel:+47...
    sms?: string; // sms:+47...?&body=
    kakaoId?: string; // will show text
};

export type WeddingCardProps = {
    // Basics
    coupleA: string;
    coupleB: string;
    dateISO: string; // "2026-03-29T14:00:00+09:00"
    venueName: string;
    venueAddress: string;
    // Map
    lat: number;
    lng: number;
    kakaoJsKey?: string; // or NEXT_PUBLIC_KAKAO_JS_KEY
    // Media & theme
    coverImage?: string;
    coverImageAlt?: string;
    images?: GalleryImage[];
    musicUrl?: string; // optional background music (mp3)
    // Sections
    schedule?: ScheduleItem[];
    groomAccount?: BankAccount;
    brideAccount?: BankAccount;
    contacts?: Contact[]; // e.g. [{label:"Groom", tel:"tel:+47..."}]
    // RSVP
    rsvpUrl?: string; // external form link or in-app route
    // Language
    defaultLang?: "en" | "ko";
    // Other
    linkToShare?: string; // canonical page link (defaults to window.location.href)
};

// ---------- Helpers ----------
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function buildICS(opts: {
    title: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
}): string {
    const fmt = (d: Date) =>
        d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z"); // UTC Zulu

    const uid = `${Math.random().toString(36).slice(2)}@weddingcard.local`;
    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//WeddingCard//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(opts.start)}`,
        `DTEND:${fmt(opts.end)}`,
        `SUMMARY:${escapeICS(opts.title)}`,
        `DESCRIPTION:${escapeICS(opts.description)}`,
        `LOCATION:${escapeICS(opts.location)}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");
}
function escapeICS(s: string) {
    return s.replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

function formatWhen(d: Date, lang: "en" | "ko") {
    if (lang === "ko") {
        const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
        return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekday}) ${pad(
            d.getHours()
        )}:${pad(d.getMinutes())}`;
    }
    return new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}

function diffTime(to: Date) {
    const now = new Date();
    const diff = Math.max(0, to.getTime() - now.getTime());
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { d, h, m, s };
}

// ---------- Kakao Map Loader ----------
let kakaoLoadPromise: Promise<any> | null = null;
function loadKakao(appKey: string): Promise<any> {
    if (typeof window === "undefined") return Promise.reject(new Error("No window"));
    if (window.kakao?.maps) return Promise.resolve(window.kakao);
    if (kakaoLoadPromise) return kakaoLoadPromise;

    kakaoLoadPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[data-kakao="true"]');
        if (existing) {
            existing.addEventListener("load", () => resolve(window.kakao));
            existing.addEventListener("error", () => reject(new Error("Failed to load Kakao SDK")));
            return;
        }
        const s = document.createElement("script");
        s.async = true;
        s.defer = true;
        s.dataset.kakao = "true";
        s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
        s.onload = () => {
            try {
                window.kakao.maps.load(() => resolve(window.kakao));
            } catch (e) {
                reject(e);
            }
        };
        s.onerror = () => reject(new Error("Failed to load Kakao SDK"));
        document.head.appendChild(s);
    });
    return kakaoLoadPromise;
}

// ---------- Main Component ----------
const WeddingCard: React.FC<WeddingCardProps> = ({
                                                     coupleA,
                                                     coupleB,
                                                     dateISO,
                                                     venueName,
                                                     venueAddress,
                                                     lat,
                                                     lng,
                                                     kakaoJsKey,
                                                     coverImage,
                                                     coverImageAlt = "Wedding cover",
                                                     images = [],
                                                     musicUrl,
                                                     schedule = [],
                                                     groomAccount,
                                                     brideAccount,
                                                     contacts = [],
                                                     rsvpUrl,
                                                     defaultLang = "en",
                                                     linkToShare,
                                                 }) => {
    const [lang, setLang] = useState<"en" | "ko">(defaultLang);
    const eventStart = useMemo(() => new Date(dateISO), [dateISO]);
    const eventEnd = useMemo(() => new Date(new Date(dateISO).getTime() + 2 * 60 * 60 * 1000), [dateISO]);

    // Countdown
    const [countdown, setCountdown] = useState(diffTime(eventStart));
    useEffect(() => {
        const id = setInterval(() => setCountdown(diffTime(eventStart)), 1000);
        return () => clearInterval(id);
    }, [eventStart]);

    // Music
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [musicOn, setMusicOn] = useState(false);
    useEffect(() => {
        if (!audioRef.current) return;
        if (musicOn) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }, [musicOn]);

    // Share
    const shareHref = useMemo(
        () => linkToShare || (typeof window !== "undefined" ? window.location.href : ""),
        [linkToShare]
    );
    const doShare = useCallback(async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${coupleA} ♥ ${coupleB} — ${venueName}`,
                    text: lang === "ko" ? "우리 결혼식에 초대합니다." : "You’re invited to our wedding.",
                    url: shareHref,
                });
            } else {
                await navigator.clipboard.writeText(shareHref);
                alert(lang === "ko" ? "링크가 복사되었습니다." : "Link copied to clipboard.");
            }
        } catch {
            /* ignore */
        }
    }, [shareHref, coupleA, coupleB, venueName, lang]);

    // Add to calendar
    const downloadICS = useCallback(() => {
        const ics = buildICS({
            title: `${coupleA} ♥ ${coupleB} — Wedding`,
            description:
                lang === "ko"
                    ? `함께해 주셔서 감사합니다.\n장소: ${venueName}\n주소: ${venueAddress}`
                    : `We’re excited to celebrate with you.\nVenue: ${venueName}\nAddress: ${venueAddress}`,
            location: `${venueName}, ${venueAddress}`,
            start: eventStart,
            end: eventEnd,
        });
        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wedding.ics";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }, [coupleA, coupleB, venueName, venueAddress, eventStart, eventEnd, lang]);

    // Map
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapObj = useRef<any | null>(null);
    const markerRef = useRef<any | null>(null);
    useEffect(() => {
        const key =
            kakaoJsKey ||
            (process as any)?.env?.NEXT_PUBLIC_KAKAO_JS_KEY ||
            (import.meta as any)?.env?.VITE_KAKAO_JS_KEY ||
            "";
        if (!key || typeof window === "undefined") return;

        let cancelled = false;
        loadKakao(key)
            .then((kakao) => {
                if (cancelled || !mapRef.current) return;
                const center = new kakao.maps.LatLng(lat, lng);
                if (!mapObj.current) {
                    mapObj.current = new kakao.maps.Map(mapRef.current, {
                        center,
                        level: 3,
                        draggable: true,
                        scrollwheel: true,
                    });
                    const z = new kakao.maps.ZoomControl();
                    mapObj.current.addControl(z, kakao.maps.ControlPosition.RIGHT);
                } else {
                    mapObj.current.setCenter(center);
                }
                if (!markerRef.current) {
                    markerRef.current = new kakao.maps.Marker({ position: center, map: mapObj.current });
                } else {
                    markerRef.current.setPosition(center);
                    markerRef.current.setMap(mapObj.current);
                }
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [lat, lng, kakaoJsKey]);

    // Lightbox
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    // Guestbook (local only)
    const [guestName, setGuestName] = useState("");
    const [guestMsg, setGuestMsg] = useState("");
    const [guestbook, setGuestbook] = useState<{ name: string; msg: string; ts: number }[]>([]);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("wedding_guestbook");
        if (raw) setGuestbook(JSON.parse(raw));
    }, []);
    const addGuestMsg = useCallback(() => {
        if (!guestName || !guestMsg) return;
        const entry = { name: guestName, msg: guestMsg, ts: Date.now() };
        const next = [entry, ...guestbook].slice(0, 100);
        setGuestbook(next);
        setGuestName("");
        setGuestMsg("");
        if (typeof window !== "undefined") {
            localStorage.setItem("wedding_guestbook", JSON.stringify(next));
        }
    }, [guestName, guestMsg, guestbook]);

    // UI strings
    const t = useMemo(() => {
        if (lang === "ko") {
            return {
                invite: "결혼식에 초대합니다",
                when: "오시는 길",
                schedule: "순서",
                rsvp: "RSVP",
                share: "공유하기",
                addCal: "캘린더에 추가",
                gallery: "갤러리",
                accounts: "마음 전하실 곳",
                groom: "신랑측",
                bride: "신부측",
                copy: "복사",
                copied: "복사되었습니다.",
                contact: "연락처",
                guestbookTitle: "방명록",
                guestbookName: "이름",
                guestbookMsg: "메시지",
                guestbookSubmit: "남기기",
                days: "일",
                hours: "시간",
                mins: "분",
                secs: "초",
            };
        }
        return {
            invite: "You’re invited",
            when: "Directions",
            schedule: "Schedule",
            rsvp: "RSVP",
            share: "Share",
            addCal: "Add to calendar",
            gallery: "Gallery",
            accounts: "Gifts / Banking",
            groom: "For Groom",
            bride: "For Bride",
            copy: "Copy",
            copied: "Copied!",
            contact: "Contacts",
            guestbookTitle: "Guestbook",
            guestbookName: "Name",
            guestbookMsg: "Message",
            guestbookSubmit: "Send",
            days: "days",
            hours: "hours",
            mins: "mins",
            secs: "secs",
        };
    }, [lang]);

    const copyText = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text);
                alert(t.copied);
            } catch {}
        },
        [t.copied]
    );

    return (
        <div style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto", color: "#111" }}>
            {/* HERO */}
            <section
                style={{
                    position: "relative",
                    minHeight: 480,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    overflow: "hidden",
                    borderRadius: 16,
                }}
            >
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={coverImageAlt}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "brightness(0.7)",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(120deg, rgba(255,182,193,.6), rgba(224,242,241,.6)), url('data:image/svg+xml;charset=UTF-8,%3Csvg width%3D%27100%25%27 height%3D%27100%25%27 xmlns%3D%27http://www.w3.org/2000/svg%27%3E%3C/svg%3E')",
                        }}
                    />
                )}

                <div style={{ position: "relative", padding: 24 }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
                        <button
                            aria-label="EN"
                            onClick={() => setLang("en")}
                            style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                border: "1px solid #fff",
                                background: lang === "en" ? "#fff" : "transparent",
                                color: lang === "en" ? "#111" : "#fff",
                                fontSize: 12,
                            }}
                        >
                            EN
                        </button>
                        <button
                            aria-label="KO"
                            onClick={() => setLang("ko")}
                            style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                border: "1px solid #fff",
                                background: lang === "ko" ? "#fff" : "transparent",
                                color: lang === "ko" ? "#111" : "#fff",
                                fontSize: 12,
                            }}
                        >
                            KO
                        </button>
                    </div>

                    <h1 style={{ color: "#fff", fontWeight: 700, fontSize: 40, letterSpacing: 1 }}>
                        {coupleA} <span style={{ opacity: 0.9 }}>♥</span> {coupleB}
                    </h1>
                    <p style={{ color: "#fff", opacity: 0.95, fontSize: 16, marginTop: 8 }}>{t.invite}</p>
                    <p style={{ color: "#fff", opacity: 0.95, fontSize: 14, marginTop: 6 }}>
                        {formatWhen(eventStart, lang)} · {venueName}
                    </p>

                    {/* Countdown */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
                        {[
                            { v: countdown.d, l: t.days },
                            { v: countdown.h, l: t.hours },
                            { v: countdown.m, l: t.mins },
                            { v: countdown.s, l: t.secs },
                        ].map((c, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "rgba(255,255,255,.9)",
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    minWidth: 64,
                                }}
                            >
                                <div style={{ fontWeight: 700, fontSize: 20, textAlign: "center" }}>{c.v}</div>
                                <div style={{ fontSize: 12, opacity: 0.7, textAlign: "center" }}>{c.l}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        {rsvpUrl && (
                            <a
                                href={rsvpUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    background: "#111",
                                    color: "#fff",
                                    padding: "10px 16px",
                                    borderRadius: 999,
                                    textDecoration: "none",
                                    fontWeight: 600,
                                }}
                            >
                                {t.rsvp}
                            </a>
                        )}
                        <button
                            onClick={doShare}
                            style={{
                                background: "#fff",
                                color: "#111",
                                padding: "10px 16px",
                                borderRadius: 999,
                                fontWeight: 600,
                                border: "1px solid #eee",
                            }}
                        >
                            {t.share}
                        </button>
                        <button
                            onClick={downloadICS}
                            style={{
                                background: "#fff",
                                color: "#111",
                                padding: "10px 16px",
                                borderRadius: 999,
                                fontWeight: 600,
                                border: "1px solid #eee",
                            }}
                        >
                            {t.addCal}
                        </button>
                        {!!musicUrl && (
                            <button
                                onClick={() => setMusicOn((v) => !v)}
                                style={{
                                    background: musicOn ? "#111" : "#fff",
                                    color: musicOn ? "#fff" : "#111",
                                    padding: "10px 16px",
                                    borderRadius: 999,
                                    fontWeight: 600,
                                    border: "1px solid #eee",
                                }}
                            >
                                {musicOn ? "Pause Music" : "Play Music"}
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Music (optional) */}
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="none" style={{ display: "none" }} aria-hidden />}

            {/* MAP + ADDRESS */}
            <section style={{ marginTop: 28 }}>
                <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{t.when}</h2>
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
                    <strong>{venueName}</strong>
                    <div>{venueAddress}</div>
                </div>
                <div
                    ref={mapRef}
                    style={{ width: "100%", height: 280, borderRadius: 12, border: "1px solid #eee", overflow: "hidden" }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <a
                        href={`https://map.kakao.com/?q=${encodeURIComponent(
                            venueName
                        )}&urlLevel=3&map_type=TYPE_MAP&target=car&rt=%2C%2C${lat},${lng}`}
                        target="_blank"
                        rel="noreferrer"
                        style={btnGhost}
                    >
                        Kakao Map
                    </a>
                    {/* FIXED: removed stray backtick */}
                    <a href="https://naver.me/x90" target="_blank" rel="noreferrer" style={btnGhost}>
                        Naver (open app)
                    </a>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${venueName} ${venueAddress}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        style={btnGhost}
                    >
                        Google Maps
                    </a>
                </div>
            </section>

            {/* SCHEDULE */}
            {!!schedule.length && (
                <section style={{ marginTop: 28 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{t.schedule}</h2>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {schedule.map((it, idx) => (
                            <li
                                key={`${it.time}-${idx}`}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "80px 1fr",
                                    gap: 12,
                                    padding: "12px 0",
                                    borderBottom: "1px dashed #eee",
                                }}
                            >
                                <div style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{it.time}</div>
                                <div>
                                    <div style={{ fontWeight: 600 }}>
                                        {it.icon ? <span style={{ marginRight: 6 }}>{it.icon}</span> : null}
                                        {it.title}
                                    </div>
                                    {it.desc && <div style={{ fontSize: 14, opacity: 0.8, marginTop: 2 }}>{it.desc}</div>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* GALLERY */}
            {!!images.length && (
                <section style={{ marginTop: 28 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{t.gallery}</h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))",
                            gap: 8,
                        }}
                    >
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setLightboxIdx(i)}
                                style={{
                                    border: "none",
                                    padding: 0,
                                    background: "none",
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    cursor: "zoom-in",
                                }}
                                aria-label={`open image ${i + 1}`}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt || ""}
                                    style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                                />
                            </button>
                        ))}
                    </div>

                    {lightboxIdx !== null && images[lightboxIdx] && (
                        <div
                            onClick={() => setLightboxIdx(null)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,.85)",
                                display: "grid",
                                placeItems: "center",
                                zIndex: 50,
                                padding: 16,
                                cursor: "zoom-out",
                            }}
                            aria-modal
                            role="dialog"
                        >
                            <img
                                src={images[lightboxIdx].src}
                                alt={images[lightboxIdx].alt || ""}
                                style={{ maxWidth: "94vw", maxHeight: "86vh", objectFit: "contain" }}
                            />
                            <div style={{ position: "absolute", top: 12, right: 12 }}>
                                <button onClick={(e) => (e.stopPropagation(), setLightboxIdx(null))} style={btnLight}>
                                    ✕
                                </button>
                            </div>
                            <div style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)" }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIdx((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));
                                    }}
                                    style={btnLight}
                                >
                                    ‹
                                </button>
                            </div>
                            <div style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)" }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIdx((i) => (i === null ? 0 : (i + 1) % images.length));
                                    }}
                                    style={btnLight}
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ACCOUNTS */}
            {(groomAccount || brideAccount) && (
                <section style={{ marginTop: 28 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{t.accounts}</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        {groomAccount && <AccountCard t={t} title={t.groom} acct={groomAccount} onCopy={copyText} />}
                        {brideAccount && <AccountCard t={t} title={t.bride} acct={brideAccount} onCopy={copyText} />}
                    </div>
                </section>
            )}

            {/* CONTACTS */}
            {!!contacts.length && (
                <section style={{ marginTop: 28 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{t.contact}</h2>
                    <div style={{ display: "grid", gap: 10 }}>
                        {contacts.map((c, i) => (
                            <div
                                key={i}
                                style={{
                                    border: "1px solid #eee",
                                    padding: 12,
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    justifyContent: "space-between",
                                }}
                            >
                                <div style={{ fontWeight: 600 }}>{c.label}</div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {c.tel && (
                                        <a href={c.tel} style={chip}>
                                            📞 Call
                                        </a>
                                    )}
                                    {c.sms && (
                                        <a href={c.sms} style={chip}>
                                            💬 SMS
                                        </a>
                                    )}
                                    {c.kakaoId && <span style={chip}>💛 Kakao: {c.kakaoId}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* GUESTBOOK (local only) */}
            <section style={{ marginTop: 28, marginBottom: 96 }}>
                <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{t.guestbookTitle}</h2>
                <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                    <input
                        placeholder={t.guestbookName}
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        style={input}
                    />
                    <textarea
                        placeholder={t.guestbookMsg}
                        value={guestMsg}
                        onChange={(e) => setGuestMsg(e.target.value)}
                        rows={3}
                        style={textarea}
                    />
                    <button onClick={addGuestMsg} style={btnPrimary}>
                        {t.guestbookSubmit}
                    </button>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                    {guestbook.map((g, i) => (
                        <div key={g.ts + "-" + i} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                            <div style={{ fontWeight: 700 }}>{g.name}</div>
                            <div style={{ fontSize: 14, marginTop: 4, whiteSpace: "pre-wrap" }}>{g.msg}</div>
                            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{new Date(g.ts).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sticky bottom bar */}
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(255,255,255,.95)",
                    borderTop: "1px solid #eee",
                    display: "flex",
                    gap: 12,
                    padding: 12,
                    justifyContent: "center",
                    zIndex: 40,
                    backdropFilter: "saturate(180%) blur(10px)",
                }}
            >
                {rsvpUrl && (
                    <a href={rsvpUrl} target="_blank" rel="noreferrer" style={btnPrimary}>
                        {t.rsvp}
                    </a>
                )}
                <button onClick={doShare} style={btnGhost}>
                    {t.share}
                </button>
                <button onClick={downloadICS} style={btnGhost}>
                    {t.addCal}
                </button>
                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        `${venueName} ${venueAddress}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={btnGhost}
                >
                    🚗 Start Route
                </a>
            </div>
        </div>
    );
};

// ---------- Small subcomponents / styles ----------
const btnPrimary: React.CSSProperties = {
    background: "#111",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 700,
    border: "1px solid #111",
};

const btnGhost: React.CSSProperties = {
    background: "#fff",
    color: "#111",
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 700,
    border: "1px solid #eee",
    textDecoration: "none",
};

const btnLight: React.CSSProperties = {
    background: "rgba(255,255,255,.9)",
    color: "#111",
    padding: "8px 12px",
    borderRadius: 12,
    fontWeight: 700,
    border: "1px solid #ddd",
};

const chip: React.CSSProperties = {
    background: "#f6f6f6",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 13,
    textDecoration: "none",
    color: "#111",
    border: "1px solid #eee",
};

const input: React.CSSProperties = {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
};

const textarea: React.CSSProperties = {
    ...input,
    resize: "vertical",
} as React.CSSProperties;

function AccountCard({
                         t,
                         title,
                         acct,
                         onCopy,
                     }: {
    t: any;
    title: string;
    acct: BankAccount;
    onCopy: (s: string) => void;
}) {
    const line = `${acct.bank} · ${acct.number} (${acct.owner})`;
    return (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontFamily: "ui-monospace, Menlo, Consolas", fontSize: 14 }}>{line}</div>
                <button onClick={() => onCopy(`${acct.number}`)} style={chip}>
                    📋 {t.copy}
                </button>
            </div>
            {acct.note && <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>{acct.note}</div>}
        </div>
    );
}

export default WeddingCard;
