import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import CustomInput from './CustomInput';
import { Button } from './ui/button';
import { ResponsiveH5 } from './ui/typography';
import type { Province, DistrictOrWard } from '@/features/provinces/types';

const PROVINCE_ALL_VALUE = '__all__';
const WARD_ALL_VALUE = '__all_ward__';

export type FilterListValues = {
  provinceId: string;
  wardId: string;
};

interface Props {
  onFilter?: (values: FilterListValues) => void;
  onClear?: () => void;
}

const FilterListComponent: React.FC<Props> = ({ onFilter, onClear }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provincesList } = useProvincesQuery();

  const methods = useForm<FilterListValues>({
    defaultValues: {
      provinceId: PROVINCE_ALL_VALUE,
      wardId: WARD_ALL_VALUE,
    },
  });

  const provinceId = methods.watch('provinceId') ?? PROVINCE_ALL_VALUE;
  const selectedProvince = provincesList?.find((p) => p._id === provinceId);
  const wards = selectedProvince?.districts ?? [];

  React.useEffect(() => {
    methods.setValue('wardId', WARD_ALL_VALUE);
  }, [provinceId, methods]);

  const handleSubmit = methods.handleSubmit((values) => {
    onFilter?.({
      provinceId: values.provinceId === PROVINCE_ALL_VALUE ? '' : values.provinceId,
      wardId: values.wardId === WARD_ALL_VALUE ? '' : values.wardId,
    });
  });

  const handleClear = () => {
    methods.reset({ provinceId: PROVINCE_ALL_VALUE, wardId: WARD_ALL_VALUE });
    onClear?.();
  };

  const getDistrictName = (d: DistrictOrWard) =>
    d.name?.[language as 'vi' | 'en'] ?? d.name?.vi ?? d.name?.en ?? '';

  return (
    <FormProvider {...methods}>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <ResponsiveH5>{t('list_page.filter_location', 'Filter by Location')}</ResponsiveH5>

        <CustomInput
          name="provinceId"
          type="select"
          label={t('input.field_label.province')}
          placeHolder={t('input.placeholder.province')}
          options={[
            { label: t('input.field_label.all_provinces'), value: PROVINCE_ALL_VALUE },
            ...(provincesList ?? []).map((p: Province) => ({
              label: p.name[language as 'vi' | 'en'] ?? p.name.vi ?? p.name.en,
              value: p._id,
            })),
          ]}
        />

        {wards.length > 0 && (
          <CustomInput
            name="wardId"
            type="select"
            label={t('input.field_label.ward', 'Quận / Huyện')}
            placeHolder={t('input.placeholder.ward', 'Chọn quận/huyện')}
            options={[
              { label: t('list_page.all_wards', 'Tất cả'), value: WARD_ALL_VALUE },
              ...wards.map((w) => ({
                label: getDistrictName(w),
                value: (w as { _id?: string })._id ?? w.code,
              })),
            ]}
          />
        )}

        <Button
          type="button"
          variant="ghost"
          className="text-blue-500 w-fit"
          onClick={handleClear}
        >
          {t('buttons.clear_filter')}
        </Button>
        <Button type="submit" className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white">
          {t('buttons.search')}
        </Button>
      </form>
    </FormProvider>
  );
};

export default FilterListComponent;
