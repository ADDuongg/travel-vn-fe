import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MainLayout } from '@/layout';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal } from '@/components/home-editorial/Reveal';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useToursQuery } from '@/features/tours/hooks';
import {
  TourCard,
  TourCardSkeleton,
  TourFilter,
} from '@/sections/tour';
import DisplayItemType from '@/sections/shared/DisplayItemType';
import DisplayContainer from '@/components/DisplayContainer';
import { EnumDisplayItem } from '@/constants/commons';
import type { TourQueryParams } from '@/features/tours/types';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles } from 'lucide-react';
import { AtlasPagination } from '@/shared/pagination/AtlasPagination';
import {
  TOUR_LIST_PAGE_SIZE,
  defaultTourListQueryParams,
  parseTourListSearchParams,
  serializeTourListSearchParams,
} from '@/pages/tour/tourListSearchParams';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400';

const TourList: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  const [queryParams, setQueryParams] = useState<TourQueryParams>(() =>
    parseTourListSearchParams(searchParams),
  );

  useEffect(() => {
    setQueryParams(parseTourListSearchParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const next = serializeTourListSearchParams(queryParams);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [queryParams, searchParams, setSearchParams]);

  const [displayType, setDisplayType] = useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );

  const { data, isLoading, error } = useToursQuery(queryParams);

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? items.length;
  const currentPage = queryParams.page ?? 1;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const limit = queryParams.limit ?? TOUR_LIST_PAGE_SIZE;

  const showingFrom = total ? (currentPage - 1) * limit + 1 : 0;
  const showingTo = Math.min(currentPage * limit, total);

  const urlSignature = searchParams.toString();

  const atlasPaginationLabels = useMemo(
    () => ({
      showingRange: t('tour.pagination.atlas_showing', {
        from: showingFrom,
        to: showingTo,
        total,
        defaultValue: 'Showing {{from}}–{{to}} of {{total}} journeys',
      }),
      folioLabel: t('tour.pagination.atlas_folio_prefix', 'Folio'),
      prevSpread: t('tour.pagination.prev_spread', 'Previous spread'),
      nextSpread: t('tour.pagination.next_spread', 'Next spread'),
      spreadNavLabel: t('tour.pagination.spread_nav', 'Spread navigation'),
    }),
    [showingFrom, showingTo, t, total],
  );

  const mergeBase = (partial: TourQueryParams): TourQueryParams => ({
    ...defaultTourListQueryParams(),
    ...partial,
    limit: TOUR_LIST_PAGE_SIZE,
  });

  return (
    <MainLayout>
      <article>
        <ParallaxHero image={HERO_IMAGE} heightClass="min-h-[min(92vh,900px)]">
          <div className="flex flex-1 flex-col justify-end px-6 pb-14 pt-36 md:px-14 md:pb-20 md:pt-44">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl space-y-5 text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/75">
                {t('tour.list.hero_kicker', 'Journeys · routes as stories')}
              </p>
              <h1 className="font-display text-[clamp(2.6rem,6.8vw,4.85rem)] leading-[0.92]">
                {t('tour.list.hero_title', 'Vietnam journeys, unhurried')}
              </h1>
              <p className="max-w-2xl text-lg text-sand-100/85">
                {t(
                  'tour.list.hero_subtitle',
                  'Scroll like a feature — filter when you need clarity, then choose a route that matches your tempo.',
                )}
              </p>
            </motion.div>
          </div>
        </ParallaxHero>

        <TourFilter
          variant="atlas"
          syncedTourQuery={queryParams}
          urlSignature={urlSignature}
          onFilter={(params) => setQueryParams(mergeBase(params))}
          onClear={() => setQueryParams(defaultTourListQueryParams())}
        />

        <section className="bg-sand-100 px-4 py-14 pb-24 md:px-10 md:py-20 md:pb-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-14 max-w-[52ch] space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('tour.list.atlas_kicker', 'Editorial catalog')}
              </p>
              <p className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
                {t(
                  'tour.list.atlas_title',
                  'Every itinerary is a letter from the road.',
                )}
              </p>
              <p className="text-sm leading-relaxed text-mist">
                {t(
                  'tour.list.atlas_lead',
                  'Price and duration stay legible but quiet — the name and the place lead the frame.',
                )}
              </p>
            </Reveal>

            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-mist">
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
                <h2 className="mt-1 font-display text-2xl tracking-[-0.02em] text-charcoal sm:text-3xl">
                  {t('tour.list.heading', 'Handpicked Vietnam tours')}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <MapPin
                  className="hidden size-4 text-forest sm:block"
                  aria-hidden
                />
                <span className="text-sm text-charcoal/50 sm:hidden">
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
            ) : error ? (
              <div className="rounded-2xl border border-dashed border-sunset-deep/40 bg-[var(--red-soft)] px-6 py-16 text-center">
                <h3 className="font-display text-xl font-semibold text-charcoal">
                  {t('tour.error_title', 'Unable to load tours')}
                </h3>
                <p className="mt-2 text-sm text-mist">
                  {error instanceof Error
                    ? error.message
                    : t(
                        'tour.error_desc',
                        'Please try again in a moment.',
                      )}
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-charcoal/20 bg-sand-50 px-6 py-20 text-center">
                <Sparkles className="mb-4 size-10 text-sunset/90" aria-hidden />
                <h3 className="font-display text-xl font-semibold text-charcoal">
                  {t('tour.search.noResults', 'No tours found')}
                </h3>
                <p className="mt-2 max-w-md text-sm text-mist">
                  {t(
                    'tour.list.empty_hint',
                    'Try adjusting your filters or search for another destination.',
                  )}
                </p>
                <Button
                  className="mt-6 cursor-pointer"
                  onClick={() => setQueryParams(defaultTourListQueryParams())}
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
                    <Reveal key={tour._id}>
                      <TourCard item={tour} lang={language} />
                    </Reveal>
                  ))}
                </DisplayContainer>

                {pagination && totalPages > 1 ? (
                  <div className="mt-16 border-t border-charcoal/10 pt-14">
                    <AtlasPagination
                      page={currentPage}
                      totalPages={totalPages}
                      onPageChange={(nextPage) =>
                        setQueryParams((prev) => ({ ...prev, page: nextPage }))
                      }
                      labels={atlasPaginationLabels}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </article>
    </MainLayout>
  );
};

export default TourList;

