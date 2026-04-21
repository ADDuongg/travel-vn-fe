import { ROUTES } from '@/constants/router';
import { generatePath } from 'react-router-dom';
import { ReviewEntityType } from './types';

/** Paths that only need `entityId` (no extra fetch). */
export function getSyncDetailPath(
  entityType: ReviewEntityType,
  entityId: string,
): string | null {
  switch (entityType) {
    case ReviewEntityType.ROOM:
      return generatePath(ROUTES.ROOM.DETAIL, { id: entityId });
    case ReviewEntityType.HOTEL:
      return generatePath(ROUTES.HOTEL.DETAIL, { id: entityId });
    case ReviewEntityType.GUIDE:
      return generatePath(ROUTES.TOUR_GUIDE.DETAIL, { id: entityId });
    case ReviewEntityType.TOUR:
    case ReviewEntityType.BLOG:
      return null;
    default:
      return null;
  }
}
