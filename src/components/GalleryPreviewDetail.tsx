import * as React from 'react';
import { AiOutlineVideoCamera } from 'react-icons/ai';
import { BsImages } from 'react-icons/bs';
import destination1 from '/images/destination1.png';

type Item = { id: string; src: string; alt: string };

export function GalleryPreviewDetail() {
  const images: Item[] = Array(5)
    .fill(null)
    .map((_, i) => ({
      id: `img-${i}`,
      src: destination1,
      alt: `Preview ${i + 1}`,
    }));

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Ảnh lớn (index 0) */}
      <div className="relative col-span-12 md:col-span-8 rounded-xl overflow-hidden ring-1 ring-border aspect-[16/9]">
        <img
          src={images[0].src}
          alt={images[0].alt}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <BsImages size={20} />
            <span>Gallery</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <AiOutlineVideoCamera size={20} />
            <span>Video</span>
          </button>
        </div>
      </div>

      {/* Ảnh nhỏ (index 1 → 4) */}
      <div className="col-span-12 md:col-span-4 grid grid-cols-2 grid-rows-2 gap-4">
        {images.slice(1).map((img) => (
          <div
            key={img.id}
            className="rounded-xl overflow-hidden ring-1 ring-border"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
