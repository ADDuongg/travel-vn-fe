import { Navigate } from 'react-router-dom';
import { Loadable } from './lib';
import { ROUTES } from './constants/router';
import type { RouteConfig } from './types/commons';
import DashboardLayout from './layout/DashboardLayout';

const HomePage = Loadable(() => import('@/pages/home/Home'));
const LoginPage = Loadable(() => import('@/pages/auth/login/Login'));
const ForgotPasswordRequestPage = Loadable(
  () => import('@/pages/auth/forgot-password/ForgotPasswordRequest'),
);
const ForgotPasswordConfirmPage = Loadable(
  () => import('@/pages/auth/forgot-password/ForgotPasswordConfirm'),
);
const DestinationSearchPage = Loadable(
  () => import('@/pages/destination/DestinationSearch'),
);
const RegisterPage = Loadable(() => import('@/pages/auth/register/Register'));
const TourPage = Loadable(() => import('@/pages/tour/TourList'));
const TourDetailPage = Loadable(() => import('@/pages/tour/TourDetail'));
const RoomDetailPage = Loadable(() => import('@/pages/room/RoomDetail'));
const RoomListStandalonePage = Loadable(() => import('@/pages/room/RoomList'));
const ListLayout = Loadable(() => import('@/layout/ListLayout'));
const HotelListPage = Loadable(() => import('@/pages/hotel/HotelList'));
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
const TourGuideRegisterPage = Loadable(
  () => import('@pages/dashboard/tour-guide/TourGuideRegisterPage'),
);
const TourBookingLookupPage = Loadable(
  () => import('@pages/tour/TourBookingLookup'),
);
const RoomBookingPage = Loadable(
  () => import('@pages/dashboard/room/RoomBookingPage'),
);
const DashboardSavedPage = Loadable(
  () => import('@pages/dashboard/saved/DashboardSavedPage'),
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
const TourGuideListPage = Loadable(() => import('@/pages/tour-guide/TourGuideList'));
const TourGuideDetailPage = Loadable(
  () => import('@/pages/tour-guide/TourGuideDetail'),
);
const ProvinceListPage = Loadable(
  () => import('@/pages/province/ProvinceListPage'),
);
const ProvinceDetailPage = Loadable(
  () => import('@/pages/province/ProvinceDetailPage'),
);
const BlogListPage = Loadable(() => import('@/pages/blog/BlogListPage'));
const BlogDetailPage = Loadable(() => import('@/pages/blog/BlogDetailPage'));
const BlogCategoryPage = Loadable(() => import('@/pages/blog/BlogCategoryPage'));
const BlogTagPage = Loadable(() => import('@/pages/blog/BlogTagPage'));

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
        path: ROUTES.DASHBOARD.TOUR_GUIDE_REGISTER,
        element: <TourGuideRegisterPage />,
        handle: { crumb: 'Tour Guide Profile' },
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
        path: ROUTES.DASHBOARD.SAVED,
        element: <DashboardSavedPage />,
        handle: { crumb: 'Reviews & wishlist' },
      },
      {
        path: ROUTES.DASHBOARD.WISHLIST,
        element: (
          <Navigate
            to={`${ROUTES.DASHBOARD.SAVED}?tab=wishlist`}
            replace
          />
        ),
      },
      {
        path: ROUTES.DASHBOARD.REVIEWS,
        element: <Navigate to={ROUTES.DASHBOARD.SAVED} replace />,
      },
      {
        path: ROUTES.DASHBOARD.ROOM_REVIEWS,
        element: <Navigate to={ROUTES.DASHBOARD.SAVED} replace />,
      },
      {
        path: ROUTES.DASHBOARD.TOUR_REVIEWS,
        element: <Navigate to={ROUTES.DASHBOARD.SAVED} replace />,
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
        element: <Navigate to={ROUTES.ROOM.INDEX} replace />,
      },
    ],
  },
  {
    path: ROUTES.LIST_HOTELS,
    element: <HotelListPage />,
  },
  {
    path: ROUTES.TOUR.SEARCH,
    element: <Navigate to={ROUTES.TOUR.INDEX} replace />,
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
    element: <RoomListStandalonePage />,
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
    path: ROUTES.PROVINCE.INDEX,
    element: <ProvinceListPage />,
  },
  {
    path: ROUTES.PROVINCE.DETAIL,
    element: <ProvinceDetailPage />,
  },
  {
    path: ROUTES.BLOG.INDEX,
    element: <BlogListPage />,
  },
  {
    path: ROUTES.BLOG.DETAIL,
    element: <BlogDetailPage />,
  },
  {
    path: ROUTES.BLOG.CATEGORY,
    element: <BlogCategoryPage />,
  },
  {
    path: ROUTES.BLOG.TAG,
    element: <BlogTagPage />,
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
    path: ROUTES.FORGOT_PASSWORD_REQUEST,
    element: <ForgotPasswordRequestPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD_CONFIRM,
    element: <ForgotPasswordConfirmPage />,
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
