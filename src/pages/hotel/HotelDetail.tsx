import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { MainLayout } from '@/layout';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHotelDetailQuery } from '@/features/hotels/hooks';
import type { Hotel } from '@/features/hotels/types';
import HotelReviews from '@/sections/hotel/hotel-detail/HotelReviews';
import HotelRooms from '@/sections/hotel/hotel-detail/HotelRooms';
import { HotelMapSection } from '@/sections/hotel/hotel-detail/HotelMapSection';
import { HotelFloatingContactBar } from '@/sections/hotel/hotel-detail/HotelFloatingContactBar';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { Reveal } from '@/components/home-editorial/Reveal';
import { FloatingSectionNav } from '@/components/home-editorial/FloatingSectionNav';
import { useHeroScrollNavReveal } from '@/components/home-editorial/useHeroScrollNavReveal';
import { scrollToSectionAnchor } from '@/lib/scrollToSectionAnchor';
import { useLanguage } from '@/hooks/useLanguage';
import { HotelEditorialMetaStrip } from '@/sections/hotel/hotel-detail/HotelEditorialMetaStrip';
import { HotelEditorialStorySection } from '@/sections/hotel/hotel-detail/HotelEditorialStorySection';
import { HotelEditorialGalleryGrid } from '@/sections/hotel/hotel-detail/HotelEditorialGalleryGrid';
import { HotelEditorialPoliciesSection } from '@/sections/hotel/hotel-detail/HotelEditorialPoliciesSection';
import { HotelEditorialPlanSection } from '@/sections/hotel/hotel-detail/HotelEditorialPlanSection';
import {
  buildOrderedGallery,
  hasHotelEditorialPolicies,
  hasHotelEditorialStory,
} from '@/sections/hotel/hotel-detail/hotelEditorialUtils';

type NavItem = { id: string; label: string };

const HotelDetailPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = language || 'vi';
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading, isError } = useHotelDetailQuery(id);

  const hasLocation = Boolean(
    hotel?.location &&
      typeof hotel.location.lat === 'number' &&
      typeof hotel.location.lng === 'number',
  );

  const navItems = useMemo<NavItem[]>(() => {
    if (!hotel) return [];
    const items: NavItem[] = [];
    if (hasHotelEditorialStory(hotel, lang)) {
      items.push({ id: 'story', label: t('hotel.nav.story', 'Story') });
    }
    items.push({ id: 'rooms', label: t('hotel.nav.rooms', 'Rooms') });
    if (hasHotelEditorialPolicies(hotel, lang)) {
      items.push({ id: 'policies', label: t('hotel.nav.policies', 'Policies') });
    }
    if (buildOrderedGallery(hotel).length > 0) {
      items.push({ id: 'gallery', label: t('hotel.nav.gallery', 'Gallery') });
    }
    if (hasLocation) {
      items.push({ id: 'location', label: t('hotel.nav.location', 'Location') });
    }
    items.push(
      { id: 'reviews', label: t('hotel.nav.reviews', 'Reviews') },
      { id: 'plan', label: t('hotel.nav.plan', 'Plan') },
    );
    return items;
  }, [hotel, lang, hasLocation, t]);

  return (
    <MainLayout>
      {isLoading && <HotelDetailSkeleton />}
      {isError && !isLoading && (
        <HotelDetailError
          title={t('hotel.detail.not_found', 'Hotel not found')}
          description={t(
            'hotel.detail.not_found_desc',
            'This property may have been removed or the link is incorrect.',
          )}
        />
      )}
      {hotel && !isLoading && (
        <HotelDetailEditorialBody
          hotel={hotel}
          hasLocation={hasLocation}
          paramId={id}
          navItems={navItems}
          lang={lang}
        />
      )}
      {hotel && !isLoading && <HotelFloatingContactBar hotel={hotel} />}
    </MainLayout>
  );
};

