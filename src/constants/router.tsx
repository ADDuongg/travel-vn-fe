export const ROUTES = {
  HOME: '/',
  /** List parent - children: rooms, hotels, foods, shop */
  LIST: '/list',
  LIST_ROOMS: '/list/rooms',
  LIST_HOTELS: '/list/hotels',
  LIST_FOODS: '/list/foods',
  LIST_SHOP: '/list/shop',
  DESTINATION: {
    INDEX: '/destination',
    SEARCH: '/destination/search',
  },
  /** Tỉnh/thành phố (Province Discovery) */
  PROVINCE: {
    INDEX: '/provinces',
    DETAIL: '/provinces/:slug',
  },
  TOUR: {
    INDEX: '/tour',
    SEARCH: '/tour/search',
    DETAIL: '/tour/:id',
    /** Tra cứu đơn theo mã (public) */
    BOOKING_LOOKUP: '/tour/booking/lookup',
  },
  /** Hướng dẫn viên (public list + detail) */
  TOUR_GUIDE: {
    INDEX: '/tour-guides',
    DETAIL: '/tour-guides/:id',
  },
  ROOM: {
    INDEX: '/room',
    SEARCH: '/room/search',
    DETAIL: '/room/:id',
  },
  HOTEL: {
    INDEX: '/hotel',
    DETAIL: '/hotel/:id',
  },
  FOOD: {
    INDEX: '/food',
    DETAIL: '/food/:slug',
  },
  DASHBOARD: {
    INDEX: '/dashboard',
    PROFILE: '/dashboard/profile',
    CHANGE_PASSWORD: '/dashboard/change-password',
    BOOKINGS: '/dashboard/bookings',
    INVOICES: '/dashboard/invoices',
    REVIEWS: '/dashboard/reviews',
    /** Đánh giá + Yêu thích (tabs: ?tab=reviews|wishlist) */
    SAVED: '/dashboard/saved',
    WISHLIST: '/dashboard/wishlist',
    FAVORITES: '/dashboard/favorites',
    ROOM_BOOKINGS: '/dashboard/room-bookings',
    ROOM_BOOKINGS_DETAIL: '/dashboard/room-bookings/:id',
    ROOM_INVOICES: '/dashboard/room-invoices',
    ROOM_REVIEWS: '/dashboard/room-reviews',
    ROOM_WISHLIST: '/dashboard/room-wishlist',
    TOUR_BOOKINGS: '/dashboard/tour-bookings',
    /** Chi tiết 1 đơn tour (theo mã) */
    TOUR_BOOKINGS_DETAIL: '/dashboard/tour-bookings/:code',
    TOUR_INVOICES: '/dashboard/tour-invoices',
    TOUR_REVIEWS: '/dashboard/tour-reviews',
    TOUR_WISHLIST: '/dashboard/tour-wishlist',
    TOUR_GUIDE_REGISTER: '/dashboard/tour-guide/register',
  },
  /** Pages (Header dropdown) */
  ABOUT_US: '/about-us',
  CONTACT: '/contact',
  OUR_SERVICES: '/our-services',
  TEAM: '/team',
  GALLERY: '/gallery',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD_REQUEST: '/forgot-password',
  FORGOT_PASSWORD_CONFIRM: '/forgot-password/confirm',
  BOOKING_PAYMENT: '/bookings/:id/payment',
  BOOKING_PAYMENT_RESULT: '/payment-result',
  /** Tour: thanh toán đơn tour (Stripe) */
  TOUR_BOOKING_PAYMENT: '/tour-bookings/:id/payment',
  TOUR_PAYMENT_RESULT: '/tour-payment-result',
};
