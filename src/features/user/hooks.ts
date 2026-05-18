import type { ProfileFormValues } from '@/pages/dashboard/my_account/types';
import { profileFormValuesToPayload } from '@/utils/profileForm';
import * as I from '@/types/auth';
import { useNotifyMutation } from '@/lib/mutation';
import { useQueryClient } from '@tanstack/react-query';
import { authKeyQuery } from '@/features/auth/key';
import { updateProfile } from './api';

export interface SubmitProfileFormOptions {
  avatarFile?: File;
  clearPassword?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useNotifyMutation<
    I.UserProfile,
    Error,
    { payload: I.UpdateProfilePayload; avatarFile?: File }
  >({
    mutationFn: ({ payload, avatarFile }) => updateProfile(payload, avatarFile),
    successKey: 'notifications.profile.update_success',
    errorKey: 'notifications.profile.update_error',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeyQuery.me });
    },
  });

  const submitProfileForm = async (
    values: ProfileFormValues,
    options?: SubmitProfileFormOptions,
  ): Promise<void> => {
    const payload = profileFormValuesToPayload(values);
    try {
      await mutation.mutateAsync({
        payload,
        avatarFile: options?.avatarFile,
      });
      options?.clearPassword?.();
      options?.onSuccess?.();
      mutation.reset();
    } catch (error) {
      options?.onError?.(
        error instanceof Error ? error : new Error(String(error)),
      );
      mutation.reset();
    }
  };

  return {
    submitProfileForm,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

