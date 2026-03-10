import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import CustomInput from '@/components/CustomInput';
import { Button } from '@/components/ui/button';
import { ResponsiveH5 } from '@/components/ui/typography';
import type {
  TourQueryParams,
  TourType,
  Difficulty,
  TourSortBy,
} from '@/features/tours/catalog-types';
import type { Province } from '@/features/provinces/types';

const ALL_VALUE = '__all__';

export type TourFilterValues = Omit<
  Partial<TourQueryParams>,
  'tourType' | 'difficulty'
> & {
  destinationId?: string;
  departureProvinceId?: string;
  tourType?: string;
  difficulty?: string;
  sortBy?: string;
};

interface TourFilterProps {
  onFilter?: (values: TourQueryParams) => void;
  onClear?: () => void;
}

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

const TourFilter: React.FC<TourFilterProps> = ({ onFilter, onClear }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provincesList } = useProvincesQuery();

  const methods = useForm<TourFilterValues>({
    defaultValues: {
      destinationId: ALL_VALUE,
      departureProvinceId: ALL_VALUE,
      tourType: ALL_VALUE,
      difficulty: ALL_VALUE,
      sortBy: 'newest',
      minPrice: undefined,
      maxPrice: undefined,
      minDays: undefined,
      maxDays: undefined,
      search: '',
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
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
    onFilter?.(params);
  });

  const handleClear = () => {
    methods.reset({
      destinationId: ALL_VALUE,
      departureProvinceId: ALL_VALUE,
      tourType: ALL_VALUE,
      difficulty: ALL_VALUE,
      sortBy: 'newest',
      minPrice: undefined,
      maxPrice: undefined,
      minDays: undefined,
      maxDays: undefined,
      search: '',
    });
    onClear?.();
  };

  const getProvinceLabel = (p: Province) =>
    p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug;

  return (
    <FormProvider {...methods}>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <ResponsiveH5>{t('tour.filter.title', 'Filter Tours')}</ResponsiveH5>

        <CustomInput
          name="search"
          type="text"
          label={t('tour.filter.search', 'Search')}
          placeHolder={t(
            'tour.filter.search_placeholder',
            'Tour name or code...',
          )}
        />

        <CustomInput
          name="destinationId"
          type="select"
          label={t('tour.filter.destination', 'Destination')}
          placeHolder={t(
            'tour.filter.select_destination',
            'Select destination',
          )}
          options={[
            { label: t('common.all'), value: ALL_VALUE },
            ...(provincesList ?? []).map((p: Province) => ({
              label: getProvinceLabel(p),
              value: p._id,
            })),
          ]}
        />

        <CustomInput
          name="departureProvinceId"
          type="select"
          label={t('tour.filter.departure', 'Departure')}
          placeHolder={t('tour.filter.select_departure', 'Select departure')}
          options={[
            { label: t('common.all'), value: ALL_VALUE },
            ...(provincesList ?? []).map((p: Province) => ({
              label: getProvinceLabel(p),
              value: p._id,
            })),
          ]}
        />

        <CustomInput
          name="tourType"
          type="select"
          label={t('tour.filter.tour_type', 'Tour Type')}
          options={TOUR_TYPES.map((o) => ({
            label: t(o.labelKey),
            value: o.value || ALL_VALUE,
          }))}
        />

        <CustomInput
          name="difficulty"
          type="select"
          label={t('tour.filter.difficulty', 'Difficulty')}
          options={DIFFICULTIES.map((o) => ({
            label: t(o.labelKey),
            value: o.value || ALL_VALUE,
          }))}
        />

        <CustomInput
          name="sortBy"
          type="select"
          label={t('tour.sort.label', 'Sort By')}
          options={SORT_OPTIONS.map((o) => ({
            label: t(o.labelKey),
            value: o.value,
          }))}
        />

        <div className="flex gap-2">
          <CustomInput
            name="minPrice"
            type="text"
            label={t('tour.filter.min_price', 'Min Price (VND)')}
            placeHolder="0"
          />
          <CustomInput
            name="maxPrice"
            type="text"
            label={t('tour.filter.max_price', 'Max Price (VND)')}
            placeHolder="0"
          />
        </div>

        <div className="flex gap-2">
          <CustomInput
            name="minDays"
            type="text"
            label={t('tour.filter.min_days', 'Min Days')}
            placeHolder="0"
          />
          <CustomInput
            name="maxDays"
            type="text"
            label={t('tour.filter.max_days', 'Max Days')}
            placeHolder="0"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          className="text-primary w-fit"
          onClick={handleClear}
        >
          {t('buttons.clear_filter')}
        </Button>
        <Button type="submit" className="mt-2 w-full">
          {t('buttons.search')}
        </Button>
      </form>
    </FormProvider>
  );
};

export default TourFilter;
