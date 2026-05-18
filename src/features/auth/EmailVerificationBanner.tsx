import { ROUTES } from '@/constants/router';
import { useResendVerifyEmail } from '@/features/auth/hooks';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { MailWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function EmailVerificationBanner() {
  const { t } = useTranslation();
  const authUser = useAuthStore((s) => s.authUser);
  const { resendVerifyEmail, isPending } = useResendVerifyEmail();

  if (!authUser || authUser.isEmailVerified !== false) {
    return null;
  }

  const email = typeof authUser.email === 'string' ? authUser.email.trim() : '';

  const verifyHref = email
    ? `${ROUTES.VERIFY_EMAIL}?target=${encodeURIComponent(email)}`
    : ROUTES.VERIFY_EMAIL;

  return (
    <Alert
      className="mb-6 border-border/80 bg-muted/30 text-foreground"
      role="status"
    >
      <MailWarning className="size-5 text-primary" aria-hidden />
      <AlertTitle className="font-display">
        {t('auth.verify_email_banner_title')}
      </AlertTitle>
      <AlertDescription className="text-sm leading-relaxed text-muted-foreground">
        <p>{t('auth.verify_email_banner_desc')}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" className="rounded-lg">
            <Link to={verifyHref}>{t('auth.verify_email_banner_cta')}</Link>
          </Button>
          {email ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              loading={isPending}
              onClick={() => resendVerifyEmail({ email })}
            >
              {t('auth.verify_email_banner_resend')}
            </Button>
          ) : null}
        </div>
      </AlertDescription>
    </Alert>
  );
}

