import { useMemo, useState } from 'react';
import type { Hotel } from '@/features/hotels/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { MapPin, Share2, Star } from 'lucide-react';
import { FaStar } from 'react-icons/fa6';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
function getProvinceName(hotel: Hotel, lang: string): string | null {
  const province = hotel.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? null;
}

function buildImageList(hotel: Hotel) {
  const gallery = hotel.gallery ?? [];
  const thumbnail = hotel.thumbnail;
  if (thumbnail) {
    return [thumbnail, ...gallery].map((g) => ({
      _id: (g as { _id?: string })._id ?? g.url,
      url: g.url,
      alt: g.alt,
    }));
  }
  return gallery.map((g, i) => ({
    _id: `g-${i}`,
    url: g.url,
    alt: g.alt,
  }));
}

const HotelHeader = ({ hotel }: { hotel: Hotel }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = language || 'vi';
  const [lightbox, setLightbox] = useState(false);

  const name =
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name ??
    hotel.slug;
  const address =
    hotel.translations?.[lang]?.address ??
    hotel.translations?.vi?.address ??
    hotel.translations?.en?.address;
  const provinceName = getProvinceName(hotel, lang);
  const locationLine = [address, provinceName].filter(Boolean).join(', ') || null;

  const images = useMemo(() => buildImageList(hotel), [hotel]);

  const share = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      void navigator
        .share({ title: name, text: name, url })
        .catch(() => copyLink(url));
    } else {
      void copyLink(url);
    }
  };

  const copyLink = (url: string) => {
    void navigator.clipboard.writeText(url).then(() => {
      /* no toast lib — silent success */
    });
  };

  const summary = hotel.ratingSummary;
  const avg = summary?.average;
  const total = summary?.total;

  return (
    <section className="pt-2">
      {images.length > 0 && (
        <div className="mb-8 grid min-h-[280px] grid-cols-12 gap-3 md:mb-10 md:min-h-[500px] md:gap-4">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="relative col-span-12 min-h-[220px] cursor-pointer overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.1)] text-left ring-offset-2 transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/40 md:col-span-8 md:min-h-0"
            aria-label={t('hotel.detail.view_photos', 'View all photos')}
          >
            <img
              src={images[0].url}
              alt={images[0].alt ?? name}
              className="h-full w-full min-h-[220px] object-cover md:min-h-0"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c1a14]/50 to-transparent"
              aria-hidden
            />
            {images.length > 1 && (
              <span className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                {t('hotel.detail.photos_count', {
                  count: images.length,
                  defaultValue: `${images.length} photos`,
                })}
              </span>
            )}
          </button>
          <div className="col-span-12 grid h-full min-h-[200px] grid-cols-2 grid-rows-2 gap-3 md:col-span-4 md:min-h-0 md:gap-4">
            {images.slice(1, 5).map((img, idx) => (
              <button
                key={img._id}
                type="button"
                onClick={() => setLightbox(true)}
                className="relative min-h-[96px] cursor-pointer overflow-hidden rounded-xl border border-[rgba(28,26,20,0.1)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/40"
              >
                {idx === 3 && images.length > 5 ? (
                  <>
                    <img
                      src={img.url}
                      alt={img.alt ?? ''}
                      className="h-full w-full min-h-[96px] object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#1c1a14]/50 text-sm font-semibold text-white">
                      +{images.length - 5} {t('common.more', 'more')}
                    </div>
                  </>
                ) : (
                  <img
                    src={img.url}
                    alt={img.alt ?? ''}
                    className="h-full w-full min-h-[96px] object-cover transition-transform duration-500 hover:scale-105"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="mb-8 flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-[rgba(28,26,20,0.12)] bg-[#faf7f2] text-muted-foreground">
          {t('hotel.detail.no_photos', 'No images yet')}
        </div>
      )}

      <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {hotel.starRating != null && hotel.starRating > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(201,146,42,0.4)] bg-[#f5e9d0] px-3 py-1.5 text-sm font-semibold text-[#9a6b1a]">
                <FaStar className="size-4 fill-[#c9922a] text-[#c9922a]" />
                {t('hotel.detail.star_hotel', {
                  count: hotel.starRating,
                })}
              </span>
            )}
            {avg != null && avg > 0 && total != null && total > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(28,26,20,0.1)] bg-white px-3 py-1.5 text-sm font-medium text-[#1c1a14] shadow-sm">
                <Star className="size-4 fill-[#c9922a] text-[#c9922a]" />
                {avg.toFixed(1)} · {total} {t('hotel.detail.reviews_short', 'reviews')}
              </span>
            )}
          </div>
          <h1
            className="text-3xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-4xl xl:text-5xl"
            style={{
              fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
            }}
          >
            {name}
          </h1>
          {locationLine && (
            <p className="mt-3 flex items-start gap-2 text-base text-[rgba(28,26,20,0.7)]">
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-[#2d6a4f]"
                strokeWidth={2.25}
                aria-hidden
              />
              <span>{locationLine}</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={share}
            className="h-11 w-11 cursor-pointer rounded-full border-[rgba(28,26,20,0.12)]"
            aria-label={t('common.share', 'Share')}
          >
            <Share2 className="size-4" />
          </Button>
          <FavoriteButton
            entityType={FavoriteEntityType.HOTEL}
            entityId={hotel._id}
            initialIsFavorited={hotel.isFavorited}
            size="icon"
            className="h-11 w-11 rounded-full"
          />
        </div>
      </div>

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-h-[min(90vh,800px)] max-w-4xl overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-left font-['Playfair_Display',serif] text-xl text-[#1c1a14]">
              {name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {images.map((img) => (
              <div
                key={img._id}
                className="overflow-hidden rounded-lg border border-[rgba(28,26,20,0.08)]"
              >
                <img
                  src={img.url}
                  alt={img.alt ?? name}
                  className="h-full max-h-72 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HotelHeader;
