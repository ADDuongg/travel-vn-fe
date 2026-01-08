export interface Room {
  _id: string;

  code: string;
  slug: string;
  isActive: boolean;

  /* capacity */
  maxGuests: number;
  adults: number;
  children: number;
  roomSize?: number;

  /* pricing */
  pricing: {
    basePrice: number;
    currency: string;
    weekendPrice?: number;
    extraAdultPrice?: number;
    extraChildPrice?: number;
  };

  /* media */
  thumbnail?: {
    url: string;
    alt?: string;
  };

  /* translations */
  translations: {
    [langCode: string]: {
      name: string;
      description: string;
      shortDescription?: string;
      hotelRule?: string[];
    };
  };

  /* sale */
  sale?: {
    isActive: boolean;
    type: 'PERCENT' | 'FIXED';
    value: number;
    startDate?: string;
    endDate?: string;
  };

  /* rating */
  ratingSummary: {
    average: number;
    total: number;
  };
}

export interface RoomQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
  minPrice?: number;
  maxPrice?: number;
  adults?: number;
  keyword?: string;
}

export interface RoomListResponse {
  items: Room[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
