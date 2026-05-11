import { motion, useReducedMotion } from 'framer-motion';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Ratings } from '@/components/ui/rating';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import type { TourGuide } from '@/features/tour-guide/types';
import { FaCircleCheck } from 'react-icons/fa6';

export type TourGuideDetailHeroProps = {
  guide: TourGuide;
  name: string;
  /** Avatar URL first; caller resolves fallbacks. */
  heroImage: string;
  storyLead?: string;
  rating: number;
  reviewCount: number;
};

export const TourGuideDetailHero = forwardRef<
  HTMLElement,
  TourGuideDetailHeroProps
>(function TourGuideDetailHero(
  { guide, name, heroImage, storyLead, rating, reviewCount },
  heroRef,
) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const metaParts: string[] = [];
  if (guide.languages?.length) {
    metaParts.push(guide.languages.join(' · '));
  }
  if (guide.yearsOfExperience != null && guide.yearsOfExperience > 0) {
    metaParts.push(
      `${guide.yearsOfExperience} ${t('tour_guide.years_experience')}`,
    );
  }

  return (
    <ParallaxHero
      ref={heroRef}
      image={heroImage}
      heightClass="min-h-[100svh]"
    >
      <div className="flex flex-1 flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-6xl space-y-5 text-sand-50"
        >
          <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/75">
            {t('tour_guide.detail.hero_kicker')}
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)] leading-[0.95]">
              {name}
            </h1>
            <FavoriteButton
              entityType={FavoriteEntityType.GUIDE}
              entityId={guide._id}
              initialIsFavorited={guide.isFavorited}
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full border border-sand-100/25 bg-sand-50/10 text-sand-50 hover:bg-sand-50/18"
            />
          </div>
          {storyLead ? (
            <p className="max-w-2xl text-lg text-sand-100/85 md:text-xl">
              {storyLead}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[11px] uppercase tracking-[0.24em] text-sand-100/70">
            {rating > 0 || reviewCount > 0 ? (
              <span className="inline-flex items-center gap-2 normal-case tracking-normal text-sand-100/90">
                <Ratings
                  rating={rating}
                  variant="yellow"
                  totalStars={5}
                  readOnly
                  size={16}
                />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em]">
                  {rating.toFixed(1)} · {reviewCount}{' '}
                  {t('tour_guide.reviews_count')}
                </span>
              </span>
            ) : null}
            {guide.isVerified ? (
              <span className="inline-flex items-center gap-1 normal-case">
                <FaCircleCheck className="h-3.5 w-3.5" aria-hidden />
                {t('tour_guide.verified')}
              </span>
            ) : null}
            <Badge
              variant={guide.isAvailable ? 'default' : 'secondary'}
              className={
                guide.isAvailable
                  ? 'border border-sand-100/20 bg-forest text-sand-50 hover:bg-forest/90'
                  : 'border border-charcoal/20 bg-charcoal/60 text-sand-100'
              }
            >
              {guide.isAvailable
                ? t('tour_guide.available')
                : t('tour_guide.not_available')}
            </Badge>
          </div>
          {metaParts.length > 0 ? (
            <p className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.24em] text-sand-100/70">
              {metaParts.map((part, i) => (
                <span key={`${part}-${i}`} className="contents">
                  {i > 0 ? (
                    <span className="text-sand-100/40" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <span>{part}</span>
                </span>
              ))}
            </p>
          ) : null}
        </motion.div>
      </div>
    </ParallaxHero>
  );
});
