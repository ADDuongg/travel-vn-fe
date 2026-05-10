import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { ProvinceDetail } from '@/features/provinces/types';
import { getMergedProvinceImages } from './provinceDetailImages';

interface ProvinceGalleryProps {
  province: ProvinceDetail;
}

export function ProvinceGallery({ province }: ProvinceGalleryProps) {
  const { t } = useTranslation();
  const images = getMergedProvinceImages(province);

  if (images.length === 0) {
    return (
      <section id="gallery" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-16 md:px-10 md:py-20">
        <p className="max-w-2xl text-center text-base leading-relaxed text-mist md:text-lg">
          {t('province.detail.gallery_empty')}
        </p>
      </section>
    );
  }

  return (
    <section id="gallery" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-20 md:px-10 md:py-24">
      <Reveal className="mb-10 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('province.detail.gallery_kicker')}
        </p>
        <h2 className="font-display text-4xl text-charcoal">{t('province.detail.gallery_title')}</h2>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2">
        {images.map((image, idx) => {
          const hero = idx === 0;
          return (
            <Reveal
              key={`${province.slug}-${image.url}-${idx}`}
              delay={idx * 0.05}
              className={hero ? 'md:col-span-7 md:row-span-2' : 'md:col-span-5'}
            >
              <motion.div
                whileHover={{ scale: hero ? 1.01 : 1.03 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                className="h-full"
              >
                <img
                  src={image.url}
                  alt={image.alt?.trim() || province.slug}
                  loading="lazy"
                  className={`w-full rounded-[1.35rem] object-cover shadow-soft ${hero ? 'min-h-[300px] md:min-h-[520px]' : 'aspect-[16/11] md:aspect-auto md:min-h-[240px]'}`}
                />
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
