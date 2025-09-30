'use client';

const IMAGES = [
  '/wedding/g1.jpg',
  '/wedding/g2.jpg',
  '/wedding/g3.jpg',
  '/wedding/g4.jpg',
  '/wedding/g5.jpg',
  '/wedding/g6.jpg',
];

export function GalleryGrid() {
  return (
    <section className="px-4 py-10">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400">GALLERY</p>
        <h3 className="text-lg font-medium">갤러리</h3>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 px-2">
        {IMAGES.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-md">
            <img src={src} alt={`gallery ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
