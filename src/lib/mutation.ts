import { resolveApiMessage } from '@/lib/api-message';
import { notify } from '@/lib/notify';
import {
  useMutation,
  type MutateOptions,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export const MUTATION_DEFAULT_ERROR_KEY = 'notifications.common.error_fallback';

export type MutationNotifyCallOptions = {
  notify?: {
    silent?: boolean;
    silentSuccess?: boolean;
    silentError?: boolean;
    successKey?: string;
    errorKey?: string;
  };
};

export type CreateMutationNotifyConfig = {
  successKey?: string;
  errorKey?: string;
  silentSuccess?: boolean;
  silentError?: boolean;
};

export function getMutationErrorDescription(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') return undefined;

  const o = err as Record<string, unknown>;
  const messageKey =
    typeof o.messageKey === 'string' && o.messageKey.trim()
      ? o.messageKey.trim()
      : undefined;

  let raw: string | undefined;
  if ('message' in o) {
    const m = o.message;
    if (typeof m === 'string' && m.trim()) raw = m;
    else if (Array.isArray(m)) raw = m.map(String).join(', ');
  }

  return resolveApiMessage(messageKey, raw);
}

type UseNotifyMutationOptions<TData, TError, TVariables, TContext> =
  UseMutationOptions<TData, TError, TVariables, TContext> &
    CreateMutationNotifyConfig;

type MutateCallOptions<TData, TError, TVariables, TContext> = MutateOptions<
  TData,
  TError,
  TVariables,
  TContext
> &
  MutationNotifyCallOptions;

/** Result of `useNotifyMutation` — `mutate` / `mutateAsync` accept optional `notify` overrides. */
export type MutationResultWithNotify<TData, TError, TVariables, TContext> =
  Omit<
    UseMutationResult<TData, TError, TVariables, TContext>,
    'mutate' | 'mutateAsync'
  > & {
    mutate: (
      variables: TVariables,
      options?: MutateCallOptions<TData, TError, TVariables, TContext>,
    ) => void;
    mutateAsync: (
      variables: TVariables,
      options?: MutateCallOptions<TData, TError, TVariables, TContext>,
    ) => Promise<TData>;
  };

export function useNotifyMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseNotifyMutationOptions<TData, TError, TVariables, TContext>,
): MutationResultWithNotify<TData, TError, TVariables, TContext> {
  const {
    successKey,
    errorKey = MUTATION_DEFAULT_ERROR_KEY,
    silentSuccess = false,
    silentError = false,
    ...rest
  } = options;

  const mutation = useMutation<TData, TError, TVariables, TContext>(rest);

  const mergeMutateOptions = useCallback(
    (
      callOpts?: MutateCallOptions<TData, TError, TVariables, TContext>,
    ): MutateOptions<TData, TError, TVariables, TContext> => {
      const { notify: notifyOverride, ...restOpts } = callOpts ?? {};

      const skipSuccess =
        silentSuccess ||
        notifyOverride?.silent ||
        notifyOverride?.silentSuccess;
      const skipError =
        silentError || notifyOverride?.silent || notifyOverride?.silentError;

      const successTitleKey = notifyOverride?.successKey ?? successKey;
      const errorTitleKey = notifyOverride?.errorKey ?? errorKey;

      return {
        ...restOpts,
        onSuccess: (data, variables, context) => {
          if (!skipSuccess && successTitleKey) {
            notify.success(successTitleKey);
          }
          restOpts.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
          if (!skipError && errorTitleKey) {
            const desc = getMutationErrorDescription(error);
            notify.error(errorTitleKey, desc);
          }
          restOpts.onError?.(error, variables, context);
        },
      };
    },
    [silentSuccess, silentError, successKey, errorKey],
  );

  const mutate = useCallback(
    (
      variables: TVariables,
      callOpts?: MutateCallOptions<TData, TError, TVariables, TContext>,
    ) => mutation.mutate(variables, mergeMutateOptions(callOpts)),
    [mutation, mergeMutateOptions],
  );

  const mutateAsync = useCallback(
    (
      variables: TVariables,
      callOpts?: MutateCallOptions<TData, TError, TVariables, TContext>,
    ) => mutation.mutateAsync(variables, mergeMutateOptions(callOpts)),
    [mutation, mergeMutateOptions],
  );

  return useMemo(
    () =>
      ({
        ...mutation,
        mutate,
        mutateAsync,
      }) as MutationResultWithNotify<TData, TError, TVariables, TContext>,
    [mutation, mutate, mutateAsync],
  );
}
