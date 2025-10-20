'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

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
  '/images/gallery photos/16 완(볼 제거)-3.jpg',
  '/images/gallery photos/17 완-3.jpg',
  '/images/gallery photos/18 완-3.jpg',
  '/images/gallery photos/20 완-3.jpg',
  '/images/gallery photos/22 완-3.jpg',
  '/images/gallery photos/23 완-3.jpg',
  '/images/gallery photos/21 완-3.jpg',
];

export function GalleryGrid() {
  const t = useTranslations('WeddingInvite');

  // Group images into sets of 3 for the alternating pattern
  const imageGroups: Array<{ type: 'left' | 'right'; images: string[] }> = [];
  for (let i = 0; i < GALLERY_IMAGES.length; i += 3) {
    const isLeftPattern = Math.floor(i / 3) % 2 === 0;
    imageGroups.push({
      type: isLeftPattern ? 'left' : 'right',
      images: GALLERY_IMAGES.slice(i, i + 3),
    });
  }

  return (
    <section className="px-4 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">{t('GALLERY_LABEL')}</p>
        <h3 className="text-lg font-medium">{t('GALLERY_HEADING')}</h3>
      </div>

      {/* Gallery with alternating pattern */}
      <div className="mt-6 space-y-2 px-2">
        {imageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex gap-2">
            {group.type === 'left' ? (
              <>
                {/* 2 horizontal images stacked */}
                <div className="flex flex-1 flex-col gap-2">
                  {group.images.slice(0, 2).map((src, i) => (
                    <div key={i} className="overflow-hidden">
                      <Image
                        src={src}
                        alt={t('GALLERY_ALT', { index: groupIndex * 3 + i + 1 })}
                        width={800}
                        height={600}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {/* 1 portrait image */}
                {group.images[2] && (
                  <div className="flex flex-1 items-center">
                    <div className="w-full overflow-hidden">
                      <Image
                        src={group.images[2]}
                        alt={t('GALLERY_ALT', { index: groupIndex * 3 + 3 })}
                        width={600}
                        height={800}
                        className="aspect-[3/4] w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* 1 portrait image */}
                {group.images[0] && (
                  <div className="flex flex-1 items-center">
                    <div className="w-full overflow-hidden">
                      <Image
                        src={group.images[0]}
                        alt={t('GALLERY_ALT', { index: groupIndex * 3 + 1 })}
                        width={600}
                        height={800}
                        className="aspect-[3/4] w-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {/* 2 horizontal images stacked */}
                <div className="flex flex-1 flex-col gap-2">
                  {group.images.slice(1, 3).map((src, i) => (
                    <div key={i} className="overflow-hidden">
                      <Image
                        src={src}
                        alt={t('GALLERY_ALT', { index: groupIndex * 3 + i + 2 })}
                        width={800}
                        height={600}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
