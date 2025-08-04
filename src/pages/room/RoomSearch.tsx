import { MainLayout } from '@/layout';
import Container from '@/layout/Container';
import DisplayContainer from '@/layout/DisplayContainer';
import DisplayItemType from '@/sections/tour/DisplayItemType';
import CardSearching from '@components/CardSearching';
import FilterRoomComponent from '@components/FilterRoomComponent';
import { ResponsiveH1, ResponsiveH3 } from '@components/ui/typography';
import { EnumDisplayItem } from '@interface/commons';
import React from 'react';
import { ToursItem } from '../../mock';

export const RoomSearchPage: React.FC = () => {
  const [displayType, setDisplayType] = React.useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );
  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1>Search Room</ResponsiveH1>
      </div>
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 py-8 ">
          {/* Left Filter Panel */}
          <div className="w-full lg:w-[320px] bg-white rounded-lg shadow p-6 flex flex-col gap-4 border">
            <FilterRoomComponent />
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
                <CardSearching
                  item={item}
                  displayType={displayType}
                ></CardSearching>
              ))}
            </DisplayContainer>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};
