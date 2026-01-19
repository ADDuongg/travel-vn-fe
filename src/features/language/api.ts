import api from '@/lib/axios';
import type { Language } from '@interface/commons';

export function getLanguages() {
  return api.get<Language[]>('/api/v1/languages');
}
