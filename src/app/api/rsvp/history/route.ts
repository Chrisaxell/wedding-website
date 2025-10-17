import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/rsvp/history?name=Guest Name
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get('name') || '').trim();
  if (!name) {
    return NextResponse.json({ ok: false, error: 'Missing name' }, { status: 400 });
  }
  try {
    const items = await prisma.rsvp.findMany({
      where: { name },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        createdAt: true,
        status: true,
        plusOne: true,
        email: true,
        phone: true,
      },
    });
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error('History fetch failed', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
