import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return Response.json({ exists: false });
        }

        // Check if this email has already submitted an RSVP
        const existingRsvp = await prisma.rsvp.findFirst({
            where: {
                email: email.trim(),
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (existingRsvp) {
            return Response.json({
                exists: true,
                name: existingRsvp.name,
                status: existingRsvp.status,
            });
        }

        return Response.json({ exists: false });
    } catch (error) {
        console.error('Error checking email:', error);
        return Response.json({ exists: false }, { status: 500 });
    }
}
