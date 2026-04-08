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
      {/* Title section (hero) — keep as-is per request */}
      <div className="bg-background_paleGray">
        <TitleSection />
      </div>

      <section className="bg-background py-20 md:py-28">
        <TopDestination />
      </section>

      <section className="border-t border-border/40 bg-background_paleGray py-20 md:py-28">
        <PopularTour />
      </section>

      <section className="border-t border-border/40 bg-background py-20 md:py-28">
        <FreshlyAdded />
      </section>

      <section className="border-t border-border/40 bg-background_paleGray py-20 md:py-28">
        <DiscoverDeal />
      </section>

      <section className="border-t border-border/40 bg-background py-20 md:py-28">
        <CustomerFeedback />
      </section>

      <section className="border-t border-border/40 bg-background py-16 md:py-20">
        <OurService />
      </section>
    </MainLayout>
  );
};

export default HomePage;
