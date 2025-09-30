'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function InfoTabs() {
  return (
    <Tabs defaultValue="photo" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="photo">포토부스</TabsTrigger>
        <TabsTrigger value="food">식사안내</TabsTrigger>
        <TabsTrigger value="parking">주차안내</TabsTrigger>
      </TabsList>
      <TabsContent value="photo" className="mt-4 space-y-3">
        <img src="/wedding/photo-booth.jpg" alt="photobooth" className="w-full rounded-md" />
        <p className="text-sm text-zinc-600">
          포토부스가 준비됩니다. 환한 미소와 따뜻한 메시지를 남겨주세요.
        </p>
      </TabsContent>
      <TabsContent value="food" className="mt-4 space-y-3">
        <img src="/wedding/food.jpg" alt="food" className="w-full rounded-md" />
        <p className="text-sm text-zinc-600">뷔페 스타일 / 채식 옵션 제공 (사전 요청).</p>
      </TabsContent>
      <TabsContent value="parking" className="mt-4 space-y-3">
        <img src="/wedding/parking.jpg" alt="parking" className="w-full rounded-md" />
        <p className="text-sm text-zinc-600">지하 2–7층 2시간 무료. 안내 데스크에서 주차권 수령.</p>
      </TabsContent>
    </Tabs>
  );
}
