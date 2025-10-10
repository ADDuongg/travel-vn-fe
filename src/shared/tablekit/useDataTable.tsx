// table/useDataTable.ts
import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

export type PageMeta = {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  total?: number;
};

export type TableState = {
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  isFetching?: boolean;
};

export function useDataTable<TData extends { id?: string | number }>(opts: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  meta: PageMeta;
  state: TableState;
  getRowId?: (row: TData) => string;
  windowSize?: number; // số nút trang mỗi bên
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const { data, columns, meta, state, windowSize = 2 } = opts;

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter: state.globalFilter,
      pagination: state.pagination,
      sorting: state.sorting,
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
    getRowId: opts.getRowId ?? ((r, i) => String((r as any).id ?? i)),
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const { pageIndex, pageSize } = table.getState().pagination;

  const start = Math.max(0, pageIndex - windowSize);
  const end = Math.min(meta.pageCount - 1, pageIndex + windowSize);
  const pages = Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, i) => start + i,
  );

  return { table, selectedRows, pageIndex, pageSize, start, end, pages };
}
