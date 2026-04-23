import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { PageHero } from '@/components/PageHero';
import {
  ProvinceCard,
  ProvinceCardSkeleton,
  ProvinceFilter,
  ProvinceListHeroSearch,
  defaultProvinceListQuery,
  type ProvinceListQuery,
} from '@/sections/province';
import { useProvincesListQuery } from '@/features/provinces/hooks';
import { useTranslation } from 'react-i18next';
import ServerPagination from '@/shared/pagination/ServerPagination';
import { EnumDisplayItem } from '@/constants/commons';
import DisplayItemType from '@/sections/shared/DisplayItemType';
import DisplayContainer from '@/components/DisplayContainer';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const HERO_VN =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&auto=format&fit=crop&q=80';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayType, setDisplayType] = useState<EnumDisplayItem>(EnumDisplayItem.GRID);
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
  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? items.length;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const showingFrom = total ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const showingTo = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <MainLayout>
      <PageHero
        backgroundImage={HERO_VN}
        title={t('province.hero_title', 'Discover Vietnam provinces')}
        subtitle={t(
          'province.hero_subtitle',
          'Find the best destinations from mountains to coastlines with practical travel insights',
        )}
        badge={t('province.hero_badge', 'Vietnam - local destinations')}
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
        <ProvinceListHeroSearch
          onApply={({ search, region }) => {
            setCurrentPage(1);
            setQuery((prev) => ({
              ...prev,
              search: search ?? '',
              region: region ?? 'ALL',
            }));
          }}
        />
      </PageHero>

      <div className="relative z-[3] -mt-3 sm:-mt-5">
        <ProvinceFilter
          value={query}
          onChange={(next) => {
            setCurrentPage(1);
            setQuery(next);
          }}
          onReset={() => {
            setQuery({ ...defaultProvinceListQuery });
            setCurrentPage(1);
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
                  : t('province.list.showing', {
                      from: showingFrom,
                      to: showingTo,
                      total,
                      defaultValue: 'Showing {{from}}-{{to}} of {{total}} provinces',
                    })}
              </p>
              <h2
                className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-3xl"
                style={{ fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)' }}
              >
                {t('province.list.heading', 'Where to go next')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[rgba(28,26,20,0.5)] sm:hidden">
                {t('province.list.display', 'View')}
              </span>
              <DisplayItemType displayType={displayType} setDisplayType={setDisplayType} />
            </div>
          </div>

          {isLoading ? (
            <DisplayContainer
              displayType={displayType}
              gridClassName="grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <ProvinceCardSkeleton key={index} />
              ))}
            </DisplayContainer>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-[rgba(200,16,46,0.3)] bg-[#fff7f7] px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-[#1c1a14]">
                {t('province.error_title', 'Unable to load provinces')}
              </h3>
              <p className="mt-2 text-sm text-[rgba(28,26,20,0.6)]">
                {error instanceof Error
                  ? error.message
                  : t('province.error_desc', 'Please try again in a moment.')}
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[rgba(28,26,20,0.2)] bg-[#faf7f2] px-6 py-20 text-center">
              <Sparkles className="mb-4 size-10 text-[#c9922a]/80" aria-hidden />
              <h3
                className="text-xl font-semibold text-[#1c1a14]"
                style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
              >
                {t('province.no_results', 'No provinces found')}
              </h3>
              <p className="mt-2 max-w-md text-sm text-[rgba(28,26,20,0.6)]">
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
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((item) => (
                  <ProvinceCard key={item._id} item={item} />
                ))}
              </DisplayContainer>

              {totalPages > 1 && (
                <ServerPagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-10"
                  labels={{
                    previous: t('common.previous', 'Previous'),
                    next: t('common.next', 'Next'),
                    pageAriaLabel: t('province.pagination.page', 'Page'),
                  }}
                />
              )}
            </>
          )}
        </Container>
      </div>
    </MainLayout>
  );
}
