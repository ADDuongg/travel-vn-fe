import { Navigate } from 'react-router-dom';
import { Loadable } from './lib';
import { ROUTES } from './constants/router';
import type { RouteConfig } from './interface/commons';
import DashboardLayout from './layout/DashboardLayout';

const HomePage = Loadable(() => import('@/pages/home/Home'));
const LoginPage = Loadable(() => import('@/pages/auth/login/Login'));
const DestinationSearchPage = Loadable(
  () => import('@/pages/destination/DestinationSearch'),
);
const RegisterPage = Loadable(() => import('@/pages/auth/register/Register'));
const TourPage = Loadable(() => import('@/pages/tour/Tour'));
const TourDetailPage = Loadable(() => import('@/pages/tour/TourDetail'));
const RoomDetailPage = Loadable(() => import('@/pages/room/RoomDetail'));
const ListLayout = Loadable(() => import('@/layout/ListLayout'));
const RoomListPage = Loadable(() => import('@/pages/list/RoomListPage'));
const HotelListPage = Loadable(() => import('@/pages/list/HotelListPage'));
const HotelDetailPage = Loadable(() => import('@/pages/hotel/HotelDetail'));
const DashboardOverviewPage = Loadable(
  () => import('@pages/dashboard/my_account/DashboardOverviewPage'),
);
const ProfilePage = Loadable(
  () => import('@pages/dashboard/my_account/ProfilePage'),
);
const ChangePasswordPage = Loadable(
  () => import('@pages/dashboard/my_account/ChangePassword'),
);
const TourBookingPage = Loadable(
  () => import('@pages/dashboard/tour/TourBookingPage'),
);
const TourBookingDetailPage = Loadable(
  () => import('@pages/dashboard/tour/TourBookingDetailPage'),
);
const TourBookingLookupPage = Loadable(
  () => import('@pages/tour/TourBookingLookup'),
);
const RoomBookingPage = Loadable(
  () => import('@pages/dashboard/room/RoomBookingPage'),
);
const WishlistPage = Loadable(
  () => import('@pages/dashboard/tour/WishlistPage'),
);

const RoomBookingPaymentPage = Loadable(
  () => import('@pages/payment/RoomBookingPaymentPage'),
);

const PaymentResultPage = Loadable(
  () => import('@pages/payment/PaymentResult'),
);

const TourBookingPaymentPage = Loadable(
  () => import('@pages/payment/TourBookingPaymentPage'),
);

const TourPaymentResultPage = Loadable(
  () => import('@pages/payment/TourPaymentResult'),
);

const MyBookingDetailPage = Loadable(
  () => import('@pages/dashboard/room/RoomBookingDetail'),
);
const AboutUsPage = Loadable(() => import('@/pages/about/AboutUs'));
const ContactPage = Loadable(() => import('@/pages/contact/Contact'));
const OurServicesPage = Loadable(() => import('@/pages/our-services/OurServices'));
const TeamPage = Loadable(() => import('@/pages/team/Team'));
const GalleryPage = Loadable(() => import('@/pages/gallery/Gallery'));
const FoodDetailPage = Loadable(() => import('@/pages/food/FoodDetail'));
const TourGuideListPage = Loadable(
  () => import('@/pages/tour-guide/TourGuideListPage'),
);
const TourGuideDetailPage = Loadable(
  () => import('@/pages/tour-guide/TourGuideDetailPage'),
);

