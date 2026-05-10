import type {
  Difficulty,
  TourQueryParams,
  TourSortBy,
  TourType,
} from '@/features/tours/types';

export const TOUR_LIST_PAGE_SIZE = 12;

const SORT_VALUES: TourSortBy[] = [
  'newest',
  'price_asc',
  'price_desc',
  'duration_asc',
  'duration_desc',
  'rating',
];

const TOUR_TYPES: TourType[] = ['DOMESTIC', 'INTERNATIONAL', 'DAILY'];

const DIFFICULTIES: Difficulty[] = [
  'EASY',
  'MODERATE',
  'CHALLENGING',
  'DIFFICULT',
];

function parsePositiveInt(raw: string | null): number | undefined {
  if (raw == null || raw === '') return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.floor(n);
}

/** Parse URL → full query used by `useToursQuery` (includes page + limit). */
export function parseTourListSearchParams(
  sp: URLSearchParams,
): TourQueryParams {
  const pageRaw = sp.get('page');
  const page = pageRaw != null ? Math.max(1, Number(pageRaw) || 1) : 1;

  const next: TourQueryParams = {
    page,
    limit: TOUR_LIST_PAGE_SIZE,
    sortBy: 'newest',
  };

  const q = sp.get('q');
  if (q?.trim()) next.search = q.trim();

  const dest = sp.get('dest');
  if (dest) next.destinationId = dest;

  const dep = sp.get('dep');
  if (dep) next.departureProvinceId = dep;

  const type = sp.get('type');
  if (type && (TOUR_TYPES as string[]).includes(type)) {
    next.tourType = type as TourType;
  }

  const diff = sp.get('diff');
  if (diff && (DIFFICULTIES as string[]).includes(diff)) {
    next.difficulty = diff as Difficulty;
  }

  const sort = sp.get('sort');
  if (sort && (SORT_VALUES as string[]).includes(sort)) {
    next.sortBy = sort as TourSortBy;
  }

  const minP = parsePositiveInt(sp.get('minP'));
  if (minP != null) next.minPrice = minP;
  const maxP = parsePositiveInt(sp.get('maxP'));
  if (maxP != null) next.maxPrice = maxP;
  const minD = parsePositiveInt(sp.get('minD'));
  if (minD != null) next.minDays = minD;
  const maxD = parsePositiveInt(sp.get('maxD'));
  if (maxD != null) next.maxDays = maxD;

  return next;
}

/** Serialize tour query to shareable URL (short keys; omit defaults). */
export function serializeTourListSearchParams(params: TourQueryParams): URLSearchParams {
  const next = new URLSearchParams();
  const page = params.page ?? 1;
  if (page > 1) next.set('page', String(page));

  if (params.search?.trim()) next.set('q', params.search.trim());
  if (params.destinationId) next.set('dest', params.destinationId);
  if (params.departureProvinceId) next.set('dep', params.departureProvinceId);
  if (params.tourType) next.set('type', params.tourType);
  if (params.difficulty) next.set('diff', params.difficulty);
  if (params.sortBy && params.sortBy !== 'newest') next.set('sort', params.sortBy);

  if (params.minPrice != null && params.minPrice > 0) {
    next.set('minP', String(params.minPrice));
  }
  if (params.maxPrice != null && params.maxPrice > 0) {
    next.set('maxP', String(params.maxPrice));
  }
  if (params.minDays != null && params.minDays > 0) {
    next.set('minD', String(params.minDays));
  }
  if (params.maxDays != null && params.maxDays > 0) {
    next.set('maxD', String(params.maxDays));
  }

  return next;
}

export function defaultTourListQueryParams(): TourQueryParams {
  return {
    page: 1,
    limit: TOUR_LIST_PAGE_SIZE,
    sortBy: 'newest',
  };
}
