import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/layout';
import { useTourQuery } from '@/features/tours/hooks';
import type { Tour } from '@/features/tours/types';
import TourDetail from '@/sections/tour/tour-detail/TourDetail';
import TourExpect from '@/sections/tour/tour-detail/TourExpect';
import TourFAQ from '@/sections/tour/tour-detail/TourFAQ';
import TourHeader from '@/sections/tour/tour-detail/TourHeader';
import TourIncluded from '@/sections/tour/tour-detail/TourIncluded';
import TourItinerary from '@/sections/tour/tour-detail/TourItinerary';
import TourMap from '@/sections/tour/tour-detail/TourMap';
import TourRelated from '@/sections/tour/tour-detail/TourRelated';
import TourReviews from '@/sections/tour/tour-detail/TourReviews';
import TourSidebar from '@/sections/tour/tour-detail/TourSidebar';
import TourFloatingBookingBar from '@/sections/tour/tour-detail/TourFloatingBookingBar';
import { AnimatedTabs } from '@components/AnimatedTabs';
import Container from '@components/Container';

const TourDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, isError } = useTourQuery(id);

  const tourTabs = useMemo(
    () => [
      { id: 'detail', label: t('tour.detail.tab_overview', 'Overview') },
      { id: 'itinerary', label: t('tour.detail.tab_itinerary', 'Itinerary') },
      {
        id: 'included',
        label: t('tour.detail.tab_included', "What's included"),
      },
      { id: 'map', label: t('tour.detail.tab_map', 'Map') },
      { id: 'faq', label: t('tour.detail.tab_faq', 'FAQ') },
      { id: 'reviews', label: t('tour.detail.tab_reviews', 'Reviews') },
    ],
    [t],
  );

  return (
    <MainLayout>
      {isLoading && <TourDetailSkeleton />}
      {isError && !isLoading && (
        <TourDetailError
          title={t('tour.detail.not_found', 'Tour not found')}
          description={t(
            'tour.detail.not_found_desc',
            'This tour may have been removed or the link is incorrect.',
          )}
        />
      )}
      {tour && !isLoading && <TourDetailContent tour={tour} tabs={tourTabs} />}
    </MainLayout>
  );
};

type TourDetailContentProps = {
  tour: Tour;
  tabs: Array<{ id: string; label: string }>;
};

const TourDetailContent = ({ tour, tabs }: TourDetailContentProps) => (
  <>
    <div className="sticky top-[136px] z-20 border-b border-[rgba(28,26,20,0.1)] bg-[#faf7f2]/95 backdrop-blur-md">
      <Container className="max-w-7xl px-4 sm:px-6">
        <AnimatedTabs
          variant="travel"
          tabs={tabs}
          scrollOffset={200}
          omitContainer
        />
      </Container>
    </div>
    <TourHeader tour={tour} />
    <div className="bg-[#F8F8F6] pb-24 lg:pb-10">
      <Container>
        <div className="grid grid-cols-1 gap-8 pb-10 pt-2 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 space-y-10 lg:col-span-8">
            <TourDetail tour={tour} />
            <TourItinerary tour={tour} />
            <TourIncluded tour={tour} />
            <TourExpect tour={tour} />
            <TourMap />
            <TourFAQ />
          </div>
          <aside className="hidden min-w-0 lg:col-span-4 lg:block">
            <TourSidebar tour={tour} />
          </aside>
        </div>
        <div className="mb-6 space-y-10 border-t border-[rgba(28,26,20,0.1)] pt-8">
          <TourRelated tour={tour} />
          <TourReviews tour={tour} />
        </div>
      </Container>
    </div>
    <TourFloatingBookingBar tour={tour} />
  </>
);

const TourDetailSkeleton = () => (
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

type TourDetailErrorProps = {
  title: string;
  description: string;
};

const TourDetailError = ({ title, description }: TourDetailErrorProps) => (
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

export default TourDetailPage;
