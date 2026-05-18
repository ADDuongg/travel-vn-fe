import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/home-editorial/Reveal';
import { useTranslation } from 'react-i18next';
import type { Room } from '@/features/rooms/types';

type Props = {
  room: Room;
};

export function RoomEditorialGalleryGrid({ room }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const rest = room.gallery?.slice(1) ?? [];
  if (rest.length === 0) return null;

  return (
    <section
      id="gallery"
      className="scroll-mt-28 border-y border-charcoal/10 bg-sand-50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-12 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('room.editorial.gallery_kicker', 'Gallery')}
          </p>
          <h2 className="font-display text-4xl text-charcoal">
            {t(
              'room.editorial.gallery_title',
              'Same air, different corners',
            )}
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 md:gap-6">
          {rest.map((g, idx) => (
            <Reveal key={g._id} delay={idx * 0.05}>
              <motion.div
                whileHover={
                  reduceMotion ? undefined : { scale: 1.012 }
                }
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="overflow-hidden rounded-[1.35rem] border border-charcoal/10 shadow-soft"
              >
                <img
                  src={g.url}
                  alt={g.alt ?? ''}
                  className="aspect-[4/3] w-full object-cover"
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

