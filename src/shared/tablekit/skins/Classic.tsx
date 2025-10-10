// table/skins/Classic.tsx
import * as React from 'react';
import { useTableCtx } from '../context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { flexRender } from '@tanstack/react-table';

export function Toolbar() {
  const { table, state, selectedRows } = useTableCtx();
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search..."
          value={state.globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        {state.isFetching && (
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
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                className="capitalize"
                checked={col.getIsVisible()}
                onCheckedChange={(v) => col.toggleVisibility(!!v)}
              >
                {col.id}
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
          size="sm"
          disabled={!selectedRows.length}
          onClick={() => console.log('selectedRows', selectedRows)}
        >
          Bulk action
        </Button>
      </div>
    </div>
  );
}

export function TableView() {
  const { table } = useTableCtx();
  return (
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
              <TableRow key={r.id} data-state={r.getIsSelected() && 'selected'}>
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
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function Pagination() {
  const { table, meta, pages, start, end, state } = useTableCtx();
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = meta.pageCount || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Page <strong>{pageIndex + 1}</strong> of <strong>{pageCount}</strong>
        </span>
        {typeof meta.total === 'number' && (
          <span>
            Total: <strong>{meta.total}</strong> rows
          </span>
        )}
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
