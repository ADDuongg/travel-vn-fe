import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Room, HotelRef, ProvinceRef } from '@/features/rooms/types';
import { ROUTES } from '@/constants/router';
import { fmtMoney, caculateSalePrice } from '@/utils';

type Props = {
  room: Room;
  lang: string;
};

function isHotelRef(h: string | HotelRef | undefined): h is HotelRef {
  return Boolean(h && typeof h === 'object' && '_id' in h);
}

function provinceFromHotel(hotel: HotelRef): ProvinceRef | null {
  const p = hotel.provinceId;
  if (p && typeof p === 'object' && 'slug' in p) return p as ProvinceRef;
  return null;
}

export function RoomEditorialMetaStrip({ room, lang }: Props) {
  const { t } = useTranslation();
  const hotel = isHotelRef(room.hotelId) ? room.hotelId : null;
  const province = hotel ? provinceFromHotel(hotel) : null;
  const provinceName =
    province?.name?.[lang as 'vi' | 'en'] ??
    province?.name?.vi ??
    province?.name?.en;
  const hotelTitle =
    hotel?.translations?.[lang]?.name ??
    hotel?.translations?.vi?.name ??
    hotel?.translations?.en?.name;
  const addressRaw = hotel?.translations?.[lang] as { address?: string } | undefined;
  const address =
    addressRaw?.address ??
    (hotel?.translations?.vi as { address?: string } | undefined)?.address ??
    (hotel?.translations?.en as { address?: string } | undefined)?.address;

  const basePrice = room.pricing?.basePrice ?? 0;
  const currency = room.pricing?.currency ?? 'VND';
  let displayPrice = basePrice;
  if (room.sale?.isActive && room.sale.type === 'PERCENT') {
    displayPrice = caculateSalePrice(basePrice, room.sale.value);
  } else if (room.sale?.isActive && room.sale.type === 'FIXED') {
    displayPrice = Math.max(0, basePrice - room.sale.value);
  }

  const ratingAvg = room.ratingSummary?.average;
  const ratingTotal = room.ratingSummary?.total ?? 0;

  return (
    <div className="rounded-[1.5rem] border border-charcoal/10 bg-sand-100/80 px-5 py-5 shadow-inner md:px-8 md:py-6">
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('room.editorial.meta_province', 'Province')}
          </dt>
          <dd className="mt-1.5 font-display text-lg text-charcoal">
            {province && provinceName ? (
              <Link
                to={ROUTES.PROVINCE.DETAIL.replace(':slug', province.slug)}
                className="transition hover:text-sunset-deep"
              >
                {provinceName}
              </Link>
            ) : (
              <span className="text-mist">—</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('room.editorial.meta_property', 'Property')}
          </dt>
          <dd className="mt-1.5 text-sm leading-snug text-mist">
            {hotel && hotelTitle ? (
              <>
                <Link
                  to={ROUTES.HOTEL.DETAIL.replace(':id', hotel._id)}
                  className="font-medium text-charcoal transition hover:text-sunset-deep"
                >
                  {hotelTitle}
                </Link>
                {address ? (
                  <span className="mt-1 block text-xs text-charcoal/55">
                    {address}
                  </span>
                ) : null}
              </>
            ) : (
              <span>—</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('room.editorial.meta_capacity', 'Capacity & inventory')}
          </dt>
          <dd className="mt-1.5 font-display text-lg text-charcoal">
            {t('room.editorial.up_to_guests', {
              count: room.maxGuests,
              defaultValue: 'Up to {{count}} guests',
            })}
            {room.roomSize ? (
              <span className="text-mist"> · {room.roomSize} m²</span>
            ) : null}
          </dd>
          <dd className="mt-1 text-xs text-charcoal/55">
            {t('room.editorial.meta_inventory_dd', {
              count: room.inventory?.totalRooms ?? 0,
              defaultValue: '{{count}} rooms in this category',
            })}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('room.editorial.meta_rate', 'Indicative rate')}
          </dt>
          <dd className="mt-1.5 font-display text-lg text-charcoal">
            {t('hotel.editorial.room_from', 'From')} {fmtMoney(displayPrice, currency)} ·{' '}
            {currency}
          </dd>
          <dd className="mt-1 text-xs leading-relaxed text-mist">
            {ratingTotal > 0 && ratingAvg != null
              ? t('room.editorial.meta_rating_line', {
                  avg: ratingAvg.toFixed(2),
                  count: ratingTotal,
                  defaultValue: '{{avg}} guest tone · {{count}} notes',
                })
              : t('room.editorial.meta_rating_pending', 'Guest tone pending')}
          </dd>
        </div>
      </dl>
    </div>
  );
}

