'use client';

import { useText } from '@/components/TranslatedText';
import { useState } from 'react';
import { GalleryDialog } from './GalleryDialog';
import { GalleryImage } from './GalleryImage';
import { Button } from '@/components/ui/button';
import { GALLERY } from '@/lib/gallery';

// Note: gallery data is centralized in src/lib/gallery.ts

export function GalleryGrid() {
    const text = useText();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Alternate images between columns (odd indices in left, even indices in right)
    const leftColumn = GALLERY.filter((_, idx) => idx % 2 === 0);
    const rightColumn = GALLERY.filter((_, idx) => idx % 2 === 1);

    return (
        <section className="px-4 py-10">
            <div className="text-center">
                <p className="text-[10px] tracking-[0.3em] text-zinc-400">GALLERY</p>
                <h3 className="text-lg font-medium">{text('GALLERY_HEADING')}</h3>
            </div>

            <div className="relative mt-6">
                <div
                    className="grid grid-cols-2 gap-2 px-2 transition-[max-height] duration-500 ease-in-out"
                    style={{
                        maxHeight: isExpanded ? '5000px' : '300px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Left Column - all images prerendered */}
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

                    {/* Right Column - all images prerendered */}
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
