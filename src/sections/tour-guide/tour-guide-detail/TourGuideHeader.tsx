import { motion, useReducedMotion } from 'framer-motion';
import { forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Ratings } from '@/components/ui/rating';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import type { TourGuide } from '@/features/tour-guide/types';
import { FaCircleCheck } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

type TourGuideHeaderProps = {
  guide: TourGuide;
  name: string;
  avatar: string;
  coverImage: string;
  shortBio?: string;
  rating: number;
  reviewCount: number;
};

export const TourGuideHeader = forwardRef<HTMLElement, TourGuideHeaderProps>(
  function TourGuideHeader(
    { guide, name, avatar, coverImage, shortBio, rating, reviewCount },
    heroRef,
  ) {
    const { t } = useTranslation();
    const reduceMotion = useReducedMotion();

    return (
      <ParallaxHero
        ref={heroRef}
        image={coverImage}
        heightClass="min-h-[min(92vh,900px)]"
      >
        <div className="flex flex-1 flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
          <div className="mx-auto w-full max-w-7xl">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-10 md:flex-row md:items-end md:gap-12"
            >
              <img
                src={avatar}
                alt={name}
                className="h-40 w-40 shrink-0 rounded-[1.5rem] border-4 border-sand-50/90 object-cover shadow-[var(--shadow-soft)] md:h-44 md:w-44"
              />
              <div className="min-w-0 flex-1 space-y-5 text-sand-50">
                <p className="text-[11px] uppercase tracking-[0.34em] text-sand-100/75">
                  {t('tour_guide.hero_profile_kicker', 'Guide · Vietnam')}
                </p>
                <div className="flex flex-wrap items-end gap-3">
                  <h1 className="font-display text-[clamp(2.35rem,5.8vw,3.85rem)] leading-[0.95] tracking-tight">
                    {name}
                  </h1>
                  <FavoriteButton
                    entityType={FavoriteEntityType.GUIDE}
                    entityId={guide._id}
                    initialIsFavorited={guide.isFavorited}
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-full border border-sand-100/25 bg-sand-50/10 text-sand-50 hover:bg-sand-50/18"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sand-100/90">
                  {guide.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sand-100/25 bg-forest/90 px-2.5 py-1.5 text-sand-50">
                      <FaCircleCheck className="h-3 w-3" aria-hidden />
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
                  {(rating > 0 || reviewCount > 0) && (
                    <span className="inline-flex items-center gap-2 text-sand-100/95">
                      <Ratings
                        rating={rating}
                        variant="yellow"
                        totalStars={5}
                        readOnly
                        size={16}
                      />
                      <span>
                        {rating.toFixed(1)} · {reviewCount} {t('tour_guide.reviews_count')}
                      </span>
                    </span>
                  )}
                  {guide.yearsOfExperience != null && guide.yearsOfExperience > 0 ? (
                    <span>
                      {guide.yearsOfExperience} {t('tour_guide.years_experience')}
                    </span>
                  ) : null}
                </div>

                {shortBio ? (
                  <p className="max-w-[52ch] text-base leading-relaxed text-sand-100/88 md:text-lg">
                    {shortBio}
                  </p>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>
      </ParallaxHero>
    );
  },
);
