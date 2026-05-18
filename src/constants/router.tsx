export const ROUTES = {
  HOME: '/',

  LIST: '/list',
  LIST_ROOMS: '/list/rooms',
  LIST_HOTELS: '/list/hotels',
  LIST_FOODS: '/list/foods',
  LIST_SHOP: '/list/shop',
  DESTINATION: {
    INDEX: '/destination',
    SEARCH: '/destination/search',
  },

  PROVINCE: {
    INDEX: '/provinces',
    DETAIL: '/provinces/:slug',
  },
  BLOG: {
    INDEX: '/blog',
    DETAIL: '/blog/:slug',
    CATEGORY: '/blog/category/:slug',
    TAG: '/blog/tag/:slug',
  },
  TOUR: {
    INDEX: '/tour',
    SEARCH: '/tour/search',
    DETAIL: '/tour/:id',

    BOOKING_LOOKUP: '/tour/booking/lookup',
  },

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

    SAVED: '/dashboard/saved',
    WISHLIST: '/dashboard/wishlist',
    FAVORITES: '/dashboard/favorites',
    ROOM_BOOKINGS: '/dashboard/room-bookings',
    ROOM_BOOKINGS_DETAIL: '/dashboard/room-bookings/:id',
    ROOM_INVOICES: '/dashboard/room-invoices',
    ROOM_REVIEWS: '/dashboard/room-reviews',
    ROOM_WISHLIST: '/dashboard/room-wishlist',
    TOUR_BOOKINGS: '/dashboard/tour-bookings',

    TOUR_BOOKINGS_DETAIL: '/dashboard/tour-bookings/:code',
    TOUR_INVOICES: '/dashboard/tour-invoices',
    TOUR_REVIEWS: '/dashboard/tour-reviews',
    TOUR_WISHLIST: '/dashboard/tour-wishlist',
    TOUR_GUIDE_REGISTER: '/dashboard/tour-guide/register',
  },

  ABOUT_US: '/about-us',
  CONTACT: '/contact',
  OUR_SERVICES: '/our-services',
  TEAM: '/team',
  GALLERY: '/gallery',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD_REQUEST: '/forgot-password',
  FORGOT_PASSWORD_CONFIRM: '/forgot-password/confirm',
  BOOKING_PAYMENT: '/bookings/:id/payment',
  BOOKING_PAYMENT_RESULT: '/payment-result',

  TOUR_BOOKING_PAYMENT: '/tour-bookings/:id/payment',
  TOUR_PAYMENT_RESULT: '/tour-payment-result',
};

