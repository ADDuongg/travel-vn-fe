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
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Province } from '@/features/provinces/types';
import type { TourGuideListQuery } from '../tour-guide-list-query';

interface TourGuideFilterProps {
  value: TourGuideListQuery;
  onChange: (next: TourGuideListQuery) => void;
  onReset: () => void;
}

const chipBtn =
  'inline-flex h-9 min-w-0 max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(28,26,20,0.1)] bg-white px-3.5 text-left text-sm font-medium text-[#1c1a14] shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ' +
  'hover:border-[rgba(28,26,20,0.2)] hover:bg-stone-50 hover:shadow ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/30 ' +
  'data-[state=open]:border-[rgba(28,26,20,0.2)] data-[state=open]:bg-stone-50 data-[state=open]:shadow';

const chipActive = 'border-[#c9922a]/50 bg-[#f5e9d0]/60 text-[#1e4d38]';

const LANGUAGES: { value: string; label: string }[] = [
  { value: '', label: 'All languages' },
  { value: 'vi', label: 'Tieng Viet' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Francais' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
];

const SORT_OPTIONS: { value: TourGuideListQuery['sortBy']; labelKey: string }[] = [
  { value: 'newest', labelKey: 'tour_guide.sort_newest' },
  { value: 'rating', labelKey: 'tour_guide.sort_rating' },
  { value: 'experience', labelKey: 'tour_guide.sort_experience' },
];

const TourGuideFilter: React.FC<TourGuideFilterProps> = ({
  value,
  onChange,
  onReset,
}) => {
  const { t } = useTranslation();
  const [openSort, setOpenSort] = useState(false);
  const { data: provincesList } = useProvincesQuery();
  const { language } = useLanguage();

  const getProvinceLabel = useCallback(
    (p: Province) =>
      p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug,
    [language],
  );

  const hasActive = useMemo(
    () =>
      value.provinceId !== '' ||
      value.language !== '' ||
      value.isVerified !== 'all' ||
      value.sortBy !== 'newest',
    [value],
  );

  const provinceLabel = useMemo(() => {
    if (!value.provinceId) {
      return t('tour_guide.filter_province', 'All provinces');
    }
    const province = provincesList?.find((p) => p._id === value.provinceId);
    return province ? getProvinceLabel(province) : t('tour_guide.province_specialty');
  }, [value.provinceId, provincesList, getProvinceLabel, t]);

  const languageLabel = useMemo(() => {
    if (!value.language) return t('tour_guide.language', 'Language');
    return LANGUAGES.find((l) => l.value === value.language)?.label ?? value.language;
  }, [value.language, t]);

  const sortLabel = useMemo(() => {
    const opt = SORT_OPTIONS.find((o) => o.value === value.sortBy);
    return opt ? t(opt.labelKey) : t('tour_guide.sort_newest');
  }, [value.sortBy, t]);

  const verificationLabel = useMemo(() => {
    if (value.isVerified === 'true') return t('tour_guide.verified_only', 'Verified only');
    if (value.isVerified === 'false') return t('tour_guide.unverified', 'Unverified');
    return t('tour_guide.all_guides', 'All guides');
  }, [value.isVerified, t]);

  return (
    <div className="sticky top-[136px] z-30 w-full overflow-hidden rounded-t-2xl border border-[rgba(28,26,20,0.07)] border-b-[rgba(28,26,20,0.08)] border-t-white/55 bg-white/95 shadow-[0_-6px_32px_rgba(0,0,0,0.06),0_12px_40px_rgba(28,26,20,0.07)] backdrop-blur-md sm:rounded-t-3xl">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:thin]">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(chipBtn, value.provinceId !== '' && chipActive)}
              >
                {provinceLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="max-h-64 space-y-0.5 overflow-y-auto">
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm hover:bg-stone-50"
                  onClick={() => onChange({ ...value, provinceId: '' })}
                >
                  {t('common.all', 'All')}
                </button>
                {(provincesList ?? []).map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    className={cn(
                      'w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm transition-colors',
                      value.provinceId === p._id
                        ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                        : 'hover:bg-stone-50',
                    )}
                    onClick={() => onChange({ ...value, provinceId: p._id })}
                  >
                    {getProvinceLabel(p)}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(chipBtn, value.language !== '' && chipActive)}
              >
                {languageLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1.5" align="start">
              {LANGUAGES.map((option) => (
                <button
                  key={option.value || 'all'}
                  type="button"
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    value.language === option.value
                      ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                      : 'hover:bg-stone-50',
                  )}
                  onClick={() => onChange({ ...value, language: option.value })}
                >
                  {option.value ? option.label : t('common.all', 'All')}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(chipBtn, value.isVerified !== 'all' && chipActive)}
              >
                <ShieldCheck className="size-4 shrink-0 text-[#2d6a4f]" />
                {verificationLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1.5" align="start">
              {(
                [
                  { id: 'all', label: t('tour_guide.all_guides', 'All guides') },
                  {
                    id: 'true',
                    label: t('tour_guide.verified_only', 'Verified only'),
                  },
                  { id: 'false', label: t('tour_guide.unverified', 'Unverified') },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    value.isVerified === option.id
                      ? 'bg-[#d4eae0] font-medium text-[#1e4d38]'
                      : 'hover:bg-stone-50',
                  )}
                  onClick={() =>
                    onChange({
                      ...value,
                      isVerified: option.id,
                    })
                  }
                >
                  {option.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Popover open={openSort} onOpenChange={setOpenSort}>
            <PopoverTrigger asChild>
              <button type="button" className={cn(chipBtn, 'max-sm:min-w-[120px]')}>
                {sortLabel}
                <ChevronDown className="size-4 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-1" align="end">
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
                  {t(option.labelKey)}
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
              onClick={onReset}
            >
              <X className="size-3.5" />
              {t('tour.filter.clear_all', 'Clear all')}
            </Button>
          )}
        </div>

        {hasActive && (
          <div className="mt-2 flex max-w-full flex-wrap items-center gap-1.5 border-t border-[rgba(28,26,20,0.06)] pt-2">
            <span className="shrink-0 text-[11px] font-medium text-[rgba(28,26,20,0.45)]">
              {t('tour.filter.active', 'Active')}:
            </span>
            {value.provinceId && (
              <Badge variant="secondary" className="rounded-full bg-stone-100 text-[11px]">
                {provinceLabel}
              </Badge>
            )}
            {value.language && (
              <Badge variant="secondary" className="rounded-full bg-stone-100 text-[11px]">
                {languageLabel}
              </Badge>
            )}
            {value.isVerified !== 'all' && (
              <Badge variant="secondary" className="rounded-full bg-stone-100 text-[11px]">
                {verificationLabel}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourGuideFilter;
