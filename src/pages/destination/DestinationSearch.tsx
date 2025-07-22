import { MainLayout } from '@/layout';
import Container from '@/layout/Container';
import CardSearching from '@components/CardSearching';
import React from 'react';
import FilterComponent from '../../components/FilterComponent';
import { ToursItem } from '../../mock';
import { ResponsiveH1, ResponsiveH6 } from '@components/ui/typography';

export const DestinationSearchPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1>Search Destination</ResponsiveH1>
      </div>
      <Container>
        <div className="flex flex-col md:flex-row gap-12 py-8 ">
          {/* Left Filter Panel */}
          <div className="w-full md:w-[320px] bg-white rounded-lg shadow p-6 flex flex-col gap-4 border">
            <FilterComponent />
          </div>
          {/* Right Grid Panel */}
          <div className="flex-1 grid justify-items-stretch grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-12">
            {ToursItem.map((item) => (
              <CardSearching item={item}></CardSearching>
            ))}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};
