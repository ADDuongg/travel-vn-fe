import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type {
  TourQueryParams,
  TourType,
  Difficulty,
  TourSortBy,
} from '@/features/tours/types';
import type { Province } from '@/features/provinces/types';
import { Settings2, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RevealItem, Stagger } from '@/components/home-editorial/Reveal';

const ALL_VALUE = '__all__';
const SEARCH_DEBOUNCE_MS = 350;

const atlasPillBase =
  'rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition';
const atlasPillOn = 'border-forest bg-forest text-sand-50';
const atlasPillOff =
  'border-charcoal/12 bg-transparent text-charcoal/70 hover:border-forest/30';

export type TourFilterValues = {
  destinationId: string;
  departureProvinceId: string;
  tourType: string;
  difficulty: string;
  sortBy: string;
  minPrice: string;
  maxPrice: string;
  minDays: string;
  maxDays: string;
  search: string;
};

const TOUR_TYPES: { value: TourType | ''; labelKey: string }[] = [
  { value: '', labelKey: 'tour.filter.all_types' },
  { value: 'DOMESTIC', labelKey: 'tour.filter.domestic' },
  { value: 'INTERNATIONAL', labelKey: 'tour.filter.international' },
  { value: 'DAILY', labelKey: 'tour.filter.daily' },
];

const DIFFICULTIES: { value: Difficulty | ''; labelKey: string }[] = [
  { value: '', labelKey: 'tour.filter.any_difficulty' },
  { value: 'EASY', labelKey: 'tour.filter.easy' },
  { value: 'MODERATE', labelKey: 'tour.filter.moderate' },
  { value: 'CHALLENGING', labelKey: 'tour.filter.challenging' },
  { value: 'DIFFICULT', labelKey: 'tour.filter.difficult' },
];

const SORT_OPTIONS: { value: TourSortBy; labelKey: string }[] = [
  { value: 'newest', labelKey: 'tour.sort.newest' },
  { value: 'price_asc', labelKey: 'tour.sort.price_asc' },
  { value: 'price_desc', labelKey: 'tour.sort.price_desc' },
  { value: 'duration_asc', labelKey: 'tour.sort.duration_asc' },
  { value: 'duration_desc', labelKey: 'tour.sort.duration_desc' },
  { value: 'rating', labelKey: 'tour.sort.rating' },
];

const DURATION_PRESETS: {
  id: string;
  minDays: string;
  maxDays: string;
  labelKey: string;
}[] = [
  { id: 'any', minDays: '', maxDays: '', labelKey: 'tour.filter.duration_any' },
  { id: '1-3', minDays: '1', maxDays: '3', labelKey: 'tour.filter.duration_1_3' },
  { id: '4-7', minDays: '4', maxDays: '7', labelKey: 'tour.filter.duration_4_7' },
  {
    id: '8+',
    minDays: '8',
    maxDays: '',
    labelKey: 'tour.filter.duration_8_plus',
  },
];

function buildQueryParams(values: TourFilterValues): TourQueryParams {
  const params: TourQueryParams = {
    page: 1,
    limit: 12,
    sortBy: (values.sortBy as TourSortBy) || 'newest',
  };
  if (values.destinationId && values.destinationId !== ALL_VALUE) {
    params.destinationId = values.destinationId;
  }
  if (
    values.departureProvinceId &&
    values.departureProvinceId !== ALL_VALUE
  ) {
    params.departureProvinceId = values.departureProvinceId;
  }
  if (values.tourType && values.tourType !== ALL_VALUE) {
    params.tourType = values.tourType as TourType;
  }
  if (values.difficulty && values.difficulty !== ALL_VALUE) {
    params.difficulty = values.difficulty as Difficulty;
  }
  const minPrice = Number(values.minPrice);
  if (!Number.isNaN(minPrice) && minPrice > 0) params.minPrice = minPrice;
  const maxPrice = Number(values.maxPrice);
  if (!Number.isNaN(maxPrice) && maxPrice > 0) params.maxPrice = maxPrice;
  const minDays = Number(values.minDays);
  if (!Number.isNaN(minDays) && minDays > 0) params.minDays = minDays;
  const maxDays = Number(values.maxDays);
  if (!Number.isNaN(maxDays) && maxDays > 0) params.maxDays = maxDays;
  if (values.search?.trim()) {
    params.search = values.search.trim();
  }
  return params;
}

