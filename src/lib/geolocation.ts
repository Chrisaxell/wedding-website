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
    return countryToLanguage[countryCode.toUpperCase()] || 'ko';
}

/**
 * Get language from browser headers (Accept-Language)
 * Improved to handle language variants and quality scores
 */
export function getLanguageFromHeaders(acceptLanguage?: string): string {
    if (!acceptLanguage) return 'ko';

    // Parse Accept-Language header with quality scores
    const languagePreferences = acceptLanguage.split(',').map((lang) => {
        const parts = lang.trim().split(';');
        const code = parts[0].trim();
        const qMatch = parts[1]?.match(/q=([0-9.]+)/);
        const quality = qMatch ? parseFloat(qMatch[1]) : 1.0;

        // Extract primary language code and variant
        const [primary, variant] = code.split('-').map((s) => s.toLowerCase());

        return { code, primary, variant, quality };
    });

    // Sort by quality score (highest first)
    languagePreferences.sort((a, b) => b.quality - a.quality);

    const supported = ['en', 'ko', 'es', 'pt', 'ca', 'sv', 'da', 'nb', 'ar', 'de', 'zh', 'gn'];

    // Map language variants to our supported locales
    const variantMap: Record<string, string> = {
        no: 'nb', // Norwegian variants
        nn: 'nb',
        'zh-cn': 'zh',
        'zh-tw': 'zh',
        'zh-hk': 'zh',
        'pt-br': 'pt',
        'pt-pt': 'pt',
        'en-us': 'en',
        'en-gb': 'en',
    };

    // First pass: try exact matches or known variants
    for (const pref of languagePreferences) {
        const fullCode = `${pref.primary}${pref.variant ? '-' + pref.variant : ''}`;

        // Check variant map first
        if (variantMap[fullCode]) {
            return variantMap[fullCode];
        }

        // Check if primary language is supported
        if (supported.includes(pref.primary)) {
            return pref.primary;
        }
    }

    // Default to Korean for this wedding website
    return 'ko';
}
