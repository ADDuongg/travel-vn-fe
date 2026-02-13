import React from 'react';
import { ResponsiveH6 } from '@components/ui/typography';
import { BsClockHistory } from 'react-icons/bs';
import { FaUserGroup } from 'react-icons/fa6';
import { AiTwotoneCalendar } from 'react-icons/ai';
import SharedHeader from '@/sections/shared/SharedHeader';
import { GalleryPreviewDetail } from '@components/GalleryPreviewDetail';
import { useTourDetail } from './TourDetailContext';
import { useLanguage } from '@/hooks/useLanguage';

function getTourName(tour: NonNullable<ReturnType<typeof useTourDetail>>, lang: string) {
  return tour.translations?.[lang]?.name ?? tour.translations?.vi?.name ?? tour.translations?.en?.name ?? tour.slug;
}

function getShortDesc(tour: NonNullable<ReturnType<typeof useTourDetail>>, lang: string) {
  return tour.translations?.[lang]?.shortDescription ?? tour.translations?.vi?.shortDescription ?? tour.translations?.en?.shortDescription;
}

const TourHeader: React.FC = () => {
  const tour = useTourDetail();
  const { language } = useLanguage();

  if (!tour) {
    return (
      <section className="mt-20">
        <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
      </section>
    );
  }

  const name = getTourName(tour, language);
  const shortDesc = getShortDesc(tour, language);
  const { days, nights } = tour.duration ?? { days: 0, nights: 0 };
  const rating = tour.ratingSummary?.average ?? 0;
  const reviewCount = tour.ratingSummary?.total ?? 0;

  const gallery = (tour.gallery ?? []).map((g, i) => ({
    _id: (g as { _id?: string })._id ?? `g-${i}`,
    url: g.url,
    alt: g.alt,
    order: g.order ?? i,
  }));
  const hasGallery = gallery.length > 0 || tour.thumbnail?.url;
  const galleryCount = Math.max(gallery.length, tour.thumbnail?.url ? 1 : 0);

  const detailItems = [
    {
      icon: <BsClockHistory size={24} className="text-muted-foreground" />,
      value: <ResponsiveH6 className="font-normal">{days}D / {nights}N</ResponsiveH6>,
    },
    {
      icon: <FaUserGroup size={24} className="text-muted-foreground" />,
      value: <span>Max: {tour.capacity?.maxGuests ?? '-'} people</span>,
    },
    ...(tour.schedule?.departureDays?.length
      ? [
          {
            icon: <AiTwotoneCalendar size={24} className="text-muted-foreground" />,
            value: <span>{tour.schedule.departureDays.join(', ')}</span>,
          },
        ]
      : []),
  ];

  return (
    <SharedHeader
      title={name}
      subtitle={shortDesc ?? undefined}
      rating={rating}
      reviewCount={reviewCount}
      details={detailItems}
      GalleryComponent={
        hasGallery ? (
          <GalleryPreviewDetail
            gallery={
              gallery.length > 0
                ? gallery
                : [{ _id: 'thumb', url: tour.thumbnail!.url, alt: tour.thumbnail?.alt }]
            }
            thumbnail={tour.thumbnail as { _id: string; url: string; alt?: string } | undefined}
            overlayLabel={galleryCount > 1 ? `View all ${galleryCount} photos` : undefined}
          />
        ) : undefined
      }
    />
  );
};

export default TourHeader;
