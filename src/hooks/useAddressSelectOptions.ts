import { useLanguage } from '@/hooks/useLanguage';
import type { SelectOption } from '@/utils/addressOptions';
import {
  ADDRESS_NONE,
  langKey,
  toProvinceSelectOptions,
  toWardSelectOptions,
} from '@/utils/addressOptions';
import type { DistrictOrWard, Province } from '@/features/provinces/types';
import { useMemo } from 'react';
import { useProvincesQuery } from '../features/provinces/hooks';

/** Hook trả về options tỉnh/thành phố cho select (dùng chung nhiều nơi) */
export function useProvinceSelectOptions(): {
  provinceOptions: SelectOption[];
  provincesList: Province[] | undefined;
} {
  const { data: provincesList } = useProvincesQuery();
  const { language } = useLanguage();
  const lang = langKey(language);
  const provinceOptions = useMemo(
    () => toProvinceSelectOptions(provincesList ?? [], lang),
    [provincesList, lang],
  );
  return { provinceOptions, provincesList };
}

/** Hook trả về options phường/xã theo provinceId (dùng chung nhiều nơi) */
export function useWardSelectOptions(provinceId: string | undefined): {
  wardOptions: SelectOption[];
  wards: DistrictOrWard[];
} {
  const { provincesList } = useProvinceSelectOptions();
  const { language } = useLanguage();
  const lang = langKey(language);

  const selectedProvince = useMemo(
    () =>
      provincesList?.find(
        (p: Province) => String(p._id) === String(provinceId),
      ),
    [provincesList, provinceId],
  );

  const wards = useMemo(
    () => selectedProvince?.wards ?? selectedProvince?.districts ?? [],
    [selectedProvince],
  );

  const wardOptions = useMemo(
    () => toWardSelectOptions(wards, lang),
    [wards, lang],
  );

  return {
    wardOptions,
    wards,
  };
}

export { ADDRESS_NONE };
