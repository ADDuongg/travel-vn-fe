import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import type {
  ProvinceListQuery,
  ProvinceRegion,
} from '@/sections/province/province-list-query';

const SEARCH_DEBOUNCE_MS = 350;

const REGION_IDS: ProvinceRegion[] = ['ALL', 'NORTH', 'CENTRAL', 'SOUTH'];

type ProvinceListAtlasToolbarProps = {
  value: ProvinceListQuery;
  onChange: (next: ProvinceListQuery) => void;
  onReset: () => void;
};

export function ProvinceListAtlasToolbar({
  value,
  onChange,
  onReset,
}: ProvinceListAtlasToolbarProps) {
  const { t } = useTranslation();
  const [draftSearch, setDraftSearch] = useState(value.search);
  const queryRef = useRef(value);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  queryRef.current = value;

  useEffect(() => {
    setDraftSearch(value.search);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [value.search]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      const q = queryRef.current;
      if (draftSearch.trim() !== q.search.trim()) {
        onChange({ ...q, search: draftSearch });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [draftSearch, onChange]);

  const hasActive = useMemo(
    () =>
      value.region !== 'ALL' ||
      value.isPopular !== 'all' ||
      value.sortBy !== 'name' ||
      value.search.trim() !== '',
    [value],
  );

  const regionLabel = (id: ProvinceRegion) => {
    if (id === 'ALL') return t('province.atlas.all_regions', 'All regions');
    if (id === 'NORTH') return t('province.atlas.region_north_short', 'North');
    if (id === 'CENTRAL')
      return t('province.atlas.region_central_short', 'Central');
    return t('province.atlas.region_south_short', 'South');
  };

  const popularActive = value.isPopular === 'true';

  const sortOptions = useMemo(
    () => [
      {
        id: 'displayOrder' as const,
        label: t('province.sort_display_order', 'Display order'),
      },
      { id: 'newest' as const, label: t('province.sort_newest', 'Newest') },
      { id: 'name' as const, label: t('province.sort_name', 'Name (A–Z)') },
    ],
    [t],
  );

  return (
    <div
      className={cn(
        'sticky top-24 z-30 border-b border-charcoal/10 bg-sand-50/80 px-4 py-4 shadow-[0_12px_40px_-24px_oklch(22%_0.02_75/0.25)] backdrop-blur-md md:top-23 md:px-10',
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block min-w-[min(100%,280px)] flex-1">
          <span className="sr-only">
            {t('province.atlas.search_label', 'Search provinces')}
          </span>
          <input
            type="search"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder={t(
              'province.search_placeholder',
              'Search provinces...',
            )}
            className="w-full rounded-full border border-charcoal/12 bg-sand-50/90 px-5 py-3 text-sm text-charcoal outline-none ring-forest/25 transition placeholder:text-charcoal/40 focus:border-forest/35 focus:ring-4"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Stagger className="flex flex-wrap gap-2">
            {REGION_IDS.map((id) => (
              <RevealItem key={id}>
                <button
                  type="button"
                  aria-pressed={value.region === id}
                  onClick={() => onChange({ ...value, region: id })}
                  className={cn(
                    'rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition',
                    value.region === id
                      ? 'border-forest bg-forest text-sand-50'
                      : 'border-charcoal/12 bg-transparent text-charcoal/70 hover:border-forest/30',
                  )}
                >
                  {regionLabel(id)}
                </button>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/55">
        <button
          type="button"
          aria-pressed={popularActive}
          onClick={() =>
            onChange({
              ...value,
              isPopular: popularActive ? 'all' : 'true',
            })
          }
          className={cn(
            'rounded-full border px-4 py-2 transition',
            popularActive
              ? 'border-sunset-deep text-sunset-deep'
              : 'border-charcoal/10 hover:border-charcoal/25',
          )}
        >
          {popularActive
            ? t('province.atlas.popular_unlocked', 'Popular focus on')
            : t('province.atlas.popular_focus', 'Popular focus')}
        </button>
        <span className="hidden h-5 w-px bg-charcoal/15 sm:block" aria-hidden />
        <div className="flex flex-wrap gap-3">
          <span className="self-center text-charcoal/40">
            {t('province.sort', 'Sort')}
          </span>
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={value.sortBy === opt.id}
              onClick={() => onChange({ ...value, sortBy: opt.id })}
              className={cn(
                'rounded-full px-3 py-1.5 tracking-[0.16em] transition',
                value.sortBy === opt.id
                  ? 'bg-charcoal text-sand-50'
                  : 'hover:text-forest',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {hasActive ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-8 shrink-0 gap-1 text-sunset-deep hover:text-sunset-deep/90"
            onClick={onReset}
          >
            <X className="size-3.5" />
            {t('province.reset_filter', 'Reset')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

