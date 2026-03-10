import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProvinceDetailQuery } from '@/features/provinces/hooks';
import type { ImageItem } from '@/features/provinces/types';

export function ProvinceGallery() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useProvinceDetailQuery(slug ?? '');
  const [activeIndex, setActiveIndex] = useState(0);

  const images: ImageItem[] = [];
  const seen = new Set<string>();
  if (data?.thumbnail?.url && !seen.has(data.thumbnail.url)) {
    images.push(data.thumbnail);
    seen.add(data.thumbnail.url);
  }
  if (data?.gallery?.length) {
    const sorted = [...data.gallery].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const img of sorted) {
      if (img.url && !seen.has(img.url)) {
        images.push(img);
        seen.add(img.url);
      }
    }
  }

  if (images.length === 0) return null;

  const mainImage = images[activeIndex] ?? images[0];
  const sideImages = images.filter((_, i) => i !== activeIndex).slice(0, 4);

  return (
    <section className="px-4 mb-16" id="gallery">
      <h2 className="text-[#111813] dark:text-white text-3xl font-bold pb-8">Gallery</h2>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8 rounded-xl overflow-hidden ring-1 ring-[#dbe6df] dark:ring-[#1e3a29] aspect-[16/9]">
          <img
            src={mainImage.url}
            alt={mainImage.alt ?? 'Province'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="col-span-12 md:col-span-4 grid grid-cols-2 grid-rows-2 gap-4">
          {sideImages.map((img) => (
            <button
              key={img.url}
              type="button"
              onClick={() => {
                const idx = images.findIndex((x) => x.url === img.url);
                if (idx >= 0) setActiveIndex(idx);
              }}
              className="rounded-xl overflow-hidden ring-1 ring-[#dbe6df] dark:ring-[#1e3a29] hover:ring-2 hover:ring-primary transition-all"
            >
              <img
                src={img.url}
                alt={img.alt ?? 'Province'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
