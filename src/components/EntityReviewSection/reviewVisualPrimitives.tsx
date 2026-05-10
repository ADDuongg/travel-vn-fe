import { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

/** Open Design–style field (JourneyReviews `field` constant). */
export const REVIEW_OD_FIELD =
  'w-full rounded-2xl border border-charcoal/12 bg-sand-50/90 px-4 py-3 text-[0.95rem] text-charcoal shadow-inner outline-none transition placeholder:text-charcoal/35 focus:border-forest/35 focus:ring-2 focus:ring-forest/15';

export const REVIEW_OD_SELECT =
  'min-w-[min(100%,12rem)] rounded-2xl border border-charcoal/12 bg-sand-100/90 px-4 py-3 text-sm font-medium text-charcoal shadow-inner outline-none focus:border-forest/35 focus:ring-2 focus:ring-forest/15';

export function reviewDisplayInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatReviewDate(iso: string, locale?: string): string {
  try {
    return new Intl.DateTimeFormat(locale ?? undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function StarRow({
  rating,
  ariaLabel,
}: {
  rating: number;
  ariaLabel: string;
}) {
  const r = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex gap-0.5" role="img" aria-label={ariaLabel}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            'text-[0.95rem] leading-none',
            i <= r ? 'text-sunset-deep' : 'text-charcoal/22',
          )}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function StarPicker({
  value,
  onChange,
  idPrefix,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  idPrefix: string;
  label: string;
}) {
  const safe =
    typeof value === 'number' && !Number.isNaN(value)
      ? Math.min(5, Math.max(1, value))
      : 1;

  const barRef = useRef<HTMLDivElement>(null);

  const pickFromClientX = useCallback(
    (clientX: number) => {
      const el = barRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0) return;
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const n = Math.ceil((x / rect.width) * 5);
      onChange(Math.min(5, Math.max(1, n)));
    },
    [onChange],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className="text-[11px] uppercase tracking-[0.22em] text-charcoal/45"
        id={`${idPrefix}-rating-label`}
      >
        {label}
      </span>
      <div
        ref={barRef}
        id={`${idPrefix}-rating-bar`}
        role="slider"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={safe}
        aria-labelledby={`${idPrefix}-rating-label`}
        aria-label={label}
        tabIndex={0}
        className={cn(
          'inline-flex h-11 min-w-[220px] max-w-full cursor-pointer rounded-full border border-charcoal/15',
          'bg-sand-50/90 px-1 shadow-inner outline-none transition',
          'focus-visible:ring-2 focus-visible:ring-forest/35',
        )}
        onMouseMove={(e) => pickFromClientX(e.clientX)}
        onClick={(e) => pickFromClientX(e.clientX)}
        onTouchEnd={(e) => {
          const t = e.changedTouches[0];
          if (t) pickFromClientX(t.clientX);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(Math.min(5, safe + 1));
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(Math.max(1, safe - 1));
          }
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              'pointer-events-none flex flex-1 items-center justify-center text-2xl leading-none transition-colors',
              n <= safe ? 'text-sunset-deep drop-shadow-sm' : 'text-charcoal/28',
            )}
            aria-hidden
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
