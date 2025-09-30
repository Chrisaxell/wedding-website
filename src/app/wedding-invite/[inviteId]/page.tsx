import {
  AccountAccordion,
  Countdown,
  GalleryGrid,
  InfoTabs,
  InviteHero,
  RsvpDialog,
} from '@/app/wedding-invite/_components';
import { getInviteOr404 } from '@/lib/invites';
import MapCard from '@/app/wedding-invite/_components/MapCard';

type Props = { params: { inviteId: string } };

// --- Hard-coded wedding data for now (you’ll likely store this in DB) ---
const WEDDING = {
  coupleA: 'Chris',
  coupleB: 'Scarlett',
  dateISO: '2026-03-29T13:30:00+09:00', // Busan/KST example
  weekday: 'SUNDAY',
  venueName: 'Hanok Garden Hall',
  venueAddress: 'Busan, South Korea',
  heroImage: '/cat.jpg',
  outroImage: '/cat.jpg',
};

export const dynamic = 'force-static'; // or "force-dynamic" if you’ll fetch from DB

export default async function Page({ params }: Props) {
  const { inviteId } = await params;
  const invite = await getInviteOr404(inviteId);

  return (
    <main className="mx-auto w-full max-w-[430px] bg-white text-zinc-700 shadow-sm">
      {/* Intro / hero */}
      <InviteHero
        heroImage={WEDDING.heroImage}
        coupleA={WEDDING.coupleA}
        coupleB={WEDDING.coupleB}
        dateISO={WEDDING.dateISO}
        weekday={WEDDING.weekday}
        venueName={WEDDING.venueName}
      />

      {/* Greeting */}
      <section className="px-6 py-10 text-center">
        <p className="text-xs tracking-[0.3em] text-zinc-400">INVITATION</p>
        <h2 className="mt-1 text-lg font-medium text-zinc-700">소중한 분들을 초대합니다</h2>
        <p className="mt-4 leading-7">
          살랑이는 바람결에 사랑이 묻어나는 계절입니다.
          <br />두 사람이 사랑을 맺어 인생의 반려자가 되려 합니다.
        </p>
      </section>

      {/* Calendar + countdown */}
      <Countdown dateISO={WEDDING.dateISO} />

      {/* Gallery */}
      <GalleryGrid />

      {/* Location */}
      <MapCard
        venueName={WEDDING.venueName}
        address={WEDDING.venueAddress}
        // lat/lng optional until you wire Kakao/Naver
      />

      {/* Info tabs */}
      <section className="px-6 py-10">
        <p className="text-center text-[10px] tracking-[0.3em] text-zinc-400">INFORMATION</p>
        <h3 className="mb-6 text-center text-lg font-medium">예식정보 및 안내사항</h3>
        <InfoTabs />
      </section>

      {/* RSVP */}
      <section className="px-6 py-10">
        <div className="rounded-xl border bg-zinc-50 p-6">
          <h3 className="text-center text-lg font-medium text-zinc-700">참석 의사 전달</h3>
          <p className="mt-2 text-center text-sm text-zinc-500">
            더 잘 모실 수 있도록 참석 여부를 알려주세요.
          </p>
          <div className="mt-4 flex justify-center">
            <RsvpDialog inviteId={invite.id} guestName={invite.guestName} />
          </div>
        </div>
      </section>

      {/* Accounts */}
      <section className="px-6 pb-12">
        <h3 className="mb-4 text-center text-lg font-medium">마음 전하실 곳</h3>
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

      {/* Outro */}
      <figure className="relative">
        <img src={WEDDING.outroImage} alt="outro" className="w-full opacity-90" />
        <figcaption className="absolute inset-0 flex items-center justify-center px-6 text-center text-white drop-shadow">
          응원해주신 모든 분들께 감사드리며 행복하게 잘 살겠습니다.
        </figcaption>
      </figure>

      {/* Footer */}
      <footer className="bg-zinc-100 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Chris & Scarlett
      </footer>
    </main>
  );
}
