import Image from 'next/image';
import {
  AccountAccordion,
  Countdown,
  GalleryGrid,
  InfoTabs,
  InviteHero,
  RsvpDialog,
} from '@/app/wedding-invite/_components';
import LanguageSwitcher from '@/app/wedding-invite/_components/LanguageSwitcher';
import { getInviteOr404 } from '@/lib/invites';
import MapCard from '@/app/wedding-invite/_components/MapCard';
import { getTranslations } from 'next-intl/server';

type Props = { params: { inviteId: string } };

const WEDDING = {
  coupleA: 'Chris',
  coupleB: 'Scarlett',
  dateISO: '2026-03-29T13:30:00+09:00',
  venueName: 'Hanok Garden Hall',
  venueAddress: 'Busan, South Korea',
  heroImage: '/cat.jpg',
  outroImage: '/cat.jpg',
};

export const dynamic = 'force-dynamic';

export default async function Page({ params }: Props) {
  const { inviteId } = await params;
  const invite = await getInviteOr404(inviteId);
  const t = await getTranslations('WeddingInvite');
  const bodyLines = t('INVITATION_BODY').split('\n');
  const year = new Date().getFullYear();

  return (
    <main className="mx-auto w-full max-w-[430px] bg-white text-zinc-700 shadow-sm">
      <InviteHero
        heroImage={WEDDING.heroImage}
        coupleA={WEDDING.coupleA}
        coupleB={WEDDING.coupleB}
        dateISO={WEDDING.dateISO}
        venueName={WEDDING.venueName}
      />
      <LanguageSwitcher />
      {/* Greeting */}
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

      <Countdown dateISO={WEDDING.dateISO} />

      <GalleryGrid />

      <MapCard venueName={WEDDING.venueName} address={WEDDING.venueAddress} />

      <section className="px-6 py-10">
        <p className="text-center text-[10px] tracking-[0.3em] text-zinc-400">{t('INFO_LABEL')}</p>
        <h3 className="mb-6 text-center text-lg font-medium">{t('INFO_HEADING')}</h3>
        <InfoTabs />
      </section>

      <section className="px-6 py-10">
        <div className="rounded-xl border bg-zinc-50 p-6">
          <h3 className="text-center text-lg font-medium text-zinc-700">
            {t('RSVP_SECTION_HEADING')}
          </h3>
          <p className="mt-2 text-center text-sm text-zinc-500">{t('RSVP_SECTION_SUB')}</p>
          <div className="mt-4 flex justify-center">
            <RsvpDialog inviteId={invite.id} guestName={invite.guestName} />
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <h3 className="mb-4 text-center text-lg font-medium">{t('ACCOUNTS_SECTION_HEADING')}</h3>
        <AccountAccordion
          groom={[
            { bank: 'DNB', number: '1234.56.78901', owner: 'Chris' },
            { bank: 'Sparebank', number: '2222.33.44444', owner: 'Chris’s Dad' },
          ]}
          bride={[
            { bank: 'KB', number: '110-123-456789', owner: 'Scarlett' },
            { bank: 'Shinhan', number: '110-987-654321', owner: 'Scarlett’s Dad' },
          ]}
        />
      </section>

      <figure className="relative">
        <Image
          src={WEDDING.outroImage}
          alt="outro"
          width={1200}
          height={800}
          className="w-full opacity-90"
        />
        <figcaption className="absolute inset-0 flex items-center justify-center px-6 text-center text-white drop-shadow">
          {t('OUTRO_CAPTION')}
        </figcaption>
      </figure>

      <footer className="bg-zinc-100 py-6 text-center text-xs text-zinc-500">
        {t('FOOTER_COPYRIGHT', { year, coupleA: WEDDING.coupleA, coupleB: WEDDING.coupleB })}
      </footer>
    </main>
  );
}
