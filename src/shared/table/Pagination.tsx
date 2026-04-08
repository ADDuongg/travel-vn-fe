// shared/table/Pagination.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

type Props<T> = {
  table: Table<T>;
  pageCount: number;
  total?: number;
  pages: number[];
  start: number;
  end: number;
  pageSizeOptions?: number[];
};

export function Pagination<T>({
  table,
  pageCount,
  total,
  pages,
  start,
  end,
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
          <strong className="font-semibold text-[#1E3A8A]">{pageIndex + 1}</strong>{' '}
          {t('bookings.table_page_of')}{' '}
          <strong className="font-semibold text-[#1E3A8A]">{safePageCount}</strong>
        </span>
        {typeof total === 'number' && (
          <span className="text-slate-500">
            ·{' '}
            <strong className="font-semibold text-slate-700">{total}</strong>{' '}
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

      <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 cursor-pointer border-slate-200 text-[#1E3A8A] hover:bg-white"
          onClick={() => table.previousPage()}
          disabled={pageIndex === 0}
        >
          {t('bookings.table_prev')}
        </Button>

        {start > 0 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 min-w-9 cursor-pointer px-2 text-[#1E3A8A] hover:bg-slate-100"
              onClick={() => table.setPageIndex(0)}
            >
              1
            </Button>
            {start > 1 && (
              <span className="px-1 text-slate-400" aria-hidden>
                …
              </span>
            )}
          </>
        )}

        {pages.map((p) => (
          <Button
            key={p}
            type="button"
            variant={p === pageIndex ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'h-9 min-w-9 cursor-pointer px-2 font-medium',
              p === pageIndex
                ? 'bg-[#1E3A8A] text-white shadow-sm hover:bg-[#1E3A8A]/90'
                : 'text-[#1E3A8A] hover:bg-slate-100',
            )}
            onClick={() => table.setPageIndex(p)}
          >
            {p + 1}
          </Button>
        ))}

        {end < safePageCount - 1 && (
          <>
            {end < safePageCount - 2 && (
              <span className="px-1 text-slate-400" aria-hidden>
                …
              </span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 min-w-9 cursor-pointer px-2 text-[#1E3A8A] hover:bg-slate-100"
              onClick={() => table.setPageIndex(safePageCount - 1)}
            >
              {safePageCount}
            </Button>
          </>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 cursor-pointer border-slate-200 text-[#1E3A8A] hover:bg-white"
          onClick={() => table.nextPage()}
          disabled={pageIndex + 1 >= safePageCount}
        >
          {t('bookings.table_next')}
        </Button>
      </div>
    </div>
  );
}
