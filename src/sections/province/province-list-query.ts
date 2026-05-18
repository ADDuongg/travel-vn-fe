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

export function isDefaultProvinceQuery(
  query: ProvinceListQuery,
  page: number,
): boolean {
  if (page !== 1) return false;
  return (
    query.search.trim() === '' &&
    query.region === defaultProvinceListQuery.region &&
    query.isPopular === defaultProvinceListQuery.isPopular &&
    query.sortBy === defaultProvinceListQuery.sortBy
  );
}

