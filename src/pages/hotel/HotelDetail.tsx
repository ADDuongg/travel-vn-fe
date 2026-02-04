import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { useParams } from 'react-router';
import { useHotelDetailQuery } from '@/features/hotels/hooks';
import HotelHeader from '@/sections/hotel/hotel-detail/HotelHeader';
import HotelInfo from '@/sections/hotel/hotel-detail/HotelInfo';
import HotelRooms from '@/sections/hotel/hotel-detail/HotelRooms';
import { LoadingScreen } from '@components/LoadingScreen';

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading } = useHotelDetailQuery(id);

  if (isLoading) return <LoadingScreen />;
  if (!hotel) return null;

  return (
    <MainLayout>
      <Container>
        <div className="pt-24 pb-16">
          <HotelHeader hotel={hotel} />
          <div className="mt-12 space-y-12">
            <HotelInfo hotel={hotel} />
            <HotelRooms hotel={hotel} />
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default HotelDetailPage;
