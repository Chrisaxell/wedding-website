import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { city, country, countryRegion, region, latitude, longitude, language, page } = body;

        // Get user agent from headers
        const userAgent = request.headers.get('user-agent') || undefined;

        // Create visitor record
        const visitor = await prisma.visitor.create({
            data: {
                city: city || null,
                country: country || null,
                countryRegion: countryRegion || null,
                region: region || null,
                latitude: latitude?.toString() || null,
                longitude: longitude?.toString() || null,
                language: language || null,
                page: page || null,
                userAgent,
            },
        });

        return Response.json({ success: true, id: visitor.id });
    } catch (error) {
        console.error('Error saving visitor data:', error);
        return Response.json({ success: false, error: 'Failed to save visitor data' }, { status: 500 });
    }
}
