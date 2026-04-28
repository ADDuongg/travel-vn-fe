/** Province ref (populated) – từ GET /api/v1/public/provinces */
export interface ProvinceRef {
  _id: string;
  name: { vi: string; en: string };
  code?: string;
  slug?: string;
  fullName?: { vi: string; en: string };
}

export interface TourGuideTranslation {
  bio?: string;
  shortBio?: string;
  specialties?: string;
  /** Mảng chuyên môn theo ngôn ngữ (cùng thứ tự giữa các lang) */
  specialtyItems?: string[];
}

/** User info populated trên guide (public) */
export interface TourGuideUserRef {
  _id: string;
  fullName?: string;
  avatar?: { url: string; publicId?: string };
}

export type TourGuideSortBy = 'rating' | 'experience' | 'newest';

export interface TourGuideRatingSummary {
  average: number;
  total: number;
}

/** TourGuide – list item (GET /api/v1/public/tour-guides) */
export interface TourGuideListItem {
  _id: string;
  userId: string;
  /** Returned when request includes Authorization (Favorites module). */
  isFavorited?: boolean;
  user?: TourGuideUserRef;
  translations: Record<string, TourGuideTranslation>;
  languages: string[];
  specializedProvinces: string[] | ProvinceRef[];
  certifications: string[];
  licenseNumber?: string;
  yearsOfExperience?: number;
  gallery?: Array<{ url: string; publicId?: string; alt?: string }>;
  ratingSummary: TourGuideRatingSummary;
  /** Tỷ lệ phản hồi (0–100) */
  responseRate?: number;
  /** Số chuyến đi hoàn tất */
  completedTripsCount?: number;
  /** Tỷ lệ khách quay lại (0–100) */
  returningCustomerRate?: number;
  isAvailable: boolean;
  isActive: boolean;
  isVerified: boolean;
  dailyRate?: number;
  currency: string;
  contactMethods: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** TourGuide – full detail (GET /api/v1/public/tour-guides/:id) */
export interface TourGuide extends TourGuideListItem {
  cv?: {
    url: string;
    publicId?: string;
    filename?: string;
  };
  verifiedAt?: string;
}

export interface TourGuidePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Payload when registering a new tour guide (POST /api/v1/client/tour-guides/register) */
export interface TourGuideRegisterPayload {
  translations: Record<string, TourGuideTranslation>;
  languages: string[];
  specializedProvinces: string[];
  certifications?: string[];
  licenseNumber?: string;
  yearsOfExperience?: number;
  gallery?: Array<{ url: string; publicId?: string; alt?: string }>;
  /** Tỷ lệ phản hồi (0–100) – optional, thường do hệ thống tính */
  responseRate?: number;
  /** Số chuyến đi hoàn tất – optional, thường do hệ thống tính */
  completedTripsCount?: number;
  /** Tỷ lệ khách quay lại (0–100) – optional, thường do hệ thống tính */
  returningCustomerRate?: number;
  isAvailable?: boolean;
  dailyRate?: number;
  currency?: string;
  contactMethods?: string[];
}

export interface TourGuidePaginatedResponse {
  items: TourGuideListItem[];
  pagination: TourGuidePagination;
}

export interface TourGuideQueryParams {
  /** Pagination */
  page?: number;
  limit?: number;
  /** Filter by province */
  provinceId?: string;
  /** Filter by language code (vi, en, ...) */
  language?: string;
  /** Filter by verification status */
  isVerified?: boolean;
  /** Filter by availability */
  isAvailable?: boolean;
  /** Minimum rating filter */
  minRating?: number;
  /** Keyword search (guide name, etc.) */
  search?: string;
  /** Sort key */
  sort?: TourGuideSortBy;
  /** (Internal) Filter by owner user id – used for my-profile dashboard */
  userId?: string;
}

/** Review item – GET /api/v1/public/tour-guides/:id/reviews (may mirror global review schema) */
export interface TourGuideReview {
  _id: string;
  entityType: 'GUIDE';
  entityId: string;
  rating: number;
  comment?: string;
  userId?: string | null;
  isAnonymous: boolean;
  /** @deprecated Prefer `status` when backend exposes it */
  isApproved?: boolean;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';
  createdAt: string;
}

export interface TourGuideReviewsResponse {
  items: TourGuideReview[];
  pagination: TourGuidePagination;
}
