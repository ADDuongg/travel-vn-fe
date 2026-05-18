import { ROUTES } from '@/constants/router';
import { useLogin } from '@/features/auth/hooks';
import { getMutationErrorDescription } from '@/lib/mutation';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { ResponsiveH1, ResponsiveH5 } from '@components/ui/typography';
import * as I from '@/types/auth';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

function isLoginLockedOut(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const o = err as { messageKey?: string; errorCode?: string };
  return (
    o.errorCode === 'LOGIN_LOCKED' ||
    o.messageKey === 'auth.login.too_many_attempts'
  );
}

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const methods = useForm<I.LoginFormValues>();
  const username = methods.watch('username');
  const { login, isPending, error, isError, reset } = useLogin();

  useEffect(() => {
    reset();
  }, [username, reset]);

  const showLoginLockAlert = isError && isLoginLockedOut(error);
  const loginLockDescription =
    error !== null && error !== undefined
      ? getMutationErrorDescription(error)
      : undefined;

  const handleSubmit = (data: I.LoginFormValues) => login(data);
  return (
    <MainLayout>
      <section className="bg-background_paleGray">
        <Container className="py-14 md:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-5">
            <div className="text-center lg:col-span-2 lg:text-left">
              <ResponsiveH1 className="font-dm-serif-display text-foreground">
                {t('auth.login_title')}
              </ResponsiveH1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('auth.login_desc', { defaultValue: '' })}
              </p>
            </div>

            <div className="lg:col-span-3">
              <Card className="rounded-2xl border-border/60 bg-card py-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  {showLoginLockAlert && (
                    <Alert variant="destructive" className="mb-5">
                      <AlertTitle>{t('auth.login_locked_title')}</AlertTitle>
                      <AlertDescription>
                        {loginLockDescription ?? t('api:auth.login.too_many_attempts')}
                      </AlertDescription>
                    </Alert>
                  )}
                  <FormProvider {...methods}>
                    <form
                      className="flex w-full flex-col gap-5"
                      onSubmit={methods.handleSubmit(handleSubmit)}
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <CustomInput
                          className="w-full"
                          name="username"
                          type="text"
                          label={t('input.field_label.username_or_email')}
                          placeHolder={t('input.placeholder.username_or_email')}
                          size="lg"
                        />
                        <CustomInput
                          className="w-full"
                          name="password"
                          type="password"
                          label={t('input.field_label.password')}
                          placeHolder={t('input.placeholder.password')}
                          size="lg"
                        />
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          className="text-sm font-semibold text-primary hover:underline"
                          onClick={() =>
                            navigate(ROUTES.FORGOT_PASSWORD_REQUEST)
                          }
                        >
                          {t('auth.forget_password')}
                        </button>
                      </div>

                      <Button
                        size="lg"
                        loading={isPending}
                        className="w-full rounded-xl"
                      >
                        {t('buttons.login')}
                      </Button>
                    </form>
                  </FormProvider>

                  <Separator className="my-8" />

                  <div className="flex flex-col items-center gap-2 text-center">
                    <ResponsiveH5 className="font-dm-serif-display font-bold text-foreground">
                      {t('auth.no_account')}
                    </ResponsiveH5>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.REGISTER)}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {t('auth.create_account')}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default LoginPage;

