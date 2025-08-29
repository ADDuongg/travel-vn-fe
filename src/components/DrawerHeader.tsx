import React, { useState } from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader as DrawerHeaderPrimitive,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { AiOutlineBars } from 'react-icons/ai';
import { FiChevronRight } from 'react-icons/fi';

import { Link, useNavigate } from 'react-router-dom';
import { countryFlags, HeaderItem } from '@/constants/commons';
import WorldFlag from 'react-world-flags';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/ui/button';
import { ROUTES } from '@/constants/router';

const DrawerHeader = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [language, setLanguage] = useState('vi');
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
  };
  const toggleSubmenu = (name: string) => {
    setOpenItem(openItem === name ? null : name);
  };
  return (
    <Drawer>
      <DrawerTrigger>
        <AiOutlineBars className="cursor-pointer" size={24} />
      </DrawerTrigger>
      <DrawerContent data-vaul-drawer-direction={'right'}>
        <DrawerHeaderPrimitive>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Choose your options</DrawerDescription>
        </DrawerHeaderPrimitive>

        <div className="space-y-4 p-4">
          {HeaderItem.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.name}>
                <Link
                  to={item.path || ''}
                  className={`flex items-center justify-between text-sm hover:text-black font-semibold ${
                    isActive ? 'text-black font-bold' : 'text-paleGray'
                  }`}
                  onClick={(e) => {
                    if (item.children) {
                      e.preventDefault();
                      toggleSubmenu(item.name);
                    }
                  }}
                >
                  <span>{t(item.label)}</span>

                  {item.children && (
                    <FiChevronRight
                      className={`ml-2 transition-transform duration-200 ${
                        openItem === item.name ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </Link>

                {item.children && openItem === item.name && (
                  <ul className="mt-2 space-y-2 pl-4">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          to={child.path || ''}
                          className="block text-sm text-gray-600 hover:text-black"
                        >
                          {t(child.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          <div className="flex gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-auto flex items-center">
                <WorldFlag
                  code={countryFlags[language]?.code}
                  alt={countryFlags[language]?.label}
                  className="w-5 h-5 rounded-full"
                />
              </SelectTrigger>
              <SelectContent className="w-full">
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
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={() => navigate(ROUTES.LOGIN)}>
            {t('buttons.login')}
          </Button>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              {t('buttons.cancel')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerHeader;
