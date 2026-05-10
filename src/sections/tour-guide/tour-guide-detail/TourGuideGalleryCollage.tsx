import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import { MagazineSectionHeading } from '@/components/home-editorial/MagazineSectionHeading';
import type { TourGuide } from '@/features/tour-guide/types';

type TourGuideGalleryCollageProps = {
  guide: TourGuide;
  /** When the first gallery image is used as the page hero, pass `1` to avoid duplicating it in the collage */
  startIndex?: number;
};

export function TourGuideGalleryCollage({
  guide,
  startIndex = 0,
}: TourGuideGalleryCollageProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const images = (guide.gallery ?? []).slice(startIndex);

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="scroll-mt-44 space-y-10">
      <MagazineSectionHeading
        kicker={t('tour_guide.gallery_chapter_kicker', 'Field frames')}
        title={t('tour_guide.gallery_chapter_title', 'Moments from the route')}
        className="space-y-6"
      >
        <p className="max-w-[52ch] text-sm leading-relaxed text-mist">
          {t(
            'tour_guide.gallery_chapter_lead',
            'Light, weather, and streets — the texture behind the itinerary.',
          )}
        </p>
      </MagazineSectionHeading>

      <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2">
        {images.map((image, idx) => {
          const hero = idx === 0;
          return (
            <Reveal
              key={`${guide._id}-${image.url}-${idx}`}
              delay={idx * 0.05}
              className={hero ? 'md:col-span-7 md:row-span-2' : 'md:col-span-5'}
            >
              <motion.a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduceMotion ? undefined : { scale: hero ? 1.01 : 1.03 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                className="block h-full overflow-hidden rounded-[1.35rem] shadow-[var(--shadow-soft)] ring-1 ring-charcoal/10 transition hover:ring-2 hover:ring-forest/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50"
              >
                <img
                  src={image.url}
                  alt={image.alt?.trim() || `${t('tour_guide.gallery_alt')} ${idx + 1}`}
                  loading="lazy"
                  className={`w-full rounded-[1.35rem] object-cover ${hero ? 'min-h-[280px] md:min-h-[520px]' : 'aspect-[16/11] md:aspect-auto md:min-h-[240px]'}`}
                />
              </motion.a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
