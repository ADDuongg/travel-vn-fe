import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MainLayout } from '@/layout';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal } from '@/components/home-editorial/Reveal';
import {
  ProvinceListAtlasToolbar,
  ProvinceMagazineCard,
  ProvinceMagazineCardSkeleton,
  ProvincePopularStrip,
  defaultProvinceListQuery,
  isDefaultProvinceQuery,
  type ProvinceListQuery,
} from '@/sections/province';
import { usePopularProvincesQuery, useProvincesListQuery } from '@/features/provinces/hooks';
import { MOCK_PROVINCES_FALLBACK } from '@/features/provinces/mockProvinces';
import type { ProvinceListItem } from '@/features/provinces/types';
import { useTranslation } from 'react-i18next';
import { AtlasPagination } from '@/shared/pagination/AtlasPagination';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1570077188670-e00b4fb6c7e9?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400';
const PAGE_SIZE = 9;

function getQueryFromSearchParams(searchParams: URLSearchParams): ProvinceListQuery {
  const region = searchParams.get('region');
  const nextRegion =
    region === 'NORTH' || region === 'CENTRAL' || region === 'SOUTH' ? region : 'ALL';
  const popular = searchParams.get('isPopular');
  const isPopular = popular === 'true' || popular === 'false' ? popular : 'all';
  const sort = searchParams.get('sort');
  const sortBy = sort === 'displayOrder' || sort === 'newest' || sort === 'name' ? sort : 'name';

  return {
    search: searchParams.get('search') ?? '',
    region: nextRegion,
    isPopular,
    sortBy,
  };
}

function getSearchParamsFromQuery(query: ProvinceListQuery, page: number) {
  const next = new URLSearchParams();
  next.set('page', String(page));
  if (query.search.trim()) next.set('search', query.search.trim());
  if (query.region !== 'ALL') next.set('region', query.region);
  if (query.isPopular !== 'all') next.set('isPopular', query.isPopular);
  if (query.sortBy !== 'name') next.set('sort', query.sortBy);
  return next;
}

export default function ProvinceListPage() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<ProvinceListQuery>(() => getQueryFromSearchParams(searchParams));
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

  const params = useMemo(() => {
    const next: Record<string, string | number | boolean | undefined> = {
      page: currentPage,
      limit: PAGE_SIZE,
      sort: query.sortBy,
    };
    if (query.region !== 'ALL') {
      next.region = query.region;
    }
    if (query.isPopular === 'true') {
      next.isPopular = true;
    } else if (query.isPopular === 'false') {
      next.isPopular = false;
    }
    if (query.search.trim()) {
      next.search = query.search.trim();
    }
    return next;
  }, [currentPage, query]);

  const { data, isLoading, error } = useProvincesListQuery(params);
  const { data: popularProvinces = [] } = usePopularProvincesQuery();

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? items.length;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  const useMockListFallback =
    !isLoading && !error && items.length === 0 && isDefaultProvinceQuery(query, currentPage);

  const displayItems: ProvinceListItem[] = useMockListFallback ? MOCK_PROVINCES_FALLBACK : items;

  const totalForUi = useMockListFallback ? MOCK_PROVINCES_FALLBACK.length : total;
  const showingFrom = totalForUi > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const showingTo = useMockListFallback
    ? MOCK_PROVINCES_FALLBACK.length
    : Math.min(currentPage * PAGE_SIZE, total);

  const handleQueryChange = useCallback((next: ProvinceListQuery) => {
    setCurrentPage(1);
    setQuery(next);
  }, []);

  const atlasPaginationLabels = useMemo(
    () => ({
      showingRange: t('province.pagination.atlas_showing', {
        from: showingFrom,
        to: showingTo,
        total: totalForUi,
      }),
      folioLabel: t('province.pagination.atlas_folio_prefix', 'Folio'),
      prevSpread: t('province.pagination.prev_spread', 'Previous spread'),
      nextSpread: t('province.pagination.next_spread', 'Next spread'),
      spreadNavLabel: t('province.pagination.spread_nav', 'Spread navigation'),
    }),
    [showingFrom, showingTo, t, totalForUi],
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
                {t('province.hero_kicker', 'Atlas · moods by latitude')}
              </p>
              <h1 className="font-display text-[clamp(2.6rem,6.8vw,4.85rem)] leading-[0.92]">
                {t('province.hero_title', 'Discover Vietnam provinces')}
              </h1>
              <p className="max-w-2xl text-lg text-sand-100/85">
                {t(
                  'province.hero_subtitle',
                  'Find destinations from highlands to delta coastlines — curated frames and practical filters.',
                )}
              </p>
            </motion.div>
          </div>
        </ParallaxHero>

        <ProvinceListAtlasToolbar
          value={query}
          onChange={handleQueryChange}
          onReset={() => {
            setQuery({ ...defaultProvinceListQuery });
            setCurrentPage(1);
          }}
        />

        <ProvincePopularStrip items={popularProvinces} />

        <section className="mx-auto max-w-6xl px-4 py-14 pb-24 md:px-10 md:py-20 md:pb-28">
          <Reveal className="mb-14 max-w-[52ch] space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('province.atlas.kicker', 'Immersive atlas')}
            </p>
            <p className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
              {t('province.atlas.title', 'Scroll as if paging a travel folio.')}
            </p>
            <p className="text-sm leading-relaxed text-mist">
              {t(
                'province.atlas.lead',
                'Each province card is geography as temperament — mountains, coast, and delta stories.',
              )}
            </p>
          </Reveal>

          {isLoading ? (
            <div className="grid gap-12 sm:gap-14 md:grid-cols-2">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <ProvinceMagazineCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-sunset-deep/40 bg-[var(--red-soft)] px-6 py-16 text-center">
              <h3 className="font-display text-xl font-semibold text-charcoal">
                {t('province.error_title', 'Unable to load provinces')}
              </h3>
              <p className="mt-2 text-sm text-mist">
                {error instanceof Error
                  ? error.message
                  : t('province.error_desc', 'Please try again in a moment.')}
              </p>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-charcoal/20 bg-sand-100 px-6 py-20 text-center">
              <Sparkles className="mb-4 size-10 text-sunset/90" aria-hidden />
              <h3 className="font-display text-xl font-semibold text-charcoal">
                {t('province.no_results', 'No provinces found')}
              </h3>
              <p className="mt-2 max-w-md text-sm text-mist">
                {t('province.empty_hint', 'Try another keyword, region, or sort option.')}
              </p>
              <Button
                className="mt-6 cursor-pointer"
                onClick={() => {
                  setQuery({ ...defaultProvinceListQuery });
                  setCurrentPage(1);
                }}
              >
                {t('province.list.clear_cta', 'Reset filters')}
              </Button>
            </div>
          ) : (
            <>
              {useMockListFallback ? (
                <p
                  className="mb-8 rounded-xl border border-charcoal/10 bg-sand-100 px-4 py-3 text-sm text-mist"
                  role="status"
                >
                  {t(
                    'province.demo_fallback_hint',
                    'Sample provinces are shown until live data is available.',
                  )}
                </p>
              ) : null}
              <div className="grid gap-12 sm:gap-14 md:grid-cols-2">
                {displayItems.map((item) => (
                  <Reveal key={item._id}>
                    <ProvinceMagazineCard item={item} />
                  </Reveal>
                ))}
              </div>

              {!useMockListFallback && totalPages > 1 ? (
                <div className="mt-16 border-t border-charcoal/10 pt-14">
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
        </section>
      </article>
    </MainLayout>
  );
}
