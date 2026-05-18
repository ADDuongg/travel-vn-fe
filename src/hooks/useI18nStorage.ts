import { useLocalStorage } from 'usehooks-ts';

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

