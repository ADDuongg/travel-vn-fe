import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi'],
    nonExplicitSupportedLngs: true,

    defaultNS: 'translation',
    /** Load with translation so notification keys resolve (nested paths use keySeparator). */
    ns: ['translation', 'notification'],

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    const lng = i18n.language;

    if (lng.includes('-')) {
      const base = lng.split('-')[0];
      i18n.changeLanguage(base);
    }
  });

export default i18n;
