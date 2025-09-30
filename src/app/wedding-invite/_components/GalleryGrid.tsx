'use client';

const IMAGES = ['/cat.jpg', '/cat.jpg', '/cat.jpg', '/cat.jpg', '/cat.jpg', '/cat.jpg'];

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
