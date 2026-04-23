export type ProvinceRegion = 'ALL' | 'NORTH' | 'CENTRAL' | 'SOUTH';

export type ProvinceListQuery = {
  search: string;
  region: ProvinceRegion;
  isPopular: 'all' | 'true' | 'false';
  sortBy: 'name' | 'displayOrder' | 'newest';
};

export const defaultProvinceListQuery: ProvinceListQuery = {
  search: '',
  region: 'ALL',
  isPopular: 'all',
  sortBy: 'name',
};
