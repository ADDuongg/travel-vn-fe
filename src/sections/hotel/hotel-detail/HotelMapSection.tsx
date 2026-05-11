import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import type { Hotel } from '@/features/hotels/types';
import { MapPin, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type HotelMapSectionProps = {
  hotel: Hotel;
  className?: string;
  /** When true, render map grid only (no outer section or H2 — parent supplies headings). */
  embedded?: boolean;
};

export function HotelMapSection({
  hotel,
  className,
  embedded = false,
}: HotelMapSectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lat = hotel.location?.lat;
  const lng = hotel.location?.lng;
  const [copied, setCopied] = useState(false);

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  const name =
    hotel.translations?.[language]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name ??
    hotel.slug;
  const address =
    hotel.translations?.[language]?.address ??
    hotel.translations?.vi?.address ??
    hotel.translations?.en?.address;
  const line = [address, name].filter(Boolean).join(' — ') || `${lat}, ${lng}`;

  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  const externalUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const copyAddress = () => {
    void navigator.clipboard.writeText(line).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const grid = (
    <div
      className={cn(
        'grid gap-6 lg:grid-cols-12',
        embedded ? className : undefined,
      )}
    >
        <div className="overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.1)] bg-[#faf7f2] shadow-[var(--shadow-card)] lg:col-span-8">
          <iframe
            title={t('hotel.detail.map_frame_title', {
              name,
              defaultValue: 'Map: {{name}}',
            })}
            src={embedUrl}
            className="aspect-[16/10] w-full min-h-[240px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="flex flex-col justify-center rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-sm lg:col-span-4">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d4eae0] text-[#1e4d38]">
              <MapPin className="size-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[rgba(28,26,20,0.5)]">
                {t('hotel.detail.address_label', 'Address')}
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[#1c1a14]">
                {line}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={copyAddress}
            >
              <Copy className="size-4" />
              {copied
                ? t('common.copied', 'Copied')
                : t('hotel.detail.copy_address', 'Copy address')}
            </Button>
            <Button asChild className="cursor-pointer">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="size-4" />
                {t('hotel.detail.open_maps', 'Open in Google Maps')}
              </a>
            </Button>
          </div>
        </div>
      </div>
  );

  if (embedded) {
    return grid;
  }

  return (
    <section
      id="location"
      className={cn(
        'scroll-mt-36 border-b border-[rgba(28,26,20,0.08)] py-12 lg:py-16',
        className,
      )}
    >
      <h2
        className="mb-2 text-2xl font-semibold text-[#1c1a14] sm:text-3xl"
        style={{
          fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
        }}
      >
        {t('hotel.detail.location_title', 'Location')}
      </h2>
      <p className="mb-6 text-sm text-[rgba(28,26,20,0.65)]">
        {t(
          'hotel.detail.location_sub',
          'See where you will stay and plan how to get there.',
        )}
      </p>
      {grid}
    </section>
  );
}
