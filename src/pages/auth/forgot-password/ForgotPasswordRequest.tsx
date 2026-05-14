import { ROUTES } from '@/constants/router';
import { useForgotPasswordRequest } from '@/features/auth/hooks';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { ResponsiveH1 } from '@components/ui/typography';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

type ForgotPasswordRequestFormValues = {
  identifier: string;
};

const ForgotPasswordRequestPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const methods = useForm<ForgotPasswordRequestFormValues>({
    defaultValues: {
      identifier: '',
    },
  });

  const { forgotPasswordRequest, isPending, error } = useForgotPasswordRequest();

  const onSubmit = (values: ForgotPasswordRequestFormValues) => {
    forgotPasswordRequest(values, {
      notify: { silentSuccess: true },
      onSuccess: () => {
        navigate(ROUTES.FORGOT_PASSWORD_CONFIRM, {
          state: { identifier: values.identifier.trim() },
        });
      },
    });
  };

  const identifierError = methods.formState.errors.identifier;

  return (
    <MainLayout>
      <section className="bg-background_paleGray">
        <Container className="py-14 md:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-5">
            <div className="text-center lg:col-span-2 lg:text-left">
              <ResponsiveH1 className="font-dm-serif-display text-foreground">
                {t('auth.forgot_password_title')}
              </ResponsiveH1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('auth.forgot_password_desc')}
              </p>
            </div>

            <div className="lg:col-span-3">
              <Card className="rounded-2xl border-border/60 bg-card py-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
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
                        error={identifierError?.message as string | undefined}
                      />

                      {error && (
                        <p className="text-sm text-destructive">
                          {error.message || t('common.error')}
                        </p>
                      )}

                      <Button size="lg" loading={isPending} className="w-full rounded-xl">
                        {t('auth.forgot_password_submit')}
                      </Button>
                    </form>
                  </FormProvider>

                  <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                    {t('auth.forgot_password_hint')}
                  </p>

                  <p className="mt-4 text-sm">
                    <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
                      {t('buttons.login')}
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

export default ForgotPasswordRequestPage;
