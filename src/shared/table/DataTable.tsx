// DataTable.tsx — TanStack Table core unchanged; UI styled (dashboard / UI UX Pro Max kit)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/shared/table/Pagination';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useServerTable } from '@hooks/useServerTable';
import * as I from '@/types/api';
import * as IC from '@/types/commons';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { ChevronDown, Inbox, Loader2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: I.ApiListResponse<TData>;
  tableState: IC.TableState;
  searchPlaceholder?: string;
  /** Hide global search input (e.g. server-only filters elsewhere) */
  hideSearch?: boolean;
  /** Override default empty state copy */
  emptyMessage?: string;
};

function DataTable<TData>({
  columns,
  data,
  tableState,
  searchPlaceholder,
  hideSearch = false,
  emptyMessage,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,
    isFetching,
  } = tableState;

  const { table, selectedRows } = useServerTable<TData>({
    data: data?.data ?? [],
    columns,
    meta: data?.meta ?? {
      pageIndex: 0,
      pageSize: 0,
      pageCount: 0,
      total: 0,
    },
    state: {
      pagination,
      setPagination,
      sorting,
      setSorting,
      globalFilter,
      setGlobalFilter,
      rowSelection,
      setRowSelection,
      isFetching,
    },
  });

  const placeholder = searchPlaceholder ?? t('bookings.table_search');
  const hasSelectableRows = columns.some((c) => 'id' in c && c.id === 'select');

  return (
    <div className="space-y-0 overflow-hidden rounded-xl border border-charcoal/10 bg-card shadow-soft">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-charcoal/10 bg-gradient-to-b from-sand-50/95 to-card px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-md sm:flex-row sm:items-center">
          {!hideSearch && (
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-charcoal/40"
                aria-hidden
              />
              <Input
                placeholder={placeholder}
                value={globalFilter}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                className="h-10 border-charcoal/15 bg-card pl-9 text-sm text-charcoal placeholder:text-charcoal/45 transition-colors duration-200 focus-visible:border-forest/40 focus-visible:ring-forest/25"
                aria-label={placeholder}
              />
            </div>
          )}
          {isFetching && (
            <span
              className="flex items-center gap-1.5 text-xs font-medium text-forest sm:ml-1 sm:shrink-0"
              aria-live="polite"
            >
              <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
              <span className="whitespace-nowrap">
                {t('bookings.table_loading')}
              </span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 cursor-pointer border-charcoal/15 bg-card text-sm font-medium text-charcoal shadow-soft transition-colors duration-200 hover:bg-charcoal/4"
              >
                {t('bookings.table_columns')}
                <ChevronDown className="ml-1 size-4 opacity-70" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[12rem]">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="cursor-pointer capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasSelectableRows && (
            <div className="flex w-full flex-wrap items-center gap-2 border-t border-charcoal/10 pt-3 sm:w-auto sm:border-t-0 sm:pt-0">
              <span className="text-xs font-medium text-charcoal/65 sm:text-sm">
                {t('bookings.table_selected', { count: selectedRows.length })}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 cursor-pointer border-forest/35 text-forest transition-colors hover:bg-charcoal/4"
                disabled={!selectedRows.length}
                onClick={() =>
                  console.log(
                    'Bulk pay:',
                    selectedRows.map((r) => (r as { id?: string }).id ?? r),
                  )
                }
              >
                {t('bookings.table_pay_selected')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 cursor-pointer border-rose-200 text-rose-700 transition-colors hover:bg-rose-50"
                disabled={!selectedRows.length}
                onClick={() =>
                  console.log(
                    'Bulk delete:',
                    selectedRows.map((r) => (r as { id?: string }).id ?? r),
                  )
                }
              >
                {t('bookings.table_delete_selected')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader className="sticky top-0 z-[1] border-b border-charcoal/10 bg-sand-50/90 shadow-[0_1px_0_0_oklch(22%_0.02_75/0.08)]">
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="border-b-charcoal/10 hover:bg-transparent"
              >
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className="h-11 whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-charcoal/70 sm:px-4"
                  >
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((r) => (
                <TableRow
                  key={r.id}
                  data-state={r.getIsSelected() && 'selected'}
                  className={cn(
                    'border-charcoal/8 transition-colors duration-150',
                    'hover:bg-sand-50/80',
                    'data-[state=selected]:bg-sand-100/90',
                  )}
                >
                  {r.getVisibleCells().map((c) => (
                    <TableCell
                      key={c.id}
                      className="align-top whitespace-normal px-3 py-3 text-sm leading-relaxed text-charcoal sm:px-4"
                    >
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 px-4 py-10 text-center text-charcoal/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Inbox
                      className="size-10 text-charcoal/25"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                    <span className="text-sm font-medium text-charcoal/60">
                      {emptyMessage ?? t('bookings.table_empty')}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        table={table}
        pageCount={data?.meta?.pageCount ?? 0}
        total={data?.meta?.total}
      />
    </div>
  );
}

export default DataTable;
