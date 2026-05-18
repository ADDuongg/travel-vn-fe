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

import type { NotificationItem } from '@/features/notifications/types';

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
    <nav aria-label="Main">
      <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium lg:gap-x-6">
        {HeaderItem.map((item) => {
          const isActive = item.path
            ? location.pathname === item.path
            : !!item.children?.some(
                (c) => c.path && location.pathname === c.path,
              );

          return (
            <li
              key={item.name}
              className={`relative group ${item.children ? 'pb-1' : ''}`}
            >
              {item.children ? (
                <span
                  className={`cursor-default transition-colors hover:text-sunset-deep ${
                    isActive ? 'font-semibold text-forest' : 'text-charcoal/80'
                  }`}
                >
                  {t(item.label)}
                </span>
              ) : (
                <Link
                  to={item.path || ''}
                  className={`transition-colors hover:text-sunset-deep ${
                    isActive ? 'font-semibold text-forest' : 'text-charcoal/80'
                  }`}
                >
                  {t(item.label)}
                </Link>
              )}

              {item.children && (
                <ul className="pointer-events-none invisible absolute top-full left-0 z-50 w-44 rounded-xl border border-charcoal/10 bg-card/95 opacity-0 shadow-soft backdrop-blur-md transition-opacity duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <li key={child.name}>
                      <Link
                        to={child.path || ''}
                        className={`block px-4 py-2 text-sm transition-colors hover:text-sunset-deep ${
                          child.path && location.pathname === child.path
                            ? 'font-semibold text-forest'
                            : 'text-charcoal/80'
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
          absolute right-0 mt-2 w-44 rounded-xl border border-charcoal/10 bg-card shadow-soft
          transition-opacity duration-200 z-20
          ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <Link
          to={ROUTES.DASHBOARD.INDEX}
          className="block px-4 py-2 text-sm text-charcoal/80 transition-colors hover:bg-muted hover:text-charcoal first:rounded-t-xl"
          onClick={() => setOpen(false)}
        >
          {t('header.dashboard')}
        </Link>

        <Link
          to={ROUTES.DASHBOARD.PROFILE}
          className="block px-4 py-2 text-sm text-charcoal/80 transition-colors hover:bg-muted hover:text-charcoal"
          onClick={() => setOpen(false)}
        >
          {t('header.edit_profile')}
        </Link>

        <Link
          to={`${ROUTES.DASHBOARD.SAVED}?tab=wishlist`}
          className="block px-4 py-2 text-sm text-charcoal/80 transition-colors hover:bg-muted hover:text-charcoal"
          onClick={() => setOpen(false)}
        >
          {t('header.wish_list')}
        </Link>

        <Separator className="my-1" />

        <button
          type="button"
          className="block w-full rounded-b-xl px-4 py-2 text-left text-sm text-charcoal/80 transition-colors hover:bg-muted hover:text-charcoal"
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
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-sand-50/90 text-charcoal transition-colors hover:bg-sand-100"
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
        className={`absolute right-0 mt-2 z-30 w-80 max-w-[320px] rounded-xl border border-charcoal/10 bg-card shadow-soft transition-opacity duration-200 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex items-center justify-between border-b border-charcoal/10 px-4 py-2">
          <span className="text-sm font-semibold text-charcoal">
            {t('header.notifications_title', 'Thông báo')}
          </span>
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isMarkAllPending || !notifications.length}
            className="text-xs text-sunset-deep hover:underline disabled:text-charcoal/40"
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
            <div className="px-4 py-4 text-center text-xs text-mist">
              {t('header.loading_notifications')}
            </div>
          )}

          {!isLoading && !notifications.length && (
            <div className="px-4 py-6 text-center text-xs text-mist">
              {t('header.no_notifications')}
            </div>
          )}

          {!!notifications.length && (
            <>
              <ul className="divide-y divide-charcoal/10">
                {notifications.map((item) => (
                  <li
                    key={item._id}
                    className={`cursor-pointer px-4 py-3 text-xs transition-colors hover:bg-muted ${
                      !item.isRead ? 'bg-muted/60' : ''
                    }`}
                    onClick={() => handleNotificationClick(item._id, item.link)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-1 font-medium text-charcoal">
                          {t(item.title, {
                            ns: 'notification',
                            ...notificationInterpolation(item.metadata),
                          })}
                        </p>
                        <p className="mt-1 line-clamp-2 text-mist">
                          {t(item.message, {
                            ns: 'notification',
                            ...notificationInterpolation(item.metadata),
                          })}
                        </p>
                        <p className="mt-1 text-[10px] text-charcoal/45">
                          {item.createdAt
                            ? formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                              })
                            : t('header.just_now')}
                        </p>
                      </div>
                      {!item.isRead && (
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-sunset" />
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
                    className="text-[11px] text-sunset-deep hover:underline disabled:text-charcoal/40"
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: me } = useMe();
  const { authUser } = useAuthStore();

  const displayName = me?.fullName || authUser?.username || 'User';
  const avatarUrl = me?.avatar?.url;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-10 md:pt-8">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-soft glass-panel md:gap-6 md:px-5">
        <Link
          to={ROUTES.HOME}
          className="font-display shrink-0 text-xl tracking-[0.04em] text-charcoal md:text-2xl"
        >
          {t('editorial.brand')}
        </Link>

        {!isMediumScreen && (
          <div className="flex min-w-0 flex-1 items-center justify-center gap-4 lg:gap-6">
            <HeaderList />
            <span className="hidden rounded-full border border-charcoal/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-charcoal/50 2xl:inline">
              {t('footer.magazine_badge')}
            </span>
          </div>
        )}

        {!isMediumScreen && (
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <NotificationBell />
            <DropdownLanguage />
            {!authUser ? (
              <Button onClick={() => navigate(ROUTES.LOGIN)} size="sm" className="shrink-0">
                {t('buttons.login')}
              </Button>
            ) : (
              <UserMenu userName={displayName} avatarUrl={avatarUrl} />
            )}
          </div>
        )}

        {isMediumScreen && (
          <div className="ml-auto flex items-center gap-2">
            <DrawerHeader />
            {!authUser ? (
              <Button onClick={() => navigate(ROUTES.LOGIN)} size="sm">
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
    </header>
  );
};

export default Header;

