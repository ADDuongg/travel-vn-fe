import { ROUTES } from '@/constants/router';
import { useLogin } from '@/features/auth/hooks';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { P, ResponsiveH1, ResponsiveH5 } from '@components/ui/typography';
import type { LoginFormValues } from '@interface/auth';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const methods = useForm<LoginFormValues>();
  const { login, isPending } = useLogin();

  const handleSubmit = (data: LoginFormValues) => login(data);
  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">Login</ResponsiveH1>
      </div>
      <Container className="py-20 px-10 max-w-[1000px]">
        <div className="flex flex-col gap-6">
          <FormProvider {...methods}>
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="flex gap-2 w-full flex-col md:flex-row">
                <CustomInput
                  className="w-full"
                  name="username"
                  type="text"
                  label={t('input.field_label.username_or_email')}
                  placeHolder={t('input.placeholder.username_or_email')}
                  size={'lg'}
                />
                <CustomInput
                  className="w-full"
                  name="password"
                  type="text"
                  label={t('input.field_label.password')}
                  placeHolder={t('input.placeholder.password')}
                  size={'lg'}
                />
              </div>
              <Button size="lg" loading={isPending}>
                {t('buttons.login')}
              </Button>
            </form>
          </FormProvider>
          <div className="flex justify-end">
            <P className="text-primary text-sm font-bold cursor-pointer">
              Forget password?
            </P>
          </div>
        </div>
        <Separator className="my-16" />
        <div className="flex flex-col gap-3 items-center">
          <ResponsiveH5 className="font-dm-serif-display font-bold">
            DO NOT HAVE AN ACCOUNT?
          </ResponsiveH5>
          <P
            onClick={() => navigate(ROUTES.REGISTER)}
            className="text-primary text-sm font-bold cursor-pointer"
          >
            CREATE AN ACCOUNT
          </P>
        </div>
      </Container>
    </MainLayout>
  );
};

export default LoginPage;
