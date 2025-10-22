'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

// Supported locales & native labels
const LOCALES: { code: string; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'ca', label: 'Català' },
    { code: 'sv', label: 'Svenska' },
    { code: 'da', label: 'Dansk' },
    { code: 'nb', label: 'Norsk' },
    { code: 'ko', label: '한국어' },
    { code: 'ar', label: 'العربية' },
    { code: 'de', label: 'Deutsch' },
    { code: 'zh', label: '中文' },
    { code: 'gn', label: 'Guaraní' },
];

export default function LanguageSwitcher() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    function setLocale(code: string) {
        document.cookie = `locale=${code}; path=/; max-age=31536000`; // 1 year
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <div className="flex flex-wrap justify-center gap-2 p-3 text-xs">
            {LOCALES.map((l) => (
                <button
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    disabled={pending}
                    className="rounded border px-2 py-1 hover:bg-zinc-100 disabled:opacity-50"
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
}
