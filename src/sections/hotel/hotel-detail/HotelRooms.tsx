import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Hotel } from '@/features/hotels/types';
import { useRoomsQuery } from '@/features/rooms/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/router';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { Room } from '@/features/rooms/types';
import { formatVndAmount } from '@/sections/hotel/hotel-detail/hotelEditorialUtils';
import { Skeleton } from '@/components/ui/skeleton';

function RoomEditorialCard({ room, lang }: { room: Room; lang: string }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const tr = room.translations?.[lang];
  const name = tr?.name ?? room.code;
  const rawDesc = tr?.description;
  const shortDesc =
    tr?.shortDescription ??
    (rawDesc
      ? rawDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)
      : undefined);
  const imageUrl = room.thumbnail?.url ?? '';
  const to = ROUTES.ROOM.DETAIL.replace(':id', room._id);
  const base = room.pricing?.basePrice ?? 0;
  const weekend = room.pricing?.weekendPrice;
  const currency = room.pricing?.currency ?? 'VND';
  const minN = room.bookingConfig?.minNights ?? 1;
  const maxN = room.bookingConfig?.maxNights;
  const sizeM2 = room.roomSize;

  return (
    <Reveal>
      <motion.article
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-charcoal/10 bg-sand-50 shadow-soft"
      >
        {imageUrl ? (
          <Link to={to} className="group relative block aspect-[16/10]">
            <img
              src={imageUrl}
              alt={room.thumbnail?.alt ?? name}
              className="h-full w-full object-cover transition duration-[800ms] group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            <p className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.22em] text-sand-100/90">
              {room.roomType}
            </p>
          </Link>
        ) : (
          <Link
            to={to}
            className="flex aspect-[16/10] items-center justify-center bg-sand-100 text-sm text-mist"
          >
            {room.roomType}
          </Link>
        )}
        <div className="flex flex-1 flex-col space-y-3 p-6 md:p-7">
          <h3 className="font-display text-2xl text-charcoal">
            <Link to={to} className="transition hover:text-sunset-deep">
              {name}
            </Link>
          </h3>
          {shortDesc ? (
            <p className="text-sm leading-relaxed text-mist line-clamp-4">
              {shortDesc}
            </p>
          ) : null}
          <ul className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
            <li>
              {t('hotel.editorial.room_up_to_guests', {
                count: room.maxGuests,
                defaultValue: 'Up to {{count}} guests',
              })}
            </li>
            {sizeM2 != null && sizeM2 > 0 ? (
              <li className="before:pe-2 before:content-['·']">
                {sizeM2} m²
              </li>
            ) : null}
            <li className="before:pe-2 before:content-['·']">
              {t('hotel.editorial.room_inventory', {
                count: room.inventory?.totalRooms ?? 0,
                defaultValue: '{{count}} in inventory',
              })}
            </li>
          </ul>
          <p className="font-display text-lg text-charcoal">
            {t('hotel.editorial.room_from', 'From')}{' '}
            {formatVndAmount(base, lang)}
            {weekend != null && weekend > 0 ? (
              <span className="ms-2 text-sm font-normal text-mist">
                · {t('hotel.editorial.room_weekend', 'weekend')}{' '}
                {formatVndAmount(weekend, lang)}
              </span>
            ) : null}
            <span className="text-sm font-normal text-mist"> · {currency}</span>
          </p>
          <p className="text-xs leading-relaxed text-charcoal/55">
            {t('hotel.editorial.room_min_nights', {
              count: minN,
              defaultValue: 'Min {{count}} night(s)',
            })}
            {maxN != null && maxN > 0
              ? ` · ${t('hotel.editorial.room_max_nights', { count: maxN, defaultValue: 'max {{count}}' })}`
              : ''}
            {room.bookingConfig?.allowInstantBooking
              ? ` · ${t('hotel.editorial.room_instant_ok', 'Instant booking when available')}`
              : ` · ${t('hotel.editorial.room_hold_only', 'Hold via correspondence')}`}
          </p>
          <Link
            to={to}
            className="mt-auto inline-flex w-fit items-center gap-2 border-b border-charcoal/20 pb-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal transition hover:border-forest/40 hover:text-forest"
          >
            {t('hotel.editorial.room_sheet', 'Room sheet')}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.article>
    </Reveal>
  );
}

function RoomEditorialSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-charcoal/10 bg-sand-50 shadow-soft">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-6 md:p-7">
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

const HotelRooms = ({ hotel }: { hotel: Hotel }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { data, isLoading } = useRoomsQuery({
    hotelIds: [hotel._id],
    limit: 6,
    lang: language,
  });
  const rooms = data?.items ?? [];

  return (
    <section
      id="rooms"
      className="scroll-mt-36 border-y border-charcoal/10 bg-sand-100 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-14 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('hotel.editorial.rooms_kicker', 'Inventory previews')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t(
              'hotel.editorial.rooms_title',
              'Rooms as correspondence objects',
            )}
          </h2>
          <p className="max-w-2xl text-sm text-mist">
            {t(
              'hotel.editorial.rooms_subtitle',
              'Rates and nights are indicative on each card; confirmation follows your chosen channel.',
            )}
          </p>
        </Reveal>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2">
            <RoomEditorialSkeleton />
            <RoomEditorialSkeleton />
          </div>
        ) : rooms.length === 0 ? (
          <p className="text-mist">
            {t(
              'hotel.editorial.rooms_empty',
              'No room inventory is listed for this property yet.',
            )}
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {rooms.map((room) => (
              <RoomEditorialCard key={room._id} room={room} lang={language} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelRooms;

