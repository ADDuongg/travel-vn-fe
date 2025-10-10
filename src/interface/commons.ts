import type { EnumRole } from '@/constants/commons';
import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import type { RegisterOptions } from 'react-hook-form';

export interface RouteConfig {
  index?: boolean;
  path?: string;
  element: React.ReactElement;
  rolesAllowed?: EnumRole[];
  children?: RouteConfig[];
  handle?: {
    crumb?: string | ((params: any) => string);
  };
}

export type HeaderItemType = {
  name: string;
  label: string;
  path?: string;
  children?: HeaderItemType[];
};

export type CountryFlag = {
  label: string;
  code: string;
};

export type InputType =
  | 'text'
  | 'password'
  | 'select'
  | 'autocomplete'
  | 'multi-select'
  | 'checkbox'
  | 'date'
  | 'custom-input';

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

export type InputInterface = {
  name: string;
  label: string;
  placeholder?: string;
  gridClass?: string;
  options?: { label: string; value: string }[];
  render?: (field: any) => React.ReactNode;
  labelPosition?: 'vertical' | 'horizontal';
  type?: InputType;
  rules?: RegisterOptions;
  [key: string]: any;
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
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  isFetching?: boolean;
};
