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
  };
  const load = loaders[locale as keyof typeof loaders] || loaders.en;
  const mod = await load();
  return (mod.default as Record<string, unknown>) || (mod as Record<string, unknown>);
}

export default getRequestConfig(async () => {
  const store = await cookies();
  let locale = store.get('locale')?.value || 'en';
  // Clamp to supported locales (en, ko)
  if (!['en', 'ko'].includes(locale)) {
    locale = 'en';
  }
  const messages = await loadMessages(locale);
  return { locale, messages };
});
