'use client';

import { useTranslations } from 'next-intl';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export function ContactInfo() {
  const t = useTranslations('WeddingInvite');

  return (
    <section className="space-y-4 px-6 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">{t('CONTACT_LABEL')}</p>
        <h3 className="text-lg font-medium">{t('CONTACT_HEADING')}</h3>
        <p className="mt-2 text-sm text-zinc-600">{t('CONTACT_DESC')}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Christian Axell</CardTitle>
          <CardDescription>
            <Link
              href="tel:+4745055067"
              className="flex items-center gap-2 text-xs text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+47 450 55 067</span>
            </Link>
            <Link
              href="mailto:chris.axell@gmail.com"
              className="flex items-center gap-2 text-xs text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>chris.axell@gmail.com</span>
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* JeongHee Hong */}
      <Card>
        <CardHeader className={'pb-0'}>
          <CardTitle>JeongHee Hong</CardTitle>
          <CardDescription>
            <Link
              href="tel:+82-10-4370-7289"
              className="flex items-center gap-2 text-xs text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{t('CONTACT_BRIDE_PHONE')}</span>
            </Link>
            <Link
              href="mailto:hhh0015@gmail.com"
              className="flex items-center gap-2 text-xs text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>hhh0015@gmail.com</span>
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
