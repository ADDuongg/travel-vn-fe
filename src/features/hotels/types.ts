/** Province ref (populated) */
export interface ProvinceRef {
  _id: string;
  name: { vi: string; en: string };
  code: string;
  slug: string;
  fullName?: { vi: string; en: string };
}

/** HotelOption – list/options response */
export interface HotelOption {
  _id: string;
  slug: string;
  /** Returned when request includes Authorization (Favorites module). */
  isFavorited?: boolean;
  translations: Record<string, { name?: string; [key: string]: unknown }>;
  provinceId: string | ProvinceRef;
}

/** Hotel – detail response (full) */
export interface HotelTranslation {
  name: string;
  description?: string;
  shortDescription?: string;
  address?: string;
  policies?: string[];
  seo?: { title?: string; description?: string };
}

export interface HotelContact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface HotelLocation {
  lat?: number;
  lng?: number;
}

export interface Hotel extends HotelOption {
  isActive?: boolean;
  starRating?: number;
  contact?: HotelContact;
  location?: HotelLocation;
  thumbnail?: { url: string; publicId?: string; alt?: string };
  gallery?: Array<{
    url: string;
    publicId?: string;
    alt?: string;
    order?: number;
  }>;
  amenities?: Array<{ _id: string; [key: string]: unknown }>;
  /** From API when included — for review header (average / count) */
  ratingSummary?: { average: number; total: number };
}

export type HotelSortBy = 'name' | 'rating' | 'newest';

export interface HotelQueryParams {
  page?: number;
  limit?: number;
  provinceId?: string;
  search?: string;
  minStars?: number;
  sortBy?: HotelSortBy;
  lang?: string;
}

export interface HotelPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HotelPaginatedResponse {
  items: Hotel[];
  pagination: HotelPagination;
}
