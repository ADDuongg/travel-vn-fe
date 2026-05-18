import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from 'lucide-react';
import * as React from 'react';

export type StatusAlertVariant = 'success' | 'error' | 'warning' | 'info';

const variantConfig: Record<
  StatusAlertVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    alertVariant: 'default' | 'destructive';
    className?: string;
  }
> = {
  success: {
    icon: CheckCircle2Icon,
    alertVariant: 'default',
    className:
      'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-50 [&_[data-slot=alert-description]]:text-green-800 dark:[&_[data-slot=alert-description]]:text-green-200',
  },
  error: {
    icon: AlertCircleIcon,
    alertVariant: 'destructive',
  },
  warning: {
    icon: AlertTriangleIcon,
    alertVariant: 'default',
    className:
      'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 [&_[data-slot=alert-description]]:text-amber-800 dark:[&_[data-slot=alert-description]]:text-amber-200',
  },
  info: {
    icon: InfoIcon,
    alertVariant: 'default',
    className:
      'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50 [&_[data-slot=alert-description]]:text-blue-800 dark:[&_[data-slot=alert-description]]:text-blue-200',
  },
};

export type StatusAlertPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export interface StatusAlertProps {
  variant: StatusAlertVariant;
  title: React.ReactNode;
  description?: React.ReactNode;
  position?: StatusAlertPosition;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

const positionClasses: Record<StatusAlertPosition, string> = {
  'top-right': 'fixed top-4 right-4 z-50',
  'top-left': 'fixed top-4 left-4 z-50',
  'bottom-right': 'fixed bottom-4 right-4 z-50',
  'bottom-left': 'fixed bottom-4 left-4 z-50',
};

export function StatusAlert({
  variant,
  title,
  description,
  position,
  duration = 2000,
  onDismiss,
  className,
}: StatusAlertProps) {
  const {
    icon: Icon,
    alertVariant,
    className: variantClassName,
  } = variantConfig[variant];

  React.useEffect(() => {
    if (duration == null || duration <= 0 || !onDismiss) return;
    const id = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(id);
  }, [duration, onDismiss]);

  const alertEl = (
    <Alert
      variant={alertVariant}
      className={cn(
        variantClassName,
        position && 'w-full max-w-sm shadow-lg',
        className,
      )}
    >
      <Icon />
      <AlertTitle>{title}</AlertTitle>
      {description != null && (
        <AlertDescription>{description}</AlertDescription>
      )}
    </Alert>
  );

  if (position) {
    return (
      <div className={positionClasses[position]} role="presentation">
        {alertEl}
      </div>
    );
  }

  return alertEl;
}

