import type { ImageItem, ProvinceDetail } from '@/features/provinces/types';

/** Thumbnail first, then gallery by order, unique URLs. */
export function getMergedProvinceImages(province: ProvinceDetail): ImageItem[] {
  const merged: ImageItem[] = [];
  const seen = new Set<string>();
  if (province.thumbnail?.url) {
    merged.push(province.thumbnail);
    seen.add(province.thumbnail.url);
  }
  (province.gallery ?? [])
    .slice()
    .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
    .forEach((image) => {
      if (image.url && !seen.has(image.url)) {
        merged.push(image);
        seen.add(image.url);
      }
    });
  return merged;
}
