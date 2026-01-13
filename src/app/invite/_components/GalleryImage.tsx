import Image from 'next/image';
import { useText } from '@/components/TranslatedText';

type GalleryImageProps = {
    src: string;
    index: number;
    isLarge?: boolean;
    isLandscape?: boolean;
    onClick: () => void;
    aspectRatio?: string; // e.g., "4/3", "16/9", or "auto" for natural
    objectPosition?: string; // e.g., "top", "center", "bottom", "50% 20%"
};

export function GalleryImage({
    src,
    index,
    onClick,
    aspectRatio = 'auto',
    objectPosition = 'center',
}: GalleryImageProps) {
    const text = useText();

    return (
        <div
            className="group relative w-full flex-shrink-0 cursor-pointer overflow-hidden rounded bg-zinc-100"
            onClick={onClick}
            style={{ aspectRatio: aspectRatio, minHeight: aspectRatio === 'auto' ? '200px' : undefined }}
        >
            <Image
                src={src}
                alt={text('GALLERY_ALT', { index })}
                fill
                unoptimized
                className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                style={{ objectPosition }}
                priority={index <= 3}
                sizes="(max-width: 768px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02Ly4vMj1CRUI+PkZGTk5PT09PT09PT09PT09PT09PT0//2wBDARUXFx4aHh4aGh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
        </div>
    );
}
