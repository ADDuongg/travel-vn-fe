import React, { useState } from 'react';
import Container from '@components/Container';
import FilterRoomComponent, {
  type FilterValues as RoomFilterValues,
} from '@components/FilterRoomComponent';
import { ResponsiveH3 } from '@components/ui/typography';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useRoomsQuery } from '@/features/rooms/hooks';
import type { RoomQueryParams } from '@/features/rooms/types';
import RoomCard, {
  RoomCardSkeleton,
} from '@/sections/room/components/RoomCard';
import DisplayItemType from '@/sections/tour/components/DisplayItemType';
import DisplayContainer from '@components/DisplayContainer';
import { EnumDisplayItem } from '@/constants/commons';

const RoomListPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [displayType, setDisplayType] = useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );
  const [roomFilter, setRoomFilter] = useState<RoomQueryParams>({
    page: 1,
    limit: 20,
    lang: language,
  });

  const { data: roomsData, isLoading: roomsLoading } = useRoomsQuery({
    ...roomFilter,
    lang: language,
  });

  const rooms = roomsData?.items ?? [];
  const totalRooms = roomsData?.pagination?.total ?? 0;

  const mapRoomFilterValues = (values: RoomFilterValues): RoomQueryParams => {
    const params: RoomQueryParams = {
      page: 1,
      limit: 20,
      lang: language,
    };
    if (values.keyword?.trim()) params.keyword = values.keyword.trim();
    if (values.minPrice && !isNaN(Number(values.minPrice)))
      params.minPrice = Number(values.minPrice);
    if (values.maxPrice && !isNaN(Number(values.maxPrice)))
      params.maxPrice = Number(values.maxPrice);
    if (values.adults && values.adults > 0) params.adults = values.adults;
    if (values.children && values.children > 0)
      params.children = values.children;
    if (values.check_in?.trim()) params.checkIn = values.check_in;
    if (values.check_out?.trim()) params.checkOut = values.check_out;
    if (values.rating != null && values.rating > 0)
      params.minRating = values.rating;
    if (values.amenities?.length) params.amenities = values.amenities;
    if (values.roomSize?.length) {
      params.roomSize = values.roomSize
        .map((s) => (typeof s === 'string' ? parseInt(s, 10) : Number(s)))
        .filter((n) => !isNaN(n));
    }
    if (values.provinceId && values.provinceId !== '__all__') {
      params.provinceId = values.provinceId;
    }
    if (values.destinations?.length) params.hotelIds = values.destinations;
    return params;
  };

  return (
    <Container>
      <div className="flex flex-col lg:flex-row gap-8 py-10">
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-36 bg-white rounded-2xl shadow-lg border p-6">
            <FilterRoomComponent
              onFilter={(v) => setRoomFilter(mapRoomFilterValues(v))}
              onClear={() =>
                setRoomFilter({ page: 1, limit: 20, lang: language })
              }
            />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <ResponsiveH3>
                {roomsLoading
                  ? t('common.loading')
                  : t('room.search.results', {
                      count: totalRooms,
                      defaultValue: `${totalRooms} Results Found`,
                    })}
              </ResponsiveH3>
              <DisplayItemType
                displayType={displayType}
                setDisplayType={setDisplayType}
              />
            </div>
            {roomsLoading ? (
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <RoomCardSkeleton key={i} />
                ))}
              </DisplayContainer>
            ) : rooms.length === 0 ? (
              <div className="py-16 text-center text-gray-500 rounded-2xl bg-slate-50">
                {t('room.search.noResults')}
              </div>
            ) : (
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
              >
                {rooms.map((room) => (
                  <RoomCard key={room._id} item={room} lang={language} />
                ))}
              </DisplayContainer>
            )}
          </div>
        </main>
      </div>
    </Container>
  );
};

export default RoomListPage;
