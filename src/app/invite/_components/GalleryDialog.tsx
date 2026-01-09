'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useCallback, useEffect } from 'react';

export interface GalleryImage {
    src: string;
    aspectRatio?: string;
    objectPosition?: string; // e.g., "top", "center", "bottom", "50% 20%"
    note?: string;
}

interface GalleryDialogProps {
    gallery: GalleryImage[];
    openIndex: number | null;
    onOpenChange: (open: boolean) => void;
    onNavigate: (index: number) => void;
}

export function GalleryDialog({ gallery, openIndex, onOpenChange, onNavigate }: GalleryDialogProps) {
    const t = useTranslations('WeddingInvite');
    const total = gallery.length;

    const goPrev = useCallback(() => {
        if (openIndex === null) return;
        onNavigate((openIndex - 1 + total) % total);
    }, [openIndex, total, onNavigate]);

    const goNext = useCallback(() => {
        if (openIndex === null) return;
        onNavigate((openIndex + 1) % total);
    }, [openIndex, total, onNavigate]);

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
                onOpenChange(false);
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [openIndex, goPrev, goNext, onOpenChange]);

    return (
        <Dialog open={openIndex !== null} onOpenChange={onOpenChange}>
            {openIndex !== null && (
                <DialogContent
                    showCloseButton={false}
                    className="flex h-screen w-screen max-w-none items-center justify-center rounded-none border-none bg-black/90 p-0"
                >
                    <DialogTitle className="sr-only">
                        GALLERY {openIndex + 1} / {total}
                    </DialogTitle>
                    <div className="relative mx-auto w-full max-w-[430px] px-4">
                        <div className="relative flex h-[82vh] items-center justify-center select-none">
                            <Image
                                src={gallery[openIndex].src}
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
                                    <ChevronLeftIcon className="size-6" />
                                </button>
                                <button
                                    aria-label="Close"
                                    onClick={() => onOpenChange(false)}
                                    className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:scale-105 hover:bg-black/80"
                                >
                                    <XIcon className="size-5" />
                                </button>
                                <button
                                    aria-label="Next image"
                                    onClick={goNext}
                                    className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:scale-105 hover:bg-black/80"
                                >
                                    <ChevronRightIcon className="size-6" />
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
    );
}
