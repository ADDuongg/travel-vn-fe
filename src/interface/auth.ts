export type LoginPayload = {
  _id: string;
  username: string;
  roles: string[];
  access_token: string;
  refresh_token: string;
  account: any;
  permissions: {
    routers: string[];
    apis: string[];
  };
};

export type LoginFormValues = {
  username: string;
  password: string;
};
