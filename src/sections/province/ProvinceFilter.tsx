import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CustomInput from '@/components/CustomInput';
import { Button } from '@/components/ui/button';
import { ResponsiveH5 } from '@/components/ui/typography';

const ALL_VALUE = '__all__';

const REGION_OPTIONS = [
  { value: ALL_VALUE, labelKey: 'common.all' },
  { value: 'NORTH', labelKey: 'province.region_north' },
  { value: 'CENTRAL', labelKey: 'province.region_central' },
  { value: 'SOUTH', labelKey: 'province.region_south' },
];

const SORT_OPTIONS = [
  { value: 'name', labelKey: 'province.sort_name' },
  { value: 'displayOrder', labelKey: 'province.sort_display_order' },
  { value: 'newest', labelKey: 'province.sort_newest' },
];

export interface ProvinceFilterValues {
  search: string;
  region: string;
  isPopular: string;
  sort: string;
}

const defaultValues: ProvinceFilterValues = {
  search: '',
  region: ALL_VALUE,
  isPopular: ALL_VALUE,
  sort: 'name',
};

export function ProvinceFilter() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const methods = useForm<ProvinceFilterValues>({
    defaultValues: {
      ...defaultValues,
      search: searchParams.get('search') ?? '',
      region: searchParams.get('region') ? searchParams.get('region')! : ALL_VALUE,
      isPopular: searchParams.get('isPopular') ? searchParams.get('isPopular')! : ALL_VALUE,
      sort: searchParams.get('sort') ?? 'name',
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    const params = new URLSearchParams();
    if (values.search?.trim()) params.set('search', values.search.trim());
    if (values.region && values.region !== ALL_VALUE) params.set('region', values.region);
    if (values.isPopular === 'true') params.set('isPopular', 'true');
    if (values.isPopular === 'false') params.set('isPopular', 'false');
    if (values.sort && values.sort !== 'name') params.set('sort', values.sort);
    setSearchParams(params, { replace: true });
  });

  const handleClear = () => {
    methods.reset(defaultValues);
    setSearchParams({}, { replace: true });
  };

  return (
    <FormProvider {...methods}>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <ResponsiveH5>{t('province.filter_title', 'Filter')}</ResponsiveH5>

        <CustomInput
          name="search"
          type="text"
          label={t('province.search', 'Search')}
          placeHolder={t('province.search_placeholder', 'Search provinces...')}
        />

        <CustomInput
          name="region"
          type="select"
          label={t('province.region', 'Region')}
          placeHolder={t('common.all', 'All')}
          options={REGION_OPTIONS.map((opt) => ({
            label: t(opt.labelKey),
            value: opt.value,
          }))}
        />

        <CustomInput
          name="isPopular"
          type="select"
          label={t('province.popular_only', 'Popular only')}
          placeHolder={t('common.all', 'All')}
          options={[
            { label: t('common.all'), value: ALL_VALUE },
            { label: t('common.yes'), value: 'true' },
            { label: t('common.no'), value: 'false' },
          ]}
        />

        <CustomInput
          name="sort"
          type="select"
          label={t('province.sort', 'Sort by')}
          options={SORT_OPTIONS.map((opt) => ({
            label: t(opt.labelKey),
            value: opt.value,
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
          {t('common.apply', 'Apply')}
        </Button>
      </form>
    </FormProvider>
  );
}
