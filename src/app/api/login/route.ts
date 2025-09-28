import { NextResponse } from 'next/server';
import { createSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  // Accept JSON or x-www-form-urlencoded
  let password: string | undefined;
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const body = await req.json().catch(() => ({}));
    password = body?.password;
  } else if (ct.includes('application/x-www-form-urlencoded')) {
    const body = await req.formData();
    password = String(body.get('password') ?? '');
  }

  if (!process.env.AUTH_PASSWORD) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  if (password !== process.env.AUTH_PASSWORD) {
    const url = new URL('/login', req.url);
    url.searchParams.set('err', '1');
    return NextResponse.redirect(url);
  }

  await createSessionCookie({ sub: 'admin', role: 'admin' });

  // Redirect back to admin (or ?from= if present)
  const from = new URL(req.url).searchParams.get('from');
  const target = from && from.startsWith('/') ? from : '/admin';
  return NextResponse.redirect(new URL(target, req.url));
}
