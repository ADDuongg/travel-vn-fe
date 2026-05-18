import i18n from '@/i18n';

export function resolveApiMessage(
  messageKey?: string,
  fallback?: string,
): string | undefined {
  if (messageKey && i18n.exists(`api:${messageKey}`)) {
    return i18n.t(`api:${messageKey}`);
  }
  return fallback;
}

