import { ROUTES } from '@/constants/router';
import {
  useResendVerifyEmail,
  useVerifyEmail,
} from '@/features/auth/hooks';
import { getMutationErrorDescription } from '@/lib/mutation';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { P, ResponsiveH1 } from '@components/ui/typography';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';

type VerifyEmailFormValues = {
  email: string;
  code: string;
};

function readEmailFromTargetParam(target: string | null): string {
  if (!target || !target.trim()) return '';
  try {
    return decodeURIComponent(target.trim());
  } catch {
    return target.trim();
  }
}

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const authEmail = useAuthStore((s) => s.authUser?.email);

  const targetFromQuery = useMemo(
    () => readEmailFromTargetParam(searchParams.get('target')),
    [searchParams],
  );

  const initialEmail = useMemo(() => {
    if (targetFromQuery) return targetFromQuery;
    if (typeof authEmail === 'string' && authEmail.trim()) {
      return authEmail.trim();
    }
    return '';
  }, [targetFromQuery, authEmail]);

  const methods = useForm<VerifyEmailFormValues>({
    defaultValues: { email: initialEmail, code: '' },
  });

  useEffect(() => {
    methods.reset({ email: initialEmail, code: methods.getValues('code') });
  }, [initialEmail, methods]);

  const {
    verifyEmail,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyEmail();

  const {
    resendVerifyEmail,
    isPending: isResending,
    error: resendError,
  } = useResendVerifyEmail();

  const onSubmit = (values: VerifyEmailFormValues) => {
    verifyEmail({
      email: values.email.trim(),
      code: values.code.trim(),
    });
  };

  const handleResend = () => {
    const email = methods.getValues('email').trim();
    if (!email) {
      methods.setError('email', {
        type: 'required',
        message: t('common.field_required'),
      });
      return;
    }
    resendVerifyEmail({ email });
  };

  const verifyDescription = verifyError
    ? getMutationErrorDescription(verifyError)
    : undefined;
  const resendDescription = resendError
    ? getMutationErrorDescription(resendError)
    : undefined;

  return (
    <MainLayout>
      <section className="bg-background_paleGray">
        <Container className="py-14 md:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-5">
            <div className="text-center lg:col-span-2 lg:text-left">
              <ResponsiveH1 className="font-dm-serif-display text-foreground">
                {t('auth.verify_email_page_title')}
              </ResponsiveH1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('auth.verify_email_page_desc')}
              </p>
            </div>

            <div className="lg:col-span-3">
              <Card className="rounded-2xl border-border/60 bg-card py-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <Alert className="mb-5 border-border/80 bg-muted/30">
                    <AlertTitle>{t('auth.verify_email_check_inbox_title')}</AlertTitle>
                    <AlertDescription>
                      {t('auth.verify_email_check_inbox_desc')}
                    </AlertDescription>
                  </Alert>

                  <FormProvider {...methods}>
                    <form
                      className="flex flex-col gap-5"
                      onSubmit={methods.handleSubmit(onSubmit)}
                    >
                      <CustomInput
                        name="email"
                        type="email"
                        label={t('input.field_label.email')}
                        placeHolder={t('input.placeholder.email')}
                        size="lg"
                        rules={{ required: t('common.field_required') }}
                      />

                      <CustomInput
                        name="code"
                        type="text"
                        label={t('auth.verify_email_code_label')}
                        placeHolder={t('auth.verify_email_code_placeholder')}
                        size="lg"
                        rules={{
                          required: t('common.field_required'),
                          pattern: {
                            value: /^\d{6}$/,
                            message: t('auth.verify_email_code_invalid'),
                          },
                        }}
                      />

                      {verifyError && (
                        <P className="text-sm text-destructive">
                          {verifyDescription ?? t('common.error')}
                        </P>
                      )}
                      {resendError && (
                        <P className="text-sm text-destructive">
                          {resendDescription ?? t('common.error')}
                        </P>
                      )}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button
                          type="submit"
                          size="lg"
                          loading={isVerifying}
                          className="w-full rounded-xl sm:flex-1"
                        >
                          {t('auth.verify_email_submit_button')}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          loading={isResending}
                          className="w-full rounded-xl sm:flex-1"
                          onClick={handleResend}
                        >
                          {t('auth.verify_email_resend_button')}
                        </Button>
                      </div>
                    </form>
                  </FormProvider>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    <Link
                      to={ROUTES.DASHBOARD.INDEX}
                      className="font-semibold text-primary hover:underline"
                    >
                      {t('auth.verify_email_skip_to_dashboard')}
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default VerifyEmailPage;

