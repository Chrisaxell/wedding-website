'use client';

import { Card, CardContent } from '@/components/ui/card';

type Props = {
  venueName: string;
  address: string;
  lat?: number;
  lng?: number;
};

export default function MapCard({ venueName, address }: Props) {
  // Plug your KakaoMap/NaverMap component here.
  return (
    <section className="px-4 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">LOCATION</p>
        <h3 className="text-lg font-medium">오시는 길</h3>
      </div>
      <div className="mt-4 text-center">
        <div className="text-base font-medium text-black">{venueName}</div>
        <div className="text-sm text-zinc-500">{address}</div>
      </div>
      <Card className="mx-2 mt-4">
        <CardContent className="p-0">
          <div className="h-60 w-full bg-zinc-100">
            {/* <KakaoMap lat={...} lng={...} ... /> */}
            {/* Placeholder box */}
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Map goes here (Kakao/Naver)
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-3 grid grid-cols-3 gap-2 px-2 text-center text-xs">
        <a className="rounded-md bg-zinc-100 py-2" href="#" aria-disabled>
          네이버 지도
        </a>
        <a className="rounded-md bg-zinc-100 py-2" href="#" aria-disabled>
          카카오 내비
        </a>
        <a className="rounded-md bg-zinc-100 py-2" href="#" aria-disabled>
          티맵
        </a>
      </div>
    </section>
  );
}
