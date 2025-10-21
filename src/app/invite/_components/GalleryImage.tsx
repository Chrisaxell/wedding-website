import Image from 'next/image';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('WeddingInvite');

  return (
    <div
      className="group relative w-full flex-shrink-0 cursor-pointer overflow-hidden rounded bg-zinc-100"
      onClick={onClick}
      style={{ aspectRatio: aspectRatio, minHeight: aspectRatio === 'auto' ? '200px' : undefined }}
    >
      <Image
        src={src}
        alt={t('GALLERY_ALT', { index })}
        fill
        unoptimized
        className="object-cover transition-transform duration-300 hover:scale-[1.03]"
        style={{ objectPosition }}
        priority={index <= 3}
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </div>
  );
}
