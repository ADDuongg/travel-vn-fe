import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { RevealItem, Stagger } from '@/components/home-editorial/Reveal';

const SEARCH_DEBOUNCE_MS = 350;

const atlasPillBase =
  'rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition';
const atlasPillOn = 'border-forest bg-forest text-sand-50';
const atlasPillOff =
  'border-charcoal/12 bg-transparent text-charcoal/70 hover:border-forest/30';

const atlasPopoverTrigger = (active: boolean) =>
  cn(
    atlasPillBase,
    'inline-flex max-w-[12rem] min-h-9 items-center justify-between gap-1 normal-case',
    active ? atlasPillOn : atlasPillOff,
  );

interface TourGuideFilterProps {
  value: TourGuideListQuery;
  onChange: (next: TourGuideListQuery) => void;
  onReset: () => void;
}

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
  const { data: provincesList } = useProvincesQuery();
  const { language } = useLanguage();
  const [draftSearch, setDraftSearch] = useState(value.search);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  valueRef.current = value;
  onChangeRef.current = onChange;

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
      const q = valueRef.current;
      if (draftSearch.trim() === q.search.trim() && draftSearch === q.search) {
        return;
      }
      onChangeRef.current({ ...q, search: draftSearch });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [draftSearch]);

  const getProvinceLabel = useCallback(
    (p: Province) =>
      p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug,
    [language],
  );

  const hasActive = useMemo(
    () =>
      value.search.trim() !== '' ||
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

  const verificationLabel = useMemo(() => {
    if (value.isVerified === 'true') return t('tour_guide.verified_only', 'Verified only');
    if (value.isVerified === 'false') return t('tour_guide.unverified', 'Unverified');
    return t('tour_guide.all_guides', 'All guides');
  }, [value.isVerified, t]);

  return (
    <div
      className={cn(
        'sticky top-24 z-30 border-b border-charcoal/10 bg-sand-50/80 px-4 py-4 shadow-[0_12px_40px_-24px_oklch(22%_0.02_75/0.25)] backdrop-blur-md md:top-[5.75rem] md:px-10',
      )}
      data-tour-guide-filters
    >
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block min-w-[min(100%,280px)] flex-1">
            <span className="sr-only">{t('tour_guide.search_label', 'Search guides')}</span>
            <input
              type="search"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder={t(
                'tour_guide.search_placeholder',
                'Guide name, specialty...',
              )}
              className="w-full rounded-full border border-charcoal/12 bg-sand-50/90 px-5 py-3 text-sm text-charcoal outline-none ring-forest/25 transition placeholder:text-charcoal/40 focus:border-forest/35 focus:ring-4"
            />
          </label>
          <Stagger className="flex flex-wrap gap-2 lg:justify-end">
            {SORT_OPTIONS.map((option) => {
              const selected = value.sortBy === option.value;
              return (
                <RevealItem key={option.value}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChange({ ...value, sortBy: option.value })}
                    className={cn(atlasPillBase, selected ? atlasPillOn : atlasPillOff)}
                  >
                    {t(option.labelKey)}
                  </button>
                </RevealItem>
              );
            })}
          </Stagger>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={atlasPopoverTrigger(value.provinceId !== '')}
              >
                <span className="max-w-[10rem] truncate">{provinceLabel}</span>
                <ChevronDown className="size-3.5 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 border-charcoal/10 bg-sand-50 p-2"
              align="start"
            >
              <div className="max-h-64 space-y-0.5 overflow-y-auto">
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm text-charcoal hover:bg-sand-100"
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
                        ? 'bg-forest/12 font-medium text-forest'
                        : 'text-charcoal hover:bg-sand-100',
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
                className={atlasPopoverTrigger(value.language !== '')}
              >
                <span className="max-w-[10rem] truncate">{languageLabel}</span>
                <ChevronDown className="size-3.5 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 border-charcoal/10 bg-sand-50 p-1.5"
              align="start"
            >
              {LANGUAGES.map((option) => (
                <button
                  key={option.value || 'all'}
                  type="button"
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    value.language === option.value
                      ? 'bg-forest/12 font-medium text-forest'
                      : 'text-charcoal hover:bg-sand-100',
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
                className={atlasPopoverTrigger(value.isVerified !== 'all')}
              >
                <ShieldCheck className="size-3.5 shrink-0 opacity-90" aria-hidden />
                <span className="max-w-[9rem] truncate">{verificationLabel}</span>
                <ChevronDown className="size-3.5 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 border-charcoal/10 bg-sand-50 p-1.5"
              align="start"
            >
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
                      ? 'bg-forest/12 font-medium text-forest'
                      : 'text-charcoal hover:bg-sand-100',
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

          {hasActive ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto hidden h-8 shrink-0 gap-1 text-sunset-deep hover:text-sunset-deep/90 sm:inline-flex"
              onClick={onReset}
            >
              <X className="size-3.5" />
              {t('tour.filter.clear_all', 'Clear all')}
            </Button>
          ) : null}
        </div>

        {hasActive ? (
          <div className="flex max-w-full flex-wrap items-center gap-1.5 border-t border-charcoal/10 pt-3">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal/45">
              {t('tour.filter.active', 'Active')}:
            </span>
            {value.search.trim() !== '' ? (
              <Badge
                variant="secondary"
                className="rounded-full border border-charcoal/10 bg-sand-100 text-[11px] text-charcoal"
              >
                “{value.search.trim().slice(0, 40)}
                {value.search.trim().length > 40 ? '…' : ''}”
              </Badge>
            ) : null}
            {value.provinceId ? (
              <Badge
                variant="secondary"
                className="rounded-full border border-charcoal/10 bg-sand-100 text-[11px] text-charcoal"
              >
                {provinceLabel}
              </Badge>
            ) : null}
            {value.language ? (
              <Badge
                variant="secondary"
                className="rounded-full border border-charcoal/10 bg-sand-100 text-[11px] text-charcoal"
              >
                {languageLabel}
              </Badge>
            ) : null}
            {value.isVerified !== 'all' ? (
              <Badge
                variant="secondary"
                className="rounded-full border border-charcoal/10 bg-sand-100 text-[11px] text-charcoal"
              >
                {verificationLabel}
              </Badge>
            ) : null}
            {value.sortBy !== 'newest' ? (
              <Badge
                variant="secondary"
                className="rounded-full border border-charcoal/10 bg-sand-100 text-[11px] text-charcoal"
              >
                {(() => {
                  const opt = SORT_OPTIONS.find((o) => o.value === value.sortBy);
                  return opt ? t(opt.labelKey) : '';
                })()}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TourGuideFilter;
