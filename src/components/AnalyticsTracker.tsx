'use client';

import { useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';
import { usePathname } from 'next/navigation';

// Helper function to get guest name from cookie
function getGuestNameFromCookie(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const guestNameCookie = cookies.find((cookie) => cookie.trim().startsWith('guest_name='));

    if (guestNameCookie) {
        const guestName = decodeURIComponent(guestNameCookie.split('=')[1]);
        return guestName && guestName.trim() ? guestName : null;
    }

    return null;
}

// Helper function to get guest email from cookie
function getGuestEmailFromCookie(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const guestEmailCookie = cookies.find((cookie) => cookie.trim().startsWith('guest_email='));

    if (guestEmailCookie) {
        const guestEmail = decodeURIComponent(guestEmailCookie.split('=')[1]);
        return guestEmail && guestEmail.trim() ? guestEmail : null;
    }

    return null;
}

// Helper function to track visitor geolocation
async function trackVisitorGeo(page: string) {
    try {
        // Fetch geolocation data from our API
        const geoResponse = await fetch('/api/geo');
        const geoData = await geoResponse.json();

        // Save visitor data to database
        await fetch('/api/visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                city: geoData.city,
                country: geoData.country,
                countryRegion: geoData.countryRegion,
                region: geoData.region,
                latitude: geoData.latitude,
                longitude: geoData.longitude,
                language: geoData.suggestedLanguage,
                page,
            }),
        });

        return geoData;
    } catch (error) {
        console.error('Failed to track visitor geolocation:', error);
        return null;
    }
}

// Export this function so other components can use it
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
    const guestName = getGuestNameFromCookie();
    const guestEmail = getGuestEmailFromCookie();

    track(eventName, {
        ...properties,
        guest_name: guestName || 'anonymous',
        guest_email: guestEmail || 'not_provided',
        timestamp: new Date().toISOString(),
    });
}

export function AnalyticsTracker() {
    const pathname = usePathname();
    const hasTrackedGeo = useRef(false);

    useEffect(() => {
        const guestName = getGuestNameFromCookie();
        const guestEmail = getGuestEmailFromCookie();

        // Track page view with guest identification
        track('page_view', {
            guest_name: guestName || 'anonymous',
            guest_email: guestEmail || 'not_provided',
            page: pathname,
            timestamp: new Date().toISOString(),
        });

        // If user has an RSVP name or email, track them as identified
        if (guestName || guestEmail) {
            track('identified_user', {
                guest_name: guestName || 'unknown',
                guest_email: guestEmail || 'not_provided',
                page: pathname,
            });
        }

        // Track geolocation data once per session for anonymous visitors
        if (!hasTrackedGeo.current) {
            hasTrackedGeo.current = true;
            trackVisitorGeo(pathname);
        }
    }, [pathname]);

    return null;
}
