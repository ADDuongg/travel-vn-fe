import { ReviewEntityType } from '@/features/review/types';
import { useRoomDetailQuery } from '@/features/rooms/hooks';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/layout';
import RoomAmenities from '@/sections/room/room-detail/RoomAmenities';
import RoomDetail from '@/sections/room/room-detail/RoomDetail';
import RoomFAQ from '@/sections/room/room-detail/RoomFAQ';
import RoomHeader from '@/sections/room/room-detail/RoomHeader';
import RulesSection from '@/sections/room/room-detail/RulesSection';
import RoomRelated from '@/sections/room/room-detail/RoomRelated';
import RoomSidebar from '@/sections/room/room-detail/RoomSidebar';
import RoomFloatingBookingBar from '@/sections/room/room-detail/RoomFloatingBookingBar';
import { AnimatedTabs } from '@components/AnimatedTabs';
import Container from '@components/Container';
import EntityReviewSection from '@components/EntityReviewSection/EntityReviewSection';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const RoomDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: room, isLoading, isError } = useRoomDetailQuery(id);

  const roomTabs = useMemo(
    () => [
      { id: 'overview', label: t('room.detail.tab_overview', 'Overview') },
      { id: 'amenities', label: t('room.detail.tab_amenities', 'Amenities') },
      { id: 'rules', label: t('room.detail.tab_rules', 'House rules') },
      { id: 'faq', label: t('room.detail.tab_faq', 'FAQ') },
      { id: 'reviews', label: t('room.detail.tab_reviews', 'Reviews') },
    ],
    [t],
  );

  return (
    <MainLayout>
      {isLoading && <RoomDetailSkeleton />}
      {isError && !isLoading && (
        <RoomDetailError
          title={t('room.detail.not_found', 'Room not found')}
          description={t(
            'room.detail.not_found_desc',
            'This room may have been removed or the link is incorrect.',
          )}
        />
      )}
      {room && !isLoading && (
        <div className="sticky top-[136px] z-20 border-b border-[rgba(28,26,20,0.1)] bg-[#faf7f2]/95 backdrop-blur-md">
          <Container className="max-w-7xl px-4 sm:px-6">
            <AnimatedTabs
              variant="travel"
              tabs={roomTabs}
              scrollOffset={200}
              omitContainer
            />
          </Container>
        </div>
      )}

      {room && !isLoading && (
        <>
          <RoomHeader room={room} />
          <div className="bg-[#F8F8F6] pb-24 lg:pb-10">
            <Container>
              <div className="grid grid-cols-1 gap-8 pb-10 pt-2 lg:grid-cols-12 lg:gap-10">
                <div className="min-w-0 space-y-10 lg:col-span-8">
                  <RoomDetail room={room} />
                  <RoomAmenities room={room} />
                  <RulesSection room={room} />
                  <RoomFAQ room={room} />
                </div>
                <aside className="hidden min-w-0 lg:col-span-4 lg:block">
                  <RoomSidebar room={room} />
                </aside>
              </div>
              <div className="mb-6 space-y-10 border-t border-[rgba(28,26,20,0.1)] pt-8">
                <RoomRelated currentRoomId={room._id} />
                <section id="reviews" className="scroll-mt-40">
                  <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-charcoal sm:mb-6 sm:text-3xl md:text-4xl">
                    {t('room.detail.reviews_block_title', 'Guest reviews')}
                  </h2>
                  <div className="rounded-[2rem] border border-charcoal/10 bg-sand-50/90 p-4 shadow-[var(--shadow-soft)] sm:p-6 md:p-8">
                    <EntityReviewSection
                      entityType={ReviewEntityType.ROOM}
                      entityId={id ?? ''}
                      ratingSummary={room.ratingSummary ?? undefined}
                    />
                  </div>
                </section>
              </div>
            </Container>
          </div>
          <RoomFloatingBookingBar room={room} />
        </>
      )}
    </MainLayout>
  );
};

const RoomDetailSkeleton = () => (
  <div className="w-full">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="pt-2">
        <div className="mb-8 grid min-h-[220px] animate-pulse grid-cols-12 gap-3 md:min-h-[400px] md:gap-4">
          <div className="col-span-12 rounded-2xl bg-[#e5ded0] md:col-span-8" />
          <div className="col-span-12 grid min-h-[180px] grid-cols-2 grid-rows-2 gap-3 md:col-span-4 md:min-h-0 md:gap-4">
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
            <div className="rounded-xl bg-[#e5ded0]" />
          </div>
        </div>
        <div className="h-8 max-w-md animate-pulse rounded bg-[#e5ded0]" />
      </div>
    </div>
  </div>
);

type RoomDetailErrorProps = {
  title: string;
  description: string;
};

const RoomDetailError = ({ title, description }: RoomDetailErrorProps) => (
  <div className="px-4 py-24 text-center">
    <h2
      className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
      style={{
        fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
      }}
    >
      {title}
    </h2>
    <p className="mt-2 text-sm text-[rgba(28,26,20,0.6)]">{description}</p>
  </div>
);

export default RoomDetailPage;
