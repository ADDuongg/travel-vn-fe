import { HeaderItem } from '@/constants/commons';
import { ROUTES } from '@/constants/router';
import { useLogout } from '@/features/auth/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { DropdownLanguage } from '@components/DropdownLanguage';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import useMediaQuery from '@hooks/useMediaQuery';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DrawerHeader from '../components/DrawerHeader';
import logox1 from '/images/logox1.png';

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
                <ul className="absolute top-full left-0  w-40 bg-white shadow-lg rounded-sm opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-opacity duration-200 z-10">
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

const UserMenu = ({ userName }: { userName: string }) => {
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
          src="https://picsum.photos/400/250?random=6"
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
          to="/profile/edit"
          className="block px-4 py-2 hover:bg-gray-100 text-sm text-paleGray"
          onClick={() => setOpen(false)}
        >
          {t('header.edit_profile')}
        </Link>

        <Link
          to="/wishlist"
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

  // const { data: me } = useMe();
  const { authUser } = useAuthStore();

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
          <div className="flex gap-2 items-center">
            <DropdownLanguage />
            {!authUser ? (
              <Button onClick={() => navigate(ROUTES.LOGIN)}>
                {t('buttons.login')}
              </Button>
            ) : (
              <UserMenu userName={authUser?.username} />
            )}
          </div>
        </>
      )}

      {/* Mobile */}
      {isMediumScreen && (
        <div className="flex items-center gap-4">
          <DrawerHeader />
          {!authUser ? (
            <Button onClick={() => navigate(ROUTES.LOGIN)}>
              {t('buttons.login')}
            </Button>
          ) : (
            <UserMenu userName="nguyen duong" />
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
