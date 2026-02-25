// DataTable.tsx
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
import * as I from '@/interface/api';
import * as IC from '@/interface/commons';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: I.ApiListResponse<TData>;
  tableState: IC.TableState;
};

function DataTable<TData>({
  columns,
  data,
  tableState,
}: DataTableProps<TData>) {
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

  const { table, selectedRows, pages, start, end } = useServerTable<TData>({
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
    windowSize: 2,
  });

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search tour name..."
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-xs"
          />
          {isFetching && (
            <span className="text-xs text-muted-foreground">Loading…</span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </span>
          <Button
            variant="outline"
            size="md"
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

      {/* Table */}
      <div className="rounded-md border">
        <Table /* className="[&_td]:text-center [&_th]:text-center" */>
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

        <Pagination
          table={table}
          pageCount={data?.meta?.pageCount ?? 0}
          total={data?.meta?.total}
          pages={pages}
          start={start}
          end={end}
        />
      </div>
    </div>
  );
}

export default DataTable;
