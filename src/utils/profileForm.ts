import * as I from '@/interface/auth';
import type { ProfileFormValues } from '@/pages/dashboard/my_account/types';
import { ADDRESS_NONE } from './addressOptions';

/** Tách fullName thành firstName + lastName */
export function splitFullName(
  fullName?: string,
): Pick<ProfileFormValues, 'firstName' | 'lastName'> {
  if (!fullName) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] ?? '', lastName: '' };
  const lastName = parts.pop() ?? '';
  const firstName = parts.join(' ');
  return { firstName, lastName };
}

/** Tháng dùng cho DOB (label = value) */
export const DOB_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((m) => ({ label: m, value: m }));

/** Options ngày (1–31) */
export const DOB_DAYS = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

/** Options năm (2025 → 1936) */
export const DOB_YEARS = Array.from({ length: 90 }, (_, i) => 2025 - i).map(
  (y) => ({ label: String(y), value: String(y) }),
);

export const DEFAULT_PROFILE_FORM_VALUES: ProfileFormValues = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  gender: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  phone: '',
  provinceId: ADDRESS_NONE,
  wardCode: ADDRESS_NONE,
  detail: '',
};

/** Từ form values → chuỗi dateOfBirth YYYY-MM-DD */
export function buildDateOfBirth(values: ProfileFormValues): string | undefined {
  const { dobDay, dobMonth, dobYear } = values;
  if (!dobDay || !dobMonth || !dobYear) return undefined;
  const monthIndex = DOB_MONTHS.findIndex((m) => m.value === dobMonth);
  if (monthIndex === -1) return undefined;
  const day = String(Number(dobDay)).padStart(2, '0');
  const month = String(monthIndex + 1).padStart(2, '0');
  return `${dobYear}-${month}-${day}`;
}

/** Form values → payload cho API update profile (dùng trong useUpdateProfile) */
export function profileFormValuesToPayload(
  data: ProfileFormValues,
): I.UpdateProfilePayload {
  const fullName =
    [data.firstName, data.lastName].filter(Boolean).join(' ').trim() ||
    undefined;
  const dateOfBirth = buildDateOfBirth(data);
  const provinceIdValue =
    data.provinceId?.trim() === ADDRESS_NONE || !data.provinceId?.trim()
      ? undefined
      : data.provinceId?.trim();
  const wardCodeValue =
    data.wardCode?.trim() === ADDRESS_NONE || !data.wardCode?.trim()
      ? undefined
      : data.wardCode?.trim();
  const hasAddress =
    provinceIdValue || wardCodeValue || data.detail?.trim();

  return {
    username: data.username?.trim() || undefined,
    email: data.email?.trim() || undefined,
    password: data.password?.trim() || undefined,
    fullName,
    phone: data.phone?.trim() || undefined,
    dateOfBirth,
    gender: (data.gender as I.Gender) || undefined,
    address: hasAddress
      ? {
          provinceId: provinceIdValue,
          wardCode: wardCodeValue,
          detail: data.detail?.trim() || undefined,
        }
      : undefined,
  };
}

/** Map UserProfile → defaultValues cho form */
export function mapUserToForm(user?: I.UserProfile): Partial<ProfileFormValues> {
  if (!user) return {};
  const { firstName, lastName } = splitFullName(user.fullName);
  let dobDay = '';
  let dobMonth = '';
  let dobYear = '';
  if (user.dateOfBirth) {
    const d = new Date(user.dateOfBirth);
    if (!Number.isNaN(d.getTime())) {
      dobDay = String(d.getDate());
      dobMonth = DOB_MONTHS[d.getMonth()]?.value ?? '';
      dobYear = String(d.getFullYear());
    }
  }
  const pid = user.address?.provinceId;
  const wcode = user.address?.wardCode;
  return {
    firstName,
    lastName,
    username: user.username ?? '',
    email: user.email ?? '',
    gender: user.gender ?? '',
    dobDay,
    dobMonth,
    dobYear,
    phone: user.phone ?? '',
    provinceId: pid != null && pid !== '' ? String(pid) : ADDRESS_NONE,
    wardCode: wcode != null && wcode !== '' ? String(wcode) : ADDRESS_NONE,
    detail: user.address?.detail ?? '',
  };
}
