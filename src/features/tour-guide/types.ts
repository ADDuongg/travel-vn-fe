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

  specialtyItems?: string[];
}

export interface TourGuideCv {
  url: string;
  publicId?: string;
  filename?: string;
  format?: string;
}

export interface TourGuideGalleryItem {
  url: string;
  publicId?: string;
  alt?: string;

  order?: number;
}

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

export interface TourGuideListItem {
  _id: string;
  userId: string;

  isFavorited?: boolean;
  user?: TourGuideUserRef;
  translations: Record<string, TourGuideTranslation>;
  languages: string[];
  specializedProvinces: string[] | ProvinceRef[];
  certifications: string[];
  licenseNumber?: string;
  yearsOfExperience?: number;
  gallery?: TourGuideGalleryItem[];
  ratingSummary: TourGuideRatingSummary;

  responseRate?: number;

  completedTripsCount?: number;

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

export interface TourGuide extends TourGuideListItem {
  cv?: TourGuideCv;
  verifiedAt?: string;
}

export interface TourGuidePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TourGuideRegisterPayload {
  translations: Record<string, TourGuideTranslation>;
  languages: string[];
  specializedProvinces: string[];
  certifications?: string[];
  licenseNumber?: string;
  yearsOfExperience?: number;
  cv?: TourGuideCv;
  gallery?: TourGuideGalleryItem[];

  responseRate?: number;

  completedTripsCount?: number;

  returningCustomerRate?: number;
  isAvailable?: boolean;
  dailyRate?: number;
  currency?: string;
  contactMethods?: string[];
}

export type TourGuideUpdatePayload = Partial<{
  translations: Record<string, TourGuideTranslation>;
  languages: string[];
  specializedProvinces: string[];
  certifications: string[];
  licenseNumber: string;
  yearsOfExperience: number;
  cv: TourGuideCv | null;
  gallery: TourGuideGalleryItem[];
  responseRate: number;
  completedTripsCount: number;
  returningCustomerRate: number;
  isAvailable: boolean;
  dailyRate: number;
  currency: string;
  contactMethods: string[];
}>;

export interface TourGuidePaginatedResponse {
  items: TourGuideListItem[];
  pagination: TourGuidePagination;
}

export interface TourGuideQueryParams {

  page?: number;
  limit?: number;

  provinceId?: string;

  language?: string;

  isVerified?: boolean;

  isAvailable?: boolean;

  minRating?: number;

  search?: string;

  sort?: TourGuideSortBy;

  userId?: string;
}

export interface TourGuideReview {
  _id: string;
  entityType: 'GUIDE';
  entityId: string;
  rating: number;
  comment?: string;
  userId?: string | null;
  isAnonymous: boolean;

  isApproved?: boolean;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';
  createdAt: string;
}

export interface TourGuideReviewsResponse {
  items: TourGuideReview[];
  pagination: TourGuidePagination;
}

