import { ROUTES } from '@/constants/router';
import { useForgotPasswordConfirm } from '@/features/auth/hooks';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Button } from '@components/ui/button';
import { P, ResponsiveH1 } from '@components/ui/typography';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

type ForgotPasswordConfirmFormValues = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

const ForgotPasswordConfirmPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const methods = useForm<ForgotPasswordConfirmFormValues>({
    defaultValues: {
      token: tokenFromUrl,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { forgotPasswordConfirm, isPending, error, isSuccess } =
    useForgotPasswordConfirm();

  const onSubmit = (values: ForgotPasswordConfirmFormValues) => {
    forgotPasswordConfirm(
      {
        token: values.token,
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

  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">
          {t('auth.forgot_password_confirm_title')}
        </ResponsiveH1>
      </div>
      <Container className="py-20 px-10 max-w-[800px]">
        <div className="flex flex-col gap-6">
          <P className="text-muted-foreground">
            {t('auth.forgot_password_confirm_desc')}
          </P>
          <FormProvider {...methods}>
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
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
                <P className="text-sm text-destructive">
                  {error.message || t('common.error')}
                </P>
              )}

              {isSuccess && (
                <P className="text-sm text-emerald-600">
                  {t('auth.forgot_password_confirm_success')}
                </P>
              )}

              <Button size="lg" loading={isPending}>
                {t('auth.forgot_password_confirm_submit')}
              </Button>
            </form>
          </FormProvider>

          <P className="text-sm">
            {t('auth.forgot_password_back_to_login')}{' '}
            <button
              type="button"
              className="text-primary font-semibold underline"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              {t('buttons.login')}
            </button>
          </P>
        </div>
      </Container>
    </MainLayout>
  );
};

export default ForgotPasswordConfirmPage;
