import { Badge } from '@/components/ui/badge';
import { Ratings } from '@/components/ui/rating';
import Container from '@/components/Container';
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

export function TourGuideHeader({
  guide,
  name,
  avatar,
  coverImage,
  shortBio,
  rating,
  reviewCount,
}: TourGuideHeaderProps) {
  const { t } = useTranslation();

  return (
    <section className="relative h-[320px] w-full overflow-hidden bg-slate-800 md:h-[380px]">
      <img
        src={coverImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative flex h-full flex-col justify-end px-4 pb-8 md:px-6 md:pb-10">
        <Container className="flex flex-col md:flex-row md:items-end md:gap-8">
          <img
            src={avatar}
            alt={name}
            className="h-24 w-24 shrink-0 rounded-2xl border-4 border-white object-cover shadow-xl md:h-32 md:w-32"
          />
          <div className="mt-4 md:mt-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-white md:text-3xl">{name}</h1>
              <FavoriteButton
                entityType={FavoriteEntityType.GUIDE}
                entityId={guide._id}
                initialIsFavorited={guide.isFavorited}
                size="icon"
                className="h-10 w-10 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/15"
              />
              {guide.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white">
                  <FaCircleCheck className="h-3.5 w-3.5" />
                  {t('tour_guide.verified')}
                </span>
              )}
              <Badge
                variant={guide.isAvailable ? 'default' : 'secondary'}
                className={
                  guide.isAvailable
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-500'
                }
              >
                {guide.isAvailable
                  ? t('tour_guide.available')
                  : t('tour_guide.not_available')}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/95">
              {(rating > 0 || reviewCount > 0) && (
                <div className="flex items-center gap-2">
                  <Ratings
                    rating={rating}
                    variant="yellow"
                    totalStars={5}
                    readOnly
                    size={18}
                  />
                  <span className="text-sm font-medium">
                    {rating.toFixed(1)} ({reviewCount} {t('tour_guide.reviews_count')})
                  </span>
                </div>
              )}
              {guide.yearsOfExperience != null && guide.yearsOfExperience > 0 && (
                <span className="text-sm font-medium">
                  {guide.yearsOfExperience} {t('tour_guide.years_experience')}
                </span>
              )}
            </div>
            {shortBio && (
              <p className="mt-2 max-w-2xl text-sm text-white/90 line-clamp-2 md:text-base">
                {shortBio}
              </p>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}
