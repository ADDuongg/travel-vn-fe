import api from '@/lib/axios';
import * as I from '@/types/auth';

/**
 * Cập nhật profile. Nếu có avatarFile thì gửi multipart (form + file), không thì gửi JSON.
 * FE-API-USER: chỉ dùng PATCH profile/me.
 */
export function updateProfile(
  data: I.UpdateProfilePayload,
  avatarFile?: File,
): Promise<I.UserProfile> {
  if (avatarFile) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'object')
        formData.append(key, JSON.stringify(value));
      else formData.append(key, String(value));
    });
    formData.append('avatar', avatarFile);
    return api.patch<I.UserProfile>('/api/v1/client/users/profile/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.patch<I.UserProfile>('/api/v1/client/users/profile/me', data);
}
