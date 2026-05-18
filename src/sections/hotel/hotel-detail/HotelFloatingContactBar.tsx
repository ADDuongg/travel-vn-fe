import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Share2 } from 'lucide-react';
import type { Hotel } from '@/features/hotels/types';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/router';

type Props = { hotel: Hotel; className?: string };

const shellClass =
  'fixed inset-x-0 bottom-0 z-50 border-t border-charcoal/15 bg-sand-50/92 px-4 py-3 shadow-[0_-12px_40px_-20px_oklch(22%_0.02_75/0.35)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden';

const itemClass =
  'flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1 py-1 text-center text-[11px] font-semibold text-charcoal/90 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 rounded-lg';

const iconWrap = (bg: string) =>
  `inline-flex h-9 w-9 items-center justify-center rounded-full ${bg}`;

export function HotelFloatingContactBar({ hotel, className }: Props) {
  const { t } = useTranslation();
  const contact = hotel.contact;
  const name =
    hotel.translations?.vi?.name ?? hotel.translations?.en?.name ?? hotel.slug;

  const share = () => {
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
      <div className={cn(shellClass, className)} role="toolbar" aria-label={t('hotel.detail.mobile_actions', 'Quick actions')}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-[0.28em] text-charcoal/45">
              {t('hotel.editorial.float_correspondence', 'Correspondence')}
            </p>
            <p className="truncate font-display text-lg text-charcoal">{name}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={`${ROUTES.CONTACT}?stay=${encodeURIComponent(hotel._id)}`}
              className="rounded-full border border-charcoal/15 px-3 py-2 text-xs font-semibold text-charcoal/80 transition hover:border-forest/35 hover:text-forest"
            >
              {t('hotel.editorial.float_note', 'Note')}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-charcoal/10 bg-sand-100 text-charcoal"
              onClick={share}
              aria-label={t('common.share', 'Share')}
            >
              <Share2 className="size-4" />
            </button>
            <FavoriteButton
              entityType={FavoriteEntityType.HOTEL}
              entityId={hotel._id}
              initialIsFavorited={hotel.isFavorited}
              size="icon"
              className="h-10 w-10 cursor-pointer rounded-full border border-charcoal/10 bg-sand-100"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(shellClass, className)} role="toolbar" aria-label={t('hotel.detail.mobile_actions', 'Quick actions')}>
      <div className="mx-auto flex max-w-6xl items-stretch justify-between gap-1">
        {contact.phone && (
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={itemClass}>
            <span className={iconWrap('bg-forest/15 text-forest')}>
              <Phone className="size-4" aria-hidden />
            </span>
            {t('hotel.detail.call_short', 'Call')}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className={itemClass}>
            <span className={iconWrap('bg-sand-100 text-charcoal')}>
              <Mail className="size-4" aria-hidden />
            </span>
            {t('hotel.detail.email_short', 'Email')}
          </a>
        )}
        <Link
          to={`${ROUTES.CONTACT}?stay=${encodeURIComponent(hotel._id)}`}
          className={itemClass}
        >
          <span className={iconWrap('border border-charcoal/12 bg-sand-100 text-charcoal')}>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {t('hotel.editorial.float_note', 'Note')}
            </span>
          </span>
          {t('hotel.editorial.float_write', 'Write')}
        </Link>
        <button type="button" className={itemClass} onClick={share}>
          <span className={iconWrap('bg-sand-100 text-charcoal')}>
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
            className="h-10 w-10 cursor-pointer rounded-full border border-charcoal/10 bg-sand-100"
          />
        </div>
      </div>
    </div>
  );
}

