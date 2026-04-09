import api from '@/lib/axios';
import * as I from '@/types/commons';

export function getLanguages() {
  return api.get<I.Language[]>('/api/v1/languages');
}
