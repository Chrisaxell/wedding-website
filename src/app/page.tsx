import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <main className={'p-12'}>
      <h1>Welcome</h1>
      <nav className={'mt-8 grid gap-4'}>
        <Link href="/wedding">{t('wedding_info')}</Link>
        <Link href="/admin">{t('admin')}</Link>
      </nav>
    </main>
  );
}
