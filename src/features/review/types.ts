export enum ReviewEntityType {
  ROOM = 'ROOM',
  HOTEL = 'HOTEL',
  TOUR = 'TOUR',
  BLOG = 'BLOG',
}

export interface Review {
  _id: string;

  entityType: ReviewEntityType;
  entityId: string;

  rating?: number;
  comment?: string;

  userId: string;
  isAnonymous: boolean;

  isApproved: boolean;
  approvedAt?: string;

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
