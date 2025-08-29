import type { EnumRole } from '@/constants/commons';
import type { RegisterOptions } from 'react-hook-form';

export interface RouteConfig {
  index?: boolean;
  path?: string;
  element: React.ReactElement;
  rolesAllowed?: EnumRole[];
  children?: RouteConfig[];
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
