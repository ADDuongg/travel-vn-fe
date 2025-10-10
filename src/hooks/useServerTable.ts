// shared/tablekit/useServerTable.ts
import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type Table,
} from '@tanstack/react-table';
import type { TableState } from '@interface/commons';

export type PageMeta = {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  total?: number;
};

export function useServerTable<TData extends { id: string | number }>(opts: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  meta: PageMeta;
  state: TableState;
  windowSize?: number;
  onSelectionChange?: (rows: TData[]) => void;
}) {
  const { data, columns, meta, state, windowSize = 2 } = opts;
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({});

  const rowSelection = opts.state.rowSelection ?? internalRowSelection;
  const setRowSelection = opts.state.setRowSelection ?? setInternalRowSelection;
  const table = useReactTable<TData>({
    data: opts.data,
    columns: opts.columns,
    state: {
      rowSelection,
      globalFilter: opts.state.globalFilter,
      pagination: opts.state.pagination,
      sorting: opts.state.sorting,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: state.setGlobalFilter,
    onPaginationChange: state.setPagination,
    onSortingChange: state.setSorting,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: meta.pageCount,
    autoResetPageIndex: false,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((r) => r.original as TData);
  const { pageIndex } = table.getState().pagination;

  const start = Math.max(0, pageIndex - windowSize);
  const end = Math.min(meta.pageCount - 1, pageIndex + windowSize);
  const pages = Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, i) => start + i,
  );

  return { table, selectedRows, pages, start, end };
}

export type ServerTableInstance<T extends { id: string | number }> = ReturnType<
  typeof useServerTable<T>
>;
