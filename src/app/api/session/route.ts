import { NextResponse } from 'next/server';
import { readSessionFromCookie } from '@/lib/auth';

export async function GET() {
  const session = await readSessionFromCookie();
  return NextResponse.json({ authenticated: !!session, session });
}
