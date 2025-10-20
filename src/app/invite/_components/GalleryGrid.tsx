'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GalleryDialog, type GalleryImage as GalleryImageType } from './GalleryDialog';
import { GalleryImage } from './GalleryImage';

const GALLERY: GalleryImageType[] = [
  { src: '/images/gallery photos/11 완-3.jpg', aspectRatio: '3/2' },
  { src: '/images/gallery photos/15 완-3.jpg', aspectRatio: '5/5', objectPosition: 'bottom' },
  { src: '/images/gallery photos/17 완-3.jpg', aspectRatio: '3/2' },
  { src: '/images/gallery photos/20 완-3.jpg', aspectRatio: '3/2' },
  { src: '/images/gallery photos/7 완-3.jpg', aspectRatio: '2/3', note: 'selfie' },
  { src: '/images/gallery photos/18 완-3.jpg', aspectRatio: '3/2' },
  { src: '/images/gallery photos/2 완-3.jpg', aspectRatio: '3/2' },
  { src: '/images/gallery photos/22 완-3.jpg', aspectRatio: '2/3' },
  { src: '/images/gallery photos/8 완-3.jpg', aspectRatio: '2/3', note: 'selfie' },
  { src: '/images/gallery photos/23 완-3.jpg', aspectRatio: '2/3' },
  { src: '/images/gallery photos/12 완-3.jpg', aspectRatio: '2/3' },
  { src: '/images/gallery photos/9완-3.jpg', aspectRatio: '2/3' },
  { src: '/images/gallery photos/4 완-3.jpg', aspectRatio: '5/5', objectPosition: 'bottom' },
  { src: '/images/gallery photos/13 완-3.jpg', aspectRatio: '2/3' },
  { src: '/images/gallery photos/6 완-3.jpg', aspectRatio: '2/3', note: 'selfie' },
  { src: '/images/gallery photos/PXL_20250628_110855147.RAW-01.COVER.jpg', aspectRatio: '3/2' },
];

export function GalleryGrid() {
  const t = useTranslations('WeddingInvite');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Alternate images between columns (odd indices in left, even indices in right)
  const leftColumn = GALLERY.filter((_, idx) => idx % 2 === 0);
  const rightColumn = GALLERY.filter((_, idx) => idx % 2 === 1);

  return (
    <section className="px-4 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">{t('GALLERY_LABEL')}</p>
        <h3 className="text-lg font-medium">{t('GALLERY_HEADING')}</h3>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 px-2">
        {/* Left Column */}
        <div className="flex flex-col gap-2">
          {leftColumn.map((image, idx) => {
            const originalIndex = idx * 2;
            return (
              <GalleryImage
                key={image.src}
                src={image.src}
                index={originalIndex + 1}
                onClick={() => setOpenIndex(originalIndex)}
                aspectRatio={image.aspectRatio}
                objectPosition={image.objectPosition}
              />
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-2">
          {rightColumn.map((image, idx) => {
            const originalIndex = idx * 2 + 1;
            return (
              <GalleryImage
                key={image.src}
                src={image.src}
                index={originalIndex + 1}
                onClick={() => setOpenIndex(originalIndex)}
                aspectRatio={image.aspectRatio}
                objectPosition={image.objectPosition}
              />
            );
          })}
        </div>
      </div>

      <GalleryDialog
        gallery={GALLERY}
        openIndex={openIndex}
        onOpenChange={(open: boolean) => !open && setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
