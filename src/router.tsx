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
const TourSearchPage = Loadable(() => import('@/pages/tour/TourSearch'));
const RoomSearchPage = Loadable(() => import('@/pages/room/RoomSearch'));
const TourPage = Loadable(() => import('@/pages/tour/Tour'));
const TourDetailPage = Loadable(() => import('@/pages/tour/TourDetail'));
const RoomDetailPage = Loadable(() => import('@/pages/room/RoomDetail'));
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
const RoomBookingPage = Loadable(
  () => import('@pages/dashboard/room/RoomBookingPage'),
);
const WishlistPage = Loadable(
  () => import('@pages/dashboard/tour/WishlistPage'),
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
        handle: { crumb: 'My Bookings' },
      },
      {
        path: ROUTES.DASHBOARD.ROOM_BOOKINGS,
        element: <RoomBookingPage />,
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
    path: ROUTES.TOUR.INDEX,
    element: <TourPage />,
  },
  {
    path: ROUTES.TOUR.SEARCH,
    element: <TourSearchPage />,
  },
  {
    path: ROUTES.TOUR.DETAIL,
    element: <TourDetailPage />,
  },
  {
    path: ROUTES.ROOM.DETAIL,
    element: <RoomDetailPage />,
  },
  {
    path: ROUTES.ROOM.SEARCH,
    element: <RoomSearchPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
];
