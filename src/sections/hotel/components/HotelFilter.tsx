import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown, SlidersHorizontal, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Province } from '@/features/provinces/types';
import type { HotelListQuery } from '@/sections/hotel/hotel-list-query';

const chipBtn =
  'inline-flex h-9 min-w-0 max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(28,26,20,0.1)] bg-white px-3.5 text-left text-sm font-medium text-[#1c1a14] shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ' +
  'hover:border-[rgba(28,26,20,0.2)] hover:bg-stone-50 hover:shadow ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/30 ' +
  'data-[state=open]:border-[rgba(28,26,20,0.2)] data-[state=open]:bg-stone-50 data-[state=open]:shadow';

const chipActive =
  'border-[#c9922a]/50 bg-[#f5e9d0]/60 text-[#1e4d38]';

type HotelFilterProps = {
  value: HotelListQuery;
  onChange: (next: HotelListQuery) => void;
  onReset: () => void;
};

const HotelFilter: React.FC<HotelFilterProps> = ({
  value: values,
  onChange: apply,
  onReset: handleParentReset,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provincesList } = useProvincesQuery();
  const [openSort, setOpenSort] = useState(false);

  const getProvinceLabel = useCallback(
    (p: Province) =>
      p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug,
    [language],
  );

  const hasActive = useMemo(() => {
    return (
      values.minStars > 0 ||
      values.sortBy !== 'newest' ||
      values.provinceId !== '' ||
      values.search !== ''
    );
  }, [values]);

  const provinceButtonLabel = useMemo(() => {
    if (!values.provinceId) {
      return t('hotel.filter.all_provinces', 'All provinces');
    }
    const p = provincesList?.find((x) => x._id === values.provinceId);
    return p ? getProvinceLabel(p) : t('hotel.filter.province', 'Province');
  }, [values.provinceId, provincesList, t, getProvinceLabel]);

  const sortLabel = useMemo(() => {
    if (values.sortBy === 'name') {
      return t('hotel.sort.name', 'Name (A–Z)');
    }
    if (values.sortBy === 'rating') {
      return t('hotel.sort.rating', 'Star rating');
    }
    return t('hotel.sort.newest', 'Newest');
  }, [values.sortBy, t]);

  const clearAll = () => {
    handleParentReset();
  };

  return (
    <div
      className="sticky top-[136px] z-30 w-full overflow-hidden rounded-t-2xl border border-[rgba(28,26,20,0.07)] border-b-[rgba(28,26,20,0.08)] border-t-white/55 bg-white/95 shadow-[0_-6px_32px_rgba(0,0,0,0.06),0_12px_40px_rgba(28,26,20,0.07)] backdrop-blur-md sm:rounded-t-3xl"
      data-hotel-filters
    >
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-2 sm:mb-0 sm:hidden">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1c1a14]">
            <SlidersHorizontal className="size-4 text-[#2d6a4f]" aria-hidden />
            {t('hotel.filter.title', 'Refine results')}
          </div>
          {hasActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 cursor-pointer text-xs text-[#c8102e]"
              onClick={clearAll}
            >
              {t('hotel.filter.clear', 'Reset')}
            </Button>
          )}
        </div>

        <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:thin] sm:flex-wrap sm:overflow-x-visible sm:pb-0 sm:pt-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  chipBtn,
                  values.provinceId !== '' && chipActive,
                )}
              >
                {provinceButtonLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <p className="px-1 pb-1 text-xs font-medium text-[rgba(28,26,20,0.5)]">
                {t('hotel.filter.province', 'Province')}
              </p>
              <div className="max-h-64 space-y-0.5 overflow-y-auto">
                <button
                  type="button"
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm transition-colors',
                    !values.provinceId
                      ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                      : 'hover:bg-stone-50',
                  )}
                  onClick={() => apply({ ...values, provinceId: '' })}
                >
                  {t('common.all', 'All')}
                </button>
                {(provincesList ?? []).map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    className={cn(
                      'w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm transition-colors',
                      values.provinceId === p._id
                        ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                        : 'hover:bg-stone-50',
                    )}
                    onClick={() => apply({ ...values, provinceId: p._id })}
                  >
                    {getProvinceLabel(p)}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="hidden h-6 w-px shrink-0 bg-[rgba(28,26,20,0.1)] sm:block" />

          {([0, 3, 4, 5] as const).map((n) => {
            const label =
              n === 0
                ? t('hotel.filter.stars_any', 'Any stars')
                : t('hotel.filter.stars_n_plus', { n, defaultValue: `${n}+ stars` });
            return (
              <button
                key={n}
                type="button"
                className={cn(
                  'inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-[border-color,background-color] duration-200',
                  values.minStars === n
                    ? 'cursor-pointer border-[#c9922a]/50 bg-[#f5e9d0] text-[#1e4d38] shadow-sm'
                    : 'cursor-pointer border-[rgba(28,26,20,0.1)] bg-white text-[#1c1a14] shadow-sm hover:border-[rgba(28,26,20,0.2)]',
                )}
                onClick={() => apply({ ...values, minStars: n })}
              >
                {n > 0 && (
                  <Star
                    className="size-3.5 fill-[#c9922a] text-[#c9922a]"
                    aria-hidden
                  />
                )}
                {label}
              </button>
            );
          })}

          <div className="hidden h-6 w-px shrink-0 bg-[rgba(28,26,20,0.1)] sm:block" />

          <Popover open={openSort} onOpenChange={setOpenSort}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(chipBtn, 'max-sm:min-w-[120px]')}
              >
                {sortLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-1" align="end">
              {(
                [
                  { id: 'newest' as const, label: t('hotel.sort.newest', 'Newest') },
                  { id: 'name' as const, label: t('hotel.sort.name', 'Name (A–Z)') },
                  { id: 'rating' as const, label: t('hotel.sort.rating', 'Star rating') },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={cn(
                    'w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm',
                    values.sortBy === opt.id
                      ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                      : 'hover:bg-stone-50',
                  )}
                  onClick={() => {
                    apply({ ...values, sortBy: opt.id });
                    setOpenSort(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {hasActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto hidden h-8 shrink-0 cursor-pointer gap-1 text-[#c8102e] sm:inline-flex"
              onClick={clearAll}
            >
              <X className="size-3.5" />
              {t('hotel.filter.clear', 'Reset')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelFilter;