function HotelDetailEditorialBody({
  hotel,
  hasLocation,
  paramId,
  navItems,
  lang,
}: {
  hotel: Hotel;
  hasLocation: boolean;
  paramId?: string;
  navItems: NavItem[];
  lang: string;
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const navVisible = useHeroScrollNavReveal(heroRef, 0.88);

  const name =
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name ??
    hotel.slug;
  const shortRaw =
    hotel.translations?.[lang]?.shortDescription ??
    hotel.translations?.vi?.shortDescription ??
    hotel.translations?.en?.shortDescription;
  const short =
    typeof shortRaw === 'string' ? shortRaw : undefined;
  const descRaw =
    hotel.translations?.[lang]?.description ??
    hotel.translations?.vi?.description ??
    hotel.translations?.en?.description;
  const descStr =
    typeof descRaw === 'string' ? descRaw : undefined;
  const lead =
    short?.trim() ??
    (descStr
      ? descStr
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 220)
      : null);
  const province = hotel.provinceId;
  const provinceName =
    typeof province === 'object' && province && 'name' in province
      ? (province.name as { vi?: string; en?: string })?.[
          lang as 'vi' | 'en'
        ] ??
        (province.name as { vi?: string; en?: string })?.vi ??
        (province.name as { vi?: string; en?: string })?.en
      : null;
  const stars = hotel.starRating ?? 0;
  const cover =
    hotel.thumbnail?.url ??
    hotel.gallery?.[0]?.url ??
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2400';
  const reviewCount = hotel.ratingSummary?.total;
  const galleryItems = buildOrderedGallery(hotel);

  return (
    <article className="relative pb-28 lg:pb-24">
      <section ref={heroRef}>
        <ParallaxHero image={cover} heightClass="min-h-[100svh]">
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
                {stars > 0 ? `${stars}★` : '—'} · {provinceName ?? '—'}
              </p>
              <h1 className="font-display text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.95]">
                {name}
              </h1>
              {lead ? (
                <p className="max-w-2xl text-lg text-sand-100/85">{lead}</p>
              ) : null}
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] uppercase tracking-[0.24em] text-sand-100/70">
                <span>
                  {t('hotel.editorial.hero_mood', 'Curated correspondence')}
                </span>
                <span className="text-sand-100/40">·</span>
                <span>
                  {reviewCount != null && reviewCount > 0
                    ? t('hotel.editorial.hero_guest_notes', {
                        count: reviewCount,
                        defaultValue: '{{count}} guest notes',
                      })
                    : t('hotel.editorial.hero_guest_notes_pending', 'Guest notes')}
                </span>
              </div>
            </motion.div>
          </div>
        </ParallaxHero>
      </section>

      <FloatingSectionNav
        visible={navVisible}
        items={navItems}
        ariaLabel={t('hotel.nav.aria', 'On this page')}
        onNavigate={(sectionId) => scrollToSectionAnchor(sectionId)}
        stickyTopClassName="top-[4.5rem] md:top-[5.5rem]"
        navClassName="bg-sand-50/85"
      />

      <section className="mx-auto max-w-6xl scroll-mt-36 px-4 pt-14 md:px-10 md:pt-16">
        <Reveal delay={0.05} className="mt-4">
          <HotelEditorialMetaStrip hotel={hotel} lang={lang} />
        </Reveal>
      </section>

      {hasHotelEditorialStory(hotel, lang) ? (
        <HotelEditorialStorySection hotel={hotel} lang={lang} />
      ) : null}

      <HotelRooms hotel={hotel} />

      {hasHotelEditorialPolicies(hotel, lang) ? (
        <HotelEditorialPoliciesSection hotel={hotel} />
      ) : null}

      {galleryItems.length > 0 ? (
        <HotelEditorialGalleryGrid items={galleryItems} />
      ) : null}

      {hasLocation ? (
        <section
          id="location"
          className="scroll-mt-36 mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28"
        >
          <Reveal className="mb-12 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('hotel.editorial.location_kicker', 'Location')}
            </p>
            <h2 className="font-display text-4xl text-charcoal">
              {t(
                'hotel.editorial.location_title',
                'Where to stand on the map',
              )}
            </h2>
          </Reveal>
          <HotelMapSection hotel={hotel} embedded />
        </section>
      ) : null}

      <section
        id="reviews"
        className="scroll-mt-36 border-t border-charcoal/10 bg-sand-100 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <Reveal className="mb-14 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('hotel.editorial.reviews_kicker', 'Guest reviews')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
              {t(
                'hotel.editorial.reviews_title',
                'Written notes, not star spam',
              )}
            </h2>
            <p className="max-w-2xl text-mist">
              {t(
                'hotel.editorial.reviews_lead',
                'Verified guest reviews for this property.',
              )}
            </p>
          </Reveal>
          <HotelReviews hotel={hotel} paramId={paramId} variant="editorial" />
        </div>
      </section>

      <HotelEditorialPlanSection hotel={hotel} lang={lang} />
    </article>
  );
}

const HotelDetailSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="min-h-[70vh] bg-sand-200/50" />
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-10">
      <div className="h-32 rounded-[1.5rem] bg-sand-200/60" />
    </div>
  </div>
);

type HotelDetailErrorProps = {
  title: string;
  description: string;
};

const HotelDetailError = ({ title, description }: HotelDetailErrorProps) => (
  <div className="px-4 py-24 text-center">
    <h2 className="font-display text-2xl font-bold text-charcoal">{title}</h2>
    <p className="mt-2 text-sm text-mist">{description}</p>
  </div>
);

export default HotelDetailPage;
