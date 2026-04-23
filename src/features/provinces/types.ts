/** LocalizedName – vi/en */
export interface LocalizedName {
  vi: string;
  en: string;
}

/** Ward (quận/huyện, phường/xã) */
export interface Ward {
  type: string;
  code: string;
  slug: string;
  name: LocalizedName;
}

/** District/Ward – alias for backward compatibility (dropdown uses wards) */
export interface DistrictOrWard {
  _id?: string;
  type?: string;
  code: string;
  slug?: string;
  name: LocalizedName;
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

/** ProvinceTranslation */
export interface ProvinceTranslation {
  description?: string;
  shortDescription?: string;
  seo?: ProvinceSeo;
}

/** ProvinceHighlight */
export interface ProvinceHighlight {
  name: LocalizedName;
  thumbnail?: ImageItem;
  description?: LocalizedName;
}
export type ProvinceHighlightItem = ProvinceHighlight;

/** ProvinceClientExtensions - optional fields for public FE list/detail */
export interface ProvinceClientExtensions {
  population?: number;
  area?: number;
  bestTimeToVisit?: LocalizedName;
  highlights?: ProvinceHighlight[];
  totalHotels?: number;
  totalTours?: number;
  totalTourGuides?: number;
}

/** ProvinceListItem – list + popular response */
export interface ProvinceListItem extends ProvinceClientExtensions {
  _id: string;
  type?: string;
  code: string;
  slug: string;
  name: LocalizedName;
  fullName?: LocalizedName;
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

/** ProvinceDetail – detail response (kèm wards) */
export interface ProvinceDetail extends ProvinceListItem, ProvinceClientExtensions {
  wards?: Ward[];
}

/** ProvinceDropdownItem – dropdown response */
export interface ProvinceDropdownItem {
  _id: string;
  code: string;
  slug: string;
  name: LocalizedName;
  fullName?: LocalizedName;
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
