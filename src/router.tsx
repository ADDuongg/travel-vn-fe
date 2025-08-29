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
  () => import('@/pages/dashboard/DashboardOverviewPage'),
);
const ProfilePage = Loadable(() => import('@/pages/dashboard/ProfilePage'));

export const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.DASHBOARD.INDEX,
    element: <DashboardLayout />,
    children: [
      { path: ROUTES.DASHBOARD.INDEX, element: <DashboardOverviewPage /> },
      { path: 'profile', element: <ProfilePage /> },
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
