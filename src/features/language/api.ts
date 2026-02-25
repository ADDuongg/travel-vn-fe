import api from '@/lib/axios';
import * as I from '@/interface/commons';

export function getLanguages() {
  return api.get<I.Language[]>('/api/v1/languages');
}
