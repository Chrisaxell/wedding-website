'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { DialogTitle } from '@/components/ui/dialog';

// Curated gallery configuration based on user rules
// Exclusions: 1,3 (not chosen), 5 (dup of 4), 9 (dup of 10), 15 (dup of 14), 16 (hero), 20 (similar to 19), 21 (outro)
// Included & ordered: 19 (lead), 18, 10, 2, 11, 12, 13, 14, 17, 6, 22, 7, 23, 8, 4
// Selfies (6,7,8) spread out; horizontals (19,18,2,11,17) interleaved with portraits.
interface GalleryImage {
  src: string;
  orientation: 'portrait' | 'landscape';
  note?: string; // optional future meta (e.g., "selfie")
}

const GALLERY: GalleryImage[] = [
  { src: '/images/gallery photos/20 완-3.jpg', orientation: 'landscape' },
  { src: '/images/gallery photos/18 완-3.jpg', orientation: 'landscape' },
  { src: '/images/gallery photos/2 완-3.jpg', orientation: 'landscape' },
  { src: '/images/gallery photos/11 완-3.jpg', orientation: 'landscape' },
  { src: '/images/gallery photos/12 완-3.jpg', orientation: 'portrait' },
  { src: '/images/gallery photos/13 완-3.jpg', orientation: 'portrait' },
  { src: '/images/gallery photos/15 완-3.jpg', orientation: 'portrait' },
  { src: '/images/gallery photos/17 완-3.jpg', orientation: 'landscape' },
  { src: '/images/gallery photos/9완-3.jpg', orientation: 'portrait' },
  { src: '/images/gallery photos/6 완-3.jpg', orientation: 'portrait', note: 'selfie' },
  { src: '/images/gallery photos/22 완-3.jpg', orientation: 'portrait' },
  { src: '/images/gallery photos/7 완-3.jpg', orientation: 'portrait', note: 'selfie' },
  { src: '/images/gallery photos/23 완-3.jpg', orientation: 'portrait' },
  { src: '/images/gallery photos/8 완-3.jpg', orientation: 'portrait', note: 'selfie' },
  { src: '/images/gallery photos/4 완-3.jpg', orientation: 'portrait' },
];

export function GalleryGrid() {
  const t = useTranslations('WeddingInvite');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = GALLERY.length;

  const goPrev = useCallback(() => {
    setOpenIndex((idx) => (idx === null ? null : (idx - 1 + total) % total));
  }, [total]);
  const goNext = useCallback(() => {
    setOpenIndex((idx) => (idx === null ? null : (idx + 1) % total));
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'Escape') {
        setOpenIndex(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, goPrev, goNext]);

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
              className={`relative overflow-hidden rounded bg-zinc-100 ${spanClasses} cursor-pointer`}
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
            </li>
          );
        })}
      </ul>

      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        {openIndex !== null && (
          <DialogContent
            showCloseButton={false}
            className="flex h-screen w-screen max-w-none items-center justify-center rounded-none border-none bg-black/90 p-0"
          >
            <DialogTitle className="sr-only">
              {t('GALLERY_LABEL')} {openIndex + 1} / {total}
            </DialogTitle>
            <div className="relative mx-auto w-full max-w-[430px] px-4">
              <div className="relative flex h-[82vh] items-center justify-center select-none">
                <Image
                  src={GALLERY[openIndex].src}
                  alt={t('GALLERY_ALT', { index: openIndex + 1 })}
                  width={900}
                  height={1200}
                  className="max-h-full max-w-full object-contain"
                  priority
                />
                {/* Floating control buttons (stable position) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-5">
                  <button
                    aria-label="Previous image"
                    onClick={goPrev}
                    className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:scale-105 hover:bg-black/80"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    aria-label="Close"
                    onClick={() => setOpenIndex(null)}
                    className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:scale-105 hover:bg-black/80"
                  >
                    <X className="size-5" />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={goNext}
                    className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:scale-105 hover:bg-black/80"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </div>
              </div>
              <div className="mt-3 mb-2 text-center text-[11px] tracking-wide text-white/60">
                {openIndex + 1} / {total}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
