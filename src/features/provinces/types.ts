export type DynamicLocalized = Record<string, string>;

export type LocalizedName = DynamicLocalized;

export interface ProvinceTranslation {
  description?: string;
  shortDescription?: string;

  bestTimeToVisit?: string;
  seo?: ProvinceSeo;
}

export interface Ward {
  type: string;
  code: string;
  slug: string;
  name: DynamicLocalized;
}

export interface DistrictOrWard {
  _id?: string;
  type?: string;
  code: string;
  slug?: string;
  name: DynamicLocalized;
}

export interface ImageItem {
  url: string;
  publicId?: string;
  alt?: string;
  order?: number;
}

export interface ProvinceSeo {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface ProvinceHighlightLocaleBlock {
  name: string;
  description?: string;
}

export interface ProvinceHighlight {
  translations?: Record<string, ProvinceHighlightLocaleBlock>;
  thumbnail?: ImageItem;

  name?: DynamicLocalized;
  description?: DynamicLocalized;
}

export type ProvinceHighlightItem = ProvinceHighlight;

export interface ProvinceClientExtensions {
  population?: number;
  area?: number;
  highlights?: ProvinceHighlight[];
  totalHotels?: number;
  totalTours?: number;
  totalTourGuides?: number;
}

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

export interface ProvinceDetail extends ProvinceListItem {
  wards?: Ward[];
}

export interface ProvinceDropdownItem {
  _id: string;
  code: string;
  slug: string;
  name: DynamicLocalized;
  fullName?: DynamicLocalized;
  wards?: Ward[];
}

export type Province = ProvinceDropdownItem;

export interface ProvinceListParams {
  page?: number;
  limit?: number;
  region?: 'NORTH' | 'CENTRAL' | 'SOUTH';
  isPopular?: boolean;
  isActive?: boolean;
  search?: string;
  sort?: 'name' | 'displayOrder' | 'newest';
}

export interface ProvinceListResponse {
  items: ProvinceListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

