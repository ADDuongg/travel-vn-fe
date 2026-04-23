import { useMemo } from 'react';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHotelDetailQuery } from '@/features/hotels/hooks';
import type { Hotel } from '@/features/hotels/types';
import HotelHeader from '@/sections/hotel/hotel-detail/HotelHeader';
import HotelInfo from '@/sections/hotel/hotel-detail/HotelInfo';
import HotelReviews from '@/sections/hotel/hotel-detail/HotelReviews';
import HotelRooms from '@/sections/hotel/hotel-detail/HotelRooms';
import { HotelMapSection } from '@/sections/hotel/hotel-detail/HotelMapSection';
import { HotelFloatingContactBar } from '@/sections/hotel/hotel-detail/HotelFloatingContactBar';
import { AnimatedTabs } from '@components/AnimatedTabs';

const HotelDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading, isError } = useHotelDetailQuery(id);

  const hasLocation = Boolean(
    hotel?.location &&
    typeof hotel.location.lat === 'number' &&
    typeof hotel.location.lng === 'number',
  );

  const hotelTabs = useMemo(
    () => [
      { id: 'overview', label: t('hotel.nav.overview', 'Overview') },
      { id: 'rooms', label: t('hotel.nav.rooms', 'Rooms') },
      { id: 'reviews', label: t('hotel.nav.reviews', 'Reviews') },
      ...(hasLocation
        ? [
            {
              id: 'location' as const,
              label: t('hotel.nav.location', 'Location'),
            },
          ]
        : []),
    ],
    [t, hasLocation],
  );

  return (
    <MainLayout>
      {isLoading && <HotelDetailSkeleton />}
      {isError && !isLoading && (
        <HotelDetailError
          title={t('hotel.detail.not_found', 'Hotel not found')}
          description={t(
            'hotel.detail.not_found_desc',
            'This property may have been removed or the link is incorrect.',
          )}
        />
      )}
      {hotel && !isLoading && (
        <div className="pb-20 md:pb-8">
          <div className="sticky top-[136px] z-20 border-b border-[rgba(28,26,20,0.1)] bg-[#faf7f2]/95 backdrop-blur-md">
            <Container className="max-w-7xl px-4">
              <AnimatedTabs
                variant="travel"
                tabs={hotelTabs}
                scrollOffset={200}
                omitContainer
              />
            </Container>
          </div>
          <HotelDetailContent hotel={hotel} hasLocation={hasLocation} paramId={id} />
        </div>
      )}
      {hotel && !isLoading && <HotelFloatingContactBar hotel={hotel} />}
    </MainLayout>
  );
};

type HotelDetailContentProps = {
  hotel: Hotel;
  hasLocation: boolean;
  paramId?: string;
};

const HotelDetailContent = ({ hotel, hasLocation, paramId }: HotelDetailContentProps) => (
  <>
    <Container className="max-w-7xl px-4 pt-4 sm:pt-6">
      <main className="px-0">
        <HotelHeader hotel={hotel} />
      </main>
    </Container>

    <Container className="max-w-7xl px-4 pt-2 sm:pt-4">
      <main className="px-0">
        <HotelInfo hotel={hotel} />
        <HotelRooms hotel={hotel} />
        {hasLocation && <HotelMapSection hotel={hotel} />}
        <HotelReviews hotel={hotel} paramId={paramId} />
      </main>
    </Container>
  </>
);

const HotelDetailSkeleton = () => (
  <div className="w-full">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="pt-2">
        <div className="mb-8 grid min-h-[220px] animate-pulse grid-cols-12 gap-3 md:min-h-[400px] md:gap-4">
          <div className="col-span-12 rounded-2xl bg-[#e5ded0] md:col-span-8" />
          <div className="col-span-12 grid min-h-[180px] grid-cols-2 grid-rows-2 gap-3 md:col-span-4 md:min-h-0 md:gap-4">
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
          </div>
        </div>
        <div className="h-8 max-w-md animate-pulse rounded bg-[#e5ded0]" />
      </div>
    </div>
  </div>
);

type HotelDetailErrorProps = {
  title: string;
  description: string;
};

const HotelDetailError = ({ title, description }: HotelDetailErrorProps) => (
  <div className="px-4 py-24 text-center">
    <h2
      className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
      style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
    >
      {title}
    </h2>
    <p className="mt-2 text-sm text-[rgba(28,26,20,0.6)]">{description}</p>
  </div>
);

export default HotelDetailPage;
