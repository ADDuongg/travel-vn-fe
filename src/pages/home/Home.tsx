import { MainLayout } from '@/layout';
import {
  CustomerFeedback,
  DiscoverDeal,
  FreshlyAdded,
  OurService,
  PopularTour,
  TitleSection,
  TopDestination,
} from '@/sections';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="bg-background_paleGray">
        <TitleSection />
      </div>

      <div className="">
        <TopDestination />
      </div>

      <div className="mt-32">
        <PopularTour />
      </div>

      <div className="mt-20">
        <FreshlyAdded />
      </div>

      <div>
        <DiscoverDeal />
      </div>

      <div className="mt-10">
        <CustomerFeedback />
      </div>

      <div>
        <OurService />
      </div>
    </MainLayout>
  );
};

export default HomePage;
