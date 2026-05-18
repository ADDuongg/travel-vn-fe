import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { TourGuide } from '@/features/tour-guide/types';

type TourGuideDetailGalleryGridProps = {
  guide: TourGuide;

  images: Array<{ url: string; alt?: string }>;
};

export function TourGuideDetailGalleryGrid({
  guide,
  images,
}: TourGuideDetailGalleryGridProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 md:px-10 md:py-28"
    >
      <Reveal className="mb-12 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('tour_guide.gallery_chapter_kicker')}
        </p>
        <h2 className="font-display text-4xl text-charcoal">
          {t('tour_guide.detail.gallery_title')}
        </h2>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-12 md:gap-6">
        {images.map((g, idx) => (
          <Reveal
            key={g.url}
            delay={idx * 0.05}
            className={
              idx === 0
                ? 'md:col-span-7 md:row-span-2'
                : idx === 1
                  ? 'md:col-span-5'
                  : idx === 2
                    ? 'md:col-span-5'
                    : 'md:col-span-7'
            }
          >
            <motion.div
              whileHover={
                reduceMotion ? undefined : { scale: 1.015 }
              }
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="h-full overflow-hidden rounded-[1.35rem] border border-charcoal/10 shadow-[var(--shadow-soft)]"
            >
              <img
                src={g.url}
                alt={g.alt ?? guide.user?.fullName ?? t('tour_guide.gallery_alt')}
                className={`h-full w-full object-cover ${
                  idx === 0
                    ? 'min-h-[280px] md:min-h-[520px]'
                    : 'aspect-[4/5] md:aspect-auto md:min-h-[240px]'
                }`}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

