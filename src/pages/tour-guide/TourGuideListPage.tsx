import React, { useState } from 'react';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { ResponsiveH3 } from '@/components/ui/typography';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useTourGuidesQuery } from '@/features/tour-guide/hooks';
import TourGuideCard, { TourGuideCardSkeleton } from '@/sections/tour-guide/TourGuideCard';
import TourGuideFilter from '@/sections/tour-guide/TourGuideFilter';
import { Button } from '@/components/ui/button';
import type { TourGuideQueryParams } from '@/features/tour-guide/types';

const TourGuideListPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [queryParams, setQueryParams] = useState<TourGuideQueryParams>({
    page: 1,
    limit: 12,
    sort: 'newest',
  });

  const { data, isLoading } = useTourGuidesQuery(queryParams);

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <MainLayout>
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')] bg-cover bg-center opacity-25" />
        <div className="relative px-6 py-20 md:py-28 text-center">
          <ResponsiveH3 className="font-dm-serif-display text-white mb-4">
            {t('tour_guide.list_title')}
          </ResponsiveH3>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t('tour_guide.list_subtitle')}
          </p>
        </div>
      </div>

      <Container>
        <div className="flex flex-col lg:flex-row gap-8 py-10">
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-36 bg-white rounded-2xl shadow-lg border p-6">
              <TourGuideFilter
                onFilter={(params) =>
                  setQueryParams((prev) => ({ ...prev, ...params, page: 1 }))
                }
                onClear={() =>
                  setQueryParams({
                    page: 1,
                    limit: 12,
                    sort: 'newest',
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
                    : `${pagination?.total ?? items.length} ${t('tour_guide.count_guides')}`}
                </ResponsiveH3>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TourGuideCardSkeleton key={i} />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="py-16 text-center text-gray-500 rounded-2xl bg-slate-50">
                  {t('tour_guide.no_results')}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                    {items.map((guide) => (
                      <TourGuideCard key={guide._id} item={guide} lang={language} />
                    ))}
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={(queryParams.page ?? 1) <= 1}
                        onClick={() =>
                          setQueryParams((p) => ({
                            ...p,
                            page: (p.page ?? 1) - 1,
                          }))
                        }
                      >
                        {t('common.previous')}
                      </Button>
                      <span className="flex items-center px-4">
                        {t('tour_guide.page')} {queryParams.page ?? 1} / {pagination.totalPages}
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
                        {t('common.next')}
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

export default TourGuideListPage;
