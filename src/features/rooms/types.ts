/** Province ref (populated in hotelId) */
export interface ProvinceRef {
  _id: string;
  name: { vi: string; en: string };
  code: string;
  slug: string;
  fullName?: { vi: string; en: string };
}

/** Hotel ref (populated in room response) */
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
  /** Returned when request includes Authorization (Favorites module). */
  isFavorited?: boolean;
  roomType: string; // e.g., "Master", "Deluxe"
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

  /* translations */
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

  /** Hotel (populated object) - room.hotelId.translations[lang].name, room.hotelId.provinceId.name[lang] */
  hotelId?: string | HotelRef;

  /* amenities */
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
  /** Language for keyword search (en, vi) */
  lang?: string;
  /** Check-in date YYYY-MM-DD */
  checkIn?: string;
  /** Check-out date YYYY-MM-DD */
  checkOut?: string;
  /** Minimum rating (ratingSummary.average >= minRating) */
  minRating?: number;
  /** Amenity codes (e.g. wifi, air_condition) */
  amenities?: string[];
  /** Room sizes in m² */
  roomSize?: number[];
  /** Filter by province (via hotel) */
  provinceId?: string;
  /** Hotel IDs (destinations) */
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
