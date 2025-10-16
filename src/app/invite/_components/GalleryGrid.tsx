'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

const HERO_IMAGE = '/images/gallery photos/16 완(볼 제거)-3.jpg';

const GALLERY_IMAGES = [
  '/images/gallery photos/2 완-3.jpg',
  '/images/gallery photos/4 완-3.jpg',
  '/images/gallery photos/6 완-3.jpg',
  '/images/gallery photos/8 완-3.jpg',
  '/images/gallery photos/9완-3.jpg',
  '/images/gallery photos/11 완-3.jpg',
  '/images/gallery photos/13 완-3.jpg',
  '/images/gallery photos/14 완-3.jpg',
  '/images/gallery photos/15 완-3.jpg',
  '/images/gallery photos/17 완-3.jpg',
  '/images/gallery photos/18 완-3.jpg',
  '/images/gallery photos/20 완-3.jpg',
  '/images/gallery photos/22 완-3.jpg',
  '/images/gallery photos/23 완-3.jpg',
  '/images/gallery photos/21 완-3.jpg', // Last one as requested
];

export function GalleryGrid() {
  const t = useTranslations('WeddingInvite');
  return (
    <section className="px-4 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">{t('GALLERY_LABEL')}</p>
        <h3 className="text-lg font-medium">{t('GALLERY_HEADING')}</h3>
      </div>

      {/* Hero image - photo 16 */}
      <div className="mt-6 overflow-hidden rounded-lg px-2">
        <Image
          src={HERO_IMAGE}
          alt={t('GALLERY_ALT', { index: 16 })}
          width={1200}
          height={800}
          className="w-full object-cover"
          priority
        />
      </div>

      {/* Gallery grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 px-2">
        {GALLERY_IMAGES.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-md">
            <Image
              src={src}
              alt={t('GALLERY_ALT', { index: i + 1 })}
              width={800}
              height={600}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
