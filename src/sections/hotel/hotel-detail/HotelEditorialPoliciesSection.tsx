import { useTranslation } from 'react-i18next';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import type { Hotel, HotelTranslation } from '@/features/hotels/types';
import { useAmenitiesQuery } from '@/features/amenities/hooks';
import { useLanguage } from '@/hooks/useLanguage';

type Props = { hotel: Hotel };

export function HotelEditorialPoliciesSection({ hotel }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = language || 'vi';
  const { data: amenitiesCatalog } = useAmenitiesQuery();

  const tr = hotel.translations?.[lang] as HotelTranslation | undefined;
  const trVi = hotel.translations?.vi as HotelTranslation | undefined;
  const trEn = hotel.translations?.en as HotelTranslation | undefined;
  const policies = tr?.policies ?? trVi?.policies ?? trEn?.policies;

  const amenityPills = (hotel.amenities ?? []).map((a) => {
    const found = amenitiesCatalog?.find((x) => x._id === a._id);
    const label =
      found?.translations?.[lang as 'vi' | 'en']?.name ??
      found?.translations?.en?.name ??
      (a as { name?: string }).name ??
      (a as { code?: string }).code ??
      a._id;
    return { _id: a._id, label };
  });

  if (
    (!policies || policies.length === 0) &&
    amenityPills.length === 0
  ) {
    return null;
  }

  const hasPolicyList = Boolean(policies && policies.length > 0);

  return (
    <section
      id="policies"
      className="scroll-mt-36 mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28"
    >
      {hasPolicyList ? (
        <>
          <Reveal className="mb-10 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('hotel.editorial.policies_kicker', 'House rules')}
            </p>
            <h2 className="font-display text-4xl text-charcoal">
              {t(
                'hotel.editorial.policies_title',
                'Policies without fine-print voice',
              )}
            </h2>
          </Reveal>
          <Stagger className="space-y-4">
            {policies!.map((p) => (
              <RevealItem key={p}>
                <div className="rounded-2xl border border-charcoal/10 bg-sand-50 px-6 py-4 text-mist shadow-soft md:px-8">
                  {p}
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </>
      ) : null}

      {amenityPills.length > 0 ? (
        <Reveal className={hasPolicyList ? 'mt-12' : ''}>
          <div className={hasPolicyList ? '' : 'mb-6 space-y-3'}>
            {!hasPolicyList ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                  {t('hotel.editorial.amenities_only_kicker', 'Comfort')}
                </p>
                <h2 className="font-display text-4xl text-charcoal">
                  {t('hotel.detail.amenities', 'Amenities')}
                </h2>
              </>
            ) : (
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('hotel.detail.amenities', 'Amenities')}
              </p>
            )}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {amenityPills.map((a) => (
              <li
                key={a._id}
                className="rounded-full border border-charcoal/12 bg-sand-100 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-charcoal/75"
              >
                {a.label}
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </section>
  );
}
