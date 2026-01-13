import {
    AccountAccordion,
    Countdown,
    GalleryGrid,
    InfoTabs,
    InviteHero,
    RsvpSection, // Import RsvpSection
    TopControls, // Import TopControls
    ContactInfo, // Import ContactInfo
} from '@/app/invite/_components';
import MapCard from '@/app/invite/_components/MapCard';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { GALLERY } from '@/lib/gallery';
import { WEDDING_EVENT } from '@/lib/wedding';
import { getCookie } from '@/lib/cookies';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ScrollReveal';
import { TranslatedText } from '@/components/TranslatedText';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const t = await getTranslations('WeddingInvite');
    const locale = await getLocale();

    // Check if user has saved name from previous RSVP
    const savedGuestName = await getCookie('guest_name');
    const hasSeenRsvp = (await getCookie('rsvp_seen')) === 'true';

    // Use translated venue location for all locales
    const venueLocation = t('VENUE_LOCATION');

    return (
        <>
            {/* Preload all gallery images (server-side link preload) */}
            {GALLERY.map((img) => (
                <link key={img.src} rel="preload" as="image" href={img.src} />
            ))}

            <main className="mx-auto w-full max-w-[430px] bg-white">
                <TopControls />
                <InviteHero
                    heroImage={WEDDING_EVENT.heroImage}
                    coupleA={WEDDING_EVENT.coupleA}
                    coupleB={WEDDING_EVENT.coupleB}
                    dateISO={WEDDING_EVENT.dateISO}
                    venueName={t('VENUE_NAME')}
                    className={'pt-8'}
                />

                <ScrollReveal threshold={0.5} className={'pt-5'}>
                    <section className="px-6 py-10 text-center">
                        <TranslatedText
                            tKey="INVITATION_HEADING"
                            as="h2"
                            className="mt-1 text-lg font-medium text-zinc-700"
                        />
                        <TranslatedText
                            tKey="INVITATION_BODY"
                            as="div"
                            className="mt-4 space-y-1 text-sm leading-relaxed"
                        />
                    </section>
                </ScrollReveal>

                <ScrollReveal threshold={1}>
                    <section className="px-6 pb-10 text-center">
                        <TranslatedText
                            tKey="INVITATION_PARENTS"
                            as="div"
                            className="space-y-1 text-sm leading-relaxed"
                        />
                    </section>
                </ScrollReveal>

                <ScrollReveal threshold={0.9}>
                    <Countdown dateISO={WEDDING_EVENT.dateISO} />
                </ScrollReveal>

                <ScrollReveal threshold={0.2}>
                    <GalleryGrid />
                </ScrollReveal>

                <ScrollReveal threshold={0.3}>
                    <MapCard
                        venueName={t('VENUE_NAME')}
                        address={venueLocation}
                        lat={WEDDING_EVENT.venueLat}
                        lng={WEDDING_EVENT.venueLng}
                    />
                </ScrollReveal>

                <ScrollReveal threshold={0.5}>
                    <section className="px-6 py-10">
                        <p className="text-center text-[10px] tracking-[0.3em] text-zinc-400">INFORMATION</p>
                        <TranslatedText tKey="INFO_HEADING" as="h3" className="mb-6 text-center text-lg font-medium" />
                        {/* Arrival notice */}
                        <TranslatedText
                            tKey="INFO_ARRIVAL_NOTICE"
                            as="p"
                            className="mb-4 text-center text-sm text-zinc-600"
                        />
                        <InfoTabs />
                    </section>
                </ScrollReveal>

                <ScrollReveal threshold={0.5}>
                    <ContactInfo />
                </ScrollReveal>

                <ScrollReveal threshold={0.5}>
                    <section className="px-6 py-10">
                        <div className="text-center">
                            <p className="text-[10px] tracking-[0.3em] text-zinc-400">RSVP</p>
                            <h3 className="text-lg font-medium">
                                {locale === 'ko' ? (
                                    <TranslatedText tKey="RSVP_SECTION_HEADING" />
                                ) : (
                                    "Répondez s'il vous plaît"
                                )}
                            </h3>
                        </div>
                        <div className="mt-6 rounded-xl border bg-zinc-50 p-6">
                            <TranslatedText
                                tKey="RSVP_SECTION_SUB"
                                as="p"
                                className="text-center text-sm text-zinc-500"
                            />
                            <TranslatedText
                                tKey="RSVP_DEADLINE"
                                as="p"
                                className="mt-1 text-center text-xs font-medium text-zinc-600"
                            />
                            <RsvpSection guestName={savedGuestName} hasSeenRsvp={hasSeenRsvp} />
                        </div>
                    </section>
                </ScrollReveal>

                {locale === 'ko' && (
                    <ScrollReveal threshold={0.5}>
                        <section className="px-6 pb-12">
                            <div className="text-center">
                                <p className="text-[10px] tracking-[0.3em] text-zinc-400">GIFTS</p>
                                <TranslatedText
                                    tKey="ACCOUNTS_SECTION_HEADING"
                                    as="h3"
                                    className="text-lg font-medium"
                                />
                            </div>
                            <div className="mt-6">
                                <AccountAccordion
                                    brideGroomAccounts={[
                                        { bank: '우리', number: '1002554754103', owner: '홍정희' },
                                        {
                                            bank: 'DNB IBAN',
                                            number: 'NO88 1224 1832 919',
                                            owner: 'JEONGHEE HONG\nBIC SWIFT DNBANOKKXXX',
                                        },
                                    ]}
                                    brideParentsAccounts={[
                                        { bank: '부산', number: '108120269320', owner: '강분례' },
                                        { bank: '새마을', number: '3827101037806', owner: '홍제완' },
                                    ]}
                                />
                            </div>
                        </section>
                    </ScrollReveal>
                )}

                {locale !== 'ko' && (
                    <ScrollReveal threshold={0.5}>
                        <section className="px-6 pb-12">
                            <div className="text-center">
                                <p className="text-[10px] tracking-[0.3em] text-zinc-400">GIFTS</p>
                                <TranslatedText
                                    tKey="ACCOUNTS_SECTION_HEADING"
                                    as="h3"
                                    className="text-lg font-medium"
                                />
                            </div>
                            <div className="mt-6">
                                <AccountAccordion
                                    brideGroomAccounts={[
                                        { bank: 'Korea Woori', number: '1002554754103', owner: 'JEONGHEE HONG' },
                                        {
                                            bank: 'Norway IBAN',
                                            number: 'NO88 1224 1832 919',
                                            owner: 'JEONGHEE HONG\nBIC SWIFT DNBANOKKXXX',
                                        },
                                    ]}
                                    brideParentsAccounts={[]}
                                />
                            </div>
                        </section>
                    </ScrollReveal>
                )}

                <ScrollReveal threshold={0.5}>
                    <figure className="relative">
                        <Image
                            src={WEDDING_EVENT.outroImage}
                            alt="outro"
                            width={1200}
                            height={800}
                            className="w-full opacity-90"
                        />
                    </figure>
                </ScrollReveal>

                <footer className="py-6 text-center text-xs text-zinc-500">© 2025 Chris & Scarlett</footer>
            </main>
        </>
    );
}
