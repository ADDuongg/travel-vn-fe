import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import { cn } from '@/lib/utils';

type Props = {
  tourId: string;
  title: string;
  initialIsFavorited?: boolean;
};

function IconShare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M18 8a3 3 0 1 0-2.83-4M18 8a3 3 0 1 1-2.83-4M18 8v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-8M6 15a3 3 0 1 0 2.83 4M6 15a3 3 0 1 1 2.83 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JourneyShareSave({
  tourId,
  title,
  initialIsFavorited,
}: Props) {
  const { t } = useTranslation();

  const onShare = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {
        /* dismissed */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard blocked */
    }
  }, [title]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void onShare()}
        aria-label={t('tour.journey.share.aria', 'Share this tour')}
        className="inline-flex items-center gap-2 rounded-full border border-charcoal/12 bg-sand-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/75 shadow-sm transition hover:border-forest/30 hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      >
        <IconShare className="text-charcoal/60" />
        {t('tour.journey.share.label', 'Share')}
      </button>
      <FavoriteButton
        entityType={FavoriteEntityType.TOUR}
        entityId={tourId}
        initialIsFavorited={initialIsFavorited}
        className={cn(
          'inline-flex size-auto items-center gap-2 rounded-full border-charcoal/12 bg-sand-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/75 shadow-sm transition hover:border-forest/30 hover:bg-sand-50 hover:text-forest',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest',
        )}
        size="sm"
      />
    </div>
  );
}
