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
  useRoomsInfiniteQuery,
  type RoomsInfiniteListParams,
} from '@/features/rooms/hooks';
import {
  defaultRoomListQuery,
  type RoomListQuery,
} from '@/sections/room/room-list-query';
import RoomFilter from '@/sections/room/components/RoomFilter';
import {
  RoomEditorialListCard,
  RoomEditorialListCardSkeleton,
} from '@/sections/room/components/RoomEditorialListCard';
import { RoomEditorialListFilters } from '@/sections/room/components/RoomEditorialListFilters';
import { ROUTES } from '@/constants/router';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400';

const PAGE_SIZE = 12;

function toInfiniteParams(
  value: RoomListQuery,
  language: string,
  debouncedSearch: string,
): RoomsInfiniteListParams {
  const params: RoomsInfiniteListParams = {
    limit: PAGE_SIZE,
    lang: language,
    sortBy: value.sortBy,
  };
  if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();
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
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState<RoomListQuery>({ ...defaultRoomListQuery });
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

  const infiniteParams = useMemo(
    () => toInfiniteParams(query, language, debouncedSearch),
    [query, language, debouncedSearch],
  );

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useRoomsInfiniteQuery(infiniteParams);

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data?.pages],
  );

  const totalCategories = data?.pages[0]?.pagination.total ?? items.length;

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
                {t(
                  'room.editorial.hero_kicker',
                  'Inventory · correspondence first',
                )}
              </p>
              <h1 className="font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95]">
                {t(
                  'room.editorial.hero_title',
                  'Rooms as typed inventory',
                )}
              </h1>
              <p className="max-w-2xl text-lg text-sand-100/85">
                {t(
                  'room.editorial.hero_subtitle',
                  'Same fields as the live catalog: nights, capacity, weekend tiers. Filters stay soft; holds stay human.',
                )}
              </p>
            </motion.div>
          </div>
        </ParallaxHero>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-10 md:py-20">
          <Reveal className="mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('room.editorial.search_kicker', 'Search')}
              </p>
              <h2 className="font-display text-3xl text-charcoal md:text-4xl">
                {t(
                  'room.editorial.search_title',
                  'Room, type, or property name',
                )}
              </h2>
            </div>
            <div className="w-full max-w-md space-y-2">
              <Label htmlFor="room-editorial-search" className="text-charcoal/80">
                {t('room.editorial.search_label', 'Find a room')}
              </Label>
              <Input
                id="room-editorial-search"
                value={query.search}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, search: e.target.value }))
                }
                placeholder={t(
                  'room.editorial.search_placeholder',
                  'e.g. Indigo, courtyard, Huế…',
                )}
                autoComplete="off"
                className="rounded-2xl border-charcoal/12 bg-sand-50/90 h-12 px-4"
              />
              <p className="text-xs text-mist">
                {t(
                  'room.editorial.search_hint',
                  'Matches room name, type, property title, or address fragment.',
                )}
              </p>
            </div>
          </Reveal>
        </section>

        <RoomEditorialListFilters
          value={query}
          onChange={(next) => setQuery(next)}
        />

        <section className="mx-auto max-w-6xl px-4 py-10 md:px-10 md:py-12">
          <Reveal className="mb-8 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('room.editorial.advanced_kicker', 'More filters')}
            </p>
            <p className="text-sm text-mist">
              {t(
                'room.editorial.advanced_hint',
                'Dates, guests, amenities, and rating use the same API fields as before.',
              )}
            </p>
          </Reveal>
          <RoomFilter
            embedded
            value={query}
            onChange={(next) => setQuery(next)}
            onReset={() => setQuery({ ...defaultRoomListQuery })}
          />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-10 md:py-24">
          <Reveal className="mb-12 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('room.editorial.catalog_kicker', 'Catalog')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
              {t('room.editorial.catalog_title', {
                count: totalCategories,
                defaultValue: '{{count}} room categories',
              })}
            </h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {showInitialSkeleton
              ? Array.from({ length: 4 }).map((_, i) => (
                  <RoomEditorialListCardSkeleton key={i} />
                ))
              : items.map((room, i) => (
                  <RoomEditorialListCard
                    key={room._id}
                    room={room}
                    index={i}
                    lang={language}
                  />
                ))}
          </div>

          {!showInitialSkeleton && items.length === 0 && !isFetching ? (
            <p className="mt-16 text-center text-mist">
              {t(
                'room.editorial.empty',
                'Nothing in this pairing: loosen price band or clear search.',
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
                  ? t('room.editorial.load_more_loading', 'Loading…')
                  : t('room.editorial.load_more', 'Load more rooms')}
              </Button>
            </div>
          ) : null}

          <Reveal className="mt-20">
            <Link
              to={ROUTES.HOTEL.INDEX}
              className="inline-flex items-center gap-2 border-b border-charcoal/25 pb-0.5 text-sm font-semibold text-charcoal transition hover:border-forest/50 hover:text-sunset-deep"
            >
              {t('room.editorial.hotels_cta', 'Browse whole properties instead')}
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </section>
      </article>
    </MainLayout>
  );
};

export default RoomListPage;
