'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

// Supported locales & native labels (temporarily reduced to EN + KO)
const LOCALES: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
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
