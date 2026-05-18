import i18n from '@/i18n';
import { toast } from 'sonner';

export type NotifyMsg =
  | string
  | { titleKey: string; titleParams?: Record<string, unknown> };

function resolve(m: NotifyMsg): string {
  return typeof m === 'string'
    ? i18n.t(m)
    : i18n.t(m.titleKey, m.titleParams);
}

export const notify = {
  success: (m: NotifyMsg, description?: string) =>
    toast.success(resolve(m), description ? { description } : undefined),

  error: (m: NotifyMsg, description?: string) =>
    toast.error(resolve(m), description ? { description } : undefined),

  info: (m: NotifyMsg, description?: string) =>
    toast(resolve(m), description ? { description } : undefined),
};

