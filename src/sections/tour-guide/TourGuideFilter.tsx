import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import CustomInput from '@/components/CustomInput';
import { Button } from '@/components/ui/button';
import { ResponsiveH5 } from '@/components/ui/typography';
import type { TourGuideQueryParams, TourGuideSortBy } from '@/features/tour-guide/types';
import type { Province } from '@/features/provinces/types';

const ALL_VALUE = '__all__';

export type TourGuideFilterValues = {
  provinceId?: string;
  language?: string;
  sort?: TourGuideSortBy;
  search?: string;
  isVerified?: string;
};

interface TourGuideFilterProps {
  onFilter?: (values: TourGuideQueryParams) => void;
  onClear?: () => void;
}

const LANGUAGES: { value: string; labelKey?: string; label?: string }[] = [
  { value: '', labelKey: 'common.all' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
];

const SORT_OPTION_KEYS: { value: TourGuideSortBy; labelKey: string }[] = [
  { value: 'newest', labelKey: 'tour_guide.sort_newest' },
  { value: 'rating', labelKey: 'tour_guide.sort_rating' },
  { value: 'experience', labelKey: 'tour_guide.sort_experience' },
];

const TourGuideFilter: React.FC<TourGuideFilterProps> = ({ onFilter, onClear }) => {
  const { t } = useTranslation();
  const { data: provincesList } = useProvincesQuery();
  const { language } = useLanguage();

  const methods = useForm<TourGuideFilterValues>({
    defaultValues: {
      provinceId: ALL_VALUE,
      language: ALL_VALUE,
      sort: 'newest',
      search: '',
      isVerified: ALL_VALUE,
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    const params: TourGuideQueryParams = {
      page: 1,
      limit: 12,
      sort: (values.sort as TourGuideSortBy) || 'newest',
    };
    if (values.provinceId && values.provinceId !== ALL_VALUE) {
      params.provinceId = values.provinceId;
    }
    if (values.language && values.language !== ALL_VALUE) {
      params.language = values.language;
    }
    if (values.search?.trim()) {
      params.search = values.search.trim();
    }
    if (values.isVerified && values.isVerified !== ALL_VALUE) {
      params.isVerified = values.isVerified === 'true';
    }
    onFilter?.(params);
  });

  const handleClear = () => {
    methods.reset({
      provinceId: ALL_VALUE,
      language: ALL_VALUE,
      sort: 'newest',
      search: '',
      isVerified: ALL_VALUE,
    });
    onClear?.();
  };

  const getProvinceLabel = (p: Province) =>
    p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug ?? p._id;

  return (
    <FormProvider {...methods}>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <ResponsiveH5>{t('tour_guide.filter_title')}</ResponsiveH5>

        <CustomInput
          name="search"
          type="text"
          label={t('tour.filter.search')}
          placeHolder={t('tour_guide.search_placeholder')}
        />

        <CustomInput
          name="provinceId"
          type="select"
          label={t('tour_guide.province_specialty')}
          placeHolder={t('tour_guide.select_province')}
          options={[
            { label: t('common.all'), value: ALL_VALUE },
            ...(provincesList ?? []).map((p: Province) => ({
              label: getProvinceLabel(p),
              value: p._id,
            })),
          ]}
        />

        <CustomInput
          name="language"
          type="select"
          label={t('tour_guide.language')}
          options={[
            { label: t('common.all'), value: ALL_VALUE },
            ...LANGUAGES.filter((l) => l.value).map((l) => ({
              label: l.labelKey ? t(l.labelKey) : l.label!,
              value: l.value,
            })),
          ]}
        />

        <CustomInput
          name="isVerified"
          type="select"
          label={t('tour_guide.verified_only')}
          options={[
            { label: t('common.all'), value: ALL_VALUE },
            { label: t('tour_guide.verified_only'), value: 'true' },
            { label: t('tour_guide.unverified'), value: 'false' },
          ]}
        />

        <CustomInput
          name="sort"
          type="select"
          label={t('tour_guide.sort_label')}
          options={SORT_OPTION_KEYS.map((o) => ({
            label: t(o.labelKey),
            value: o.value,
          }))}
        />

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

export default TourGuideFilter;
