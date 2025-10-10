// --- đặt dưới cùng file, thay DataTable cũ ---
// TourBookingPage.tsx
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { compareByKey } from '@utils/index';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
type BookingStatus =
  | 'all'
  | 'pending'
  | 'approved'
  | 'receipt_submitted'
  | 'online_paid'
  | 'deposit_paid'
  | 'departed'
  | 'rejected'
  | 'wait_for_approval';
type PaymentStatus = 'pending' | 'paid' | 'refunded';

type BookingRow = {
  id: string;
  tourName: string;
  tourUrl?: string;
  travelDate: string; // ISO
  total: number; // USD
  status: BookingStatus;
  paymentStatus: PaymentStatus;
};

const DataTable: React.FC<{
  columns: ColumnDef<BookingRow>[];
  data: BookingRow[]; // 👈 đổi sang mảng thô
}> = ({ columns, data }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data, // 👈 đưa full array
    columns,
    state: { rowSelection, globalFilter, sorting },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,

    // ✅ client-side models
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
    getRowId: (r) => r.id,
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const start = Math.max(0, pageIndex - 2);
  const end = Math.min(pageCount - 1, pageIndex + 2);
  const pages = Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, i) => start + i,
  );
  return (
    <div className="space-y-3">
      {/* Toolbar: search + bulk actions */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search tour name..."
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </span>
          <Button
            variant="outline"
            size={'md'}
            disabled={!selectedRows.length}
            onClick={() =>
              console.log(
                'Bulk pay:',
                selectedRows.map((r) => r.id),
              )
            }
          >
            Pay selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={!selectedRows.length}
            onClick={() =>
              console.log(
                'Bulk delete:',
                selectedRows.map((r) => r.id),
              )
            }
          >
            Delete selected
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-muted-foreground">
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
                >
                  {r.getVisibleCells().map((c) => (
                    <TableCell key={c.id}>
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination: Prev | 1 2 3 | Next + Page size + tổng bản ghi */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              Page <strong>{pageIndex + 1}</strong> of{' '}
              <strong>{pageCount || 1}</strong>
            </span>
            <select
              className="h-9 rounded-md border px-2 text-sm"
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((s) => (
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
              disabled={!table.getCanPreviousPage()}
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
                {start > 1 && (
                  <span className="px-1 text-muted-foreground">…</span>
                )}
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
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