/** Hydrate tour filter form from URL / parent query (Tour list editorial sync). */
export function tourQueryParamsToFilterValues(
  q: TourQueryParams,
): TourFilterValues {
  return {
    destinationId: q.destinationId ?? ALL_VALUE,
    departureProvinceId: q.departureProvinceId ?? ALL_VALUE,
    tourType: q.tourType ?? ALL_VALUE,
    difficulty: q.difficulty ?? ALL_VALUE,
    sortBy: q.sortBy ?? 'newest',
    minPrice:
      q.minPrice != null && q.minPrice > 0 ? String(q.minPrice) : '',
    maxPrice:
      q.maxPrice != null && q.maxPrice > 0 ? String(q.maxPrice) : '',
    minDays: q.minDays != null && q.minDays > 0 ? String(q.minDays) : '',
    maxDays: q.maxDays != null && q.maxDays > 0 ? String(q.maxDays) : '',
    search: q.search ?? '',
  };
}

const defaultForm: TourFilterValues = {
  destinationId: ALL_VALUE,
  departureProvinceId: ALL_VALUE,
  tourType: ALL_VALUE,
  difficulty: ALL_VALUE,
  sortBy: 'newest',
  minPrice: '',
  maxPrice: '',
  minDays: '',
  maxDays: '',
  search: '',
};

const chipBtn =
  'inline-flex h-9 min-w-0 max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(28,26,20,0.1)] bg-white px-3.5 text-left text-sm font-medium text-[#1c1a14] shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ' +
  'hover:border-[rgba(28,26,20,0.2)] hover:bg-stone-50 hover:shadow ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/30 ' +
  'active:bg-stone-50/90 data-[state=open]:border-[rgba(28,26,20,0.2)] data-[state=open]:bg-stone-50 data-[state=open]:shadow';

const chipBtnActive = 'border-[#1c1a14]/30 bg-stone-50/90';

const chipBtnAtlas =
  'inline-flex h-9 min-w-0 max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-charcoal/12 bg-sand-50/90 px-3.5 text-left text-sm font-medium text-charcoal shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ' +
  'hover:border-forest/30 hover:bg-sand-100 hover:shadow ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest/25 ' +
  'active:bg-sand-100/90 data-[state=open]:border-forest/30 data-[state=open]:bg-sand-100';

const chipBtnAtlasActive =
  'border-forest/40 bg-sand-100 text-charcoal shadow-[0_1px_8px_-2px_oklch(22%_0.02_75/0.12)]';

interface TourFilterProps {
  onFilter?: (values: TourQueryParams) => void;
  onClear?: () => void;
  /** When URL query string changes, form resets from this snapshot (share link / history). */
  syncedTourQuery?: TourQueryParams;
  urlSignature?: string;
  variant?: 'default' | 'atlas';
}

function matchesPreset(minDays: string, maxDays: string): string | null {
  if (!minDays && !maxDays) return 'any';
  for (const p of DURATION_PRESETS) {
    if (p.id === 'any' || p.id === '8+') continue;
    if (p.minDays === minDays && p.maxDays === maxDays) return p.id;
  }
  if (minDays === '8' && !maxDays) return '8+';
  return null;
}

function formatVnd(n: string) {
  const num = Number(n);
  if (Number.isNaN(num) || num <= 0) return n;
  try {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(
      num,
    );
  } catch {
    return n;
  }
}

