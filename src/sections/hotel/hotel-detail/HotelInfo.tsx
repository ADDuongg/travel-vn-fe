import type { Hotel, HotelTranslation } from '@/features/hotels/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { useAmenitiesQuery } from '@/features/amenities/hooks';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { BsGlobe2 } from 'react-icons/bs';
import { Card } from '@/components/ui/card';
import { Wifi, Coffee, Car, Bath, Wind, Shield } from 'lucide-react';

function iconForCode(code?: string) {
  const c = (code ?? '').toLowerCase();
  if (c.includes('wifi') || c.includes('internet')) return Wifi;
  if (c.includes('park')) return Car;
  if (c.includes('pool') || c.includes('bath')) return Bath;
  if (c.includes('ac') || c.includes('air')) return Wind;
  if (c.includes('breakfast') || c.includes('coffee')) return Coffee;
  if (c.includes('safe') || c.includes('security')) return Shield;
  return Wifi;
}

const HotelInfo = ({ hotel }: { hotel: Hotel }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = language || 'vi';
  const { data: amenitiesCatalog } = useAmenitiesQuery();

  const tr = hotel.translations?.[lang] as HotelTranslation | undefined;
  const trVi = hotel.translations?.vi as HotelTranslation | undefined;
  const trEn = hotel.translations?.en as HotelTranslation | undefined;

  const desc =
    tr?.description ?? trVi?.description ?? trEn?.description;
  const policies =
    tr?.policies ?? trVi?.policies ?? trEn?.policies;

  const contact = hotel.contact;
  const hasContact =
    contact && (contact.phone || contact.email || contact.website);

  const amenityRows = (hotel.amenities ?? []).map((a) => {
    const found = amenitiesCatalog?.find((x) => x._id === a._id);
    const label =
      found?.translations?.[lang as 'vi' | 'en']?.name ??
      found?.translations?.en?.name ??
      (a as { name?: string }).name ??
      (a as { code?: string }).code ??
      a._id;
    const Icon = iconForCode(found?.code);
    return { _id: a._id, label, Icon };
  });

  return (
    <section
      id="overview"
      className="scroll-mt-36 border-b border-[rgba(28,26,20,0.08)] pb-16 lg:pb-20"
    >
      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        <div className="col-span-12 lg:col-span-8">
          <h2
            className="mb-6 text-2xl font-semibold tracking-tight text-[#1c1a14] sm:text-3xl"
            style={{
              fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
            }}
          >
            {t('hotel.detail.about', 'About this property')}
          </h2>
          {desc ? (
            <div
              className="prose prose-slate max-w-none text-base leading-relaxed text-[rgba(28,26,20,0.75)] prose-headings:font-[family-name:var(--font-dm-serif-display)] dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          ) : (
            <p className="text-muted-foreground">
              {t('hotel.detail.no_description', 'No description available.')}
            </p>
          )}

          {amenityRows.length > 0 && (
            <div className="mt-10">
              <h3
                className="mb-4 text-xl font-semibold text-[#1c1a14]"
                style={{
                  fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
                }}
              >
                {t('hotel.detail.amenities', 'Amenities')}
              </h3>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {amenityRows.map(({ _id, label, Icon }) => (
                  <li
                    key={_id}
                    className="flex items-center gap-3 rounded-xl border border-[rgba(28,26,20,0.08)] bg-[#faf7f2] px-4 py-3 text-sm font-medium text-[#1c1a14]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4eae0] text-[#1e4d38]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {policies && policies.length > 0 && (
            <div className="mt-10 rounded-2xl border border-[rgba(28,26,20,0.1)] bg-[#ede7d9]/50 p-6">
              <h3
                className="mb-3 text-lg font-semibold text-[#1c1a14]"
                style={{
                  fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
                }}
              >
                {t('hotel.detail.policies', 'House rules')}
              </h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-[rgba(28,26,20,0.8)]">
                {policies.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4">
          {hasContact && (
            <div className="hidden md:block lg:sticky lg:top-28">
              <Card className="rounded-2xl border border-[rgba(28,26,20,0.1)] bg-card p-6 shadow-[var(--shadow-card)] lg:p-8">
                <h3
                  className="mb-6 text-xl font-semibold text-[#1c1a14]"
                  style={{
                    fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
                  }}
                >
                  {t('hotel.detail.contact_title', 'Contact')}
                </h3>
                <div className="space-y-5">
                  {contact!.phone && (
                    <a
                      href={`tel:${contact!.phone}`}
                      className="group flex cursor-pointer items-center gap-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c8102e]/10 text-[#c8102e] transition-colors group-hover:bg-[#c8102e] group-hover:text-white">
                        <FiPhone className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t('hotel.detail.call', 'Call')}
                        </p>
                        <p className="font-semibold text-foreground">
                          {contact!.phone}
                        </p>
                      </div>
                    </a>
                  )}
                  {contact!.email && (
                    <a
                      href={`mailto:${contact!.email}`}
                      className="group flex cursor-pointer items-center gap-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c8102e]/10 text-[#c8102e] transition-colors group-hover:bg-[#c8102e] group-hover:text-white">
                        <MdOutlineEmail className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t('hotel.detail.email', 'Email')}
                        </p>
                        <p className="break-all font-semibold text-foreground">
                          {contact!.email}
                        </p>
                      </div>
                    </a>
                  )}
                  {contact!.website && (
                    <a
                      href={
                        contact!.website.startsWith('http')
                          ? contact!.website
                          : `https://${contact!.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex cursor-pointer items-center gap-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c8102e]/10 text-[#c8102e] transition-colors group-hover:bg-[#c8102e] group-hover:text-white">
                        <BsGlobe2 className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t('hotel.detail.website', 'Website')}
                        </p>
                        <p className="break-all font-semibold text-foreground">
                          {contact!.website}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotelInfo;
