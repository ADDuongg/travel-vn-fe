// table/context.tsx
import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import type { PageMeta, TableState } from './useDataTable';

export const TableCtx = React.createContext<{
  table: Table<any>;
  meta: PageMeta;
  state: TableState;
  selectedRows: any[];
  pages: number[];
  start: number;
  end: number;
} | null>(null);

export const useTableCtx = () => {
  const v = React.useContext(TableCtx);
  if (!v) throw new Error('TableCtx missing');
  return v;
};
