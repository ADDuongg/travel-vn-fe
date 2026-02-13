import React, { useState } from 'react';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { ResponsiveH3 } from '@/components/ui/typography';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useToursQuery } from '@/features/tours/catalog-hooks';
import TourCard, { TourCardSkeleton } from '@/sections/tour/components/TourCard';
import TourFilter from '@/sections/tour/components/TourFilter';
import DisplayItemType from '@/sections/tour/components/DisplayItemType';
import DisplayContainer from '@/components/DisplayContainer';
import { EnumDisplayItem } from '@/constants/commons';
import type { TourQueryParams } from '@/features/tours/catalog-types';
import { Button } from '@/components/ui/button';

const TourPage: React.FC = () => {
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

  return (
    <MainLayout>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')] bg-cover bg-center opacity-30" />
        <div className="relative px-6 py-20 md:py-28 text-center">
          <ResponsiveH3 className="font-dm-serif-display text-white mb-4">
            {t('tour.page.title', 'Explore Tours')}
          </ResponsiveH3>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t('tour.page.subtitle', 'Discover unforgettable experiences across Vietnam')}
          </p>
        </div>
      </div>

      <Container>
        <div className="flex flex-col lg:flex-row gap-8 py-10">
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-36 bg-white rounded-2xl shadow-lg border p-6">
              <TourFilter
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
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <ResponsiveH3>
                  {isLoading
                    ? t('common.loading')
                    : t('tour.search.results', {
                        count: pagination?.total ?? items.length,
                      })}
                </ResponsiveH3>
                <DisplayItemType
                  displayType={displayType}
                  setDisplayType={setDisplayType}
                />
              </div>

              {isLoading ? (
                <DisplayContainer
                  displayType={displayType}
                  gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TourCardSkeleton key={i} />
                  ))}
                </DisplayContainer>
              ) : items.length === 0 ? (
                <div className="py-16 text-center text-gray-500 rounded-2xl bg-slate-50">
                  {t('tour.search.noResults', 'No tours found')}
                </div>
              ) : (
                <>
                  <DisplayContainer
                    displayType={displayType}
                    gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
                  >
                    {items.map((tour) => (
                      <TourCard key={tour._id} item={tour} lang={language} />
                    ))}
                  </DisplayContainer>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={queryParams.page <= 1}
                        onClick={() =>
                          setQueryParams((p) => ({
                            ...p,
                            page: (p.page ?? 1) - 1,
                          }))
                        }
                      >
                        {t('common.previous', 'Previous')}
                      </Button>
                      <span className="flex items-center px-4">
                        {t('tour.pagination.page', 'Page')}{' '}
                        {(queryParams.page ?? 1)} / {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={
                          (queryParams.page ?? 1) >= pagination.totalPages
                        }
                        onClick={() =>
                          setQueryParams((p) => ({
                            ...p,
                            page: (p.page ?? 1) + 1,
                          }))
                        }
                      >
                        {t('common.next', 'Next')}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </Container>
    </MainLayout>
  );
};

export default TourPage;
