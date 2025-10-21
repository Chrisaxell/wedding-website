'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export function ContactInfo() {
  const t = useTranslations('WeddingInvite');

  return (
    <section className="px-6 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">{t('CONTACT_LABEL')}</p>
        <h3 className="text-lg font-medium">{t('CONTACT_HEADING')}</h3>
        <p className="mt-2 text-sm text-zinc-600">{t('CONTACT_DESC')}</p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Christian Axell */}
        <Card>
          <CardContent className="p-5">
            <h4 className="text-base font-semibold text-zinc-900">Christian Axell</h4>
            <div className="mt-3 space-y-2">
              <Link
                href="tel:+4745055067"
                className="flex items-center gap-3 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
              >
                <Phone className="h-4 w-4" />
                <span>+47 450 55 067</span>
              </Link>
              <Link
                href="mailto:chris.axell@gmail.com"
                className="flex items-center gap-3 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
              >
                <Mail className="h-4 w-4" />
                <span>chris.axell@gmail.com</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Jeong Hee Hong */}
        <Card>
          <CardContent className="p-5">
            <h4 className="text-base font-semibold text-zinc-900">{t('CONTACT_BRIDE_NAME')}</h4>
            <div className="mt-3 space-y-2">
              <Link
                href="tel:+821012345678"
                className="flex items-center gap-3 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
              >
                <Phone className="h-4 w-4" />
                <span>{t('CONTACT_BRIDE_PHONE')}</span>
              </Link>
              <Link
                href="mailto:hhh0015@gmail.com"
                className="flex items-center gap-3 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
              >
                <Mail className="h-4 w-4" />
                <span>hhh0015@gmail.com</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
