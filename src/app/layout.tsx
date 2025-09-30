import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import './globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body style={{ fontFamily: 'system-ui, sans-serif' }}>
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
