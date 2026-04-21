import type { Hotel } from '@/features/hotels/types';
import { useLanguage } from '@/hooks/useLanguage';
import { FaStar, FaLocationDot } from 'react-icons/fa6';
import { ResponsiveH1 } from '@/components/ui/typography';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';

function getProvinceName(hotel: Hotel, lang: string): string | null {
  const province = hotel.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? null;
}

const HotelHeader = ({ hotel }: { hotel: Hotel }) => {
  const { language } = useLanguage();
  const lang = language || 'vi';
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

  const gallery = hotel.gallery ?? [];
  const thumbnail = hotel.thumbnail;
  const images = thumbnail
    ? [thumbnail, ...gallery].map((g) => ({
        _id: (g as { _id?: string })._id ?? g.url,
        url: g.url,
        alt: g.alt,
      }))
    : gallery.map((g, i) => ({
        _id: `g-${i}`,
        url: g.url,
        alt: g.alt,
      }));

  return (
    <section className="mt-20">
      {/* Hero: badge, title, address */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {hotel.starRating != null && hotel.starRating > 0 && (
                <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5">
                  <FaStar className="size-[18px] fill-current" />
                  {hotel.starRating} Star Hotel
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <ResponsiveH1 className="font-bold tracking-tight text-foreground mb-2">
                {name}
              </ResponsiveH1>
              <FavoriteButton
                entityType={FavoriteEntityType.HOTEL}
                entityId={hotel._id}
                initialIsFavorited={hotel.isFavorited}
                size="icon"
                className="h-10 w-10 rounded-full"
              />
            </div>
            {locationLine && (
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <FaLocationDot className="size-5 text-primary shrink-0" />
                {locationLine}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Image gallery (bento: main + 2x2 grid) */}
      {images.length > 0 && (
        <section className="grid grid-cols-12 gap-4 mb-16 min-h-[320px] md:h-[500px]">
          <div className="col-span-12 md:col-span-8 h-full min-h-[240px] md:min-h-0">
            <img
              src={images[0].url}
              alt={images[0].alt ?? name}
              className="w-full h-full object-cover rounded-xl shadow-sm border border-border"
            />
          </div>
          <div className="col-span-12 md:col-span-4 grid grid-cols-2 grid-rows-2 gap-4 h-full min-h-[240px] md:min-h-0">
            {images.slice(1, 5).map((img, idx) => (
              <div key={img._id} className="relative overflow-hidden rounded-xl border border-border">
                {idx === 3 && images.length > 5 ? (
                  <>
                    <img
                      src={img.url}
                      alt={img.alt ?? ''}
                      className="w-full h-full object-cover min-h-[120px]"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                      +{images.length - 5} Photos
                    </div>
                  </>
                ) : (
                  <img
                    src={img.url}
                    alt={img.alt ?? ''}
                    className="w-full h-full object-cover min-h-[120px]"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {images.length === 0 && (
        <div className="mb-16 aspect-[16/9] rounded-xl bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No images</span>
        </div>
      )}
    </section>
  );
};

export default HotelHeader;
