/**
 * Type province public API: docs/PROVINCE-FE.md
 * Name / fullName / ward.name: Record<locale, string> (key lowercase: vi, en, …)
 */

/** DynamicLocalized — tên & text đa ngôn ngữ (BE dùng Record, không còn cố định { vi, en } tại cùng cấp) */
export type DynamicLocalized = Record<string, string>;

/** @deprecated dùng DynamicLocalized; giữ alias để code cũ đọc dễ */
export type LocalizedName = DynamicLocalized;

/** Nội dung theo từng locale — bestTimeToVisit nằm trong đây (PROVINCE-FE.md §2.3) */
export interface ProvinceTranslation {
  description?: string;
  shortDescription?: string;
  /** Thời điểm du lịch tốt — chuỗi theo locale (không còn field bestTimeToVisit root) */
  bestTimeToVisit?: string;
  seo?: ProvinceSeo;
}

/** Ward (quận/huyện, phường/xã) */
export interface Ward {
  type: string;
  code: string;
  slug: string;
  name: DynamicLocalized;
}

/** District/Ward – alias for backward compatibility (dropdown uses wards) */
export interface DistrictOrWard {
  _id?: string;
  type?: string;
  code: string;
  slug?: string;
  name: DynamicLocalized;
}

/** ImageItem – thumbnail, gallery */
export interface ImageItem {
  url: string;
  publicId?: string;
  alt?: string;
  order?: number;
}

/** ProvinceSeo */
export interface ProvinceSeo {
  title?: string;
  description?: string;
  keywords?: string[];
}

/** Một dòng highlight theo ngôn ngữ */
export interface ProvinceHighlightLocaleBlock {
  name: string;
  description?: string;
}

/**
 * Điểm nổi bật: highlights[].translations[lang].name / description
 * (legacy: name/description cùng cấp — BE có thể parse tạm)
 */
export interface ProvinceHighlight {
  translations?: Record<string, ProvinceHighlightLocaleBlock>;
  thumbnail?: ImageItem;
  /** Legacy shape (migration) — ưu tiên translations khi có */
  name?: DynamicLocalized;
  description?: DynamicLocalized;
}

export type ProvinceHighlightItem = ProvinceHighlight;

/** Các field mở rộng FE client — list + detail (trừ wards) */
export interface ProvinceClientExtensions {
  population?: number;
  area?: number;
  highlights?: ProvinceHighlight[];
  totalHotels?: number;
  totalTours?: number;
  totalTourGuides?: number;
}

/** ProvinceListItem — list + popular; không có wards trên từng item list */
export interface ProvinceListItem extends ProvinceClientExtensions {
  _id: string;
  type?: string;
  code: string;
  slug: string;
  name: DynamicLocalized;
  fullName?: DynamicLocalized;
  thumbnail?: ImageItem;
  gallery?: ImageItem[];
  translations?: Record<string, ProvinceTranslation>;
  isPopular?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  region?: 'NORTH' | 'CENTRAL' | 'SOUTH';
  createdAt?: string;
  updatedAt?: string;
}

/** Chi tiết theo slug — thêm wards */
export interface ProvinceDetail extends ProvinceListItem {
  wards?: Ward[];
}

/** ProvinceDropdownItem – dropdown response */
export interface ProvinceDropdownItem {
  _id: string;
  code: string;
  slug: string;
  name: DynamicLocalized;
  fullName?: DynamicLocalized;
  wards?: Ward[];
}

/** Province – alias for dropdown (backward compat) */
export type Province = ProvinceDropdownItem;

/** Province list query params */
export interface ProvinceListParams {
  page?: number;
  limit?: number;
  region?: 'NORTH' | 'CENTRAL' | 'SOUTH';
  isPopular?: boolean;
  isActive?: boolean;
  search?: string;
  sort?: 'name' | 'displayOrder' | 'newest';
}

/** Province list response */
export interface ProvinceListResponse {
  items: ProvinceListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
