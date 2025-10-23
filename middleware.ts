import { NextResponse, NextRequest } from 'next/server';
import { getLanguageFromHeaders } from '@/lib/geolocation';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'session';

const PUBLIC_PATHS = [
    '/',
    '/wedding',
    '/wedding-invite',
    '/invite',
    '/login',
    '/api/login',
    '/api/logout',
    '/api/session',
    '/_next',
    '/favicon.ico',
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
        const response = NextResponse.next();

        // Set locale based on geolocation/headers if not already set
        if (!req.cookies.get('locale')?.value && (pathname.startsWith('/wedding-invite/') || pathname === '/invite')) {
            const acceptLanguage = req.headers.get('accept-language') || undefined;
            const detectedLanguage = getLanguageFromHeaders(acceptLanguage);
            response.cookies.set('locale', detectedLanguage, {
                maxAge: 60 * 60 * 24 * 365, // 1 year
                path: '/',
            });
        }

        return response;
    }

    const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin');

    if (isAdmin) {
        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = '/wedding';
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)'],
};
