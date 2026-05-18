export interface Room {
  _id: string;

  code: string;
  slug: string;
  isActive: boolean;

  maxGuests: number;
  adults: number;
  children: number;
  roomSize?: number;

  pricing: {
    basePrice: number;
    currency: string;
    weekendPrice?: number;
    extraAdultPrice?: number;
    extraChildPrice?: number;
  };

  thumbnail?: {
    _id: string;
    url: string;
    alt?: string;
  };

  gallery: Array<{
    _id: string;
    url: string;
    alt?: string;
    order?: number;
  }>;

  translations: {
    [langCode: string]: {
      name: string;
      description: string;
      shortDescription?: string;
      hotelRule?: string[];
      faq: {
        question: string;
        answer: string;
      }[];
    };
  };

  sale?: {
    isActive: boolean;
    type: 'PERCENT' | 'FIXED';
    value: number;
    startDate?: string;
    endDate?: string;
  };

  ratingSummary: {
    average: number;
    total: number;
  };

  amenities: {
    translations: {
      [langCode: string]: {
        name: string;
        description: string;
      };
    };
    icon?: {
      url: string;
      publicId: string;
    };
    isActive: boolean;
  }[];
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

