import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CardSearching from '@components/CardSearching';
import { ResponsiveH1 } from '@components/ui/typography';
import React from 'react';
import FilterComponent from '../../components/FilterComponent';
import { ToursItem } from '../../mock';

const DestinationSearchPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">
          Search Destination
        </ResponsiveH1>
      </div>
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 py-8 ">
          {/* Left Filter Panel */}
          <div className="w-full lg:w-[320px] bg-white rounded-lg shadow p-6 flex flex-col gap-4 border">
            <FilterComponent />
          </div>
          {/* Right Grid Panel */}
          <div className="flex-1 grid justify-items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
            {ToursItem.map((item) => (
              <CardSearching item={item}></CardSearching>
            ))}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};
export default DestinationSearchPage;
