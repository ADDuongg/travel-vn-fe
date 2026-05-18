import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import { BsClockHistory } from 'react-icons/bs';
import { FaUserGroup } from 'react-icons/fa6';
import { AiTwotoneCalendar } from 'react-icons/ai';
import { Ratings } from '@components/ui/rating';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { MapPin, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import type { Tour } from '@/features/tours/types';

function getTourName(
  tour: Tour,
  lang: string,
) {
  return (
    tour.translations?.[lang]?.name ??
    tour.translations?.vi?.name ??
    tour.translations?.en?.name ??
    tour.slug
  );
}

function getShortDesc(
  tour: Tour,
  lang: string,
) {
  return (
    tour.translations?.[lang]?.shortDescription ??
    tour.translations?.vi?.shortDescription ??
    tour.translations?.en?.shortDescription
  );
}

type TourHeaderProps = {
  tour: Tour;
};

const TourHeader: React.FC<TourHeaderProps> = ({ tour }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [galleryOpen, setGalleryOpen] = useState(false);

  const images = useMemo(() => {
    if (!tour) return [] as { _id: string; url: string; alt?: string }[];
    const g = (tour.gallery ?? []).map((g, i) => ({
      _id: (g as { _id?: string })._id ?? `g-${i}`,
      url: g.url,
      alt: g.alt,
    }));
    if (tour.thumbnail?.url) {
      const thumb = {
        _id: (tour.thumbnail as { _id?: string })._id ?? 'thumb',
        url: tour.thumbnail.url,
        alt: tour.thumbnail.alt,
      };
      return [thumb, ...g];
    }
    return g;
  }, [tour]);

  const name = getTourName(tour, language);
  const shortDesc = getShortDesc(tour, language);
  const { days, nights } = tour.duration ?? { days: 0, nights: 0 };
  const rating = tour.ratingSummary?.average ?? 0;
  const reviewCount = tour.ratingSummary?.total ?? 0;
  const main = tour.destinations?.find((d) => d.isMainDestination);
  const province = main?.provinceId;
  const placeLabel =
    typeof province === 'object' && province && 'name' in province
      ? ((province.name as { vi?: string; en?: string })[
          language as 'vi' | 'en'
        ] ??
        (province.name as { vi?: string; en?: string }).vi ??
        (province.name as { vi?: string; en?: string }).en)
      : null;

  const share = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      void navigator
        .share({ title: name, text: name, url })
        .catch(() => copyLink(url));
    } else {
      void copyLink(url);
    }
  };

  const copyLink = (url: string) => {
    void navigator.clipboard.writeText(url);
  };

  const detailItems = [
    {
      icon: <BsClockHistory className="size-5 text-[rgba(28,26,20,0.5)]" />,
      value: (
        <span className="text-sm font-medium text-[#1c1a14]">
          {t('tour.detail.duration_short', { days, nights })}
        </span>
      ),
    },
    {
      icon: <FaUserGroup className="size-5 text-[rgba(28,26,20,0.5)]" />,
      value: (
        <span className="text-sm text-[#1c1a14]">
          {t('tour.detail.max_guests', {
            max: tour.capacity?.maxGuests ?? '—',
          })}
        </span>
      ),
    },
    ...(tour.schedule?.departureDays?.length
      ? [
          {
            icon: (
              <AiTwotoneCalendar className="size-5 text-[rgba(28,26,20,0.5)]" />
            ),
            value: (
              <span className="text-sm text-[#1c1a14]">
                {tour.schedule?.departureDays?.join(', ')}
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <header className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <section className="pt-2">
          {images.length > 0 && (
            <div className="mb-8 grid min-h-[280px] grid-cols-12 gap-3 md:mb-10 md:min-h-[500px] md:gap-4">
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="relative col-span-12 min-h-[220px] cursor-pointer overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.1)] text-left ring-offset-2 transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/40 md:col-span-8 md:min-h-0"
                aria-label={t('hotel.detail.view_photos', 'View all photos')}
              >
                <img
                  src={images[0].url}
                  alt={images[0].alt ?? name}
                  className="h-full w-full min-h-[220px] object-cover md:min-h-0"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c1a14]/50 to-transparent"
                  aria-hidden
                />
                {images.length > 1 && (
                  <span className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {t('hotel.detail.photos_count', {
                      count: images.length,
                      defaultValue: '{{count}} photos',
                    })}
                  </span>
                )}
              </button>
              <div className="col-span-12 grid h-full min-h-[200px] grid-cols-2 grid-rows-2 gap-3 md:col-span-4 md:min-h-0 md:gap-4">
                {images.slice(1, 5).map((img, idx) => (
                  <button
                    key={img._id}
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="relative min-h-[96px] cursor-pointer overflow-hidden rounded-xl border border-[rgba(28,26,20,0.1)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/40"
                  >
                    {idx === 3 && images.length > 5 ? (
                      <>
                        <img
                          src={img.url}
                          alt={img.alt ?? ''}
                          className="h-full w-full min-h-[96px] object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#1c1a14]/50 text-sm font-semibold text-white">
                          +{images.length - 5} {t('common.more', 'more')}
                        </div>
                      </>
                    ) : (
                      <img
                        src={img.url}
                        alt={img.alt ?? ''}
                        className="h-full w-full min-h-[96px] object-cover transition-transform duration-500 hover:scale-105"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {images.length === 0 && (
            <div className="mb-8 flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-[rgba(28,26,20,0.12)] bg-[#faf7f2] text-muted-foreground">
              {t('hotel.detail.no_photos', 'No images yet')}
            </div>
          )}
        </section>
      </div>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-h-[min(90vh,800px)] max-w-4xl overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle asChild>
              <h2
                className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
                style={{
                  fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
                }}
              >
                {t('tour.detail.gallery_title', { name })}
              </h2>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {images.map((g) => (
              <div
                key={g._id}
                className="overflow-hidden rounded-lg border border-[rgba(28,26,20,0.08)]"
              >
                <img
                  src={g.url}
                  alt={g.alt ?? name}
                  className="h-full max-h-72 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-[#F8F8F6]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {placeLabel && (
              <Badge
                variant="secondary"
                className="border border-[rgba(45,106,79,0.25)] bg-[#d4eae0] text-[#1e4d38]"
              >
                <MapPin className="mr-1 size-3" />
                {placeLabel}
              </Badge>
            )}
            {tour.tourType && (
              <span className="rounded-full border border-[rgba(28,26,20,0.1)] bg-white px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-[rgba(28,26,20,0.6)]">
                {tour.tourType}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
              <h1
                className="font-['Playfair_Display',serif] text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1c1a14] sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
                }}
              >
                {name}
              </h1>
              {shortDesc && (
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-[rgba(28,26,20,0.6)] sm:text-lg">
                  {shortDesc}
                </p>
              )}
              {rating > 0 && reviewCount > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Ratings
                      rating={rating}
                      variant="yellow"
                      totalStars={5}
                      readOnly
                      size={16}
                    />
                    <span className="text-sm font-semibold text-[#1c1a14]">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-[rgba(28,26,20,0.5)]">
                      ({reviewCount} {t('tour.card.reviews_label', 'reviews')})
                    </span>
                  </div>
                  <Link
                    to="#reviews"
                    className="text-sm font-medium text-[#2d6a4f] underline-offset-2 hover:underline"
                  >
                    {t('tour.detail.read_reviews', 'Read reviews')}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={share}
                className="h-11 w-11 cursor-pointer rounded-full border-[rgba(28,26,20,0.12)]"
                aria-label={t('common.share', 'Share')}
              >
                <Share2 className="size-4" />
              </Button>
              <FavoriteButton
                entityType={FavoriteEntityType.TOUR}
                entityId={tour._id}
                initialIsFavorited={tour.isFavorited}
                className="h-12 w-12 cursor-pointer rounded-full border border-[rgba(28,26,20,0.1)] bg-white shadow-sm"
                size="icon"
              />
            </div>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-[rgba(28,26,20,0.1)] pt-6">
            {detailItems.map((it, i) => (
              <li key={i} className="flex items-center gap-2">
                {it.icon}
                {it.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default TourHeader;

