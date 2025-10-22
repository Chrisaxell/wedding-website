// src/lib/auth.ts
import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { cookies as nextCookies } from 'next/headers';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'session';
const TTL_DAYS = Number(process.env.AUTH_COOKIE_TTL_DAYS ?? '7');
const SECRET = new TextEncoder().encode(process.env.AUTH_JWT_SECRET);

// Works in Next 14 (sync) and 15 (async)
async function getJar() {
    const maybe = nextCookies();
    return Promise.resolve(maybe);
}

export type Session = { sub: string; role?: 'admin' | 'user' };

// NOTE: Call this from a Route Handler or Server Action (not during Server Component render)
export async function createSessionCookie(session: Session) {
    const exp = Math.floor(Date.now() / 1000) + TTL_DAYS * 24 * 60 * 60;

    const token = await new SignJWT(session)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(exp)
        .setIssuedAt()
        .sign(SECRET);

    const jar = await getJar();
    jar.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: TTL_DAYS * 24 * 60 * 60,
    });
}

export async function readSessionFromCookie(): Promise<Session | null> {
    try {
        const jar = await getJar();
        const token: string | undefined = jar.get(COOKIE_NAME)?.value;
        if (!token) return null;

        // Optional: small clock tolerance helps avoid edge skew issues
        const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 5 });
        return payload as unknown as Session;
    } catch {
        return null;
    }
}

// NOTE: Call this from a Route Handler or Server Action
export async function clearSessionCookie() {
    const jar = await getJar();
    jar.set({
        name: COOKIE_NAME,
        value: '',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 0,
    });
}
