import { useRoomsQuery } from '@/features/rooms/hooks';
import { Link } from 'react-router-dom';
import React from 'react';
import RoomCard, { RoomCardSkeleton } from '../components/RoomCard';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/router';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

type RoomRelatedProps = {
  currentRoomId: string;
};

const RoomRelated: React.FC<RoomRelatedProps> = ({ currentRoomId }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: relatedRooms, isLoading } = useRoomsQuery({
    limit: 6,
    sortBy: 'newest',
    lang: language,
  });
  const items = (relatedRooms?.items ?? [])
    .filter((item) => item._id !== currentRoomId)
    .slice(0, 8);

  if (!items.length && !isLoading) return null;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <h2
          className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14] sm:text-3xl"
          style={{
            fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
          }}
        >
          {t('room.detail.related_title', 'You may also like')}
        </h2>
        <Link
          to={ROUTES.ROOM.INDEX}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#2d6a4f] transition hover:text-[#1e4d38]"
        >
          {t('room.detail.see_all_rooms', 'See all rooms')}
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="-mx-1 flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-gutter:stable] sm:-mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-[min(100%,320px)] shrink-0 snap-center sm:w-auto"
              >
                <RoomCardSkeleton />
              </div>
            ))
          : items.map((item) => (
              <div
                key={item._id}
                className="w-[min(100%,320px)] shrink-0 snap-center sm:w-auto"
              >
                <RoomCard item={item} lang={language} />
              </div>
            ))}
      </div>
    </section>
  );
};

export default RoomRelated;
