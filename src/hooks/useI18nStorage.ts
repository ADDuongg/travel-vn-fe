import { useLocalStorage } from 'usehooks-ts';

/**
 * useLocalStorage wrapper for i18nextLng.
 * i18next may store plain strings like "en" or "vi" (not JSON),
 * so we use a custom deserializer to avoid JSON.parse errors.
 */
export function useI18nStorage(defaultValue: string) {
  return useLocalStorage('i18nextLng', defaultValue, {
    deserializer: (value: string) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
  });
}
