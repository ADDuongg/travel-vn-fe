import type { Hotel } from '@/features/hotels/types';
import SharedHeader from '@/sections/shared/SharedHeader';
import { useLanguage } from '@/hooks/useLanguage';
import { FaStar, FaLocationDot } from 'react-icons/fa6';

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

  const detailItems = [
    ...(hotel.starRating
      ? [
          {
            icon: <FaStar size={20} className="text-amber-500 fill-amber-500" />,
            value: <span>{hotel.starRating} Star Hotel</span>,
          },
        ]
      : []),
    ...(provinceName || address
      ? [
          {
            icon: <FaLocationDot size={20} />,
            value: (
              <span>
                {[address, provinceName].filter(Boolean).join(', ')}
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <SharedHeader
      title={name}
      subtitle={provinceName ?? undefined}
      rating={undefined}
      reviewCount={undefined}
      details={detailItems}
      GalleryComponent={
        images.length > 0 ? (
          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-12 md:col-span-8 rounded-xl overflow-hidden ring-1 ring-border aspect-[16/9]">
              <img
                src={images[0].url}
                alt={images[0].alt ?? name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
              {images.slice(1, 5).map((img) => (
                <div
                  key={img._id}
                  className="rounded-xl overflow-hidden ring-1 ring-border aspect-square"
                >
                  <img
                    src={img.url}
                    alt={img.alt ?? ''}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 aspect-[16/9] rounded-xl bg-slate-200 flex items-center justify-center">
            <span className="text-gray-500">No images</span>
          </div>
        )
      }
    />
  );
};

export default HotelHeader;
