'use client';

import { useText } from '@/components/TranslatedText';
import { useState, useEffect } from 'react';
import { GalleryDialog } from './GalleryDialog';
import { GalleryImage } from './GalleryImage';
import { Button } from '@/components/ui/button';
import { GALLERY } from '@/lib/gallery';

// Note: gallery data is centralized in src/lib/gallery.ts

// Preload gallery images on the client so expanding the gallery / opening dialog is instant
// We use a lightweight Image() prefetch which leverages the browser cache.

const INITIAL_ITEMS_PER_COLUMN_LEFT = 3; // Left column shows 3 images with 3rd cut off
const INITIAL_ITEMS_PER_COLUMN_RIGHT = 2; // Right column shows only 2 images

export function GalleryGrid() {
    const text = useText();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        GALLERY.forEach((img) => {
            const i = new Image();
            i.src = img.src;
        });
    }, []);

    // Alternate images between columns (odd indices in left, even indices in right)
    const leftColumn = GALLERY.filter((_, idx) => idx % 2 === 0);
    const rightColumn = GALLERY.filter((_, idx) => idx % 2 === 1);

    // Limit displayed images when not expanded
    const displayLeftColumn = isExpanded ? leftColumn : leftColumn.slice(0, INITIAL_ITEMS_PER_COLUMN_LEFT);
    const displayRightColumn = isExpanded ? rightColumn : rightColumn.slice(0, INITIAL_ITEMS_PER_COLUMN_RIGHT);

    return (
        <section className="px-4 py-10">
            <div className="text-center">
                <p className="text-[10px] tracking-[0.3em] text-zinc-400">GALLERY</p>
                <h3 className="text-lg font-medium">{text('GALLERY_HEADING')}</h3>
            </div>

            <div className="relative mt-6">
                <div className="grid grid-cols-2 gap-2 px-2">
                    {/* Left Column - shows 2 full images + barely top of 3rd portrait */}
                    <div
                        className="flex flex-col gap-2"
                        style={!isExpanded ? { maxHeight: '300px', overflow: 'hidden' } : undefined}
                    >
                        {displayLeftColumn.map((image, idx) => {
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

                    {/* Right Column - shows only 2 full images */}
                    <div
                        className="flex flex-col gap-2"
                        style={!isExpanded ? { maxHeight: '300px', overflow: 'hidden' } : undefined}
                    >
                        {displayRightColumn.map((image, idx) => {
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

                {/* More aggressive but shorter fade overlay when not expanded */}
                {!isExpanded && (
                    <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-white to-transparent" />
                )}
            </div>

            {/* Show More Button */}
            {!isExpanded && (
                <div className="mt-6 flex justify-center">
                    <Button onClick={() => setIsExpanded(true)} variant="outline" className="px-8">
                        {text('GALLERY_SHOW_MORE')}
                    </Button>
                </div>
            )}

            <GalleryDialog
                gallery={GALLERY}
                openIndex={openIndex}
                onOpenChange={(open: boolean) => !open && setOpenIndex(null)}
                onNavigate={setOpenIndex}
            />
        </section>
    );
}
