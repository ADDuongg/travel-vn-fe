import { MainLayout } from '@/layout';
import {
  CustomerFeedback,
  DiscoverDeal,
  ExploreByRegion,
  FeaturedHotels,
  FoodExperiences,
  TitleSection,
  TopDestination,
  TravelGuides,
} from '@/sections';

const HomePage = () => {
  return (
    <MainLayout>
      <TitleSection />

      <div className="bg-background">
        <div className="py-20 md:py-24 lg:py-28">
          <ExploreByRegion />
        </div>
      </div>

      <div className="bg-surface-300">
        <div className="py-20 md:py-24 lg:py-28">
          <TopDestination />
        </div>
      </div>

      <div className="bg-background">
        <div className="py-20 md:py-24 lg:py-28">
          <FeaturedHotels />
        </div>
      </div>

      <div className="bg-surface-300">
        <div className="py-20 md:py-24 lg:py-28">
          <FoodExperiences />
        </div>
      </div>

      <div className="bg-background">
        <div className="py-20 md:py-24 lg:py-28">
          <TravelGuides />
        </div>
      </div>

      <div className="bg-surface-300">
        <div className="py-20 md:py-24 lg:py-28">
          <CustomerFeedback />
        </div>
      </div>

      <div className="bg-background">
        <DiscoverDeal />
      </div>
    </MainLayout>
  );
};

export default HomePage;
