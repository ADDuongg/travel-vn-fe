import { MainLayout } from '@/layout';
import Container from '@components/Container';
import DisplayContainer from '@components/DisplayContainer';
import DisplayItemType from '@/sections/tour/components/DisplayItemType';
import FilterRoomComponent, {
  type FilterValues,
} from '@components/FilterRoomComponent';
import { ResponsiveH1, ResponsiveH3 } from '@components/ui/typography';
import React from 'react';
import { EnumDisplayItem } from '@/constants/commons';
import { useRoomsQuery } from '@/features/rooms/hooks';
import type { RoomQueryParams } from '@/features/rooms/types';
import RoomCard from '@/sections/room/components/RoomCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';

const RoomSearchPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [displayType, setDisplayType] = React.useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );
  const [filterParams, setFilterParams] = React.useState<RoomQueryParams>({
    page: 1,
    limit: 20,
  });

  // Map FilterValues to RoomQueryParams (align with BE RoomQueryDto)
  const handleFilter = (values: FilterValues) => {
    const params: RoomQueryParams = {
      page: 1,
      limit: 20,
    };

    if (values.keyword?.trim()) {
      params.keyword = values.keyword.trim();
    }

    if (values.minPrice) {
      const minPrice = Number(values.minPrice);
      if (!isNaN(minPrice) && minPrice > 0) {
        params.minPrice = minPrice;
      }
    }

    if (values.maxPrice) {
      const maxPrice = Number(values.maxPrice);
      if (!isNaN(maxPrice) && maxPrice > 0) {
        params.maxPrice = maxPrice;
      }
    }

    if (values.adults && values.adults > 0) {
      params.adults = values.adults;
    }

    if (values.check_in?.trim()) {
      params.checkIn = values.check_in.trim();
    }
    if (values.check_out?.trim()) {
      params.checkOut = values.check_out.trim();
    }

    if (values.rating != null && values.rating > 0) {
      params.minRating = values.rating;
    }

    if (values.amenities?.length) {
      params.amenities = values.amenities;
    }

    if (values.roomSize?.length) {
      params.roomSize = values.roomSize.map((s) => (typeof s === 'string' ? parseInt(s, 10) : Number(s))).filter((n) => !isNaN(n));
    }

    if (values.destinations?.length) {
      params.hotelIds = values.destinations;
    }

    setFilterParams(params);
  };

  const handleClearFilter = () => {
    setFilterParams({
      page: 1,
      limit: 20,
    });
  };

  const { data, isLoading, isError, error } = useRoomsQuery({
    ...filterParams,
    lang: language,
  });

  const rooms = data?.items ?? [];
  const totalResults = data?.pagination?.total ?? 0;

  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">
          {t('room.search.title', 'Search Room')}
        </ResponsiveH1>
      </div>
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 py-8 ">
          {/* Left Filter Panel */}
          <div className="w-full lg:w-[320px] bg-white rounded-lg shadow p-6 flex flex-col gap-4 border">
            <FilterRoomComponent
              onFilter={handleFilter}
              onClear={handleClearFilter}
            />
          </div>
          {/* Right Grid Panel */}
          <div className="flex-1 flex flex-col gap-12">
            <div className="col-span-2 space-y-4">
              <ResponsiveH3>
                {isLoading
                  ? t('common.loading', 'Loading...')
                  : isError
                    ? t('common.error', 'Error loading rooms')
                    : t('room.search.results', {
                        count: totalResults,
                        defaultValue: `${totalResults} Results Found`,
                      })}
              </ResponsiveH3>
              <DisplayItemType
                displayType={displayType}
                setDisplayType={setDisplayType}
              />
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {t('common.loading', 'Loading...')}
                </p>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500">
                  {t('common.error', 'Error loading rooms')}
                </p>
                {error && (
                  <p className="text-sm text-gray-500 mt-2">
                    {error instanceof Error ? error.message : String(error)}
                  </p>
                )}
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {t('room.search.noResults', 'No rooms found')}
                </p>
              </div>
            ) : (
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 sm:grid-cols-2 justify-items-stretch lg:grid-cols-2 gap-12 "
              >
                {rooms.map((room) => (
                  <RoomCard key={room._id} item={room} lang={language} />
                ))}
              </DisplayContainer>
            )}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default RoomSearchPage;
