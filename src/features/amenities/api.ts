import api from '@/lib/axios';
import type { Amenity } from './types';

export function getAmenities() {
  return api.get<Amenity[]>('/api/v1/public/amenities');
}

