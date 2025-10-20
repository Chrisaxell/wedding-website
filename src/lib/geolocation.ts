/**
 * Map country codes to supported languages
 */
const countryToLanguage: Record<string, string> = {
  // English speaking countries
  US: 'en',
  GB: 'en',
  CA: 'en',
  AU: 'en',
  NZ: 'en',
  IE: 'en',

  // Korean
  KR: 'ko',
};

/**
 * Get language based on country code from geolocation
 */
export function getLanguageFromCountry(countryCode: string): string {
  return countryToLanguage[countryCode.toUpperCase()] || 'en';
}

/**
 * Get language from browser headers (Accept-Language)
 */
export function getLanguageFromHeaders(acceptLanguage?: string): string {
  if (!acceptLanguage) return 'en';

  const languages = acceptLanguage.split(',').map((lang) => {
    const [code] = lang.trim().split(';');
    return code.split('-')[0].toLowerCase();
  });

  const supported = ['en', 'ko'];

  for (const lang of languages) {
    if (supported.includes(lang)) {
      return lang;
    }
  }

  return 'en';
}
