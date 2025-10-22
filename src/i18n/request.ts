import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

interface MessagesModule {
    default?: Record<string, unknown>;
    [key: string]: unknown;
}

async function loadMessages(locale: string) {
    // Explicit map to avoid bundling unused locale JSON files
    const loaders: Record<string, () => Promise<MessagesModule>> = {
        en: () => import('../../messages/en.json'),
        ko: () => import('../../messages/ko.json'),
        es: () => import('../../messages/es.json'),
        pt: () => import('../../messages/pt.json'),
        ca: () => import('../../messages/ca.json'),
        sv: () => import('../../messages/sv.json'),
        da: () => import('../../messages/da.json'),
        nb: () => import('../../messages/nb.json'),
        ar: () => import('../../messages/ar.json'),
        de: () => import('../../messages/de.json'),
        zh: () => import('../../messages/zh.json'),
        gn: () => import('../../messages/gn.json'),
    };
    const load = loaders[locale as keyof typeof loaders] || loaders.en;
    const mod = await load();
    return (mod.default as Record<string, unknown>) || (mod as Record<string, unknown>);
}

const supportedLocales = ['en', 'ko', 'es', 'pt', 'ca', 'sv', 'da', 'nb', 'ar', 'de', 'zh', 'gn'];

export default getRequestConfig(async () => {
    const store = await cookies();
    let locale = store.get('locale')?.value || 'en';
    // Clamp to supported locales
    if (!supportedLocales.includes(locale)) {
        locale = 'en';
    }
    const messages = await loadMessages(locale);
    return { locale, messages };
});
