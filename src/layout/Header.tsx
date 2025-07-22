import React, { useEffect, useState } from 'react';
import { HeaderItem } from '@/constants/commons';
import { DropdownLanguage } from '@components/DropdownLanguage';
import { Button } from '@components/ui/button';
import useMediaQuery from '@hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import DrawerHeader from './DrawerHeader';
import logox1 from '/images/logox1.png';

const HeaderList = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery('(max-width: 900px)');
  return (
    <>
      {!isMediumScreen && (
        <nav>
          <ul className="flex space-x-6 px-4 py-3 text-sm font-medium">
            {HeaderItem.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.name} className="relative group">
                  <Link
                    to={item.path || ''}
                    className={`hover:text-black transition-colors ${
                      isActive ? 'text-black font-bold' : 'text-paleGray'
                    }`}
                  >
                    {t(item.label)} {/* Sử dụng i18next để dịch */}
                  </Link>

                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 w-full h-2 z-20 flex justify-center">
                    <div
                      className={`w-2 h-2 bg-transparent group-hover:bg-gray-400 rounded-full transition-all`}
                    ></div>
                  </div>

                  {item.children && (
                    <ul className="absolute top-full left-0 mt-4 w-40 bg-white shadow-lg rounded-sm opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            to={child.path || ''}
                            className={`block px-4 py-2 text-gray-700 hover:text-black ${
                              isActive
                                ? 'text-black font-bold'
                                : 'text-paleGray'
                            }`}
                          >
                            {t(child.label)} {/* Sử dụng i18next để dịch */}
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
      )}
    </>
  );
};

const Header = () => {
  const isMediumScreen = useMediaQuery('(max-width: 900px)');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 156);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`w-full h-auto bg-background_paleGray flex items-center justify-between md:px-10 px-5 fixed top-0 left-0 z-50 ${
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
      <img src={logox1} alt="logox1" className="h-full" />
      <HeaderList />
      {isMediumScreen && <DrawerHeader />}
      {!isMediumScreen && (
        <div className="flex gap-2">
          <DropdownLanguage />
          <Button>Login</Button>
        </div>
      )}
    </div>
  );
};

export default Header;
