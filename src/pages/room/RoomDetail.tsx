import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReviewEntityType } from '@/features/review/types';
import { useRoomDetailQuery } from '@/features/rooms/hooks';
import type { Room, HotelRef } from '@/features/rooms/types';
import { MainLayout } from '@/layout';
import RoomFAQ from '@/sections/room/room-detail/RoomFAQ';
import RoomRelated from '@/sections/room/room-detail/RoomRelated';
import RoomFloatingBookingBar from '@/sections/room/room-detail/RoomFloatingBookingBar';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal } from '@/components/home-editorial/Reveal';
import { FloatingSectionNav } from '@/components/home-editorial/FloatingSectionNav';
import { useHeroScrollNavReveal } from '@/components/home-editorial/useHeroScrollNavReveal';
import { scrollToSectionAnchor } from '@/lib/scrollToSectionAnchor';
import { useLanguage } from '@/hooks/useLanguage';
import { fmtMoney, caculateSalePrice } from '@/utils';
import EntityReviewSection from '@components/EntityReviewSection/EntityReviewSection';
import { RoomEditorialStorySection } from '@/sections/room/room-detail/RoomEditorialStorySection';
import { hasRoomEditorialStory } from '@/sections/room/room-detail/roomEditorialCopyUtils';
import { RoomEditorialMetaStrip } from '@/sections/room/room-detail/RoomEditorialMetaStrip';
import { RoomEditorialBookingPostureSection } from '@/sections/room/room-detail/RoomEditorialBookingPostureSection';
import { RoomEditorialAmenitiesPills } from '@/sections/room/room-detail/RoomEditorialAmenitiesPills';
import { RoomEditorialGalleryGrid } from '@/sections/room/room-detail/RoomEditorialGalleryGrid';
import { RoomEditorialPlanSection } from '@/sections/room/room-detail/RoomEditorialPlanSection';

type NavItem = { id: string; label: string };

function isHotelRef(h: string | HotelRef | undefined): h is HotelRef {
  return Boolean(h && typeof h === 'object' && '_id' in h);
}

function hasFaq(room: Room, lang: string): boolean {
  const faqs =
    room.translations?.[lang]?.faq ??
    room.translations?.vi?.faq ??
    room.translations?.en?.faq ??
    [];
  return faqs.length > 0;
}

const RoomDetailPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = language || 'vi';
  const { id } = useParams<{ id: string }>();
  const { data: room, isLoading, isError } = useRoomDetailQuery(id);

  const navItems = useMemo<NavItem[]>(() => {
    if (!room) return [];
    const items: NavItem[] = [];
    if (hasRoomEditorialStory(room, lang)) {
      items.push({ id: 'story', label: t('room.nav.story', 'Story') });
    }
    items.push({ id: 'rules', label: t('room.nav.rules', 'Nights & rules') });
    if (room.amenities?.length) {
      items.push({ id: 'amenities', label: t('room.nav.amenities', 'Amenities') });
    }
    if ((room.gallery?.length ?? 0) > 1) {
      items.push({ id: 'gallery', label: t('room.nav.gallery', 'Gallery') });
    }
    items.push({ id: 'plan', label: t('room.nav.plan', 'Plan') });
    if (hasFaq(room, lang)) {
      items.push({ id: 'faq', label: t('room.nav.faq', 'FAQ') });
    }
    items.push(
      { id: 'related', label: t('room.nav.related', 'Related') },
      { id: 'reviews', label: t('room.nav.reviews', 'Reviews') },
    );
    return items;
  }, [room, lang, t]);

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
        <RoomDetailEditorialBody
          room={room}
          paramId={id}
          navItems={navItems}
          lang={lang}
        />
      )}
    </MainLayout>
  );
};

