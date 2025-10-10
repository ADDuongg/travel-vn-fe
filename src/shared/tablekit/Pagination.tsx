// shared/tablekit/Pagination.tsx
import * as React from 'react';
import { type Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

type Props<T> = {
  table: Table<T>;
  pageCount: number;
  total?: number;
  pages: number[]; // từ hook
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
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Page <strong>{pageIndex + 1}</strong> of{' '}
          <strong>{pageCount || 1}</strong>
        </span>
        {typeof total === 'number' && (
          <span>
            {' '}
            Total: <strong>{total}</strong> rows{' '}
          </span>
        )}
        <select
          className="h-9 rounded-md border px-2 text-sm"
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>

        {start > 0 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.setPageIndex(0)}
            >
              1
            </Button>
            {start > 1 && <span className="px-1 text-muted-foreground">…</span>}
          </>
        )}

        {pages.map((p) => (
          <Button
            key={p}
            variant={p === pageIndex ? 'default' : 'ghost'}
            size="sm"
            onClick={() => table.setPageIndex(p)}
          >
            {p + 1}
          </Button>
        ))}

        {end < pageCount - 1 && (
          <>
            {end < pageCount - 2 && (
              <span className="px-1 text-muted-foreground">…</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.setPageIndex(pageCount - 1)}
            >
              {pageCount}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={pageIndex + 1 >= pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
