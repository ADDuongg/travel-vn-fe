import { MainLayout } from '@/layout';
import TourDetail from '@/sections/tour/tour-detail/TourDetail';
import TourExpect from '@/sections/tour/tour-detail/TourExpect';
import TourFAQ from '@/sections/tour/tour-detail/TourFAQ';
import TourHeader from '@/sections/tour/tour-detail/TourHeader';
import TourItinerary from '@/sections/tour/tour-detail/TourItinerary';
import TourMap from '@/sections/tour/tour-detail/TourMap';
import TourRelated from '@/sections/tour/tour-detail/TourRelated';
import TourReviews from '@/sections/tour/tour-detail/TourReviews';
import TourSidebar from '@/sections/tour/tour-detail/TourSidebar';
import { AnimatedTabs } from '@components/AnimatedTabs';
import Container from '@components/Container';
import { Separator } from '@components/ui/separator';

const TourDetailPage = () => {
  return (
    <MainLayout>
      <div className="border-b sticky top-[136px] bg-white z-20">
        <AnimatedTabs />
      </div>

      <Container>
        <TourHeader />
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-12 xl:col-span-8 mt-10 px-[20px] space-y-10">
            <TourDetail />
            <Separator className="my-6" />
            <TourExpect />
            <Separator className="my-6" />
            <TourItinerary />
            <Separator className="my-6" />
            <TourMap />
            <Separator className="my-6" />
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
          <Separator className="my-6" />
        </div>
      </Container>
    </MainLayout>
  );
};

export default TourDetailPage;
