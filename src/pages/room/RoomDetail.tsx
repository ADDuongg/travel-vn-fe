import { MainLayout } from '@/layout';
import RoomDetail from '@/sections/room/room-detail/RoomDetail';
import RoomAmenities from '@/sections/room/room-detail/RoomAmenities';
import RoomFAQ from '@/sections/room/room-detail/RoomFAQ';
import RoomHeader from '@/sections/room/room-detail/RoomHeader';
import RoomItinerary from '@/sections/room/room-detail/RoomItinerary';
import RoomRelated from '@/sections/room/room-detail/RoomRelated';
import RoomReviews from '@/sections/room/room-detail/RoomReviews';
import RoomSidebar from '@/sections/room/room-detail/RoomSidebar';
import { AnimatedTabs } from '@components/AnimatedTabs';
import Container from '@components/Container';
import RulesSection from '@/sections/room/room-detail/RoomItinerary';

const RoomDetailPage = () => {
  return (
    <MainLayout>
      <div className="border-b sticky top-[136px] bg-white z-20">
        <AnimatedTabs />
      </div>

      <Container>
        <RoomHeader />
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-12 xl:col-span-8 mt-10 px-[20px] space-y-10">
            <RoomDetail />
            <RoomAmenities />
            <RulesSection
              title="House Rules"
              rules={[
                'No smoking',
                'No pets',
                'No parties or events',
                'Check-in time is 3 PM',
                'Check-out time is 11 AM',
              ]}
            />
            <RoomFAQ />
          </div>
          <div className="col-span-12 xl:col-span-4 mt-10 px-[20px]">
            <RoomSidebar />
          </div>
          <div className="col-span-12 mt-10 px-[20px] mb-10 space-y-10">
            <RoomRelated />
            <RoomReviews />
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default RoomDetailPage;
