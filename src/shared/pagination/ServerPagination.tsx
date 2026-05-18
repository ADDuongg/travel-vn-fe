import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

type PaginationToken = number | '…';

function getVisiblePages(currentPage: number, totalPages: number): PaginationToken[] {
  if (totalPages <= 1) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set(
    [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(
      (p) => p >= 1 && p <= totalPages,
    ),
  );

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const visible: PaginationToken[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      visible.push('…');
    }
    visible.push(sorted[i]!);
  }

  return visible;
}

type ServerPaginationLabels = {
  previous?: string;
  next?: string;
  pageAriaLabel?: string;
};

type ServerPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPrevNextLabel?: boolean;
  labels?: ServerPaginationLabels;
};

export default function ServerPagination({
  page,
  totalPages,
  onPageChange,
  className,
  showPrevNextLabel = false,
  labels,
}: ServerPaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const pageButtons = React.useMemo(
    () => getVisiblePages(safePage, safeTotalPages),
    [safePage, safeTotalPages],
  );

  if (safeTotalPages <= 1) return null;

  return (
    <nav className={cn('flex flex-wrap items-center justify-center gap-2', className)} aria-label={labels?.pageAriaLabel}>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        disabled={safePage <= 1}
        onClick={() => onPageChange(Math.max(1, safePage - 1))}
        aria-label={labels?.previous}
      >
        <ChevronLeft className="size-4" />
        {showPrevNextLabel ? <span>{labels?.previous}</span> : null}
      </Button>

      {pageButtons.map((token, idx) =>
        token === '…' ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-sm text-[rgba(28,26,20,0.4)]">
            …
          </span>
        ) : (
          <Button
            key={token}
            type="button"
            variant={safePage === token ? 'default' : 'outline'}
            className={cn(
              'min-w-10 cursor-pointer',
              safePage === token &&
                'bg-[#c8102e] text-white hover:bg-[#a50d25] hover:text-white',
            )}
            onClick={() => onPageChange(token)}
          >
            {token}
          </Button>
        ),
      )}

      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        disabled={safePage >= safeTotalPages}
        onClick={() => onPageChange(Math.min(safeTotalPages, safePage + 1))}
        aria-label={labels?.next}
      >
        {showPrevNextLabel ? <span>{labels?.next}</span> : null}
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

