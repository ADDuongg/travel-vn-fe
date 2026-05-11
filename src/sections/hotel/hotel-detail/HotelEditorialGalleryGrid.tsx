import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { GalleryItem } from '@/sections/hotel/hotel-detail/hotelEditorialUtils';

type Props = { items: GalleryItem[] };

export function HotelEditorialGalleryGrid({ items }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <section
      id="gallery"
      className="scroll-mt-36 border-y border-charcoal/10 bg-sand-50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-12 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('hotel.editorial.gallery_kicker', 'Gallery')}
          </p>
          <h2 className="font-display text-4xl text-charcoal">
            {t(
              'hotel.editorial.gallery_title',
              'Still frames from the same air',
            )}
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-12 md:gap-6">
          {items.map((g, idx) => (
            <Reveal
              key={`${g.url}-${idx}`}
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
                whileHover={reduceMotion ? undefined : { scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="h-full overflow-hidden rounded-[1.35rem] border border-charcoal/10 shadow-soft"
              >
                <img
                  src={g.url}
                  alt={g.alt}
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
      </div>
    </section>
  );
}
