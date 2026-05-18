import type { DistrictOrWard, Province } from '@/features/provinces/types';
import { pickLocale } from '@/features/provinces/locale';

export const ADDRESS_NONE = '__none__';

export type LangKey = 'vi' | 'en';

export function langKey(lang: string): LangKey {
  return lang === 'en' ? 'en' : 'vi';
}

export function getWardLabel(w: DistrictOrWard, lang: LangKey): string {
  return pickLocale(w.name, lang) ?? '';
}

export interface SelectOption {
  label: string;
  value: string;
}

export function toProvinceSelectOptions(
  provinces: Province[] | undefined,
  lang: LangKey,
  noneLabel = '-- Chọn tỉnh/thành phố --',
): SelectOption[] {
  if (!provinces?.length) {
    return [{ label: noneLabel, value: ADDRESS_NONE }];
  }
  return [
    { label: noneLabel, value: ADDRESS_NONE },
    ...provinces.map((p) => ({
      label: pickLocale(p.name, lang) ?? p.code ?? String(p._id),
      value: String(p._id),
    })),
  ];
}

export function toWardSelectOptions(
  wards: DistrictOrWard[] | undefined,
  lang: LangKey,
  noneLabel = '-- Chọn phường/xã --',
): SelectOption[] {
  if (!wards?.length) {
    return [{ label: noneLabel, value: ADDRESS_NONE }];
  }
  return [
    { label: noneLabel, value: ADDRESS_NONE },
    ...wards.map((w) => ({
      label: getWardLabel(w, lang),
      value: String(w.code),
    })),
  ];
}

