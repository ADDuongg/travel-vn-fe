export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  rolesAllowed?: RoleEnum[];
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
