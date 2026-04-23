// shared/table/Pagination.tsx
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
    <div className="flex flex-col items-stretch gap-3 border-t border-slate-100 bg-[#F8FAFC]/40 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
        <span>
          {t('bookings.table_page_label')}{' '}
          <strong className="font-semibold text-[#1E3A8A]">
            {pageIndex + 1}
          </strong>{' '}
          {t('bookings.table_page_of')}{' '}
          <strong className="font-semibold text-[#1E3A8A]">
            {safePageCount}
          </strong>
        </span>
        {typeof total === 'number' && (
          <span className="text-slate-500">
            · <strong className="font-semibold text-slate-700">{total}</strong>{' '}
            {t('bookings.table_rows_short')}
          </span>
        )}
        <label className="inline-flex items-center gap-2 text-slate-600">
          <span className="sr-only">{t('bookings.table_page_size_aria')}</span>
          <select
            className={cn(
              'h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium',
              'text-[#1E40AF] shadow-sm transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30',
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
