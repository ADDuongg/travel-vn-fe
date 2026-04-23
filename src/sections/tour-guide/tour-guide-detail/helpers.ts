import type { ProvinceRef, TourGuide } from '@/features/tour-guide/types';

export function getBio(guide: TourGuide, lang: string): string | undefined {
  const translation =
    guide.translations?.[lang] ?? guide.translations?.vi ?? guide.translations?.en;
  return translation?.bio ?? translation?.shortBio;
}

export function getShortBio(guide: TourGuide, lang: string): string | undefined {
  const translation =
    guide.translations?.[lang] ?? guide.translations?.vi ?? guide.translations?.en;
  return translation?.shortBio ?? translation?.bio;
}

export function getSpecialties(guide: TourGuide, lang: string): string | undefined {
  const translation =
    guide.translations?.[lang] ?? guide.translations?.vi ?? guide.translations?.en;
  return translation?.specialties;
}

export function getSpecialtyItems(guide: TourGuide, lang: string): string[] {
  const translation =
    guide.translations?.[lang] ?? guide.translations?.vi ?? guide.translations?.en;
  return translation?.specialtyItems ?? [];
}

export function getProvinceName(province: string | ProvinceRef, lang: string): string {
  if (typeof province === 'string') return province;
  const names = (province as ProvinceRef).name as
    | { vi?: string; en?: string }
    | undefined;
  return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? '';
}
