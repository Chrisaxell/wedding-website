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
  IN: 'en',
  SG: 'en',
  ZA: 'en',

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
  EC: 'es',
  GT: 'es',
  CU: 'es',
  BO: 'es',
  DO: 'es',
  HN: 'es',
  PY: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  UY: 'es',

  // Portuguese speaking countries
  PT: 'pt',
  BR: 'pt',
  AO: 'pt',
  MZ: 'pt',

  // Catalan
  AD: 'ca', // Andorra

  // Swedish
  SE: 'sv',

  // Danish
  DK: 'da',

  // Norwegian
  NO: 'nb',

  // Arabic speaking countries
  SA: 'ar',
  EG: 'ar',
  AE: 'ar',
  IQ: 'ar',
  MA: 'ar',
  DZ: 'ar',
  SD: 'ar',
  SY: 'ar',
  YE: 'ar',
  JO: 'ar',
  TN: 'ar',
  LY: 'ar',
  LB: 'ar',
  OM: 'ar',
  KW: 'ar',
  QA: 'ar',
  BH: 'ar',

  // German
  DE: 'de',
  AT: 'de',
  CH: 'de',
  LI: 'de',

  // Chinese
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  MO: 'zh',

  // Guarani (Paraguay also uses Spanish, but including for completeness)
  // PY: 'gn', // Commented out since Spanish is more common
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

  const supported = ['en', 'ko', 'es', 'pt', 'ca', 'sv', 'da', 'nb', 'ar', 'de', 'zh', 'gn'];

  for (const lang of languages) {
    if (supported.includes(lang)) {
      return lang;
    }
  }

  return 'en';
}
