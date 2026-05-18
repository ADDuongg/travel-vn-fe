export interface ProvinceRef {
  _id: string;
  name: { vi: string; en: string };
  code: string;
  slug: string;
  fullName?: { vi: string; en: string };
}

export interface HotelRef {
  _id: string;
  slug: string;
  translations: Record<string, { name?: string; [key: string]: unknown }>;
  provinceId: string | ProvinceRef;
  contact?: { phone?: string; email?: string; website?: string };
  location?: { lat?: number; lng?: number };
}

export interface Room {
  _id: string;

  code: string;
  slug: string;

  isFavorited?: boolean;
  roomType: string;
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

  bookingConfig: {
    minNights: number;
    maxNights?: number;
    allowInstantBooking: boolean;
  };
  inventory: {
    totalRooms: number;
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

  hotelId?: string | HotelRef;

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
  children?: number;
  keyword?: string;

  lang?: string;

  checkIn?: string;

  checkOut?: string;

  minRating?: number;

  amenities?: string[];

  roomSize?: number[];

  provinceId?: string;

  hotelIds?: string[];
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

export interface RoomGuestPayload {
  adults: number;
  children?: number;
}

export interface RoomBookingPayload {
  roomId: string;

  checkIn: string;
  checkOut: string;

  userId: string;

  rooms: RoomGuestPayload[];
}