export const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.DASHBOARD.INDEX,
    element: <DashboardLayout />,
    handle: { crumb: 'Dashboard' },
    children: [
      {
        path: ROUTES.DASHBOARD.INDEX,
        element: <DashboardOverviewPage />,
        // handle: { crumb: 'Overview' },
      },
      {
        path: ROUTES.DASHBOARD.PROFILE,
        element: <ProfilePage />,
        handle: { crumb: 'Edit Profile' },
      },
      {
        path: ROUTES.DASHBOARD.CHANGE_PASSWORD,
        element: <ChangePasswordPage />,
        handle: { crumb: 'Change Password' },
      },
      {
        path: ROUTES.DASHBOARD.TOUR_BOOKINGS,
        element: <TourBookingPage />,
        handle: { crumb: 'My Tour Bookings' },
      },
      {
        path: ROUTES.DASHBOARD.TOUR_BOOKINGS_DETAIL,
        element: <TourBookingDetailPage />,
        handle: { crumb: 'Tour Booking Detail' },
      },
      {
        path: ROUTES.DASHBOARD.ROOM_BOOKINGS,
        element: <RoomBookingPage />,
        handle: { crumb: 'My Bookings' },
      },
      {
        path: ROUTES.DASHBOARD.ROOM_BOOKINGS_DETAIL,
        element: <MyBookingDetailPage />,
        handle: { crumb: 'My Bookings' },
      },
      {
        path: ROUTES.DASHBOARD.WISHLIST,
        element: <WishlistPage />,
        handle: { crumb: 'Wish List' },
      },
      // ví dụ route động:
      {
        path: 'bookings/:id',
        element: <div>Booking</div>,
        handle: { crumb: (m) => `Booking #${m.params.id}` },
      },
    ],
  },
  {
    path: ROUTES.DESTINATION.SEARCH,
    element: <DestinationSearchPage />,
  },
  {
    path: ROUTES.LIST,
    element: <ListLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.LIST_ROOMS} replace />,
      },
      {
        path: 'rooms',
        element: <RoomListPage />,
      },
      {
        path: 'hotels',
        element: <HotelListPage />,
      },
    ],
  },
  {
    path: ROUTES.TOUR.SEARCH,
    element: <Navigate to={ROUTES.LIST_ROOMS} replace />,
  },
  {
    path: ROUTES.ROOM.SEARCH,
    element: <Navigate to={ROUTES.LIST_ROOMS} replace />,
  },
  {
    path: ROUTES.TOUR.INDEX,
    element: <TourPage />,
  },
  {
    path: ROUTES.TOUR.DETAIL,
    element: <TourDetailPage />,
  },
  {
    path: ROUTES.TOUR.BOOKING_LOOKUP,
    element: <TourBookingLookupPage />,
  },
  {
    path: ROUTES.ROOM.INDEX,
    element: <Navigate to={ROUTES.LIST_ROOMS} replace />,
  },
  {
    path: ROUTES.ROOM.DETAIL,
    element: <RoomDetailPage />,
  },
  {
    path: ROUTES.HOTEL.DETAIL,
    element: <HotelDetailPage />,
  },
  {
    path: ROUTES.HOTEL.INDEX,
    element: <Navigate to={ROUTES.LIST_HOTELS} replace />,
  },
  {
    path: ROUTES.ABOUT_US,
    element: <AboutUsPage />,
  },
  {
    path: ROUTES.CONTACT,
    element: <ContactPage />,
  },
  {
    path: ROUTES.OUR_SERVICES,
    element: <OurServicesPage />,
  },
  {
    path: ROUTES.TEAM,
    element: <TeamPage />,
  },
  {
    path: ROUTES.GALLERY,
    element: <GalleryPage />,
  },
  {
    path: ROUTES.FOOD.DETAIL,
    element: <FoodDetailPage />,
  },
  {
    path: ROUTES.TOUR_GUIDE.INDEX,
    element: <TourGuideListPage />,
  },
  {
    path: ROUTES.TOUR_GUIDE.DETAIL,
    element: <TourGuideDetailPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.BOOKING_PAYMENT,
    element: <RoomBookingPaymentPage />,
  },
  {
    path: ROUTES.BOOKING_PAYMENT_RESULT,
    element: <PaymentResultPage />,
  },
  {
    path: ROUTES.TOUR_BOOKING_PAYMENT,
    element: <TourBookingPaymentPage />,
  },
  {
    path: ROUTES.TOUR_PAYMENT_RESULT,
    element: <TourPaymentResultPage />,
  },
];
