import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { countryFlags } from '@/constants/commons';
import WorldFlag from 'react-world-flags';
export const DropdownLanguage = () => {
  const [language, setLanguage] = useState('vi');
  const { i18n } = useTranslation();
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
  };
  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto flex items-center bg-white">
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
            <span>{countryFlags[key as keyof typeof countryFlags].label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