const TourFilter: React.FC<TourFilterProps> = ({
  onFilter,
  onClear,
  syncedTourQuery,
  urlSignature,
  variant = 'default',
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provincesList } = useProvincesQuery();

  const [openPill, setOpenPill] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [atlasDraftSearch, setAtlasDraftSearch] = useState('');
  const atlasSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const methods = useForm<TourFilterValues>({
    defaultValues: { ...defaultForm },
  });
  const { setValue, getValues, reset, control } = methods;
  const watched = useWatch({ control });
  const w = (watched ?? defaultForm) as TourFilterValues;

  const syncedTourQueryRef = useRef(syncedTourQuery);
  syncedTourQueryRef.current = syncedTourQuery;

  useEffect(() => {
    if (urlSignature === undefined) return;
    const q = syncedTourQueryRef.current;
    if (q == null) return;
    reset(tourQueryParamsToFilterValues(q), { keepDirty: false });
  }, [reset, urlSignature]);

  useEffect(() => {
    setAtlasDraftSearch(w.search ?? '');
    if (atlasSearchTimerRef.current) {
      clearTimeout(atlasSearchTimerRef.current);
      atlasSearchTimerRef.current = null;
    }
  }, [w.search]);

  const chipPreset = variant === 'atlas';
  const pillClassBtn = chipPreset ? chipBtnAtlas : chipBtn;
  const pillClassActive = chipPreset ? chipBtnAtlasActive : chipBtnActive;

  const getProvinceLabel = useCallback(
    (p: Province) =>
      p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug,
    [language],
  );

  const apply = useCallback(
    (values: TourFilterValues) => {
      onFilter?.(buildQueryParams(values));
    },
    [onFilter],
  );

  const applyPartial = (patch: Partial<TourFilterValues>) => {
    const v = { ...getValues(), ...patch };
    apply(v);
  };

  useEffect(() => {
    if (variant !== 'atlas') return;
    if (atlasSearchTimerRef.current) {
      clearTimeout(atlasSearchTimerRef.current);
    }
    atlasSearchTimerRef.current = setTimeout(() => {
      atlasSearchTimerRef.current = null;
      const applied = (getValues().search ?? '').trim();
      const next = atlasDraftSearch.trim();
      if (next !== applied) {
        const merged: TourFilterValues = {
          ...getValues(),
          search: atlasDraftSearch,
        };
        setValue('search', atlasDraftSearch, { shouldDirty: true });
        apply(merged);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (atlasSearchTimerRef.current) {
        clearTimeout(atlasSearchTimerRef.current);
        atlasSearchTimerRef.current = null;
      }
    };
  }, [apply, atlasDraftSearch, getValues, setValue, variant]);

  const handleClear = () => {
    reset({ ...defaultForm });
    onClear?.();
  };

  const hasActive = useMemo(() => {
    return (
      (w.search?.trim() ?? '') !== '' ||
      w.destinationId !== ALL_VALUE ||
      w.departureProvinceId !== ALL_VALUE ||
      w.tourType !== ALL_VALUE ||
      w.difficulty !== ALL_VALUE ||
      w.sortBy !== 'newest' ||
      (w.minPrice && Number(w.minPrice) > 0) ||
      (w.maxPrice && Number(w.maxPrice) > 0) ||
      (w.minDays && Number(w.minDays) > 0) ||
      (w.maxDays && Number(w.maxDays) > 0)
    );
  }, [w]);

  const activeChips = useMemo(() => {
    const chips: { key: keyof TourFilterValues; label: string }[] = [];
    if (w.search?.trim()) {
      chips.push({
        key: 'search',
        label: `${t('tour.filter.search')}: “${w.search.trim()}”`,
      });
    }
    if (w.destinationId && w.destinationId !== ALL_VALUE) {
      const p = provincesList?.find((x) => x._id === w.destinationId);
      chips.push({
        key: 'destinationId',
        label: p ? getProvinceLabel(p) : t('tour.filter.destination'),
      });
    }
    if (w.departureProvinceId && w.departureProvinceId !== ALL_VALUE) {
      const p = provincesList?.find((x) => x._id === w.departureProvinceId);
      chips.push({
        key: 'departureProvinceId',
        label: `${t('tour.filter.departure')}: ${p ? getProvinceLabel(p) : ''}`,
      });
    }
    if (w.tourType && w.tourType !== ALL_VALUE) {
      const opt = TOUR_TYPES.find((o) => o.value === w.tourType);
      chips.push({
        key: 'tourType',
        label: opt ? t(opt.labelKey) : w.tourType,
      });
    }
    if (w.difficulty && w.difficulty !== ALL_VALUE) {
      const opt = DIFFICULTIES.find((o) => o.value === w.difficulty);
      chips.push({
        key: 'difficulty',
        label: opt ? t(opt.labelKey) : w.difficulty,
      });
    }
    if (w.sortBy && w.sortBy !== 'newest') {
      const opt = SORT_OPTIONS.find((o) => o.value === w.sortBy);
      chips.push({
        key: 'sortBy',
        label: opt ? t(opt.labelKey) : w.sortBy,
      });
    }
    if (w.minPrice && Number(w.minPrice) > 0) {
      chips.push({
        key: 'minPrice',
        label: `${t('tour.filter.min_price')}: ${w.minPrice}`,
      });
    }
    if (w.maxPrice && Number(w.maxPrice) > 0) {
      chips.push({
        key: 'maxPrice',
        label: `${t('tour.filter.max_price')}: ${w.maxPrice}`,
      });
    }
    if (w.minDays && Number(w.minDays) > 0) {
      chips.push({
        key: 'minDays',
        label: `${t('tour.filter.min_days')}: ${w.minDays}`,
      });
    }
    if (w.maxDays && Number(w.maxDays) > 0) {
      chips.push({
        key: 'maxDays',
        label: `${t('tour.filter.max_days')}: ${w.maxDays}`,
      });
    }
    return chips;
  }, [w, provincesList, t, getProvinceLabel]);

  const removeChip = (key: keyof TourFilterValues) => {
    const v: TourFilterValues = { ...getValues() };
    if (key === 'sortBy') v.sortBy = 'newest';
    else if (
      key === 'destinationId' ||
      key === 'departureProvinceId' ||
      key === 'tourType' ||
      key === 'difficulty'
    ) {
      (v as Record<string, string>)[key] = ALL_VALUE;
    } else {
      (v as Record<string, string>)[key] = '';
    }
    reset(v);
    apply(v);
  };

  const popoverOnChange = (id: string) => (o: boolean) => {
    setOpenPill(o ? id : null);
  };

  const destinationButtonLabel = useMemo(() => {
    if (w.destinationId === ALL_VALUE) {
      return t('tour.filter.all_destinations');
    }
    const p = provincesList?.find((x) => x._id === w.destinationId);
    return p ? getProvinceLabel(p) : t('tour.filter.destination');
  }, [w.destinationId, provincesList, t, getProvinceLabel]);

  const tourTypeButtonLabel = useMemo(() => {
    if (w.tourType === ALL_VALUE) return t('tour.filter.chips.tour_type');
    const opt = TOUR_TYPES.find((o) => o.value === w.tourType);
    return opt ? t(opt.labelKey) : t('tour.filter.chips.tour_type');
  }, [w.tourType, t]);

  const difficultyButtonLabel = useMemo(() => {
    if (w.difficulty === ALL_VALUE) return t('tour.filter.chips.difficulty');
    const opt = DIFFICULTIES.find((o) => o.value === w.difficulty);
    return opt ? t(opt.labelKey) : t('tour.filter.chips.difficulty');
  }, [w.difficulty, t]);

  const durationButtonLabel = useMemo(() => {
    const m = w.minDays;
    const x = w.maxDays;
    if (!m && !x) return t('tour.filter.chips.duration');
    const preset = matchesPreset(m, x);
    if (preset && preset !== 'any') {
      const p = DURATION_PRESETS.find((d) => d.id === preset);
      return p ? t(p.labelKey) : t('tour.filter.chips.duration');
    }
    const parts: string[] = [];
    if (m) parts.push(m);
    if (x) parts.push(x);
    return parts.length
      ? `${t('tour.filter.chips.duration')}: ${parts.join('–')}`
      : t('tour.filter.chips.duration');
  }, [w.minDays, w.maxDays, t]);

  const priceButtonLabel = useMemo(() => {
    const hasMin = w.minPrice && Number(w.minPrice) > 0;
    const hasMax = w.maxPrice && Number(w.maxPrice) > 0;
    if (!hasMin && !hasMax) return t('tour.filter.chips.price');
    if (hasMin && hasMax) {
      return `₫ ${formatVnd(w.minPrice)} – ${formatVnd(w.maxPrice)}`;
    }
    if (hasMin) return `₫ ${formatVnd(w.minPrice)}+`;
    return `≤ ₫ ${formatVnd(w.maxPrice ?? '')}`;
  }, [w.minPrice, w.maxPrice, t]);

  const sortButtonLabel = useMemo(() => {
    const opt = SORT_OPTIONS.find((o) => o.value === w.sortBy);
    return opt ? t(opt.labelKey) : t('tour.sort.newest');
  }, [w.sortBy, t]);

  const moreActive =
    w.departureProvinceId !== ALL_VALUE;

  const atlasPopoverTrigger = (active: boolean) =>
    cn(
      atlasPillBase,
      'inline-flex max-w-[12rem] items-center justify-between gap-1 normal-case',
      active ? atlasPillOn : atlasPillOff,
    );

  return (
    <FormProvider {...methods}>
      <div
        className={cn(
          variant === 'atlas'
            ? 'sticky top-24 z-30 border-b border-charcoal/10 bg-sand-50/80 px-4 py-4 shadow-[0_12px_40px_-24px_oklch(22%_0.02_75/0.25)] backdrop-blur-md md:top-23 md:px-10'
            : 'sticky top-[136px] z-30 w-full overflow-hidden rounded-t-2xl border border-[rgba(28,26,20,0.07)] border-b-[rgba(28,26,20,0.08)] border-t-white/55 bg-white/95 shadow-[0_-6px_32px_rgba(0,0,0,0.06),0_12px_40px_rgba(28,26,20,0.07)] backdrop-blur-md sm:rounded-t-3xl',
        )}
        data-tour-filters
      >
        <div
          className={cn(
            variant === 'atlas'
              ? 'mx-auto max-w-6xl space-y-4'
              : 'mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3',
          )}
        >
          {variant === 'atlas' ? (
            <>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <label className="relative block min-w-[min(100%,280px)] flex-1">
                  <span className="sr-only">
                    {t('tour.filter.search', 'Search')}
                  </span>
                  <input
                    type="search"
                    value={atlasDraftSearch}
                    onChange={(e) => setAtlasDraftSearch(e.target.value)}
                    placeholder={t(
                      'tour.filter.search_placeholder',
                      'Tour name or code...',
                    )}
                    className="w-full rounded-full border border-charcoal/12 bg-sand-50/90 px-5 py-3 text-sm text-charcoal outline-none ring-forest/25 transition placeholder:text-charcoal/40 focus:border-forest/35 focus:ring-4"
                  />
                </label>
                <Stagger className="flex flex-wrap gap-2 lg:justify-end">
                  {TOUR_TYPES.map((o) => {
                    const val = o.value || ALL_VALUE;
                    const selected = w.tourType === val;
                    return (
                      <RevealItem key={val}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            setValue('tourType', val, { shouldDirty: true });
                            applyPartial({ tourType: val });
                          }}
                          className={cn(
                            atlasPillBase,
                            selected ? atlasPillOn : atlasPillOff,
                          )}
                        >
                          {t(o.labelKey)}
                        </button>
                      </RevealItem>
                    );
                  })}
                </Stagger>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Stagger className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((o) => {
                    const val = o.value || ALL_VALUE;
                    const selected = w.difficulty === val;
                    return (
                      <RevealItem key={val || 'any'}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            setValue('difficulty', val, { shouldDirty: true });
                            applyPartial({ difficulty: val });
                          }}
                          className={cn(
                            atlasPillBase,
                            selected ? atlasPillOn : atlasPillOff,
                          )}
                        >
                          {t(o.labelKey)}
                        </button>
                      </RevealItem>
                    );
                  })}
                </Stagger>
              </div>
            </>
          ) : null}

          <div
            className={cn(
              variant === 'atlas'
                ? 'flex flex-wrap items-center gap-2'
                : 'flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:thin]',
            )}
          >
            <Popover
              open={openPill === 'dest'}
              onOpenChange={popoverOnChange('dest')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    variant === 'atlas'
                      ? atlasPopoverTrigger(w.destinationId !== ALL_VALUE)
                      : cn(
                          pillClassBtn,
                          w.destinationId !== ALL_VALUE && pillClassActive,
                        ),
                  )}
                >
                  <span className="max-w-[10rem] truncate">
                    {destinationButtonLabel}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[min(100vw-2rem,20rem)] border-[rgba(28,26,20,0.1)] p-0 shadow-lg"
                align="start"
              >
                <div className="max-h-64 overflow-y-auto p-1.5" role="listbox">
                  <button
                    type="button"
                    role="option"
                    className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm text-[#1c1a14] transition-colors hover:bg-stone-100"
                    onClick={() => {
                      setValue('destinationId', ALL_VALUE, {
                        shouldDirty: true,
                      });
                      applyPartial({ destinationId: ALL_VALUE });
                      setOpenPill(null);
                    }}
                  >
                    {t('tour.filter.all_destinations')}
                  </button>
                  {(provincesList ?? []).map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      role="option"
                      className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm text-[#1c1a14] transition-colors hover:bg-stone-100"
                      onClick={() => {
                        setValue('destinationId', p._id, { shouldDirty: true });
                        applyPartial({ destinationId: p._id });
                        setOpenPill(null);
                      }}
                    >
                      {getProvinceLabel(p)}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {variant !== 'atlas' ? (
              <Popover
                open={openPill === 'type'}
                onOpenChange={popoverOnChange('type')}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      pillClassBtn,
                      w.tourType !== ALL_VALUE && pillClassActive,
                    )}
                  >
                    <span className="max-w-[9rem] truncate">
                      {tourTypeButtonLabel}
                    </span>
                    <ChevronDown className="size-3.5 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[min(100vw-2rem,18rem)] border-[rgba(28,26,20,0.1)] p-0 shadow-lg"
                  align="start"
                >
                  <div className="p-1.5" role="listbox">
                    {TOUR_TYPES.map((o) => {
                      const val = o.value || ALL_VALUE;
                      return (
                        <button
                          key={val}
                          type="button"
                          role="option"
                          className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm text-[#1c1a14] transition-colors hover:bg-stone-100"
                          onClick={() => {
                            setValue('tourType', val, { shouldDirty: true });
                            applyPartial({ tourType: val });
                            setOpenPill(null);
                          }}
                        >
                          {t(o.labelKey)}
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            ) : null}

            {variant !== 'atlas' ? (
            <Popover
              open={openPill === 'diff'}
              onOpenChange={popoverOnChange('diff')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    pillClassBtn,
                    w.difficulty !== ALL_VALUE && pillClassActive,
                  )}
                >
                  <span className="max-w-[8rem] truncate">
                    {difficultyButtonLabel}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[min(100vw-2rem,18rem)] border-[rgba(28,26,20,0.1)] p-0 shadow-lg"
                align="start"
              >
                <div className="p-1.5" role="listbox">
                  {DIFFICULTIES.map((o) => {
                    const val = o.value || ALL_VALUE;
                    return (
                      <button
                        key={val || 'any'}
                        type="button"
                        role="option"
                        className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm text-[#1c1a14] transition-colors hover:bg-stone-100"
                        onClick={() => {
                          setValue('difficulty', val, { shouldDirty: true });
                          applyPartial({ difficulty: val });
                          setOpenPill(null);
                        }}
                      >
                        {t(o.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            ) : null}

            <Popover
              open={openPill === 'dur'}
              onOpenChange={popoverOnChange('dur')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    variant === 'atlas'
                      ? atlasPopoverTrigger(Boolean(w.minDays || w.maxDays))
                      : cn(
                          pillClassBtn,
                          (w.minDays || w.maxDays) && pillClassActive,
                        ),
                  )}
                >
                  <span className="max-w-[11rem] truncate">
                    {durationButtonLabel}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[min(100vw-2rem,20rem)] border-[rgba(28,26,20,0.1)] p-0 shadow-lg"
                align="start"
              >
                <div className="p-1.5" role="listbox">
                  {DURATION_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm text-[#1c1a14] transition-colors hover:bg-stone-100"
                      onClick={() => {
                        if (p.id === '8+') {
                          setValue('minDays', '8', { shouldDirty: true });
                          setValue('maxDays', '', { shouldDirty: true });
                          applyPartial({ minDays: '8', maxDays: '' });
                        } else {
                          setValue('minDays', p.minDays, { shouldDirty: true });
                          setValue('maxDays', p.maxDays, { shouldDirty: true });
                          applyPartial({ minDays: p.minDays, maxDays: p.maxDays });
                        }
                        setOpenPill(null);
                      }}
                    >
                      {t(p.labelKey)}
                    </button>
                  ))}
                </div>
                <div className="border-t border-[rgba(28,26,20,0.08)] p-3">
                  <p className="mb-2 text-xs font-medium text-[rgba(28,26,20,0.55)]">
                    {t('tour.filter.custom_range')}
                  </p>
                  <div className="flex gap-2">
                    <Input
                      inputMode="numeric"
                      className="h-9 flex-1 rounded-lg border border-[rgba(28,26,20,0.12)] bg-white text-sm"
                      placeholder={t('tour.filter.min_days')}
                      value={w.minDays}
                      onChange={(e) =>
                        setValue('minDays', e.target.value, {
                          shouldDirty: true,
                        })
                      }
                    />
                    <Input
                      inputMode="numeric"
                      className="h-9 flex-1 rounded-lg border border-[rgba(28,26,20,0.12)] bg-white text-sm"
                      placeholder={t('tour.filter.max_days')}
                      value={w.maxDays}
                      onChange={(e) =>
                        setValue('maxDays', e.target.value, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    className="mt-2 h-8 w-full cursor-pointer text-sm"
                    onClick={() => {
                      apply(getValues());
                      setOpenPill(null);
                    }}
                  >
                    {t('tour.filter.apply', 'Apply')}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover
              open={openPill === 'price'}
              onOpenChange={popoverOnChange('price')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    variant === 'atlas'
                      ? atlasPopoverTrigger(
                          Boolean(
                            (w.minPrice && Number(w.minPrice) > 0) ||
                              (w.maxPrice && Number(w.maxPrice) > 0),
                          ),
                        )
                      : cn(
                          pillClassBtn,
                          ((w.minPrice && Number(w.minPrice) > 0) ||
                            (w.maxPrice && Number(w.maxPrice) > 0)) &&
                            pillClassActive,
                        ),
                  )}
                >
                  <span className="max-w-[12rem] truncate">
                    {priceButtonLabel}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[min(100vw-2rem,20rem)] border-[rgba(28,26,20,0.1)] p-0 shadow-lg"
                align="start"
              >
                <div className="p-3">
                  <p className="mb-2 text-xs text-[rgba(28,26,20,0.55)]">
                    {t('tour.filter.price_range_hint')}
                  </p>
                  <div className="flex gap-2">
                    <Input
                      inputMode="numeric"
                      className="h-9 flex-1 rounded-lg border border-[rgba(28,26,20,0.12)] bg-white text-sm"
                      placeholder={t('tour.filter.min_price')}
                      value={w.minPrice}
                      onChange={(e) =>
                        setValue('minPrice', e.target.value, {
                          shouldDirty: true,
                        })
                      }
                    />
                    <Input
                      inputMode="numeric"
                      className="h-9 flex-1 rounded-lg border border-[rgba(28,26,20,0.12)] bg-white text-sm"
                      placeholder={t('tour.filter.max_price')}
                      value={w.maxPrice}
                      onChange={(e) =>
                        setValue('maxPrice', e.target.value, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    className="mt-3 h-8 w-full cursor-pointer text-sm"
                    onClick={() => {
                      apply(getValues());
                      setOpenPill(null);
                    }}
                  >
                    {t('tour.filter.apply', 'Apply')}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {variant !== 'atlas' ? (
              <Popover
                open={openPill === 'sort'}
                onOpenChange={popoverOnChange('sort')}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      pillClassBtn,
                      w.sortBy !== 'newest' && pillClassActive,
                    )}
                  >
                    <span className="max-w-[10rem] truncate">
                      {w.sortBy === 'newest'
                        ? t('tour.filter.chips.sort')
                        : sortButtonLabel}
                    </span>
                    <ChevronDown className="size-3.5 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[min(100vw-2rem,20rem)] border-[rgba(28,26,20,0.1)] p-0 shadow-lg"
                  align="end"
                >
                  <div className="p-1.5" role="listbox">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm text-[#1c1a14] transition-colors hover:bg-stone-100"
                        onClick={() => {
                          setValue('sortBy', o.value, { shouldDirty: true });
                          applyPartial({ sortBy: o.value });
                          setOpenPill(null);
                        }}
                      >
                        {t(o.labelKey)}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            ) : null}

            <Popover open={moreOpen} onOpenChange={setMoreOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    variant === 'atlas'
                      ? atlasPopoverTrigger(moreActive)
                      : cn(pillClassBtn, moreActive && pillClassActive),
                  )}
                >
                  {t('tour.filter.more_filters', 'More filters')}
                  <Settings2 className="size-3.5 shrink-0 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[min(100vw-2rem,22rem)] border-[rgba(28,26,20,0.1)] p-0 shadow-lg"
                align="end"
              >
                <div className="max-h-64 overflow-y-auto p-1.5">
                  <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[rgba(28,26,20,0.5)]">
                    {t('tour.filter.departure')}
                  </p>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm text-[#1c1a14] transition-colors hover:bg-stone-100"
                    onClick={() => {
                      setValue('departureProvinceId', ALL_VALUE, {
                        shouldDirty: true,
                      });
                      applyPartial({ departureProvinceId: ALL_VALUE });
                    }}
                  >
                    {t('common.all')}
                  </button>
                  {(provincesList ?? []).map((p) => (
                    <button
                      key={`dep-${p._id}`}
                      type="button"
                      className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm text-[#1c1a14] transition-colors hover:bg-stone-100"
                      onClick={() => {
                        setValue('departureProvinceId', p._id, {
                          shouldDirty: true,
                        });
                        applyPartial({ departureProvinceId: p._id });
                        setMoreOpen(false);
                      }}
                    >
                      {getProvinceLabel(p)}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {variant !== 'atlas' && hasActive ? (
              <Button
                type="button"
                variant="ghost"
                className="h-9 shrink-0 cursor-pointer rounded-full px-2.5 text-sm text-[#c8102e] hover:bg-rose-50/80"
                onClick={handleClear}
              >
                {t('tour.filter.clear_all', 'Clear all')}
              </Button>
            ) : null}
          </div>

          {variant === 'atlas' ? (
            <div className="flex flex-wrap items-center gap-4 border-t border-charcoal/10 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/55">
              <div className="flex flex-wrap items-center gap-3">
                <span className="self-center text-charcoal/40">
                  {t('province.sort', 'Sort')}
                </span>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={w.sortBy === opt.value}
                    onClick={() => {
                      setValue('sortBy', opt.value, { shouldDirty: true });
                      applyPartial({ sortBy: opt.value });
                    }}
                    className={cn(
                      'rounded-full px-3 py-1.5 tracking-[0.16em] transition',
                      w.sortBy === opt.value
                        ? 'bg-charcoal text-sand-50'
                        : 'hover:text-forest',
                    )}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
              {hasActive ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-8 shrink-0 gap-1 text-sunset-deep hover:text-sunset-deep/90"
                  onClick={handleClear}
                >
                  <X className="size-3.5" />
                  {t('province.reset_filter', 'Reset')}
                </Button>
              ) : null}
            </div>
          ) : null}

          {variant !== 'atlas' && activeChips.length > 0 ? (
            <div className="mt-2 flex max-w-full flex-wrap items-center gap-1.5 border-t border-[rgba(28,26,20,0.06)] pt-2">
              <span className="shrink-0 text-[11px] font-medium text-[rgba(28,26,20,0.45)]">
                {t('tour.filter.active', 'Active')}:
              </span>
              {activeChips.map((c) => (
                <Badge
                  key={String(c.key) + c.label}
                  variant="secondary"
                  className="inline-flex h-auto max-w-full cursor-default items-center gap-1 rounded-full border-0 bg-stone-100/90 py-1 pl-2.5 pr-1 text-[11px] font-medium text-[#1c1a14]"
                >
                  <span className="truncate">{c.label}</span>
                  <button
                    type="button"
                    className="cursor-pointer rounded-full p-0.5 hover:bg-stone-200/80"
                    onClick={() => removeChip(c.key)}
                    aria-label={t('common.remove', 'Remove')}
                  >
                    <X className="size-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </FormProvider>
  );
};

export default TourFilter;
