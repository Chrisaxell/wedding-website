import { NextResponse, NextRequest } from 'next/server';
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'session';

const PUBLIC_PATHS = [
  '/',
  '/wedding',
  '/weddingInvite',
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
    return NextResponse.next();
  }

  const isAdmin =
    pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin');

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
