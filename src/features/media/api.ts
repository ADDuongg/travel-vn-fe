import api from '@/lib/axios';
import type { MediaUploadItem } from './types';

const CLIENT_MEDIA_BASE = '/api/v1/client/media';

export function uploadMedia(file: File): Promise<MediaUploadItem> {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<MediaUploadItem>(`${CLIENT_MEDIA_BASE}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function uploadMediaMultiple(files: File[]): Promise<MediaUploadItem[]> {
  const formData = new FormData();
  for (const f of files) {
    formData.append('files', f);
  }
  return api.post<MediaUploadItem[]>(
    `${CLIENT_MEDIA_BASE}/upload-multiple`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
}

