import {
  DETAIL_NAV_SCROLL_OFFSET_PX,
  scrollToSectionAnchor,
} from '@/lib/scrollToSectionAnchor';

/** @deprecated use DETAIL_NAV_SCROLL_OFFSET_PX from @/lib/scrollToSectionAnchor */
export const PROVINCE_DETAIL_SCROLL_OFFSET_PX = DETAIL_NAV_SCROLL_OFFSET_PX;

export function scrollToProvinceDetailSection(id: string) {
  scrollToSectionAnchor(id);
}
