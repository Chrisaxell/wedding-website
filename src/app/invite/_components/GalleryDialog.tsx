'use client';

import Image from 'next/image';
import { useText } from '@/components/TranslatedText';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    const text = useText();
    const total = gallery.length;

    // Check if transitioning between first and last (wrap-around)
    const isWrapTransition = useRef(false);

    const goPrev = useCallback(() => {
        if (openIndex === null) return;
        const newIndex = (openIndex - 1 + total) % total;
        isWrapTransition.current = openIndex === 0; // Going from first to last
        onNavigate(newIndex);
    }, [openIndex, total, onNavigate]);

    const goNext = useCallback(() => {
        if (openIndex === null) return;
        const newIndex = (openIndex + 1) % total;
        isWrapTransition.current = openIndex === total - 1; // Going from last to first
        onNavigate(newIndex);
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

    // Touch swipe navigation
    const touchStartX = useRef<number | null>(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const currentX = e.touches[0].clientX;
        const offset = currentX - touchStartX.current;
        setSwipeOffset(offset);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        if (Math.abs(swipeOffset) > minSwipeDistance) {
            if (swipeOffset < 0) {
                // Swiped left -> next image
                goNext();
            } else {
                // Swiped right -> previous image
                goPrev();
            }
        }

        setSwipeOffset(0);
        touchStartX.current = null;
    };

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
                    <div className="relative mx-auto w-full max-w-[430px] overflow-hidden">
                        {/* Carousel track - all images in a row */}
                        <div
                            className="flex h-[82vh] items-center select-none"
                            style={{
                                transform: `translateX(calc(-${openIndex * 100}% + ${swipeOffset}px))`,
                                transition: isDragging
                                    ? 'none'
                                    : isWrapTransition.current
                                      ? 'transform 600ms ease-out'
                                      : 'transform 300ms ease-out',
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {gallery.map((img, idx) => (
                                <div
                                    key={img.src}
                                    className="flex h-full w-full shrink-0 items-center justify-center px-4"
                                >
                                    <Image
                                        src={img.src}
                                        alt={text('GALLERY_ALT', { index: idx + 1 })}
                                        width={900}
                                        height={1200}
                                        className="max-h-full max-w-full object-contain"
                                        priority={Math.abs(idx - openIndex) <= 1}
                                    />
                                </div>
                            ))}
                        </div>
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
                        <div className="absolute inset-x-0 bottom-20 text-center text-[11px] tracking-wide text-white/60">
                            {openIndex + 1} / {total}
                        </div>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
}
