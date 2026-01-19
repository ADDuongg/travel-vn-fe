import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { useGetLanguagesQuery } from '@/features/language/hooks';

export const DropdownLanguage = () => {
  const { language, changeLanguage } = useLanguage();
  const { data: languages = [], isLoading } = useGetLanguagesQuery();

  const currentLang = languages.find((l) => l.code === language);
  console.log('languages', languages);

  if (isLoading) return null;

  return (
    <Select value={language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[5rem] flex items-center bg-white">
        {currentLang?.flagUrl ? (
          <img
            src={currentLang.flagUrl}
            alt={currentLang.name}
            className="w-5 h-5 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm uppercase">{language}</span>
        )}
      </SelectTrigger>

      <SelectContent className="w-auto">
        {languages
          .filter((l) => l.isActive)
          .map((lang, idx) => (
            <SelectItem
              key={idx}
              value={lang.code}
              className="flex items-center gap-2"
            >
              {lang.flagUrl && (
                <img
                  src={lang.flagUrl}
                  alt={lang.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              )}
              <span>{lang.name}</span>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
