import { useNotifyMutation } from '@/lib/mutation';
import { uploadMedia, uploadMediaMultiple } from './api';
import type { MediaUploadItem } from './types';

export function useUploadMedia() {
  return useNotifyMutation<MediaUploadItem, Error, File>({
    mutationFn: uploadMedia,
    successKey: 'notifications.media.upload_success',
    errorKey: 'notifications.media.upload_error',
  });
}

export function useUploadMediaMultiple() {
  return useNotifyMutation<MediaUploadItem[], Error, File[]>({
    mutationFn: uploadMediaMultiple,
    successKey: 'notifications.media.upload_success',
    errorKey: 'notifications.media.upload_error',
  });
}
