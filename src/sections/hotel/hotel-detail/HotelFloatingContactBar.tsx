import { useTranslation } from 'react-i18next';
import { Phone, Mail, Share2 } from 'lucide-react';
import type { Hotel } from '@/features/hotels/types';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import { cn } from '@/lib/utils';

type Props = { hotel: Hotel; className?: string };

const itemClass =
  'flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1 py-1 text-center text-[11px] font-semibold text-[#1c1a14] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]/30 rounded-lg';

const iconWrap = (bg: string) =>
  `inline-flex h-9 w-9 items-center justify-center rounded-full ${bg}`;

export function HotelFloatingContactBar({ hotel, className }: Props) {
  const { t } = useTranslation();
  const contact = hotel.contact;
  const share = () => {
    const name =
      hotel.translations?.vi?.name ?? hotel.translations?.en?.name ?? hotel.slug;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      void navigator
        .share({ title: name, text: name, url })
        .catch(() => {
          void navigator.clipboard.writeText(url);
        });
    } else {
      void navigator.clipboard.writeText(url);
    }
  };

  if (!contact?.phone && !contact?.email) {
    return (
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(28,26,20,0.1)] bg-white/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden',
          className,
        )}
        role="toolbar"
        aria-label={t('hotel.detail.mobile_actions', 'Quick actions')}
      >
        <div className="mx-auto flex max-w-lg items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgba(28,26,20,0.1)] bg-stone-50 text-[#1c1a14] transition-colors hover:bg-stone-100"
            onClick={share}
            aria-label={t('common.share', 'Share')}
          >
            <Share2 className="size-5" />
          </button>
          <FavoriteButton
            entityType={FavoriteEntityType.HOTEL}
            entityId={hotel._id}
            initialIsFavorited={hotel.isFavorited}
            size="icon"
            className="h-11 w-11 cursor-pointer rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(28,26,20,0.1)] bg-white/95 px-1.5 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden',
        className,
      )}
      role="toolbar"
      aria-label={t('hotel.detail.mobile_actions', 'Quick actions')}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5">
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className={itemClass}>
            <span className={iconWrap('bg-[#d4eae0] text-[#1e4d38]')}>
              <Phone className="size-4" aria-hidden />
            </span>
            {t('hotel.detail.call_short', 'Call')}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className={itemClass}>
            <span className={iconWrap('bg-[#ede7d9] text-[#c8102e]')}>
              <Mail className="size-4" aria-hidden />
            </span>
            {t('hotel.detail.email_short', 'Email')}
          </a>
        )}
        <button
          type="button"
          className={itemClass}
          onClick={share}
        >
          <span className={iconWrap('bg-stone-100 text-[#1c1a14]')}>
            <Share2 className="size-4" aria-hidden />
          </span>
          {t('common.share', 'Share')}
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <FavoriteButton
            entityType={FavoriteEntityType.HOTEL}
            entityId={hotel._id}
            initialIsFavorited={hotel.isFavorited}
            size="icon"
            className="h-11 w-11 cursor-pointer rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
