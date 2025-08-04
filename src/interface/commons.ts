export enum EnumRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
export interface RouteConfig {
  path: string;
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

export enum EnumDisplayItem {
  TABLE = 'table',
  GRID = 'grid',
  FLEX = 'flex',
}
