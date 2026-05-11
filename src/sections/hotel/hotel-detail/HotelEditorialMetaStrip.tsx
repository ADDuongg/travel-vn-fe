import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Hotel } from '@/features/hotels/types';
import { ROUTES } from '@/constants/router';

type Props = { hotel: Hotel; lang: string };

export function HotelEditorialMetaStrip({ hotel, lang }: Props) {
  const { t } = useTranslation();
  const name =
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name ??
    hotel.slug;
  const addressRaw =
    hotel.translations?.[lang]?.address ??
    hotel.translations?.vi?.address ??
    hotel.translations?.en?.address;
  const address =
    typeof addressRaw === 'string' ? addressRaw : undefined;
  const province = hotel.provinceId;
  const provinceSlug =
    typeof province === 'object' && province && 'slug' in province
      ? province.slug
      : null;
  const provinceName =
    typeof province === 'object' && province && 'name' in province
      ? (province.name as { vi?: string; en?: string })?.[
          lang as 'vi' | 'en'
        ] ??
        (province.name as { vi?: string; en?: string })?.vi ??
        (province.name as { vi?: string; en?: string })?.en
      : null;
  const stars = hotel.starRating ?? 0;
  const ratingAvg = hotel.ratingSummary?.average;
  const reviewCount = hotel.ratingSummary?.total;

  return (
    <div className="rounded-[1.5rem] border border-charcoal/10 bg-sand-100/80 px-5 py-5 shadow-inner md:px-8 md:py-6">
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('hotel.editorial.meta_province', 'Province')}
          </dt>
          <dd className="mt-1.5 font-display text-lg text-charcoal">
            {provinceSlug && provinceName ? (
              <Link
                to={ROUTES.PROVINCE.DETAIL.replace(':slug', provinceSlug)}
                className="transition hover:text-sunset-deep"
              >
                {provinceName}
              </Link>
            ) : (
              provinceName ?? '—'
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('hotel.editorial.meta_star_address', 'Star & address')}
          </dt>
          <dd className="mt-1.5 text-sm leading-snug text-mist">
            <span className="font-medium text-charcoal">
              {stars > 0
                ? t('hotel.detail.star_hotel', { count: stars })
                : t('hotel.editorial.meta_star_pending', 'Unrated property')}
            </span>
            {address ? (
              <span className="mt-1 block text-xs text-charcoal/55">
                {address}
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('hotel.editorial.meta_planning', 'Indicative planning')}
          </dt>
          <dd className="mt-1.5 font-display text-lg text-charcoal">
            {t('hotel.editorial.meta_rates_contact', 'Ask for rates')}
          </dd>
          <dd className="mt-1 text-xs leading-relaxed text-mist">
            {t(
              'hotel.editorial.meta_rates_note',
              'Final price depends on dates and room — confirmed on the room page or by message.',
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('hotel.editorial.meta_guest_notes', 'Guest notes')}
          </dt>
          <dd className="mt-1.5 text-sm text-charcoal">
            {ratingAvg != null && reviewCount != null && reviewCount > 0 ? (
              <>
                <span className="font-display text-xl text-charcoal">
                  {ratingAvg.toFixed(2)}
                </span>
                <span className="text-mist"> · </span>
                <span className="text-mist">
                  {t('hotel.editorial.meta_notes_count', {
                    count: reviewCount,
                    defaultValue: '{{count}} notes',
                  })}
                </span>
              </>
            ) : (
              <span className="text-mist">
                {t('hotel.editorial.meta_no_reviews', 'No notes yet')}
              </span>
            )}
            <span className="mt-1 block truncate text-xs text-charcoal/45">
              {name}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
