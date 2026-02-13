import { useParams } from 'react-router-dom';
import { MainLayout } from '@/layout';
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
import { TourDetailProvider } from '@/sections/tour/tour-detail/TourDetailContext';
import { AnimatedTabs } from '@components/AnimatedTabs';
import Container from '@components/Container';
import { Separator } from '@components/ui/separator';
import { useTourBySlugQuery, useTourQuery } from '@/features/tours/catalog-hooks';

/** MongoDB ObjectId is 24 hex chars */
const isObjectId = (s: string) => /^[a-f0-9]{24}$/i.test(s);

const TourDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const bySlug = useTourBySlugQuery(slug, { enabled: !!slug && !isObjectId(slug) });
  const byId = useTourQuery(slug, { enabled: !!slug && isObjectId(slug) });

  const { data: tour, isLoading, isError } = slug && isObjectId(slug) ? byId : bySlug;

  return (
    <MainLayout>
      <TourDetailProvider tour={tour}>
        <div className="border-b sticky top-[136px] bg-white z-20">
          <AnimatedTabs />
        </div>

        <Container>
          {isLoading && (
            <div className="mt-20 h-96 bg-gray-100 animate-pulse rounded-xl" />
          )}
          {isError && (
            <div className="mt-20 py-16 text-center text-red-500">
              Tour not found
            </div>
          )}
          {tour && !isLoading && (
            <>
              <TourHeader />
              <div className="grid grid-cols-12 w-full">
                <div className="col-span-12 xl:col-span-8 mt-10 px-[20px] space-y-10">
                  <TourDetail />
                  <TourIncluded />
                  <TourExpect />
                  <TourItinerary />
                  <TourMap />
                  <TourFAQ />
                </div>

                <div className="col-span-12 xl:col-span-4 mt-10 px-[20px]">
                  <TourSidebar />
                </div>

                <div className="col-span-12 mt-10 px-[20px] mb-10 space-y-10">
                  <Separator className="my-6" />
                  <TourRelated />
                  <Separator className="my-6" />
                  <TourReviews />
                </div>
              </div>
            </>
          )}
        </Container>
      </TourDetailProvider>
    </MainLayout>
  );
};

export default TourDetailPage;
