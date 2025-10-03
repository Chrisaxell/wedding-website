import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

async function loadMessages(locale: string) {
  try {
    const mod = await import(`../../messages/${locale}.json`);
    return mod.default || mod;
  } catch {
    if (locale !== 'en') {
      const fallback = await import('../../messages/en.json');
      return fallback.default || fallback;
    }
    throw new Error(`Missing messages for locale: ${locale}`);
  }
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'en';
  const messages = await loadMessages(locale);
  return { locale, messages };
});
