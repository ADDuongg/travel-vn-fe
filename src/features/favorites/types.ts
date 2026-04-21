export const FavoriteEntityType = {
  TOUR: 'TOUR',
  ROOM: 'ROOM',
  HOTEL: 'HOTEL',
  GUIDE: 'GUIDE',
} as const;

export type FavoriteEntityType =
  (typeof FavoriteEntityType)[keyof typeof FavoriteEntityType];

export type FavoriteEntitySummary = {
  id: string;
  type: FavoriteEntityType;
  slug?: string;
  name: string;
  thumbnailUrl: string;
  ratingSummary?: { average: number; total: number };
};

export type FavoriteRecord = {
  _id: string;
  userId: string;
  entityType: FavoriteEntityType;
  entityId: string;
  createdAt: string;
  updatedAt: string;
  entitySummary: FavoriteEntitySummary;
};

export type MyFavoritesListParams = {
  entityType?: FavoriteEntityType;
  page?: number;
  limit?: number;
  lang?: string;
};

export type MyFavoritesListPayload = {
  data: FavoriteRecord[];
  pagination: { page: number; limit: number; total: number };
};

