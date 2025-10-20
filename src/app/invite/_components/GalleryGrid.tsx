'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GalleryDialog, type GalleryImage } from './GalleryDialog';

const GALLERY: GalleryImage[] = [
  { name: '1', src: '/images/gallery photos/11 완-3.jpg', orientation: 'landscape' },
  { name: '2', src: '/images/gallery photos/12 완-3.jpg', orientation: 'portrait' },
  { name: '3', src: '/images/gallery photos/13 완-3.jpg', orientation: 'portrait' },
  { name: '4', src: '/images/gallery photos/15 완-3.jpg', orientation: 'portrait' },
  { name: '5', src: '/images/gallery photos/17 완-3.jpg', orientation: 'landscape' },
  { name: '6', src: '/images/gallery photos/18 완-3.jpg', orientation: 'landscape' },
  { name: '7', src: '/images/gallery photos/2 완-3.jpg', orientation: 'landscape' },
  { name: '8', src: '/images/gallery photos/20 완-3.jpg', orientation: 'landscape' },
  { name: '9', src: '/images/gallery photos/22 완-3.jpg', orientation: 'portrait' },
  { name: '10', src: '/images/gallery photos/23 완-3.jpg', orientation: 'portrait' },
  { name: '11', src: '/images/gallery photos/4 완-3.jpg', orientation: 'portrait' },
  { name: '12', src: '/images/gallery photos/6 완-3.jpg', orientation: 'portrait', note: 'selfie' },
  { name: '13', src: '/images/gallery photos/7 완-3.jpg', orientation: 'portrait', note: 'selfie' },
  { name: '14', src: '/images/gallery photos/8 완-3.jpg', orientation: 'portrait', note: 'selfie' },
  { name: '15', src: '/images/gallery photos/9완-3.jpg', orientation: 'portrait' },
];

export function GalleryGrid() {
  const t = useTranslations('WeddingInvite');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">{t('GALLERY_LABEL')}</p>
        <h3 className="text-lg font-medium">{t('GALLERY_HEADING')}</h3>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2 px-2 md:grid-cols-3">
        {GALLERY.map((img, i) => {
          const isLandscape = img.orientation === 'landscape';
          const spanClasses = isLandscape ? 'col-span-2 md:col-span-2' : '';
          const aspect = isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]';
          return (
            <li
              key={img.src}
              className={`relative overflow-hidden rounded bg-zinc-100 ${spanClasses} group cursor-pointer`}
              onClick={() => setOpenIndex(i)}
            >
              <Image
                src={img.src}
                alt={t('GALLERY_ALT', { index: i + 1 })}
                width={isLandscape ? 800 : 600}
                height={isLandscape ? 600 : 800}
                className={`${aspect} w-full object-cover transition-transform duration-300 hover:scale-[1.03]`}
                priority={i < 3}
              />
              {/* Photo number label */}
              <div className="absolute top-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                #{img.name}
              </div>
            </li>
          );
        })}
      </ul>

      <GalleryDialog
        gallery={GALLERY}
        openIndex={openIndex}
        onOpenChange={(open: boolean) => !open && setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
