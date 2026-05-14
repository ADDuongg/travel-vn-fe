export type Permissions = {
  routers: string[];
  apis: string[];
};

/** Giới tính – dùng cho profile */
export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'Male', value: Gender.Male },
  { label: 'Female', value: Gender.Female },
  { label: 'Other', value: Gender.Other },
];

export type Account = {
  _id: string;
  username: string;
  roles: string[];
  permissions: Permissions;
  fullName?: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId?: string;
  };
  email?: string;
  /** `false` = must verify; omit/`true` = treated as verified (legacy). */
  isEmailVerified?: boolean;
  dateOfBirth?: string;
  gender?: Gender;
  address?: {
    provinceId?: string;
    districtCode?: string;
    wardCode?: string;
    detail?: string;
  };
};

export type LoginPayload = {
  access_token: string;
  refresh_token?: string;
  account: Account;
};

export type LoginFormValues = {
  username: string;
  password: string;
};

/** POST /auth/forgot-password/confirm — OTP flow (no JWT token). */
export type ForgotPasswordConfirmPayload = {
  identifier: string;
  code: string;
  newPassword: string;
};

export type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
};

/** POST /auth/verify-email */
export type VerifyEmailPayload = {
  email: string;
  code: string;
};

/** POST /auth/resend-verify-email */
export type ResendVerifyEmailPayload = {
  email: string;
};

export type UserProfile = {
  id?: string;
  _id?: string;
  username: string;
  roles: string[];
  permissions: Permissions;
  fullName?: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId?: string;
  };
  email?: string;
  /** `false` = must verify; omit/`true` = treated as verified (legacy). */
  isEmailVerified?: boolean;
  dateOfBirth?: string;
  gender?: Gender;
  address?: {
    provinceId?: string;
    districtCode?: string;
    wardCode?: string;
    detail?: string;
  };
};

export type UpdateProfilePayload = {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId?: string;
  };
  dateOfBirth?: string;
  gender?: Gender;
  address?: {
    provinceId?: string;
    districtCode?: string;
    wardCode?: string;
    detail?: string;
  };
};
