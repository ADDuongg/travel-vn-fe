import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logox1 from '/images/logox1.png';
import { Button } from '@components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { HeaderItem } from '@/constants/commons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import WorldFlag from 'react-world-flags';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
// Định nghĩa kiểu cho countryFlags để TypeScript hiểu rõ hơn
type CountryFlag = {
  label: string;
  code: string;
};

const countryFlags: { [key: string]: CountryFlag } = {
  vi: { label: 'VI', code: 'VN' },
  en: { label: 'ENG', code: 'US' },
};

const HeaderList = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="bg-white">
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
                          isActive ? 'text-black font-bold' : 'text-paleGray'
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
  );
};

const Header = () => {
  const [language, setLanguage] = useState('vi');
  const { i18n } = useTranslation();
  const [openItem, setOpenItem] = useState<string | null>(null); // State lưu item đang mở

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value); // Thay đổi ngôn ngữ
  };

  // Hàm toggle submenu trong drawer
  const toggleSubmenu = (name: string) => {
    setOpenItem(openItem === name ? null : name); // Toggle giữa mở và đóng submenu
  };

  return (
    <div className="w-full h-16 bg-white flex items-center justify-between px-10">
      <img src={logox1} alt="logox1" />

      {/* Drawer */}
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent data-vaul-drawer-direction={'right'}>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>Choose your options</DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 p-4">
            {HeaderItem.map((item) => (
              <div key={item.name}>
                {/* Click vào item để mở submenu nếu có */}
                <Link
                  to={item.path || ''}
                  className="block text-sm text-gray-700 hover:text-black font-semibold"
                  onClick={(e) => {
                    // Nếu item có children thì mở submenu
                    if (item.children) {
                      e.preventDefault(); // Ngăn link chuyển hướng khi click
                      toggleSubmenu(item.name); // Toggle mở submenu
                    }
                  }}
                >
                  {item.label}
                </Link>

                {/* Hiển thị submenu nếu có children và item đang mở */}
                {item.children && openItem === item.name && (
                  <ul className="mt-2 space-y-2 pl-4">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          to={child.path || ''}
                          className="block text-sm text-gray-600 hover:text-black"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Select Language */}
      <div className="flex gap-2">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-auto flex items-center">
            <WorldFlag
              code={countryFlags[language]?.code}
              alt={countryFlags[language]?.label}
              className="w-5 h-5 rounded-full"
            />
          </SelectTrigger>
          <SelectContent className="w-auto">
            {Object.keys(countryFlags).map((key) => (
              <SelectItem
                key={key}
                value={key}
                className="flex items-center space-x-2"
              >
                <WorldFlag
                  code={countryFlags[key as keyof typeof countryFlags].code}
                  alt={countryFlags[key as keyof typeof countryFlags].label}
                  className="w-5 h-5 rounded-full"
                />
                <span>
                  {countryFlags[key as keyof typeof countryFlags].label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button>Login</Button>
      </div>
    </div>
  );
};

export default Header;
