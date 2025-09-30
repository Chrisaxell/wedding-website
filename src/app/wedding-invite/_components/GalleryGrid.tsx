'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

const IMAGES = ['/cat.jpg', '/cat.jpg', '/cat.jpg', '/cat.jpg', '/cat.jpg', '/cat.jpg'];

export function GalleryGrid() {
  const t = useTranslations('WeddingInvite');
  return (
    <section className="px-4 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">{t('GALLERY_LABEL')}</p>
        <h3 className="text-lg font-medium">{t('GALLERY_HEADING')}</h3>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 px-2">
        {IMAGES.map((src, i) => (
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
