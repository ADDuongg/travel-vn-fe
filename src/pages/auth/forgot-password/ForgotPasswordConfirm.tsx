import { ROUTES } from '@/constants/router';
import { useForgotPasswordConfirm } from '@/features/auth/hooks';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { ResponsiveH1 } from '@components/ui/typography';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';

type ForgotPasswordLocationState = {
  identifier?: string;
};

type ForgotPasswordConfirmFormValues = {
  identifier: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

function readInitialIdentifier(state: unknown): string {
  if (
    typeof state === 'object' &&
    state !== null &&
    'identifier' in state
  ) {
    const id = (state as ForgotPasswordLocationState).identifier;
    if (typeof id === 'string') {
      return id.trim();
    }
  }
  return '';
}

const ForgotPasswordConfirmPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const initialIdentifier = useMemo(
    () => readInitialIdentifier(location.state),
    [location.state],
  );

  const methods = useForm<ForgotPasswordConfirmFormValues>({
    defaultValues: {
      identifier: initialIdentifier,
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { forgotPasswordConfirm, isPending, error } = useForgotPasswordConfirm();

  const onSubmit = (values: ForgotPasswordConfirmFormValues) => {
    forgotPasswordConfirm(
      {
        identifier: values.identifier.trim(),
        code: values.code.trim(),
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.LOGIN);
        },
      },
    );
  };

  const { errors } = methods.formState;
  const hasPrefilledIdentifier = initialIdentifier.length > 0;

  return (
    <MainLayout>
      <section className="bg-background_paleGray">
        <Container className="py-14 md:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-5">
            <div className="text-center lg:col-span-2 lg:text-left">
              <ResponsiveH1 className="font-dm-serif-display text-foreground">
                {t('auth.forgot_password_confirm_title')}
              </ResponsiveH1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('auth.forgot_password_confirm_desc')}
              </p>
            </div>

            <div className="lg:col-span-3">
              <Card className="rounded-2xl border-border/60 bg-card py-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  {!hasPrefilledIdentifier && (
                    <Alert className="mb-5 border-border/80 bg-muted/30">
                      <AlertTitle>{t('auth.forgot_password_confirm_no_state_title')}</AlertTitle>
                      <AlertDescription>{t('auth.forgot_password_confirm_no_state_desc')}</AlertDescription>
                    </Alert>
                  )}

                  {hasPrefilledIdentifier && (
                    <Alert className="mb-5 border-border/80 bg-muted/30">
                      <AlertDescription>{t('auth.forgot_password_otp_sent_hint')}</AlertDescription>
                    </Alert>
                  )}

                  <FormProvider {...methods}>
                    <form
                      className="flex w-full flex-col gap-5"
                      onSubmit={methods.handleSubmit(onSubmit)}
                    >
                      <CustomInput
                        className="w-full"
                        name="identifier"
                        type="text"
                        label={t('input.field_label.username_or_email')}
                        placeHolder={t('input.placeholder.username_or_email')}
                        size="lg"
                        rules={{
                          required: t('common.field_required'),
                        }}
                        error={errors.identifier?.message as string | undefined}
                      />

                      <CustomInput
                        className="w-full font-mono tracking-widest"
                        name="code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        label={t('auth.forgot_password_otp_label')}
                        placeHolder={t('auth.forgot_password_otp_placeholder')}
                        size="lg"
                        rules={{
                          required: t('common.field_required'),
                          validate: (value: string) => {
                            const v = value.trim();
                            if (/^\d{6}$/.test(v)) return true;
                            return t('auth.forgot_password_otp_invalid') as string;
                          },
                        }}
                        error={errors.code?.message as string | undefined}
                      />

                      <CustomInput
                        className="w-full"
                        name="newPassword"
                        type="password"
                        label={t('input.field_label.new_password')}
                        placeHolder={t('input.placeholder.new_password')}
                        size="lg"
                        rules={{
                          required: t('common.field_required'),
                          minLength: {
                            value: 6,
                            message: t('auth.forgot_password_new_too_short'),
                          },
                          maxLength: {
                            value: 128,
                            message: t('auth.forgot_password_new_too_long'),
                          },
                        }}
                        error={errors.newPassword?.message as string | undefined}
                      />

                      <CustomInput
                        className="w-full"
                        name="confirmPassword"
                        type="password"
                        label={t('input.field_label.confirm_password')}
                        placeHolder={t('input.placeholder.confirm_password')}
                        size="lg"
                        rules={{
                          required: t('common.field_required'),
                          validate: (value: string) =>
                            value === methods.getValues('newPassword') ||
                            (t('auth.forgot_password_confirm_mismatch') as string),
                        }}
                        error={errors.confirmPassword?.message as string | undefined}
                      />

                      {error && (
                        <p className="text-sm text-destructive">
                          {error.message || t('common.error')}
                        </p>
                      )}

                      <Button size="lg" loading={isPending} className="w-full rounded-xl">
                        {t('auth.forgot_password_confirm_submit')}
                      </Button>
                    </form>
                  </FormProvider>

                  <p className="mt-6 text-sm text-muted-foreground">
                    {t('auth.forgot_password_back_to_login')}{' '}
                    <button
                      type="button"
                      className="font-semibold text-primary underline"
                      onClick={() => navigate(ROUTES.LOGIN)}
                    >
                      {t('buttons.login')}
                    </button>
                    {' · '}
                    <Link
                      to={ROUTES.FORGOT_PASSWORD_REQUEST}
                      className="font-semibold text-primary underline"
                    >
                      {t('auth.forgot_password_back_to_request')}
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

export default ForgotPasswordConfirmPage;
