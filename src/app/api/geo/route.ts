import { geolocation } from '@vercel/functions';
import { getLanguageFromCountry, getLanguageFromHeaders } from '@/lib/geolocation';

export function GET(request: Request) {
    const geo = geolocation(request);

    // Extract geolocation data
    const { city, country, countryRegion, region, latitude, longitude } = geo;

    // Determine suggested language with priority:
    // 1. Country-based geolocation
    // 2. Accept-Language header
    // 3. Default to Korean
    const suggestedLanguage = country
        ? getLanguageFromCountry(country)
        : getLanguageFromHeaders(request.headers.get('accept-language') || undefined);

    // Return comprehensive geolocation info as JSON
    return Response.json({
        city: city || 'Unknown',
        country: country || 'Unknown',
        countryRegion: countryRegion || 'Unknown',
        region: region || 'Unknown',
        latitude: latitude || null,
        longitude: longitude || null,
        suggestedLanguage,
    });
}
