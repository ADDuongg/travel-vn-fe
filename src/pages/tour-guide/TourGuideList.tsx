import React, { useMemo, useState } from 'react';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { PageHero } from '@/components/PageHero';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useTourGuidesQuery } from '@/features/tour-guide/hooks';
import type { TourGuideQueryParams } from '@/features/tour-guide/types';
import ServerPagination from '@/shared/pagination/ServerPagination';
import DisplayItemType from '@/sections/shared/DisplayItemType';
import DisplayContainer from '@/components/DisplayContainer';
import { EnumDisplayItem } from '@/constants/commons';
import { MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TourGuideCard,
  TourGuideCardSkeleton,
  TourGuideFilter,
  TourGuideListHeroSearch,
} from '@/sections/tour-guide';
import {
  defaultTourGuideListQuery,
  type TourGuideListQuery,
} from '@/sections/tour-guide';

const HERO_VN =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&auto=format&fit=crop&q=80';
const PAGE_SIZE = 9;

const TourGuideList: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [displayType, setDisplayType] = useState<EnumDisplayItem>(
    EnumDisplayItem.GRID,
  );
  const [query, setQuery] = useState<TourGuideListQuery>({
    ...defaultTourGuideListQuery,
  });
  const [currentPage, setCurrentPage] = useState(1);

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

  const { data, isLoading } = useTourGuidesQuery(queryParams);

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
        title={t('tour_guide.list_title', 'Professional Tour Guides')}
        subtitle={t(
          'tour_guide.list_subtitle',
          'Connect with trusted local guides across Vietnam for deeper travel experiences',
        )}
        badge={t('tour_guide.page.badge', 'Vietnam - local experts')}
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
        <TourGuideListHeroSearch
          onApply={({ search, provinceId }) => {
            setCurrentPage(1);
            setQuery((prev: TourGuideListQuery) => ({
              ...prev,
              search: search ?? '',
              provinceId: provinceId ?? '',
            }));
          }}
        />
      </PageHero>

      <div className="relative z-[3] -mt-3 sm:-mt-5">
        <TourGuideFilter
          value={query}
          onChange={(next) => {
            setCurrentPage(1);
            setQuery(next);
          }}
          onReset={() => {
            setQuery({ ...defaultTourGuideListQuery });
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
                  : t('tour_guide.list.showing', {
                      from: showingFrom,
                      to: showingTo,
                      total,
                      defaultValue:
                        'Showing {{from}}-{{to}} of {{total}} tour guides',
                    })}
              </p>
              <h2
                className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-3xl"
                style={{
                  fontFamily:
                    'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
                }}
              >
                {t('tour_guide.list.heading', 'Find your travel companion')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="hidden size-4 text-[#2d6a4f] sm:block" aria-hidden />
              <span className="text-sm text-[rgba(28,26,20,0.5)] sm:hidden">
                {t('tour_guide.list.display', 'View')}
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
                <TourGuideCardSkeleton key={i} />
              ))}
            </DisplayContainer>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[rgba(28,26,20,0.2)] bg-[#faf7f2] px-6 py-20 text-center">
              <Sparkles className="mb-4 size-10 text-[#c9922a]/80" aria-hidden />
              <h3
                className="text-xl font-semibold text-[#1c1a14]"
                style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
              >
                {t('tour_guide.no_results', 'No guides found')}
              </h3>
              <p className="mt-2 max-w-md text-sm text-[rgba(28,26,20,0.6)]">
                {t(
                  'tour_guide.list.empty_hint',
                  'Try a different destination, language, or verification filter.',
                )}
              </p>
              <Button
                className="mt-6 cursor-pointer"
                onClick={() => {
                  setQuery({ ...defaultTourGuideListQuery });
                  setCurrentPage(1);
                }}
              >
                {t('tour_guide.list.clear_cta', 'Reset filters')}
              </Button>
            </div>
          ) : (
            <>
              <DisplayContainer
                displayType={displayType}
                gridClassName="grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((guide) => (
                  <TourGuideCard key={guide._id} item={guide} lang={language} />
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
                    pageAriaLabel: t('tour_guide.page', 'Page'),
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

export default TourGuideList;
