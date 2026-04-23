import { useMemo, useState } from 'react';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { PageHero } from '@/components/PageHero';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useRoomsQuery } from '@/features/rooms/hooks';
import RoomCard, {
  RoomCardSkeleton,
} from '@/sections/room/components/RoomCard';
import RoomFilter from '@/sections/room/components/RoomFilter';
import { RoomListHeroSearch } from '@/sections/room/components/RoomListHeroSearch';
import DisplayItemType from '@/sections/shared/DisplayItemType';
import DisplayContainer from '@/components/DisplayContainer';
import { EnumDisplayItem } from '@/constants/commons';
import type { RoomQueryParams } from '@/features/rooms/types';
import {
  defaultRoomListQuery,
  type RoomListQuery,
} from '@/sections/room/room-list-query';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles } from 'lucide-react';
import ServerPagination from '@/shared/pagination/ServerPagination';

const HERO_VN =
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1920&h=1080&auto=format&fit=crop&q=80';

function toQueryParams(value: RoomListQuery, page: number, language: string): RoomQueryParams {
  const params: RoomQueryParams = {
    page,
    limit: 12,
    lang: language,
    sortBy: value.sortBy,
  };
  if (value.search.trim()) params.keyword = value.search.trim();
  if (value.provinceId) params.provinceId = value.provinceId;
  if (value.minPrice && !Number.isNaN(Number(value.minPrice))) {
    params.minPrice = Number(value.minPrice);
  }
  if (value.maxPrice && !Number.isNaN(Number(value.maxPrice))) {
    params.maxPrice = Number(value.maxPrice);
  }
  if (value.minRating > 0) params.minRating = value.minRating;
  if (value.adults > 0) params.adults = value.adults;
  if (value.children > 0) params.children = value.children;
  if (value.checkIn) params.checkIn = value.checkIn;
  if (value.checkOut) params.checkOut = value.checkOut;
  if (value.amenities.length) params.amenities = value.amenities;
  if (value.roomSize.length) params.roomSize = value.roomSize;
  return params;
}

const RoomListPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [displayType, setDisplayType] = useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );
  const [query, setQuery] = useState<RoomListQuery>(defaultRoomListQuery);
  const [currentPage, setCurrentPage] = useState(1);

  const roomQuery = useMemo(
    () => toQueryParams(query, currentPage, language),
    [query, currentPage, language],
  );
  const { data, isLoading } = useRoomsQuery(roomQuery);

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? items.length;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const showingFrom = total ? (currentPage - 1) * (roomQuery.limit ?? 12) + 1 : 0;
  const showingTo = Math.min(currentPage * (roomQuery.limit ?? 12), total);

  return (
    <MainLayout>
      <PageHero
        backgroundImage={HERO_VN}
        title={t('room.page.title', 'Find your perfect room')}
        subtitle={t(
          'room.page.subtitle',
          'Comfortable stays, flexible options, and trusted room quality across Vietnam',
        )}
        badge={t('room.page.badge', 'Vietnam - curated room stays')}
        contentClassName="min-h-[320px] justify-center pb-16 pt-24 md:min-h-[420px] md:pb-20 md:pt-32"
        footerSlot={
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 sm:h-28"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(28,26,20,0.1) 22%, rgba(245,240,232,0.45) 58%, #ffffff 100%)',
            }}
            aria-hidden
          />
        }
      >
        <RoomListHeroSearch
          onApply={({ search, provinceId }) => {
            setCurrentPage(1);
            setQuery((prev) => ({
              ...prev,
              search: search ?? '',
              provinceId: provinceId ?? '',
            }));
          }}
        />
      </PageHero>

      <div className="relative z-[3] -mt-3 sm:-mt-5">
        <RoomFilter
          value={query}
          onChange={(next) => {
            setCurrentPage(1);
            setQuery(next);
          }}
          onReset={() => {
            setCurrentPage(1);
            setQuery(defaultRoomListQuery);
          }}
        />
      </div>

      <div className="bg-[#F8F8F6] pb-16 pt-6 sm:pt-7">
        <Container>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-[rgba(28,26,20,0.6)]">
                {isLoading
                  ? t('common.loading')
                  : t('room.list.showing', {
                      from: showingFrom,
                      to: showingTo,
                      total,
                      defaultValue:
                        'Showing {{from}}-{{to}} of {{total}} rooms',
                    })}
              </p>
              <h2
                className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-3xl"
                style={{
                  fontFamily:
                    'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
                }}
              >
                {t('room.list.heading', 'Handpicked rooms for your trip')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="hidden size-4 text-[#2d6a4f] sm:block" aria-hidden />
              <span className="text-sm text-[rgba(28,26,20,0.5)] sm:hidden">
                {t('room.list.display', 'View')}
              </span>
              <DisplayItemType
                displayType={displayType}
                setDisplayType={setDisplayType}
              />
            </div>
          </div>

          {isLoading ? (
            <DisplayContainer
              displayType={displayType}
              gridClassName="grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 9 }).map((_, index) => (
                <RoomCardSkeleton key={index} />
              ))}
            </DisplayContainer>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[rgba(28,26,20,0.2)] bg-[#faf7f2] px-6 py-20 text-center">
              <Sparkles className="mb-4 size-10 text-[#c9922a]/80" aria-hidden />
              <h3
                className="text-xl font-semibold text-[#1c1a14]"
                style={{
                  fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
                }}
              >
                {t('room.search.noResults', 'No rooms found')}
              </h3>
              <p className="mt-2 max-w-md text-sm text-[rgba(28,26,20,0.6)]">
                {t(
                  'room.list.empty_hint',
                  'Try adjusting your filters or searching a different destination.',
                )}
              </p>
              <Button
                className="mt-6 cursor-pointer"
                onClick={() => {
                  setCurrentPage(1);
                  setQuery(defaultRoomListQuery);
                }}
              >
                {t('room.list.clear_cta', 'Reset filters')}
              </Button>
            </div>
          ) : (
            <>
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((room) => (
                  <RoomCard key={room._id} item={room} lang={language} />
                ))}
              </DisplayContainer>

              {pagination && totalPages > 1 && (
                <ServerPagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-10"
                  labels={{
                    previous: t('common.previous', 'Previous'),
                    next: t('common.next', 'Next'),
                    pageAriaLabel: t('room.pagination.page', 'Page'),
                  }}
                />
              )}
            </>
          )}
        </Container>
      </div>
    </MainLayout>
  );
};

export default RoomListPage;