function RoomDetailEditorialBody({
  room,
  paramId,
  navItems,
  lang,
}: {
  room: Room;
  paramId?: string;
  navItems: NavItem[];
  lang: string;
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const navVisible = useHeroScrollNavReveal(heroRef, 0.88);

  const hotel = isHotelRef(room.hotelId) ? room.hotelId : null;
  const hotelTitle =
    hotel?.translations?.[lang]?.name ??
    hotel?.translations?.vi?.name ??
    hotel?.translations?.en?.name ??
    '';
  const tr =
    room.translations?.[lang] ??
    room.translations?.vi ??
    room.translations?.en;
  const name = tr?.name ?? room.code;
  const shortLead = tr?.shortDescription?.trim();
  const heroImage =
    room.gallery?.[0]?.url ??
    room.thumbnail?.url ??
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=2400';

  const basePrice = room.pricing?.basePrice ?? 0;
  const currency = room.pricing?.currency ?? 'VND';
  let displayPrice = basePrice;
  if (room.sale?.isActive && room.sale.type === 'PERCENT') {
    displayPrice = caculateSalePrice(basePrice, room.sale.value);
  } else if (room.sale?.isActive && room.sale.type === 'FIXED') {
    displayPrice = Math.max(0, basePrice - room.sale.value);
  }

  return (
    <article className="relative pb-28 lg:pb-24">
      <section ref={heroRef}>
        <ParallaxHero image={heroImage} heightClass="min-h-[100svh]">
          <div className="flex flex-1 flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
              }
              className="max-w-3xl space-y-5 text-sand-50"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/75">
                {room.roomType}
                {hotelTitle ? ` · ${hotelTitle}` : ''}
              </p>
              <h1 className="font-display text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.95]">
                {name}
              </h1>
              {shortLead ? (
                <p className="max-w-2xl text-lg text-sand-100/85">{shortLead}</p>
              ) : null}
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] uppercase tracking-[0.24em] text-sand-100/70">
                <span>
                  {t('room.editorial.hero_guests', {
                    count: room.maxGuests,
                    defaultValue: 'Up to {{count}} guests',
                  })}
                </span>
                <span className="text-sand-100/40">·</span>
                <span>
                  {t('room.editorial.hero_inventory', {
                    count: room.inventory?.totalRooms ?? 0,
                    defaultValue: '{{count}} in category',
                  })}
                </span>
                <span className="text-sand-100/40">·</span>
                <span>
                  {t('room.editorial.hero_from', 'From')}{' '}
                  {fmtMoney(displayPrice, currency)}
                </span>
              </div>
            </motion.div>
          </div>
        </ParallaxHero>
      </section>

      <FloatingSectionNav
        visible={navVisible}
        items={navItems}
        ariaLabel={t('room.nav.aria', 'On this page')}
        onNavigate={(sectionId) => scrollToSectionAnchor(sectionId)}
        stickyTopClassName="top-[4.5rem] md:top-[5.5rem]"
        navClassName="bg-sand-50/85"
      />

      <section className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-14 md:px-10 md:pt-16">
        <Reveal delay={0.05} className="mt-4">
          <RoomEditorialMetaStrip room={room} lang={lang} />
        </Reveal>
      </section>

      {hasRoomEditorialStory(room, lang) ? (
        <RoomEditorialStorySection room={room} lang={lang} />
      ) : null}

      <RoomEditorialBookingPostureSection room={room} />
      <RoomEditorialAmenitiesPills room={room} lang={lang} />
      <RoomEditorialGalleryGrid room={room} />
      <RoomEditorialPlanSection room={room} lang={lang} />

      <div className="mx-auto max-w-6xl space-y-20 border-t border-charcoal/10 bg-sand-50/50 px-4 py-20 md:px-10 md:py-28">
        <RoomFAQ room={room} />
        <RoomRelated currentRoomId={room._id} />
        <section id="reviews" className="scroll-mt-28 md:scroll-mt-32">
          <Reveal className="mb-10 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('room.editorial.reviews_kicker', 'Guest notes')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
              {t('room.detail.reviews_block_title', 'Guest reviews')}
            </h2>
          </Reveal>
          <div className="rounded-[2rem] border border-charcoal/10 bg-sand-50/90 p-4 shadow-soft sm:p-6 md:p-8">
            <EntityReviewSection
              entityType={ReviewEntityType.ROOM}
              entityId={paramId ?? ''}
              ratingSummary={room.ratingSummary ?? undefined}
            />
          </div>
        </section>
      </div>

      <RoomFloatingBookingBar room={room} />
    </article>
  );
}

const RoomDetailSkeleton = () => (
  <div className="w-full">
    <div className="min-h-[70vh] animate-pulse bg-sand-100 md:min-h-[100svh]" />
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-10">
      <div className="h-40 animate-pulse rounded-[1.5rem] bg-sand-100" />
    </div>
  </div>
);

type RoomDetailErrorProps = {
  title: string;
  description: string;
};

const RoomDetailError = ({ title, description }: RoomDetailErrorProps) => (
  <div className="px-4 py-24 text-center">
    <h2 className="font-display text-2xl font-bold text-charcoal">{title}</h2>
    <p className="mt-2 text-sm text-mist">{description}</p>
  </div>
);

export default RoomDetailPage;
