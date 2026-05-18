import { cn } from '@/lib/utils';
import { type Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import ServerPagination from '@/shared/pagination/ServerPagination';

type Props<T> = {
  table: Table<T>;
  pageCount: number;
  total?: number;
  pageSizeOptions?: number[];
};

export function Pagination<T>({
  table,
  pageCount,
  total,
  pageSizeOptions = [5, 10, 20, 50],
}: Props<T>) {
  const { t } = useTranslation();
  const { pageIndex, pageSize } = table.getState().pagination;
  const safePageCount = Math.max(pageCount || 1, 1);

  return (
    <div className="flex flex-col items-stretch gap-3 border-t border-charcoal/10 bg-sand-50/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-charcoal/65">
        <span>
          {t('bookings.table_page_label')}{' '}
          <strong className="font-semibold text-charcoal">
            {pageIndex + 1}
          </strong>{' '}
          {t('bookings.table_page_of')}{' '}
          <strong className="font-semibold text-charcoal">
            {safePageCount}
          </strong>
        </span>
        {typeof total === 'number' && (
          <span className="text-charcoal/50">
            · <strong className="font-semibold text-charcoal">{total}</strong>{' '}
            {t('bookings.table_rows_short')}
          </span>
        )}
        <label className="inline-flex items-center gap-2 text-charcoal/65">
          <span className="sr-only">{t('bookings.table_page_size_aria')}</span>
          <select
            className={cn(
              'h-9 cursor-pointer rounded-lg border border-charcoal/15 bg-card px-2.5 text-sm font-medium',
              'text-charcoal shadow-soft transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30',
            )}
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
                {t('bookings.table_per_page_suffix')}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ServerPagination
        page={pageIndex + 1}
        totalPages={safePageCount}
        onPageChange={(next) => table.setPageIndex(next - 1)}
        showPrevNextLabel
        labels={{
          previous: t('bookings.table_prev'),
          next: t('bookings.table_next'),
          pageAriaLabel: t('bookings.table_page_label'),
        }}
        className="sm:justify-end"
      />
    </div>
  );
}

