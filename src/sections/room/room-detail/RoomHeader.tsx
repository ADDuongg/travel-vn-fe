import { useMemo, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ratings } from '@/components/ui/rating';
import { MapPin, Share2 } from 'lucide-react';
import type { HotelRef, Room } from '@/features/rooms/types';

function getHotelDisplay(
  hotel: string | HotelRef | undefined,
  lang: string,
): string | null {
  if (!hotel || typeof hotel === 'string') return null;
  const name =
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name;
  return name ?? null;
}

function getProvinceDisplay(
  hotel: string | HotelRef | undefined,
  lang: string,
): string | null {
  if (!hotel || typeof hotel === 'string') return null;
  const province = hotel.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  const name = names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en;
  return name ?? null;
}

type RoomHeaderProps = {
  room: Room;
};

const RoomHeader = ({ room }: RoomHeaderProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [galleryOpen, setGalleryOpen] = useState(false);

  const images = useMemo(() => {
    if (!room) return [] as Array<{ _id: string; url: string; alt?: string }>;
    const list = (room.gallery ?? []).map((image, index) => ({
      _id: image._id ?? `g-${index}`,
      url: image.url,
      alt: image.alt,
    }));
    if (room.thumbnail?.url) {
      return [
        {
          _id: room.thumbnail._id ?? 'thumb',
          url: room.thumbnail.url,
          alt: room.thumbnail.alt,
        },
        ...list,
      ];
    }
    return list;
  }, [room]);

  const lang = language || 'vi';
  const roomName =
    room.translations?.[lang]?.name ??
    room.translations?.vi?.name ??
    room.translations?.en?.name ??
    room.roomType ??
    room.code;
  const hotelName = getHotelDisplay(room.hotelId, lang);
  const provinceName = getProvinceDisplay(room.hotelId, lang);
  const share = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      void navigator.share({ title: roomName, text: roomName, url }).catch(() => {
        void navigator.clipboard.writeText(url);
      });
      return;
    }
    void navigator.clipboard.writeText(url);
  };

  return (
    <header className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <section className="pt-2">
          {images.length > 0 && (
            <div className="mb-8 grid min-h-[280px] grid-cols-12 gap-3 md:mb-10 md:min-h-[500px] md:gap-4">
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="relative col-span-12 min-h-[220px] cursor-pointer overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.1)] text-left transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)] md:col-span-8 md:min-h-0"
              >
                <img
                  src={images[0].url}
                  alt={images[0].alt ?? roomName}
                  className="h-full w-full min-h-[220px] object-cover md:min-h-0"
                />
              </button>
              <div className="col-span-12 grid min-h-[200px] grid-cols-2 grid-rows-2 gap-3 md:col-span-4 md:min-h-0 md:gap-4">
                {images.slice(1, 5).map((image, idx) => (
                  <button
                    key={image._id}
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="relative min-h-[96px] cursor-pointer overflow-hidden rounded-xl border border-[rgba(28,26,20,0.1)] text-left"
                  >
                    <img
                      src={image.url}
                      alt={image.alt ?? roomName}
                      className="h-full w-full min-h-[96px] object-cover"
                    />
                    {idx === 3 && images.length > 5 && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#1c1a14]/50 text-sm font-semibold text-white">
                        +{images.length - 5} {t('common.more', 'more')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-h-[min(90vh,800px)] max-w-4xl overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-left font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]">
              {roomName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {images.map((image) => (
              <div
                key={image._id}
                className="overflow-hidden rounded-lg border border-[rgba(28,26,20,0.08)]"
              >
                <img
                  src={image.url}
                  alt={image.alt ?? roomName}
                  className="h-full max-h-72 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-[#F8F8F6]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {(hotelName || provinceName) && (
              <Badge
                variant="secondary"
                className="border border-[rgba(45,106,79,0.25)] bg-[#d4eae0] text-[#1e4d38]"
              >
                <MapPin className="mr-1 size-3" />
                {[hotelName, provinceName].filter(Boolean).join(' • ')}
              </Badge>
            )}
            {room.roomType && (
              <span className="rounded-full border border-[rgba(28,26,20,0.1)] bg-white px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-[rgba(28,26,20,0.6)]">
                {room.roomType}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
              <h1 className="font-['Playfair_Display',serif] text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1c1a14] sm:text-4xl md:text-5xl">
                {roomName}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[rgba(28,26,20,0.6)] sm:text-lg">
                {t('room.detail.capacity', {
                  defaultValue: 'Max {{count}} guests · {{size}} m2',
                  count: room.maxGuests,
                  size: room.roomSize ?? '—',
                })}
              </p>
              {room.ratingSummary?.average > 0 && room.ratingSummary?.total > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Ratings
                      rating={room.ratingSummary.average}
                      variant="yellow"
                      totalStars={5}
                      readOnly
                      size={16}
                    />
                    <span className="text-sm font-semibold text-[#1c1a14]">
                      {room.ratingSummary.average.toFixed(1)}
                    </span>
                    <span className="text-sm text-[rgba(28,26,20,0.5)]">
                      ({room.ratingSummary.total} {t('room.reviews', 'reviews')})
                    </span>
                  </div>
                </div>
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
                entityType={FavoriteEntityType.ROOM}
                entityId={room._id}
                initialIsFavorited={room.isFavorited}
                className="h-12 w-12 cursor-pointer rounded-full border border-[rgba(28,26,20,0.1)] bg-white shadow-sm"
                size="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RoomHeader;
