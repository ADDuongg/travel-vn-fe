export enum ReviewEntityType {
  ROOM = 'ROOM',
  HOTEL = 'HOTEL',
  TOUR = 'TOUR',
  BLOG = 'BLOG',
  GUIDE = 'GUIDE',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  HIDDEN = 'HIDDEN',
}

export interface Review {
  _id: string;

  entityType: ReviewEntityType;
  entityId: string;

  rating?: number;
  comment?: string;

  userId: string;
  isAnonymous: boolean;

  status: ReviewStatus;

  approvedAt?: string;
  approvedBy?: string;

  rejectedAt?: string;
  rejectedBy?: string;
  rejectReason?: string;

  hiddenAt?: string;
  hiddenBy?: string;
  hiddenReason?: string;

  deletedAt?: string | null;

  createdAt: string;
  updatedAt: string;

  user?: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export type UpdateReviewInput = {
  entityType: ReviewEntityType;
  entityId: string;

  rating?: number;
  comment?: string;

  isAnonymous?: boolean;
};

export type DeleteReviewInput = {
  id: string;
  entityType: ReviewEntityType;
  entityId: string;
};

/** Resolved title + thumbnail from backend (`entitySummary`) */
export interface EntitySummary {
  name: string;
  thumbnailUrl: string;
}

/** Item from GET /api/v1/reviews/me/list (lean + entitySummary) */
export interface MyReviewListItem extends Review {
  entitySummary?: EntitySummary;
}

export type MyReviewsListParams = {
  page?: number;
  limit?: number;
  entityType?: ReviewEntityType;
  /** CSV e.g. `PENDING,APPROVED` — omit for all non-deleted */
  status?: string;
  lang?: string;
};

/** Raw API body before mapping to ApiListResponse */
export type MyReviewsListPayload = {
  data: MyReviewListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

/** Table row: stable `id` for TanStack Table */
export type MyReviewTableRow = MyReviewListItem & { id: string };
