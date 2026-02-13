import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { useParams } from 'react-router';
import { useHotelDetailQuery } from '@/features/hotels/hooks';
import HotelHeader from '@/sections/hotel/hotel-detail/HotelHeader';
import HotelInfo from '@/sections/hotel/hotel-detail/HotelInfo';
import HotelRooms from '@/sections/hotel/hotel-detail/HotelRooms';
import { LoadingScreen } from '@components/LoadingScreen';
import { ResponsiveH2 } from '@/components/ui/typography';
import { FaLocationDot } from 'react-icons/fa6';

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading } = useHotelDetailQuery(id);

  if (isLoading) return <LoadingScreen />;
  if (!hotel) return null;

  const hasLocation =
    hotel.location &&
    typeof hotel.location.lat === 'number' &&
    typeof hotel.location.lng === 'number';
  const mapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${hotel.location!.lat},${hotel.location!.lng}`
    : null;

  return (
    <MainLayout>
      <Container className="max-w-7xl pt-24 pb-16">
        <main className="px-0">
          <HotelHeader hotel={hotel} />
          <HotelInfo hotel={hotel} />
          <HotelRooms hotel={hotel} />

          {mapsUrl && (
            <section className="mt-20">
              <ResponsiveH2 className="text-foreground mb-6 border-0 pb-0">
                Location
              </ResponsiveH2>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                <FaLocationDot className="size-5" />
                View on Google Maps
              </a>
            </section>
          )}
        </main>
      </Container>
    </MainLayout>
  );
};

export default HotelDetailPage;
