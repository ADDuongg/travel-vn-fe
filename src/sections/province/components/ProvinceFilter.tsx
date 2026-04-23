import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProvinceListQuery, ProvinceRegion } from '@/sections/province/province-list-query';

const chipBtn =
  'inline-flex h-9 min-w-0 max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(28,26,20,0.1)] bg-white px-3.5 text-left text-sm font-medium text-[#1c1a14] shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ' +
  'hover:border-[rgba(28,26,20,0.2)] hover:bg-stone-50 hover:shadow ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/30 ' +
  'data-[state=open]:border-[rgba(28,26,20,0.2)] data-[state=open]:bg-stone-50 data-[state=open]:shadow';

const chipActive = 'border-[#c9922a]/50 bg-[#f5e9d0]/60 text-[#1e4d38]';

interface ProvinceFilterProps {
  value: ProvinceListQuery;
  onChange: (next: ProvinceListQuery) => void;
  onReset: () => void;
}

export function ProvinceFilter({ value, onChange, onReset }: ProvinceFilterProps) {
  const { t } = useTranslation();
  const [openSort, setOpenSort] = useState(false);

  const hasActive = useMemo(
    () =>
      value.region !== 'ALL' ||
      value.isPopular !== 'all' ||
      value.sortBy !== 'name' ||
      value.search.trim() !== '',
    [value],
  );

  const sortLabel = useMemo(() => {
    if (value.sortBy === 'displayOrder') {
      return t('province.sort_display_order', 'Display order');
    }
    if (value.sortBy === 'newest') {
      return t('province.sort_newest', 'Newest');
    }
    return t('province.sort_name', 'Name (A-Z)');
  }, [value.sortBy, t]);

  const regionOptions: Array<{ id: ProvinceRegion; label: string }> = [
    { id: 'ALL', label: t('common.all', 'All') },
    { id: 'NORTH', label: t('province.region_north', 'North') },
    { id: 'CENTRAL', label: t('province.region_central', 'Central') },
    { id: 'SOUTH', label: t('province.region_south', 'South') },
  ];

  return (
    <div className="sticky top-[136px] z-30 w-full overflow-hidden rounded-t-2xl border border-[rgba(28,26,20,0.07)] border-b-[rgba(28,26,20,0.08)] border-t-white/55 bg-white/95 shadow-[0_-6px_32px_rgba(0,0,0,0.06),0_12px_40px_rgba(28,26,20,0.07)] backdrop-blur-md sm:rounded-t-3xl">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-2 sm:mb-0 sm:hidden">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1c1a14]">
            <SlidersHorizontal className="size-4 text-[#2d6a4f]" aria-hidden />
            {t('province.filter_title', 'Refine provinces')}
          </div>
          {hasActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 cursor-pointer text-xs text-[#c8102e]"
              onClick={onReset}
            >
              {t('province.reset_filter', 'Reset')}
            </Button>
          )}
        </div>

        <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:thin] sm:flex-wrap sm:overflow-x-visible sm:pb-0 sm:pt-0">
          {regionOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-[border-color,background-color] duration-200',
                value.region === option.id
                  ? 'border-[#c9922a]/50 bg-[#f5e9d0] text-[#1e4d38] shadow-sm'
                  : 'border-[rgba(28,26,20,0.1)] bg-white text-[#1c1a14] shadow-sm hover:border-[rgba(28,26,20,0.2)]',
              )}
              onClick={() => onChange({ ...value, region: option.id })}
            >
              {option.label}
            </button>
          ))}

          <div className="hidden h-6 w-px shrink-0 bg-[rgba(28,26,20,0.1)] sm:block" />

          {(['all', 'true', 'false'] as const).map((popularValue) => {
            const label =
              popularValue === 'all'
                ? t('common.all', 'All')
                : popularValue === 'true'
                  ? t('common.yes', 'Popular')
                  : t('common.no', 'Not popular');

            return (
              <button
                key={popularValue}
                type="button"
                className={cn(
                  'inline-flex h-9 shrink-0 items-center rounded-full border px-3 text-sm font-medium transition-[border-color,background-color] duration-200',
                  value.isPopular === popularValue
                    ? 'border-[#c9922a]/50 bg-[#f5e9d0] text-[#1e4d38] shadow-sm'
                    : 'border-[rgba(28,26,20,0.1)] bg-white text-[#1c1a14] shadow-sm hover:border-[rgba(28,26,20,0.2)]',
                )}
                onClick={() => onChange({ ...value, isPopular: popularValue })}
              >
                {label}
              </button>
            );
          })}

          <div className="hidden h-6 w-px shrink-0 bg-[rgba(28,26,20,0.1)] sm:block" />

          <Popover open={openSort} onOpenChange={setOpenSort}>
            <PopoverTrigger asChild>
              <button type="button" className={cn(chipBtn, 'max-sm:min-w-[120px]')}>
                {sortLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="end">
              {(
                [
                  { id: 'name' as const, label: t('province.sort_name', 'Name (A-Z)') },
                  {
                    id: 'displayOrder' as const,
                    label: t('province.sort_display_order', 'Display order'),
                  },
                  { id: 'newest' as const, label: t('province.sort_newest', 'Newest') },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={cn(
                    'w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm',
                    value.sortBy === option.id
                      ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                      : 'hover:bg-stone-50',
                  )}
                  onClick={() => {
                    onChange({ ...value, sortBy: option.id });
                    setOpenSort(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {hasActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto h-8 shrink-0 cursor-pointer gap-1 text-[#c8102e]"
              onClick={onReset}
            >
              <X className="size-3.5" />
              {t('province.reset_filter', 'Reset')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
