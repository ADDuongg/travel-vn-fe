import { ROUTES } from '@/constants/router';
import { useForgotPasswordRequest } from '@/features/auth/hooks';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Button } from '@components/ui/button';
import { P, ResponsiveH1 } from '@components/ui/typography';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type ForgotPasswordRequestFormValues = {
  identifier: string;
};

const ForgotPasswordRequestPage = () => {
  const { t } = useTranslation();
  const methods = useForm<ForgotPasswordRequestFormValues>({
    defaultValues: {
      identifier: '',
    },
  });

  const { forgotPasswordRequest, isPending, error, isSuccess } =
    useForgotPasswordRequest();

  const onSubmit = (values: ForgotPasswordRequestFormValues) => {
    forgotPasswordRequest(values);
  };

  const identifierError = methods.formState.errors.identifier;

  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">
          {t('auth.forgot_password_title')}
        </ResponsiveH1>
      </div>
      <Container className="py-20 px-10 max-w-[800px]">
        <div className="flex flex-col gap-6">
          <P className="text-muted-foreground">
            {t('auth.forgot_password_desc')}
          </P>
          <FormProvider {...methods}>
            <form
              className="w-full flex flex-col gap-4"
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
                <P className="text-sm text-destructive">
                  {error.message || t('common.error')}
                </P>
              )}

              {isSuccess && (
                <P className="text-sm text-emerald-600">
                  {t('auth.forgot_password_request_success')}
                </P>
              )}

              <Button size="lg" loading={isPending}>
                {t('auth.forgot_password_submit')}
              </Button>
            </form>
          </FormProvider>

          <P className="text-sm text-muted-foreground">
            {t('auth.forgot_password_hint')}
          </P>

          <P className="text-sm">
            <Link to={ROUTES.LOGIN} className="text-primary font-semibold">
              {t('buttons.login')}
            </Link>
          </P>
        </div>
      </Container>
    </MainLayout>
  );
};

export default ForgotPasswordRequestPage;
