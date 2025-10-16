import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { Noto_Serif } from 'next/font/google';
import './globals.css';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={notoSerif.className} style={{ backgroundColor: '#333333' }}>
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
          timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
