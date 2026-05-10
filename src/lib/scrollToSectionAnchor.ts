/** Offset below fixed header — section anchors align with editorial detail nav */
export const DETAIL_NAV_SCROLL_OFFSET_PX = 112;

export function scrollToSectionAnchor(
  sectionId: string,
  offsetPx: number = DETAIL_NAV_SCROLL_OFFSET_PX,
) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - offsetPx;
  window.scrollTo({ top, behavior: 'smooth' });
}
