// table/DataTable.tsx
import * as React from 'react';
import { useDataTable, type PageMeta, type TableState } from './useDataTable';
import { TableCtx } from './context';

export type DataTableRootProps<TData> = {
  data: TData[];
  columns: any[];
  meta: PageMeta;
  state: TableState;
  windowSize?: number;
  children: React.ReactNode;
};

export function DataTableRoot<TData extends { id?: string | number }>(
  props: DataTableRootProps<TData>,
) {
  const dt = useDataTable<TData>({
    data: props.data,
    columns: props.columns,
    meta: props.meta,
    state: props.state,
    windowSize: props.windowSize,
  });

  return (
    <TableCtx.Provider
      value={{
        table: dt.table,
        meta: props.meta,
        state: props.state,
        selectedRows: dt.selectedRows,
        pages: dt.pages,
        start: dt.start,
        end: dt.end,
      }}
    >
      {props.children}
    </TableCtx.Provider>
  );
}
