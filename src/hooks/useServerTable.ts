// shared/tablekit/useServerTable.ts
import * as I from '@/types/api';
import * as IC from '@/types/commons';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';
import * as React from 'react';

export function useServerTable<TData>(opts: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  meta: I.PageMeta;
  state: IC.TableState;
  onSelectionChange?: (rows: TData[]) => void;
}) {
  const { meta, state } = opts;
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
    getRowId: (row, index) => {
      if (row && typeof row === 'object' && 'id' in row) {
        return String((row as { id: string | number }).id);
      }
      return String(index);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((r) => r.original as TData);
  return { table, selectedRows };
}

export type ServerTableInstance<T extends { id: string | number }> = ReturnType<
  typeof useServerTable<T>
>;
