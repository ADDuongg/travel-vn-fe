import { EnumLanguage } from '@/constants/commons';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export function useLanguage() {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useLocalStorage(
    'i18nextLng',
    EnumLanguage.DEFAULT,
  );

  useEffect(() => {
    const detected = i18n.resolvedLanguage || i18n.language;

    if (!language || language !== detected) {
      setLanguage(detected);
    }
  }, [i18n.resolvedLanguage]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return {
    language,
    changeLanguage,
  };
}
