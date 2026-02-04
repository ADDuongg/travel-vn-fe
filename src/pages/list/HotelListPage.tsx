import React, { useState } from 'react';
import Container from '@components/Container';
import FilterListComponent, {
  type FilterListValues,
} from '@components/FilterListComponent';
import { ResponsiveH3 } from '@components/ui/typography';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useHotelsQuery } from '@/features/hotels/hooks';
import HotelCard, { HotelCardSkeleton } from '@/sections/hotel/components/HotelCard';
import DisplayItemType from '@/sections/tour/components/DisplayItemType';
import DisplayContainer from '@components/DisplayContainer';
import { EnumDisplayItem } from '@/constants/commons';

const HotelListPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [displayType, setDisplayType] = useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );
  const [hotelFilter, setHotelFilter] = useState<FilterListValues>({
    provinceId: '',
    wardId: '',
  });

  const { data: hotelsData, isLoading: hotelsLoading } = useHotelsQuery(
    hotelFilter.provinceId ? { provinceId: hotelFilter.provinceId } : undefined,
  );

  const hotels = hotelsData ?? [];

  return (
    <Container>
      <div className="flex flex-col lg:flex-row gap-8 py-10">
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-36 bg-white rounded-2xl shadow-lg border p-6">
            <FilterListComponent
              onFilter={setHotelFilter}
              onClear={() => setHotelFilter({ provinceId: '', wardId: '' })}
            />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <ResponsiveH3>
                {hotelsLoading
                  ? t('common.loading')
                  : t('hotel.search.results', {
                      count: hotels.length,
                    })}
              </ResponsiveH3>
              <DisplayItemType
                displayType={displayType}
                setDisplayType={setDisplayType}
              />
            </div>
            {hotelsLoading ? (
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </DisplayContainer>
            ) : hotels.length === 0 ? (
              <div className="py-16 text-center text-gray-500 rounded-2xl bg-slate-50">
                {t('hotel.search.noResults', 'No hotels found')}
              </div>
            ) : (
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
              >
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id} item={hotel} lang={language} />
                ))}
              </DisplayContainer>
            )}
          </div>
        </main>
      </div>
    </Container>
  );
};

export default HotelListPage;
