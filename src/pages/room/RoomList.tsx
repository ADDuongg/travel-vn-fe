// pages/room/RoomListPage.tsx

import { ROUTES } from '@/constants/router';
import { useRoomsQuery } from '@/features/rooms/hooks';
import { MainLayout } from '@/layout';
import RoomCard from '@/sections/room/components/RoomCard';
import Container from '@components/Container';
import { LoadingScreen } from '@components/LoadingScreen';
import { ResponsiveH1 } from '@components/ui/typography';
import { useMinLoading } from '@hooks/useMinLoading';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const RoomListPage = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    'price_asc' | 'price_desc' | 'rating_desc'
  >();

  const { data, isLoading } = useRoomsQuery({
    page,
    limit: 9,
    sortBy,
  });
  const navigate = useNavigate();

  const showLoading = useMinLoading(isLoading);

  if (showLoading) return <LoadingScreen />;

  return (
    <MainLayout>
      <div className="bg-background_paleGray p-8 md:p-16 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">Rooms</ResponsiveH1>
      </div>

      <Container className="py-10">
        <select
          value={sortBy}
          onChange={(e) => {
            setPage(1);
            setSortBy(e.target.value as any);
          }}
          className="mb-6 border px-3 py-2"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating_desc">Rating</option>
        </select>

        <div className="grid grid-cols-12 gap-12">
          {data?.items.map((room) => (
            <div
              key={room._id}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
              onClick={() => navigate(`${ROUTES.ROOM.INDEX}/${room._id}`)}
            >
              <RoomCard item={room} />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-10">
          {Array.from({ length: data?.pagination.totalPages ?? 1 }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border ${
                  page === i + 1 ? 'bg-black text-white' : ''
                }`}
              >
                {i + 1}
              </button>
            ),
          )}
        </div>
      </Container>
    </MainLayout>
  );
};

export default RoomListPage;
