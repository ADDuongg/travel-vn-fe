import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { Room, HotelRef } from '@/features/rooms/types';
import { ROUTES } from '@/constants/router';
import { fmtMoney, caculateSalePrice } from '@/utils';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';

type Props = {
  room: Room;
  index: number;
  lang: string;
};

function getHotelDisplay(
  hotel: string | HotelRef | undefined,
  language: string,
): string | null {
  if (!hotel || typeof hotel === 'string') return null;
  const name =
    hotel.translations?.[language]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name;
  return name ?? null;
}

function getProvinceDisplay(
  hotel: string | HotelRef | undefined,
  language: string,
): string | null {
  if (!hotel || typeof hotel === 'string') return null;
  const province = hotel.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  return names?.[language as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? null;
}

export function RoomEditorialListCard({ room, index, lang }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const tr = room.translations?.[lang];
  const name = tr?.name ?? room.code;
  const hotelTitle = getHotelDisplay(room.hotelId, lang);
  const region = getProvinceDisplay(room.hotelId, lang);
  const imageUrl = room.thumbnail?.url ?? '';
  const to = ROUTES.ROOM.DETAIL.replace(':id', room._id);

  const basePrice = room.pricing?.basePrice ?? 0;
  const weekend = room.pricing?.weekendPrice;
  const currency = room.pricing?.currency ?? 'VND';
  let displayPrice = basePrice;
  if (room.sale?.isActive && room.sale.type === 'PERCENT') {
    displayPrice = caculateSalePrice(basePrice, room.sale.value);
  } else if (room.sale?.isActive && room.sale.type === 'FIXED') {
    displayPrice = Math.max(0, basePrice - room.sale.value);
  }

  const minN = room.bookingConfig?.minNights ?? 1;
  const maxN = room.bookingConfig?.maxNights;
  const ratingAvg = room.ratingSummary?.average;
  const ratingTotal = room.ratingSummary?.total ?? 0;

  return (
    <Reveal delay={(index % 4) * 0.04}>
      <motion.article
        initial={false}
        whileHover={{ y: reduceMotion ? 0 : -4 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-charcoal/10 bg-sand-50 shadow-soft"
      >
        <Link to={to} className="group relative block">
          {imageUrl ? (
            <div className="relative aspect-[16/10]">
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
              <div className="absolute right-3 top-3 z-[1]">
                <FavoriteButton
                  entityType={FavoriteEntityType.ROOM}
                  entityId={room._id}
                  initialIsFavorited={room.isFavorited}
                  stopNavigation
                  className="h-9 w-9 rounded-full border border-charcoal/10 bg-sand-50/90 shadow-soft"
                />
              </div>
            </div>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center bg-sand-100 text-sm text-mist">
              {t('room.editorial.no_image', 'No preview')}
            </div>
          )}
        </Link>
        <div className="flex flex-1 flex-col space-y-3 p-6 md:p-7">
          <p className="text-[10px] uppercase tracking-[0.26em] text-charcoal/45">
            {[hotelTitle, region].filter(Boolean).join(' · ') || '—'}
          </p>
          <h3 className="font-display text-2xl text-charcoal">
            <Link to={to} className="transition hover:text-sunset-deep">
              {name}
            </Link>
          </h3>
          {tr?.shortDescription ? (
            <p className="text-sm leading-relaxed text-mist line-clamp-3">
              {tr.shortDescription}
            </p>
          ) : null}
          <ul className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
            <li>
              {t('room.editorial.up_to_guests', {
                count: room.maxGuests,
                defaultValue: 'Up to {{count}} guests',
              })}
            </li>
            {room.roomSize ? (
              <li className="before:pe-2 before:content-['·']">
                {room.roomSize} m²
              </li>
            ) : null}
            <li className="before:pe-2 before:content-['·']">
              {t('room.editorial.inventory_line', {
                count: room.inventory?.totalRooms ?? 0,
                defaultValue: '{{count}} in inventory',
              })}
            </li>
          </ul>
          <p className="font-display text-lg text-charcoal">
            {t('hotel.editorial.room_from', 'From')}{' '}
            {fmtMoney(displayPrice, currency)}
            {weekend ? (
              <span className="ms-2 text-sm font-normal text-mist">
                · {t('hotel.editorial.room_weekend', 'weekend')}{' '}
                {fmtMoney(weekend, currency)}
              </span>
            ) : null}
            <span className="text-sm font-normal text-mist"> · {currency}</span>
          </p>
          <p className="text-xs leading-relaxed text-charcoal/55">
            {t('hotel.editorial.room_min_nights', {
              count: minN,
              defaultValue: 'Min {{count}} night(s)',
            })}
            {maxN
              ? ` · ${t('hotel.editorial.room_max_nights', { count: maxN, defaultValue: 'max {{count}}' })}`
              : ''}
            {room.bookingConfig?.allowInstantBooking
              ? ` · ${t('hotel.editorial.room_instant_ok', 'Instant booking when available')}`
              : ` · ${t('hotel.editorial.room_hold_only', 'Hold via correspondence')}`}
          </p>
          {ratingTotal > 0 && ratingAvg != null ? (
            <p className="text-xs text-charcoal/45">
              {t('room.editorial.tone_line', {
                avg: ratingAvg.toFixed(2),
                count: ratingTotal,
                defaultValue:
                  'Property tone {{avg}} · {{count}} guest notes',
              })}
            </p>
          ) : null}
          <Link
            to={to}
            className="mt-auto inline-flex w-fit items-center gap-2 border-b border-charcoal/20 pb-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal transition hover:border-forest/40 hover:text-forest"
          >
            {t('room.editorial.open_sheet', 'Open room sheet')}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function RoomEditorialListCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-charcoal/10 bg-sand-50 shadow-soft">
      <div className="aspect-[16/10] animate-pulse bg-sand-100" />
      <div className="space-y-3 p-6 md:p-7">
        <div className="h-3 w-24 animate-pulse rounded-full bg-sand-100" />
        <div className="h-8 max-w-sm w-[85%] animate-pulse rounded-md bg-sand-100" />
        <div className="h-4 w-full animate-pulse rounded bg-sand-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-sand-100" />
      </div>
    </div>
  );
}
