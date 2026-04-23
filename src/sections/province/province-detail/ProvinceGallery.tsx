import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ImageItem, ProvinceDetail } from '@/features/provinces/types';

interface ProvinceGalleryProps {
  province: ProvinceDetail;
}

export function ProvinceGallery({ province }: ProvinceGalleryProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = useMemo(() => {
    const merged: ImageItem[] = [];
    const seen = new Set<string>();
    if (province.thumbnail?.url) {
      merged.push(province.thumbnail);
      seen.add(province.thumbnail.url);
    }
    (province.gallery ?? [])
      .slice()
      .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
      .forEach((image) => {
        if (image.url && !seen.has(image.url)) {
          merged.push(image);
          seen.add(image.url);
        }
      });
    return merged;
  }, [province.gallery, province.thumbnail]);

  useEffect(() => {
    setActiveIndex(0);
  }, [province._id]);

  if (images.length === 0) {
    return null;
  }

  const mainImage = images[activeIndex] ?? images[0];
  const sideImages = images.filter((_, index) => index !== activeIndex).slice(0, 4);

  return (
    <section id="gallery" className="scroll-mt-44 rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <h2
        className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-3xl"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {t('province.gallery', 'Gallery')}
      </h2>
      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className="col-span-12 aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-[rgba(28,26,20,0.1)] md:col-span-8">
          <img src={mainImage.url} alt={mainImage.alt ?? 'Province'} className="h-full w-full object-cover" />
        </div>
        <div className="col-span-12 grid grid-cols-2 grid-rows-2 gap-4 md:col-span-4">
          {sideImages.map((image) => (
            <button
              key={image.url}
              type="button"
              onClick={() => {
                const index = images.findIndex((item) => item.url === image.url);
                if (index >= 0) {
                  setActiveIndex(index);
                }
              }}
              className="overflow-hidden rounded-xl ring-1 ring-[rgba(28,26,20,0.1)] transition-all hover:ring-2 hover:ring-[#c8102e]/50"
            >
              <img src={image.url} alt={image.alt ?? 'Province'} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
