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

  // Spanish speaking countries
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',

  // Portuguese speaking countries
  BR: 'pt',
  PT: 'pt',

  // Norwegian/Nordic
  NO: 'no',

  // Swedish
  SE: 'sv',

  // Danish
  DK: 'da',

  // Chinese speaking
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  SG: 'zh',
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

  const supported = ['en', 'ko', 'es', 'pt', 'no', 'sv', 'da', 'zh', 'gn'];

  for (const lang of languages) {
    if (supported.includes(lang)) {
      return lang;
    }
  }

  return 'en';
}
