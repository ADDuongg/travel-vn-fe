import { HeaderItem } from '@/constants/commons';
import { ROUTES } from '@/constants/router';
import { useLogout, useMe } from '@/features/auth/hooks';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useInfiniteNotificationsList,
  useUnreadNotificationCount,
} from '@/features/notifications/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { DropdownLanguage } from '@components/DropdownLanguage';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import useMediaQuery from '@hooks/useMediaQuery';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DrawerHeader from '../components/DrawerHeader';
import logox1 from '/images/logox1.png';

import type { NotificationItem } from '@/features/notifications/types';

/** Values from API metadata for i18n interpolation (e.g. {{tourName}}). */
function notificationInterpolation(
  metadata: NotificationItem['metadata'],
): Record<string, string | number> {
  if (!metadata || typeof metadata !== 'object') return {};
  return Object.fromEntries(
    Object.entries(metadata).filter(
      ([, v]) => typeof v === 'string' || typeof v === 'number',
    ),
  ) as Record<string, string | number>;
}

const HeaderList = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery('(max-width: 900px)');

  if (isMediumScreen) return null;

  return (
    <nav>
      <ul className="flex space-x-6 px-4 py-3 text-sm font-medium">
        {HeaderItem.map((item) => {
          const isActive = item.path
            ? location.pathname === item.path
            : !!item.children?.some(
                (c) => c.path && location.pathname === c.path,
              );

          return (
            <li
              key={item.name}
              className={`relative group ${item.children ? 'pb-4' : ''}`}
            >
              {item.children ? (
                <span
                  className={`hover:text-black transition-colors ${
                    isActive ? 'text-black font-bold' : 'text-paleGray'
                  } cursor-default`}
                >
                  {t(item.label)}
                </span>
              ) : (
                <Link
                  to={item.path || ''}
                  className={`hover:text-black transition-colors ${
                    isActive ? 'text-black font-bold' : 'text-paleGray'
                  }`}
                >
                  {t(item.label)}
                </Link>
              )}

              {/* <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 w-full h-2 z-50 flex justify-center">
                <div className="w-2 h-2 bg-transparent group-hover:bg-gray-400 rounded-full transition-all"></div>
              </div> */}

              {item.children && (
                <ul className="absolute top-full left-0  w-40 bg-white shadow-lg rounded-sm opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                  {item.children.map((child) => (
                    <li key={child.name}>
                      <Link
                        to={child.path || ''}
                        className={`block px-4 py-2 text-gray-700 hover:text-black ${
                          child.path && location.pathname === child.path
                            ? 'text-black font-bold'
                            : 'text-paleGray'
                        }`}
                      >
                        {t(child.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const UserMenu = ({
  userName,
  avatarUrl,
}: {
  userName: string;
  avatarUrl?: string;
}) => {
  const { t } = useTranslation();
  const { logout } = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative cursor-pointer">
      <div
        className="flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <img
          src={avatarUrl || 'https://picsum.photos/400/250?random=6'}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium hidden md:inline">{userName}</span>
      </div>

      <div
        className={`
          absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md
          transition-opacity duration-200 z-20
          ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <Link
          to={ROUTES.DASHBOARD.INDEX}
          className="block px-4 py-2 hover:bg-gray-100 text-sm text-paleGray"
          onClick={() => setOpen(false)}
        >
          {t('header.dashboard')}
        </Link>

        <Link
          to={ROUTES.DASHBOARD.PROFILE}
          className="block px-4 py-2 hover:bg-gray-100 text-sm text-paleGray"
          onClick={() => setOpen(false)}
        >
          {t('header.edit_profile')}
        </Link>

        <Link
          to={`${ROUTES.DASHBOARD.SAVED}?tab=wishlist`}
          className="block px-4 py-2 hover:bg-gray-100 text-sm text-paleGray"
          onClick={() => setOpen(false)}
        >
          {t('header.wish_list')}
        </Link>

        <Separator className="my-1" />

        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-paleGray"
          onClick={() => {
            setOpen(false);
            logout();
          }}
        >
          {t('buttons.sign_out')}
        </button>
      </div>
    </div>
  );
};

const NotificationBell = () => {
  const { authUser } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useUnreadNotificationCount(true);
  const unreadCount = unreadData?.count ?? 0;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteNotificationsList(5, open);

  const notifications = data?.pages.flatMap((page) => page.items) ?? [];

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkAllPending } =
    useMarkAllNotificationsAsRead();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!authUser) return null;

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id, {
      onSuccess: () => {
        if (link) {
          const target =
            link === '/guide/my-profile'
              ? ROUTES.DASHBOARD.TOUR_GUIDE_REGISTER
              : link;
          navigate(target);
        }
      },
    });
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    if (!notifications.length) return;
    markAllAsRead();
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < 40) {
      fetchNextPage();
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        aria-label={t('header.notifications') || 'Notifications'}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <div
        className={`absolute right-0 mt-2 w-80 max-w-[320px] rounded-md bg-white shadow-lg transition-opacity duration-200 z-30 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <span className="text-sm font-semibold">
            {t('header.notifications_title', 'Thông báo')}
          </span>
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isMarkAllPending || !notifications.length}
            className="text-xs text-blue-600 hover:underline disabled:text-gray-300"
          >
            {t('header.mark_all_read', 'Đánh dấu đã đọc')}
          </button>
        </div>

        <div
          ref={scrollRef}
          className="max-h-80 overflow-y-auto"
          onScroll={handleScroll}
        >
          {isLoading && (
            <div className="px-4 py-4 text-center text-xs text-gray-400">
              {t('header.loading_notifications')}
            </div>
          )}

          {!isLoading && !notifications.length && (
            <div className="px-4 py-6 text-center text-xs text-gray-400">
              {t('header.no_notifications')}
            </div>
          )}

          {!!notifications.length && (
            <>
              <ul className="divide-y divide-gray-100">
                {notifications.map((item) => (
                  <li
                    key={item._id}
                    className={`px-4 py-3 text-xs cursor-pointer hover:bg-gray-50 ${
                      !item.isRead ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(item._id, item.link)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {t(item.title, {
                            ns: 'notification',
                            ...notificationInterpolation(item.metadata),
                          })}
                        </p>
                        <p className="mt-1 text-gray-500 line-clamp-2">
                          {t(item.message, {
                            ns: 'notification',
                            ...notificationInterpolation(item.metadata),
                          })}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {item.createdAt
                            ? formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                              })
                            : t('header.just_now')}
                        </p>
                      </div>
                      {!item.isRead && (
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {hasNextPage && (
                <div className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="text-[11px] text-blue-600 hover:underline disabled:text-gray-300"
                  >
                    {isFetchingNextPage
                      ? t('header.loading_notifications')
                      : t('header.load_more')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const isMediumScreen = useMediaQuery('(max-width: 900px)');
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: me } = useMe();
  const { authUser } = useAuthStore();

  const displayName = me?.fullName || authUser?.username || 'User';
  const avatarUrl = me?.avatar?.url;

  return (
    <div
      className={`w-full h-[136px] bg-background_paleGray flex items-center justify-between md:px-10 px-5 fixed top-0 left-0 z-50 ${
        isScrolled ? 'shadow-lg backdrop-blur-md' : ''
      }`}
      style={{
        transition: 'filter 0.3s, box-shadow 0.3s, padding 0.3s',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        willChange: 'filter, box-shadow, padding',
        background: 'rgba(245, 245, 245, 0.95)',
        paddingTop: isScrolled ? '12px' : '56px',
        paddingBottom: isScrolled ? '12px' : '56px',
      }}
    >
      <img src={logox1} alt="logox1" className="h-[20px]" />

      {/* Desktop */}
      {!isMediumScreen && (
        <>
          <HeaderList />
          <div className="flex gap-3 items-center">
            <NotificationBell />
            <DropdownLanguage />
            {!authUser ? (
              <Button onClick={() => navigate(ROUTES.LOGIN)}>
                {t('buttons.login')}
              </Button>
            ) : (
              <UserMenu userName={displayName} avatarUrl={avatarUrl} />
            )}
          </div>
        </>
      )}

      {/* Mobile */}
      {isMediumScreen && (
        <div className="flex items-center gap-3">
          <DrawerHeader />
          {!authUser ? (
            <Button onClick={() => navigate(ROUTES.LOGIN)}>
              {t('buttons.login')}
            </Button>
          ) : (
            <>
              <NotificationBell />
              <UserMenu userName={displayName} avatarUrl={avatarUrl} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
