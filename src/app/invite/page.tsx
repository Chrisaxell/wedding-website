import {
  AccountAccordion,
  Countdown,
  GalleryGrid,
  InfoTabs,
  InviteHero,
  RsvpDialog, // Import RsvpDialog
  TopControls, // Import TopControls
  ContactInfo, // Import ContactInfo
} from '@/app/invite/_components';
import MapCard from '@/app/invite/_components/MapCard';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { WEDDING_EVENT } from '@/lib/wedding';
import { getCookie } from '@/lib/cookies';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const t = await getTranslations('WeddingInvite');
  const locale = await getLocale();
  const bodyLines = t('INVITATION_BODY').split('\n');

  // Check if user has saved name from previous RSVP
  const savedGuestName = await getCookie('guest_name');
  const hasSeenRsvp = (await getCookie('rsvp_seen')) === 'true';

  return (
    <main className="mx-auto w-full max-w-[430px] bg-white">
      <TopControls />
      <InviteHero
        heroImage={WEDDING_EVENT.heroImage}
        coupleA={WEDDING_EVENT.coupleA}
        coupleB={WEDDING_EVENT.coupleB}
        dateISO={WEDDING_EVENT.dateISO}
        venueName={WEDDING_EVENT.venueAddress}
        className={'pt-10'}
      />

      <ScrollReveal threshold={1} className={'pt-5'}>
        <section className="px-6 py-10 text-center">
          <p className="text-xs tracking-[0.3em] text-zinc-400">{t('INVITATION_LABEL')}</p>
          <h2 className="mt-1 text-lg font-medium text-zinc-700">{t('INVITATION_HEADING')}</h2>
          <p className="mt-4 leading-7">
            {bodyLines.map((line, i) => (
              <span key={i} className="block first:mt-0">
                {line}
              </span>
            ))}
          </p>
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
          venueName={WEDDING_EVENT.venueName}
          address={WEDDING_EVENT.venueAddress}
          lat={WEDDING_EVENT.venueLat}
          lng={WEDDING_EVENT.venueLng}
        />
      </ScrollReveal>

      <ScrollReveal threshold={0.5}>
        <section className="px-6 py-10">
          <p className="text-center text-[10px] tracking-[0.3em] text-zinc-400">
            {t('INFO_LABEL')}
          </p>
          <h3 className="mb-6 text-center text-lg font-medium">{t('INFO_HEADING')}</h3>
          <InfoTabs />
        </section>
      </ScrollReveal>

      <ScrollReveal threshold={0.5}>
        <ContactInfo />
      </ScrollReveal>

      <ScrollReveal threshold={0.5}>
        <section className="px-6 py-10">
          <div className="rounded-xl border bg-zinc-50 p-6">
            <h3 className="text-center text-lg font-medium text-zinc-700">
              {t('RSVP_SECTION_HEADING')}
            </h3>
            <p className="mt-2 text-center text-sm text-zinc-500">{t('RSVP_SECTION_SUB')}</p>
            <p className="mt-1 text-center text-xs font-medium text-zinc-600">
              Please respond before 28th of January.
            </p>
            <div className="mt-4 flex justify-center">
              <RsvpDialog guestName={savedGuestName} autoOpen={!hasSeenRsvp} />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {locale === 'ko' && (
        <ScrollReveal threshold={0.5}>
          <section className="px-6 pb-12">
            <h3 className="mb-4 text-center text-lg font-medium">
              {t('ACCOUNTS_SECTION_HEADING')}
            </h3>
            <AccountAccordion
              groom={[
                { bank: 'DNB', number: '1234.56.78901', owner: 'Chris' },
                { bank: 'Sparebank', number: '2222.33.44444', owner: "Chris's Dad" },
              ]}
              bride={[
                { bank: 'KB', number: '110-123-456789', owner: 'Scarlett' },
                { bank: 'Shinhan', number: '110-987-654321', owner: "Scarlett's Dad" },
              ]}
            />
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
          {/* Removed text overlay figcaption */}
        </figure>
      </ScrollReveal>

      <footer className="py-6 text-center text-xs text-zinc-500">© 2025 Chris & Scarlett</footer>
    </main>
  );
}
