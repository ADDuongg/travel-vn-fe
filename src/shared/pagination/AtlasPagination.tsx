import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type PageToken = number | 'ellipsis';

function atlasPageItemsOneBased(current: number, totalPages: number): PageToken[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const windowRadius = 2;
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let i = current - windowRadius; i <= current + windowRadius; i++) {
    if (i > 1 && i < totalPages) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const out: PageToken[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      out.push('ellipsis');
    }
    out.push(sorted[i]!);
  }
  return out;
}

export type AtlasPaginationLabels = {

  showingRange: string;

  folioLabel: string;

  prevSpread: string;

  nextSpread: string;

  spreadNavLabel: string;
};

type AtlasPaginationProps = {

  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  labels: AtlasPaginationLabels;
};

export function AtlasPagination({
  page,
  totalPages,
  onPageChange,
  className,
  labels,
}: AtlasPaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const items = useMemo(
    () => atlasPageItemsOneBased(safePage, safeTotalPages),
    [safePage, safeTotalPages],
  );

  const canPrev = safePage > 1;
  const canNext = safePage < safeTotalPages;

  if (safeTotalPages <= 1) return null;

  return (
    <nav
      aria-label={labels.spreadNavLabel}
      className={cn(
        'flex flex-col items-stretch gap-6 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-2 text-center md:text-left">
        <p className="text-[11px] uppercase tracking-[0.28em] text-charcoal/40">{labels.showingRange}</p>
        <p className="font-display text-lg text-charcoal/55">
          {labels.folioLabel}{' '}
          <span className="text-charcoal">{String(safePage).padStart(2, '0')}</span>
          <span className="mx-2 text-charcoal/25">/</span>
          <span className="text-charcoal/70">{String(safeTotalPages).padStart(2, '0')}</span>
        </p>
      </div>

      <div className="flex w-full max-w-[min(100%,560px)] items-center justify-center gap-1 rounded-2xl border border-charcoal/10 bg-sand-50/95 px-2 py-2 shadow-soft backdrop-blur-[2px] sm:w-auto sm:max-w-none sm:gap-1.5 sm:px-3 md:ml-auto">
        <PaginationArrow
          direction="prev"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(safePage - 1)}
          label={labels.prevSpread}
        />

        <div className="mx-1 flex min-h-[2.5rem] flex-wrap items-center justify-center gap-1 sm:mx-2">
          {items.map((item, idx) =>
            item === 'ellipsis' ? (
              <span
                key={`e-${idx}`}
                className="select-none px-1.5 font-display text-lg leading-none text-charcoal/30"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === safePage ? 'page' : undefined}
                className={cn(
                  'flex min-h-9 min-w-9 items-center justify-center rounded-xl border text-xs font-semibold tabular-nums transition',
                  item === safePage
                    ? 'border-forest bg-forest text-sand-50 shadow-[0_10px_28px_-14px_oklch(28%_0.045_165/0.55)]'
                    : 'border-transparent text-charcoal/75 hover:border-charcoal/15 hover:bg-charcoal/[0.04]',
                )}
              >
                {String(item).padStart(2, '0')}
              </button>
            ),
          )}
        </div>

        <PaginationArrow
          direction="next"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(safePage + 1)}
          label={labels.nextSpread}
        />
      </div>
    </nav>
  );
}

function PaginationArrow({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-charcoal/10 text-charcoal transition enabled:hover:border-forest/35 enabled:hover:bg-charcoal/[0.03] enabled:hover:text-forest disabled:cursor-not-allowed disabled:opacity-30"
    >
      <span className="sr-only">{label}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {direction === 'prev' ? (
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

