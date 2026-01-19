import { EnumLanguage } from '@/constants/commons';
import { ReviewEntityType } from '@/features/review/types';
import { useRoomDetailQuery } from '@/features/rooms/hooks';
import { MainLayout } from '@/layout';
import RoomAmenities from '@/sections/room/room-detail/RoomAmenities';
import RoomDetail from '@/sections/room/room-detail/RoomDetail';
import RoomFAQ from '@/sections/room/room-detail/RoomFAQ';
import RoomHeader from '@/sections/room/room-detail/RoomHeader';
import RulesSection from '@/sections/room/room-detail/RulesSection';
import RoomRelated from '@/sections/room/room-detail/RoomRelated';
import RoomSidebar from '@/sections/room/room-detail/RoomSidebar';
import { AnimatedTabs } from '@components/AnimatedTabs';
import Container from '@components/Container';
import EntityReviewSection from '@components/EntityReviewSection/EntityReviewSection';
import { useParams } from 'react-router';
import { useLocalStorage } from 'usehooks-ts';

const RoomDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [value] = useLocalStorage('i18nextLng', EnumLanguage.DEFAULT);
  const { data: room, isLoading } = useRoomDetailQuery(id!);

  if (isLoading || !room) return null;

  return (
    <MainLayout>
      <div className="border-b sticky top-[136px] bg-white z-20">
        <AnimatedTabs />
      </div>

      <Container>
        <RoomHeader room={room} />
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-12 xl:col-span-8 mt-10 px-[20px] space-y-10">
            <RoomDetail room={room} />
            <RoomAmenities room={room} />
            <RulesSection
              title="House Rules"
              rules={room.translations?.[value]?.hotelRule ?? []}
            />
            <RoomFAQ room={room} />
          </div>
          <div className="col-span-12 xl:col-span-4 mt-10 px-[20px]">
            <RoomSidebar room={room} />
          </div>
          <div className="col-span-12 mt-10 px-[20px] mb-10 space-y-10">
            <RoomRelated />
            {/* <RoomReviews /> */}
            <EntityReviewSection
              entityType={ReviewEntityType.ROOM}
              entityId={id ?? ''}
            />
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default RoomDetailPage;
