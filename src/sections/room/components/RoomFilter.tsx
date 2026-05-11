import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useAmenitiesQuery } from '@/features/amenities/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown, SlidersHorizontal, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoomListQuery } from '@/sections/room/room-list-query';

const chipBtn =
  'inline-flex h-9 min-w-0 max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(28,26,20,0.1)] bg-white px-3.5 text-left text-sm font-medium text-[#1c1a14] shadow-sm transition-[border-color,box-shadow,background-color] duration-200 hover:border-[rgba(28,26,20,0.2)] hover:bg-stone-50 hover:shadow';

const chipActive = 'border-[#c9922a]/50 bg-[#f5e9d0]/60 text-[#1e4d38]';

const SORT_OPTIONS: Array<{
  value: RoomListQuery['sortBy'];
  key: string;
  fallback: string;
}> = [
  { value: 'newest', key: 'room.sort.newest', fallback: 'Newest' },
  { value: 'price_asc', key: 'room.sort.price_asc', fallback: 'Price low to high' },
  { value: 'price_desc', key: 'room.sort.price_desc', fallback: 'Price high to low' },
  { value: 'rating_desc', key: 'room.sort.rating_desc', fallback: 'Top rated' },
];

type RoomFilterProps = {
  value: RoomListQuery;
  onChange: (next: RoomListQuery) => void;
  onReset: () => void;
  /** When true, drops sticky positioning for use inside editorial room list. */
  embedded?: boolean;
};

