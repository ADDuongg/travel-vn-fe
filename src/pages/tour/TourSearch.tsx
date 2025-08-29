import { MainLayout } from '@/layout';
import DisplayItemType from '@/sections/tour/components/DisplayItemType';
import CardSearching from '@components/CardSearching';
import Container from '@components/Container';
import DisplayContainer from '@components/DisplayContainer';
import { ResponsiveH1, ResponsiveH3 } from '@components/ui/typography';
import React from 'react';
import FilterComponent from '../../components/FilterComponent';
import { ToursItem } from '../../mock';
import { EnumDisplayItem } from '@/constants/commons';

const TourSearchPage: React.FC = () => {
  const [displayType, setDisplayType] = React.useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );
  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">
          Search Tour
        </ResponsiveH1>
      </div>
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 py-8 ">
          {/* Left Filter Panel */}
          <div className="w-full lg:w-[320px] bg-white rounded-lg shadow p-6 flex flex-col gap-4 border">
            <FilterComponent />
          </div>
          {/* Right Grid Panel */}
          <div className="flex-1 flex flex-col gap-12">
            <div className="col-span-2 space-y-4">
              <ResponsiveH3>22 Results Found</ResponsiveH3>
              <DisplayItemType
                displayType={displayType}
                setDisplayType={setDisplayType}
              />
            </div>
            <DisplayContainer
              displayType={displayType}
              gridClassName="grid-cols-1 sm:grid-cols-2 justify-items-stretch lg:grid-cols-2 gap-12 "
            >
              {ToursItem.map((item) => (
                <CardSearching item={item} displayType={displayType} />
              ))}
            </DisplayContainer>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default TourSearchPage;
