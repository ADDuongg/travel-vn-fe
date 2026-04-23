import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const ALL_VALUE = '__all__';

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

interface TourFilterProps {
  onFilter?: (values: TourQueryParams) => void;
  onClear?: () => void;
  syncedSearch?: string;
  syncedDestinationId?: string;
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
  syncedSearch,
  syncedDestinationId,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provincesList } = useProvincesQuery();

  const [openPill, setOpenPill] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const methods = useForm<TourFilterValues>({
    defaultValues: { ...defaultForm },
  });
  const { setValue, getValues, reset, control } = methods;
  const watched = useWatch({ control });
  const w = (watched ?? defaultForm) as TourFilterValues;

  useEffect(() => {
    setValue('search', syncedSearch != null && syncedSearch !== '' ? syncedSearch : '', {
      shouldDirty: false,
    });
  }, [syncedSearch, setValue]);

  useEffect(() => {
    if (syncedDestinationId) {
      setValue('destinationId', syncedDestinationId, { shouldDirty: false });
    } else {
      setValue('destinationId', ALL_VALUE, { shouldDirty: false });
    }
  }, [syncedDestinationId, setValue]);

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

  return (
    <FormProvider {...methods}>
      <div
        className="sticky top-[136px] z-30 w-full overflow-hidden rounded-t-2xl border border-[rgba(28,26,20,0.07)] border-b-[rgba(28,26,20,0.08)] border-t-white/55 bg-white/95 shadow-[0_-6px_32px_rgba(0,0,0,0.06),0_12px_40px_rgba(28,26,20,0.07)] backdrop-blur-md sm:rounded-t-3xl"
        data-tour-filters
      >
        <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3">
          <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:thin]">
            <Popover
              open={openPill === 'dest'}
              onOpenChange={popoverOnChange('dest')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    chipBtn,
                    w.destinationId !== ALL_VALUE && chipBtnActive,
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

            <Popover
              open={openPill === 'type'}
              onOpenChange={popoverOnChange('type')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    chipBtn,
                    w.tourType !== ALL_VALUE && chipBtnActive,
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

            <Popover
              open={openPill === 'diff'}
              onOpenChange={popoverOnChange('diff')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    chipBtn,
                    w.difficulty !== ALL_VALUE && chipBtnActive,
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

            <Popover
              open={openPill === 'dur'}
              onOpenChange={popoverOnChange('dur')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    chipBtn,
                    (w.minDays || w.maxDays) && chipBtnActive,
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
                    chipBtn,
                    ((w.minPrice && Number(w.minPrice) > 0) ||
                      (w.maxPrice && Number(w.maxPrice) > 0)) &&
                      chipBtnActive,
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

            <Popover
              open={openPill === 'sort'}
              onOpenChange={popoverOnChange('sort')}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    chipBtn,
                    w.sortBy !== 'newest' && chipBtnActive,
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

            <Popover open={moreOpen} onOpenChange={setMoreOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(chipBtn, moreActive && chipBtnActive)}
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

            {hasActive && (
              <Button
                type="button"
                variant="ghost"
                className="h-9 shrink-0 cursor-pointer rounded-full px-2.5 text-sm text-[#c8102e] hover:bg-rose-50/80"
                onClick={handleClear}
              >
                {t('tour.filter.clear_all', 'Clear all')}
              </Button>
            )}
          </div>

          {activeChips.length > 0 && (
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
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default TourFilter;