const RoomFilter = ({
  value,
  onChange,
  onReset,
  embedded = false,
}: RoomFilterProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provinces } = useProvincesQuery();
  const { data: amenities } = useAmenitiesQuery();
  const [openSort, setOpenSort] = useState(false);

  const hasActive = useMemo(
    () =>
      Boolean(
        value.search ||
          value.provinceId ||
          value.minPrice ||
          value.maxPrice ||
          value.minRating > 0 ||
          value.sortBy !== 'newest' ||
          value.adults !== 1 ||
          value.children !== 0 ||
          value.checkIn ||
          value.checkOut ||
          value.amenities.length ||
          value.roomSize.length,
      ),
    [value],
  );

  const provinceLabel = useMemo(() => {
    if (!value.provinceId) return t('room.filter.all_provinces', 'All provinces');
    const province = (provinces ?? []).find((item) => item._id === value.provinceId);
    if (!province) return t('room.filter.province', 'Province');
    return (
      province.name?.[language as 'vi' | 'en'] ??
      province.name?.vi ??
      province.name?.en ??
      province.slug
    );
  }, [language, provinces, t, value.provinceId]);

  const sortLabel = useMemo(() => {
    const selected = SORT_OPTIONS.find((opt) => opt.value === value.sortBy);
    return selected ? t(selected.key, selected.fallback) : t('room.sort.newest', 'Newest');
  }, [t, value.sortBy]);

  return (
    <div
      className={
        embedded
          ? 'relative z-10 w-full overflow-hidden rounded-2xl border border-charcoal/10 bg-sand-50/95 shadow-soft backdrop-blur-md'
          : 'sticky top-[136px] z-30 w-full overflow-hidden rounded-t-2xl border border-[rgba(28,26,20,0.07)] border-b-[rgba(28,26,20,0.08)] border-t-white/55 bg-white/95 shadow-[0_-6px_32px_rgba(0,0,0,0.06),0_12px_40px_rgba(28,26,20,0.07)] backdrop-blur-md sm:rounded-t-3xl'
      }
    >
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-2 sm:mb-0 sm:hidden">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1c1a14]">
            <SlidersHorizontal className="size-4 text-[#2d6a4f]" aria-hidden />
            {t('room.filter.title', 'Refine rooms')}
          </div>
          {hasActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 cursor-pointer text-xs text-[#c8102e]"
              onClick={onReset}
            >
              {t('room.filter.clear', 'Reset')}
            </Button>
          )}
        </div>

        <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 pt-0.5 sm:flex-wrap sm:overflow-x-visible sm:pb-0 sm:pt-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(chipBtn, value.provinceId && chipActive)}
              >
                {provinceLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="max-h-64 space-y-0.5 overflow-y-auto">
                <button
                  type="button"
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm',
                    !value.provinceId
                      ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                      : 'hover:bg-stone-50',
                  )}
                  onClick={() => onChange({ ...value, provinceId: '' })}
                >
                  {t('common.all', 'All')}
                </button>
                {(provinces ?? []).map((province) => (
                  <button
                    key={province._id}
                    type="button"
                    className={cn(
                      'w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm',
                      value.provinceId === province._id
                        ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                        : 'hover:bg-stone-50',
                    )}
                    onClick={() => onChange({ ...value, provinceId: province._id })}
                  >
                    {province.name?.[language as 'vi' | 'en'] ??
                      province.name?.vi ??
                      province.name?.en ??
                      province.slug}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  chipBtn,
                  (value.minPrice || value.maxPrice) && chipActive,
                )}
              >
                {t('room.filter.price', 'Price')}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 space-y-3 p-3" align="start">
              <Input
                value={value.minPrice}
                onChange={(event) =>
                  onChange({ ...value, minPrice: event.target.value })
                }
                placeholder={t('room.filter.min_price', 'Min price')}
              />
              <Input
                value={value.maxPrice}
                onChange={(event) =>
                  onChange({ ...value, maxPrice: event.target.value })
                }
                placeholder={t('room.filter.max_price', 'Max price')}
              />
            </PopoverContent>
          </Popover>

          {([0, 3, 4, 5] as const).map((rating) => (
            <button
              key={rating}
              type="button"
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-3 text-sm font-medium',
                value.minRating === rating
                  ? 'cursor-pointer border-[#c9922a]/50 bg-[#f5e9d0] text-[#1e4d38]'
                  : 'cursor-pointer border-[rgba(28,26,20,0.1)] bg-white text-[#1c1a14]',
              )}
              onClick={() => onChange({ ...value, minRating: rating })}
            >
              {rating > 0 && (
                <Star className="size-3.5 fill-[#c9922a] text-[#c9922a]" aria-hidden />
              )}
              {rating > 0
                ? t('room.filter.stars_n_plus', {
                    n: rating,
                    defaultValue: `${rating}+ stars`,
                  })
                : t('room.filter.stars_any', 'Any stars')}
            </button>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  chipBtn,
                  (value.checkIn || value.checkOut || value.adults !== 1 || value.children !== 0) &&
                    chipActive,
                )}
              >
                {t('room.filter.guests_dates', 'Guests & dates')}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-3 p-3" align="start">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={value.checkIn}
                  onChange={(event) =>
                    onChange({ ...value, checkIn: event.target.value })
                  }
                />
                <Input
                  type="date"
                  value={value.checkOut}
                  onChange={(event) =>
                    onChange({ ...value, checkOut: event.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min={1}
                  value={String(value.adults)}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      adults: Math.max(1, Number(event.target.value || 1)),
                    })
                  }
                  placeholder={t('input.field_label.adults', 'Adults')}
                />
                <Input
                  type="number"
                  min={0}
                  value={String(value.children)}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      children: Math.max(0, Number(event.target.value || 0)),
                    })
                  }
                  placeholder={t('input.field_label.children', 'Children')}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={openSort} onOpenChange={setOpenSort}>
            <PopoverTrigger asChild>
              <button type="button" className={chipBtn}>
                {sortLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-1" align="end">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm',
                    value.sortBy === option.value
                      ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                      : 'hover:bg-stone-50',
                  )}
                  onClick={() => {
                    onChange({ ...value, sortBy: option.value });
                    setOpenSort(false);
                  }}
                >
                  {t(option.key, option.fallback)}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  chipBtn,
                  (value.amenities.length || value.roomSize.length) && chipActive,
                )}
              >
                {t('room.filter.more', 'Amenities & size')}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-3 p-3" align="end">
              <p className="text-xs font-medium text-[rgba(28,26,20,0.6)]">
                {t('room.filter.room_size', 'Room size (m2)')}
              </p>
              <div className="flex flex-wrap gap-2">
                {[20, 25, 30, 35, 40, 45].map((size) => {
                  const active = value.roomSize.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs',
                        active
                          ? 'border-[#c9922a]/50 bg-[#f5e9d0] text-[#1e4d38]'
                          : 'border-[rgba(28,26,20,0.1)]',
                      )}
                      onClick={() =>
                        onChange({
                          ...value,
                          roomSize: active
                            ? value.roomSize.filter((s) => s !== size)
                            : [...value.roomSize, size],
                        })
                      }
                    >
                      {size} m2
                    </button>
                  );
                })}
              </div>
              <p className="pt-2 text-xs font-medium text-[rgba(28,26,20,0.6)]">
                {t('input.field_label.amenities', 'Amenities')}
              </p>
              <div className="max-h-40 space-y-1 overflow-y-auto">
                {(amenities ?? []).map((amenity) => {
                  const key = amenity.code || amenity._id;
                  const active = value.amenities.includes(key);
                  const label =
                    amenity.translations?.[language]?.name ||
                    amenity.translations?.vi?.name ||
                    amenity.translations?.en?.name ||
                    key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={cn(
                        'w-full rounded-md px-2 py-1.5 text-left text-sm',
                        active
                          ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                          : 'hover:bg-stone-50',
                      )}
                      onClick={() =>
                        onChange({
                          ...value,
                          amenities: active
                            ? value.amenities.filter((item) => item !== key)
                            : [...value.amenities, key],
                        })
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {hasActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto hidden h-8 shrink-0 cursor-pointer gap-1 text-[#c8102e] sm:inline-flex"
              onClick={onReset}
            >
              <X className="size-3.5" />
              {t('room.filter.clear', 'Reset')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;
