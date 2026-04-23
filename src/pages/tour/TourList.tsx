import React, { useState } from 'react';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { PageHero } from '@/components/PageHero';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useToursQuery } from '@/features/tours/hooks';
import { TourCard, TourCardSkeleton, TourFilter, TourListHeroSearch } from '@/sections/tour';
import DisplayItemType from '@/sections/shared/DisplayItemType';
import DisplayContainer from '@/components/DisplayContainer';
import { EnumDisplayItem } from '@/constants/commons';
import type { TourQueryParams } from '@/features/tours/types';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles } from 'lucide-react';
import ServerPagination from '@/shared/pagination/ServerPagination';

const HERO_VN =
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&h=1080&auto=format&fit=crop&q=80';

const TourList: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [displayType, setDisplayType] = useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );
  const [queryParams, setQueryParams] = useState<TourQueryParams>({
    page: 1,
    limit: 12,
    sortBy: 'newest',
  });

  const { data, isLoading } = useToursQuery(queryParams);

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? items.length;
  const currentPage = queryParams.page ?? 1;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const showingFrom = total
    ? (currentPage - 1) * (queryParams.limit ?? 12) + 1
    : 0;
  const showingTo = Math.min(currentPage * (queryParams.limit ?? 12), total);

  return (
    <MainLayout>
      <PageHero
        backgroundImage={HERO_VN}
        title={t('tour.page.title', 'Explore Tours')}
        subtitle={t(
          'tour.page.subtitle',
          'Discover unforgettable experiences across Vietnam',
        )}
        badge={t('tour.page.badge', 'Vietnam — guided journeys')}
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
        <TourListHeroSearch
          onApply={({ search, destinationId }) => {
            setQueryParams((prev) => {
              const next: TourQueryParams = { ...prev, page: 1, limit: 12 };
              if (search?.trim()) next.search = search.trim();
              else delete next.search;
              if (destinationId) next.destinationId = destinationId;
              else delete next.destinationId;
              return next;
            });
          }}
        />
      </PageHero>

      <div className="relative z-[3] -mt-3 sm:-mt-5">
        <TourFilter
          syncedSearch={queryParams.search}
          syncedDestinationId={queryParams.destinationId}
          onFilter={(params) =>
            setQueryParams((prev) => ({ ...prev, ...params, page: 1 }))
          }
          onClear={() =>
            setQueryParams({
              page: 1,
              limit: 12,
              sortBy: 'newest',
            })
          }
        />
      </div>

      <div className="bg-[#F8F8F6] pb-16 pt-6 sm:pt-7">
        <Container>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-[rgba(28,26,20,0.6)]">
                {isLoading
                  ? t('common.loading')
                  : t('tour.list.showing', {
                      from: showingFrom,
                      to: showingTo,
                      total,
                      defaultValue:
                        'Showing {{from}}–{{to}} of {{total}} tours',
                    })}
              </p>
              <h2
                className="mt-1 font-['Playfair_Display',serif] text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-3xl"
                style={{
                  fontFamily:
                    'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
                }}
              >
                {t('tour.list.heading', 'Handpicked Vietnam tours')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <MapPin
                className="hidden size-4 text-[#2d6a4f] sm:block"
                aria-hidden
              />
              <span className="text-sm text-[rgba(28,26,20,0.5)] sm:hidden">
                {t('tour.list.display', 'View')}
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
              {Array.from({ length: 9 }).map((_, i) => (
                <TourCardSkeleton key={i} />
              ))}
            </DisplayContainer>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[rgba(28,26,20,0.2)] bg-[#faf7f2] px-6 py-20 text-center">
              <Sparkles
                className="mb-4 size-10 text-[#c9922a]/80"
                aria-hidden
              />
              <h3
                className="font-['Playfair_Display',serif] text-xl font-semibold text-[#1c1a14]"
                style={{
                  fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
                }}
              >
                {t('tour.search.noResults', 'No tours found')}
              </h3>
              <p className="mt-2 max-w-md text-sm text-[rgba(28,26,20,0.6)]">
                {t(
                  'tour.list.empty_hint',
                  'Try adjusting your filters or search for another destination.',
                )}
              </p>
              <Button
                className="mt-6 cursor-pointer"
                onClick={() =>
                  setQueryParams({ page: 1, limit: 12, sortBy: 'newest' })
                }
              >
                {t('tour.list.clear_cta', 'Reset filters')}
              </Button>
            </div>
          ) : (
            <>
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((tour) => (
                  <TourCard key={tour._id} item={tour} lang={language} />
                ))}
              </DisplayContainer>

              {pagination && totalPages > 1 && (
                <ServerPagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={(nextPage) =>
                    setQueryParams((prev) => ({ ...prev, page: nextPage }))
                  }
                  className="mt-10"
                  labels={{
                    previous: t('common.previous', 'Previous'),
                    next: t('common.next', 'Next'),
                    pageAriaLabel: t('tour.pagination.page', 'Page'),
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

export default TourList;
