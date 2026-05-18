import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { Hotel } from '@/features/hotels/types';
import { ROUTES } from '@/constants/router';

type Props = { hotel: Hotel; lang: string };

export function HotelEditorialPlanSection({ hotel, lang }: Props) {
  const { t } = useTranslation();
  const contact = hotel.contact;
  const name =
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name ??
    hotel.slug;
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

  const websiteHref =
    contact?.website != null && contact.website.length > 0
      ? contact.website.startsWith('http')
        ? contact.website
        : `https://${contact.website}`
      : null;

  return (
    <section
      id="plan"
      className="scroll-mt-36 mx-auto max-w-6xl px-4 pb-12 md:px-10 md:pb-20"
    >
      <Reveal className="mb-10 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('hotel.editorial.plan_kicker', 'Correspondence')}
        </p>
        <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
          {t('hotel.editorial.plan_title', 'Plan this stay slowly')}
        </h2>
        <p className="max-w-2xl text-sm text-mist">
          {t(
            'hotel.editorial.plan_lead',
            'Share dates and room preference. We confirm availability and next steps by message or phone.',
          )}
        </p>
      </Reveal>
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-charcoal/10 bg-sand-50 p-8 shadow-soft md:flex-row md:flex-wrap md:items-center md:gap-6">
        {contact?.phone ? (
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className="rounded-full bg-forest px-6 py-3 text-center text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-forest-soft"
          >
            {t('hotel.detail.call', 'Call')}
          </a>
        ) : null}
        {contact?.email ? (
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(`Inquiry: ${name}`)}`}
            className="rounded-full border border-charcoal/20 px-6 py-3 text-center text-sm font-semibold text-charcoal transition hover:border-forest/40"
          >
            {t('hotel.detail.email', 'Email')}
          </a>
        ) : null}
        {websiteHref ? (
          <a
            href={websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-charcoal/20 px-6 py-3 text-center text-sm font-semibold text-charcoal transition hover:border-forest/40"
          >
            {t('hotel.editorial.plan_property_site', 'Property site ↗')}
          </a>
        ) : null}
        <Link
          to={`${ROUTES.CONTACT}?stay=${encodeURIComponent(hotel._id)}`}
          className="rounded-full bg-charcoal px-6 py-3 text-center text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-charcoal/90"
        >
          {t('hotel.editorial.plan_write_platform', 'Write via Đất Việt')}
        </Link>
      </div>
      <Reveal className="mt-14 flex flex-wrap gap-4">
        <Link
          to={ROUTES.LIST_HOTELS}
          className="rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-forest/40"
        >
          {t('hotel.editorial.plan_all_stays', 'All stays')}
        </Link>
        {provinceSlug && provinceName ? (
          <Link
            to={ROUTES.PROVINCE.DETAIL.replace(':slug', provinceSlug)}
            className="rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-forest/40"
          >
            {t('hotel.editorial.plan_province_atlas', 'Province atlas')}
          </Link>
        ) : null}
      </Reveal>
    </section>
  );
}

