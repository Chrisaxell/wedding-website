import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { Noto_Serif } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const notoSerif = Noto_Serif({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
    variable: '--font-noto-serif',
});

export const metadata: Metadata = {
    title: 'Christian & JeongHee - Wedding Invitation',
    description: 'Join us as we celebrate our wedding on February 8th, 2025',
    icons: {
        icon: '/wedding-rings.svg',
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const messages = await getMessages();
    const locale = await getLocale();
    return (
        <html lang={locale}>
            <body className={notoSerif.variable} style={{ backgroundColor: '#333333' }}>
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
