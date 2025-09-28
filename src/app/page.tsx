import Link from "next/link";
import {useTranslations} from 'next-intl';

export default function Home() {
    const t = useTranslations('HomePage');
    return (
        <main style={{ padding: 24 }}>
            <h1>Welcome</h1>
            <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
                <Link href="/wedding">{t('wedding_info')}</Link>
                <Link href="/admin">{t('admin')}</Link>
            </nav>
        </main>
    );
}
