import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layout';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal } from '@/components/home-editorial/Reveal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import {
  useHotelsInfiniteQuery,
  type HotelsInfiniteListParams,
} from '@/features/hotels/hooks';
import {
  defaultHotelListQuery,
  type HotelListQuery,
} from '@/sections/hotel/hotel-list-query';
import {
  HotelEditorialListCard,
  HotelEditorialListCardSkeleton,
} from '@/sections/hotel/components/HotelEditorialListCard';
import { HotelEditorialListFilters } from '@/sections/hotel/components/HotelEditorialListFilters';
import { ROUTES } from '@/constants/router';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400';

const PAGE_SIZE = 9;

const HotelList: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState<HotelListQuery>({ ...defaultHotelListQuery });
  const [debouncedSearch, setDebouncedSearch] = useState(query.search);

  useEffect(() => {
    if (query.search === '') {
      setDebouncedSearch('');
      return;
    }
    const id = window.setTimeout(() => {
      setDebouncedSearch(query.search);
    }, 380);
    return () => window.clearTimeout(id);
  }, [query.search]);

  const infiniteParams = useMemo<HotelsInfiniteListParams>(() => {
    const params: HotelsInfiniteListParams = {
      limit: PAGE_SIZE,
      sortBy: query.sortBy,
      lang: language,
    };
    if (query.provinceId) params.provinceId = query.provinceId;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (query.minStars > 0) params.minStars = query.minStars;
    return params;
  }, [language, query.provinceId, query.sortBy, query.minStars, debouncedSearch]);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useHotelsInfiniteQuery(infiniteParams);

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data?.pages],
  );

  const showInitialSkeleton = isLoading && !data;

  return (
    <MainLayout>
      <article>
        <ParallaxHero image={HERO_IMAGE}>
          <div className="flex flex-1 flex-col justify-end px-6 pb-14 pt-36 md:px-14 md:pb-20 md:pt-44">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
              }
              className="max-w-3xl space-y-5 text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/75">
                {t('hotel.editorial.hero_kicker', 'Shelters · correspondence first')}
              </p>
              <h1 className="font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95]">
                {t('hotel.editorial.hero_title', 'Stays that behave like chapters')}
              </h1>
              <p className="max-w-2xl text-lg text-sand-100/85">
                {t(
                  'hotel.editorial.hero_subtitle',
                  'Boutique roofs and honest inventories; filters stay soft, and nothing here pretends to be a checkout cart.',
                )}
              </p>
            </motion.div>
          </div>
        </ParallaxHero>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-10 md:py-20">
          <Reveal className="mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('hotel.editorial.search_kicker', 'Search')}
              </p>
              <h2 className="font-display text-3xl text-charcoal md:text-4xl">
                {t(
                  'hotel.editorial.search_title',
                  'Name, province, or address fragment',
                )}
              </h2>
            </div>
            <div className="w-full max-w-md space-y-2">
              <Label htmlFor="hotel-editorial-search" className="text-charcoal/80">
                {t('hotel.editorial.search_label', 'Find a stay')}
              </Label>
              <Input
                id="hotel-editorial-search"
                value={query.search}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, search: e.target.value }))
                }
                placeholder={t(
                  'hotel.editorial.search_placeholder',
                  'e.g. Huế, terrace, canal…',
                )}
                autoComplete="off"
                className="rounded-2xl border-charcoal/12 bg-sand-50/90 h-12 px-4"
              />
              <p className="text-xs text-mist">
                {t(
                  'hotel.editorial.search_hint',
                  'Matches title, description, address, or province.',
                )}
              </p>
            </div>
          </Reveal>
        </section>

        <HotelEditorialListFilters
          value={query}
          onChange={(next) => setQuery(next)}
        />

        <section className="mx-auto max-w-6xl px-4 pb-28 md:px-10 md:pb-36">
          <div className="flex flex-col gap-24 md:gap-32">
            {showInitialSkeleton
              ? Array.from({ length: 3 }).map((_, i) => (
                  <HotelEditorialListCardSkeleton key={i} />
                ))
              : items.map((h, i) => (
                  <HotelEditorialListCard
                    key={h._id}
                    hotel={h}
                    index={i}
                    lang={language}
                  />
                ))}
          </div>

          {!showInitialSkeleton && items.length === 0 && !isFetching ? (
            <p className="mt-16 text-center text-mist">
              {t(
                'hotel.editorial.empty',
                'Nothing in this pairing: loosen a filter or clear search.',
              )}
            </p>
          ) : null}

          {!showInitialSkeleton && hasNextPage ? (
            <div className="mt-16 flex flex-col items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer rounded-full border-charcoal/20 px-8 py-6 text-sm font-semibold text-charcoal hover:border-forest/40 hover:bg-sand-50"
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                {isFetchingNextPage
                  ? t('hotel.editorial.load_more_loading', 'Loading…')
                  : t('hotel.editorial.load_more', 'Load more stays')}
              </Button>
            </div>
          ) : null}

          <Reveal className="mt-20">
            <Link
              to={ROUTES.TOUR.INDEX}
              className="inline-flex items-center gap-2 border-b border-charcoal/25 pb-0.5 text-sm font-semibold text-charcoal transition hover:border-forest/50 hover:text-sunset-deep"
            >
              {t('hotel.editorial.tour_cta', 'Prefer slow routes instead')}
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </section>
      </article>
    </MainLayout>
  );
};

export default HotelList;
