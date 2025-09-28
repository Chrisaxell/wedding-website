'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';

import GoogleMap from '@/components/maps/GoogleMap';

export default function WeddingInvite() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
      {/* Top bar */}
      <div className="flex w-full justify-end px-4 py-3">
        <Button variant="ghost" size="sm" className="ml-auto">
          Icon
        </Button>
      </div>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center space-y-6 px-4 pb-12">
        <header className="mt-4 space-y-1 text-center">
          <h1 className="text-4xl font-light tracking-widest">25 | 10 | 12</h1>
          <h2 className="text-xs tracking-[0.4em] text-neutral-500 uppercase">Sunday</h2>
        </header>

        <div className="relative h-[400px] w-[300px]">
          <Image
            src="/cat.jpg"
            alt="Cat"
            width={300}
            height={400}
            className="rounded-md object-cover shadow-md"
            priority
          />
        </div>

        <section className="space-y-1 text-center">
          <h1 className="text-lg tracking-wide">Some text | More text</h1>
          <h2 className="text-sm text-neutral-600">2025 somewhat 10 and 12 maybe 30</h2>
          <h2 className="text-sm text-neutral-500">More stuff</h2>
          <h2 className="text-sm text-neutral-600">2025 somewhat 10 and 12 maybe 30</h2>
          <h2 className="text-sm text-neutral-500">More stuff</h2>
          <h2 className="text-sm text-neutral-600">2025 somewhat 10 and 12 maybe 30</h2>
          <h2 className="text-sm text-neutral-500">More stuff</h2>
        </section>

        <Calendar selected={'01'} className="rounded-lg border" />

        <div>Time left to the big day</div>

        <div>
          <h3>Gallery</h3>
          <div className={'grid grid-cols-3 gap-4'}>
            <Image
              src="/cat.jpg"
              alt="Cat"
              width={300}
              height={400}
              className="rounded-md object-cover shadow-md"
              priority
            />
            <Image
              src="/cat.jpg"
              alt="Cat"
              width={300}
              height={400}
              className="rounded-md object-cover shadow-md"
              priority
            />
          </div>
        </div>

        <h3>Directions</h3>
        <h3>Bla bla</h3>
        <h3>bla bla</h3>

        <Tabs defaultValue="kakao_map" className={'w-full'}>
          <TabsList>
            <TabsTrigger value="kakao_map">Kakao Navi</TabsTrigger>
            <TabsTrigger value="google_map">Google mps</TabsTrigger>
          </TabsList>
          <TabsContent value="kakao_map">
            <GoogleMap />
          </TabsContent>
          <TabsContent value="google_map">
            <GoogleMap />
          </TabsContent>
        </Tabs>

        <div>
          <div>Subway</div>
          <div>Bus</div>
          <div>Parking inormation</div>
        </div>

        <h1>Ceremony information and information</h1>

        <Tabs defaultValue="photo_both" className={'w-full'}>
          <TabsList>
            <TabsTrigger value="photo_both">Photo booth</TabsTrigger>
            <TabsTrigger value="meal_info">Meal information</TabsTrigger>
            <TabsTrigger value="parking_info">Parking Information</TabsTrigger>
          </TabsList>
          <TabsContent value="photo_both">A Photo booth</TabsContent>
          <TabsContent value="meal_info">Meals are serverd after wedding. buffet style</TabsContent>
          <TabsContent value="parking_info">Parking is avaliable</TabsContent>
        </Tabs>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Reception Information</CardTitle>
          </CardHeader>
          <CardContent>Lets arty</CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full">View Reception map</Button>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Communicate our intention to attend</CardTitle>
          </CardHeader>
          <CardContent>
            Thank you for attending with congralulations So we can treat everyne with respect Please
            convey your intention to attend
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full">Communicate your intention to attend</Button>
          </CardFooter>
        </Card>

        <h1>A place to convey your feelings</h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Grooms account number</AccordionTrigger>
            <AccordionContent>Chris | 1204.61.21000</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Brides account number</AccordionTrigger>
            <AccordionContent>Scarlett | 1204.61.21000</AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
