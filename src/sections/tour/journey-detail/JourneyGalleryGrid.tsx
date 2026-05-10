import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { TourGalleryItemVm } from './tourJourneyMap';

type Props = {
  items: TourGalleryItemVm[];
};

export function JourneyGalleryGrid({ items }: Props) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <div className="grid gap-5 md:grid-cols-12 md:gap-6">
      {items.map((g, idx) => (
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
            whileHover={{ scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="h-full overflow-hidden rounded-[1.35rem] border border-charcoal/10 shadow-[var(--shadow-soft)]"
          >
            <img
              src={g.url}
              alt={g.alt || t('tour.journey.gallery.alt', 'Tour gallery')}
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
  );
}
