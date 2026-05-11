import { ReviewStatus, type Review } from '@/features/review/types';
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

/** Split long bio into paragraphs for editorial layout (Open Design–style story). */
export function splitBioToParagraphs(bio: string | undefined): string[] {
  if (!bio?.trim()) return [];
  const normalized = bio.replace(/\r\n/g, '\n').trim();
  const byBlank = normalized.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (byBlank.length > 1) return byBlank;
  return normalized
    .split(/\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Highest-rated approved public review with a non-empty comment (editorial “voice” block). */
export function pickFeaturedGuideReview(reviews: Review[] | undefined): Review | null {
  if (!reviews?.length) return null;
  const approved = reviews.filter(
    (r) => r.status === ReviewStatus.APPROVED && (r.comment?.trim()?.length ?? 0) > 0,
  );
  if (!approved.length) return null;
  return [...approved].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
}
