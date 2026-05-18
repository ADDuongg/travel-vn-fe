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

export interface EntitySummary {
  name: string;
  thumbnailUrl: string;
  slug?: string;
}

export interface MyReviewListItem extends Review {
  entitySummary?: EntitySummary;
}

export type MyReviewsListParams = {
  page?: number;
  limit?: number;
  entityType?: ReviewEntityType;

  status?: string;
  lang?: string;
};

export type MyReviewsListPayload = {
  data: MyReviewListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type MyReviewTableRow = MyReviewListItem & { id: string };

