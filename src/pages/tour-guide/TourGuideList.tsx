import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/layout';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { MagazineSectionHeading } from '@/components/home-editorial/MagazineSectionHeading';
import { Reveal } from '@/components/home-editorial/Reveal';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useTourGuidesQuery } from '@/features/tour-guide/hooks';
import type { TourGuideQueryParams } from '@/features/tour-guide/types';
import { AtlasPagination } from '@/shared/pagination/AtlasPagination';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TourGuideCard,
  TourGuideCardSkeleton,
  TourGuideFilter,
} from '@/sections/tour-guide';
import {
  defaultTourGuideListQuery,
  type TourGuideListQuery,
} from '@/sections/tour-guide';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1570077188670-e00b4fb6c7e9?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400';
const PAGE_SIZE = 9;

function getQueryFromSearchParams(searchParams: URLSearchParams): TourGuideListQuery {
  const sort = searchParams.get('sort');
  const sortBy: TourGuideListQuery['sortBy'] =
    sort === 'rating' || sort === 'experience' || sort === 'newest' ? sort : 'newest';
  const verified = searchParams.get('verified');
  const isVerified: TourGuideListQuery['isVerified'] =
    verified === 'true' ? 'true' : verified === 'false' ? 'false' : 'all';

  return {
    search: searchParams.get('search') ?? '',
    provinceId: searchParams.get('province') ?? '',
    language: searchParams.get('language') ?? '',
    isVerified,
    sortBy,
  };
}

function getSearchParamsFromQuery(query: TourGuideListQuery, page: number) {
  const next = new URLSearchParams();
  next.set('page', String(page));
  if (query.search.trim()) next.set('search', query.search.trim());
  if (query.provinceId) next.set('province', query.provinceId);
  if (query.language) next.set('language', query.language);
  if (query.isVerified !== 'all') next.set('verified', query.isVerified);
  if (query.sortBy !== 'newest') next.set('sort', query.sortBy);
  return next;
}

const TourGuideList: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<TourGuideListQuery>(() =>
    getQueryFromSearchParams(searchParams),
  );
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const nextQuery = getQueryFromSearchParams(searchParams);
    const nextPage = Number(searchParams.get('page')) || 1;
    setQuery(nextQuery);
    setCurrentPage(nextPage);
  }, [searchParams]);

  useEffect(() => {
    const next = getSearchParamsFromQuery(query, currentPage);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [currentPage, query, searchParams, setSearchParams]);

  const queryParams = useMemo<TourGuideQueryParams>(() => {
    const params: TourGuideQueryParams = {
      page: currentPage,
      limit: PAGE_SIZE,
      sort: query.sortBy,
    };
    if (query.provinceId) params.provinceId = query.provinceId;
    if (query.language) params.language = query.language;
    if (query.search.trim()) params.search = query.search.trim();
    if (query.isVerified !== 'all') params.isVerified = query.isVerified === 'true';
    return params;
  }, [currentPage, query]);

  const { data, isLoading, isError, error } = useTourGuidesQuery(queryParams);

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? items.length;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const showingFrom = total ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const showingTo = Math.min(currentPage * PAGE_SIZE, total);

  const handleFilterChange = useCallback((next: TourGuideListQuery) => {
    setCurrentPage(1);
    setQuery(next);
  }, []);

  const handleFilterReset = useCallback(() => {
    setQuery({ ...defaultTourGuideListQuery });
    setCurrentPage(1);
  }, []);

  const atlasPaginationLabels = useMemo(
    () => ({
      showingRange: t('tour_guide.pagination.atlas_showing', {
        from: showingFrom,
        to: showingTo,
        total,
      }),
      folioLabel: t('tour_guide.pagination.atlas_folio_prefix', 'Folio'),
      prevSpread: t('tour_guide.pagination.prev_spread', 'Previous spread'),
      nextSpread: t('tour_guide.pagination.next_spread', 'Next spread'),
      spreadNavLabel: t('tour_guide.pagination.spread_nav', 'Spread navigation'),
    }),
    [showingFrom, showingTo, t, total],
  );

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
                {t('tour_guide.hero_kicker')}
              </p>
              <h1 className="font-display text-[clamp(2.6rem,6.8vw,4.85rem)] leading-[0.92]">
                {t('tour_guide.hero_title')}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-sand-100/85">
                {t('tour_guide.hero_subtitle')}
              </p>
            </motion.div>
          </div>
        </ParallaxHero>

        <TourGuideFilter
          value={query}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />

        <section className="bg-sand-100 px-4 py-16 pb-28 md:px-10 md:py-24 md:pb-32">
          <div className="mx-auto max-w-6xl">
            <MagazineSectionHeading
              kicker={t('tour_guide.atlas.kicker')}
              title={t('tour_guide.atlas.title')}
              className="mb-12 space-y-6 md:mb-16"
            >
              <p className="max-w-[52ch] text-sm leading-relaxed text-mist md:text-[15px]">
                {t('tour_guide.atlas.lead')}
              </p>
              {!isLoading && (
                <p className="text-[11px] uppercase tracking-[0.24em] text-charcoal/45">
                  {t('tour_guide.list.showing', {
                    from: showingFrom,
                    to: showingTo,
                    total,
                  })}
                </p>
              )}
            </MagazineSectionHeading>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-14 sm:gap-16 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TourGuideCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-dashed border-sunset-deep/40 bg-[var(--red-soft)] px-6 py-16 text-center">
                <h2 className="font-display text-xl font-semibold text-charcoal">
                  {t('tour_guide.error_title', 'Unable to load guides')}
                </h2>
                <p className="mt-2 text-sm text-mist">
                  {error instanceof Error
                    ? error.message
                    : t('tour_guide.error_desc', 'Please try again in a moment.')}
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-charcoal/18 bg-sand-50/80 px-8 py-24 text-center">
                <Sparkles className="mb-5 size-10 text-sunset/90" aria-hidden />
                <h2 className="font-display text-xl font-semibold text-charcoal">
                  {t('tour_guide.no_results')}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">
                  {t('tour_guide.list.empty_hint')}
                </p>
                <Button
                  className="mt-8 cursor-pointer"
                  onClick={() => {
                    setQuery({ ...defaultTourGuideListQuery });
                    setCurrentPage(1);
                  }}
                >
                  {t('tour_guide.list.clear_cta')}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-14 sm:gap-16 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
                  {items.map((guide, index) => (
                    <Reveal key={guide._id}>
                      <TourGuideCard
                        item={guide}
                        lang={language}
                        index={index}
                      />
                    </Reveal>
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-20 border-t border-charcoal/10 pt-16">
                    <AtlasPagination
                      page={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
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

export default TourGuideList;

