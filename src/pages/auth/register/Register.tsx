import { ROUTES } from '@/constants/router';
import { useRegister } from '@/features/auth/hooks';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import {
  ResponsiveH1,
  ResponsiveH5,
  ResponsiveH6,
} from '@components/ui/typography';
import * as I from '@/types/auth';
import * as IC from '@/types/commons';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const RegisterPage = () => {
  const { t } = useTranslation();
  const methods = useForm<I.RegisterFormValues>();
  const navigate = useNavigate();
  const { register: registerMutation, isPending } = useRegister();

  const handleSubmit = (data: I.RegisterFormValues) => {
    const payload: I.RegisterFormValues = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      fullName: data.fullName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
    };

    registerMutation(payload, {
      onSuccess: (_loginPayload, variables) => {
        const email = variables.email.trim();
        navigate(`${ROUTES.VERIFY_EMAIL}?target=${encodeURIComponent(email)}`);
      },
    });
  };

  const inputs: IC.InputInterface[] = [
    {
      name: 'username',
      label: t('input.field_label.username', {
        defaultValue: 'Username',
      }),
      placeholder: t('input.placeholder.username', {
        defaultValue: 'Enter Username',
      }),
      gridClass: 'col-span-12 sm:col-span-6',
    },
    {
      name: 'email',
      label: t('input.field_label.email'),
      placeholder: t('input.placeholder.email'),
      gridClass: 'col-span-12 sm:col-span-6',
      type: 'email',
    },
    {
      name: 'fullName',
      label: t('input.field_label.full_name', {
        defaultValue: 'Full Name',
      }),
      placeholder: t('input.placeholder.full_name', {
        defaultValue: 'Enter Full Name',
      }),
      gridClass: 'col-span-12 sm:col-span-6',
    },
    {
      name: 'phone',
      label: t('input.field_label.phone'),
      placeholder: t('input.placeholder.phone'),
      gridClass: 'col-span-12 sm:col-span-6',
    },
    {
      name: 'password',
      label: t('input.field_label.password'),
      placeholder: t('input.placeholder.password'),
      type: 'password',
      gridClass: 'col-span-12 sm:col-span-6',
    },
    {
      name: 'confirmPassword',
      label: t('input.field_label.confirm_password', {
        defaultValue: 'Confirm Password',
      }),
      placeholder: t('input.placeholder.confirm_password', {
        defaultValue: 'Enter Confirm Password',
      }),
      type: 'password',
      gridClass: 'col-span-12 sm:col-span-6',
    },
    {
      name: 'dateOfBirth',
      label: t('input.field_label.birth'),
      placeholder: t('input.placeholder.birth'),
      type: 'date',
      gridClass: 'col-span-12 sm:col-span-5',
    },
    {
      name: 'address',
      label: t('input.field_label.address'),
      placeholder: t('input.placeholder.address'),
      gridClass: 'col-span-12 sm:col-span-7',
    },
  ];

  return (
    <MainLayout>
      <section className="bg-background_paleGray">
        <Container className="py-14 md:py-20">
          <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-5">
            <div className="text-center lg:col-span-2 lg:text-left mt-6">
              <ResponsiveH1 className="font-dm-serif-display text-foreground">
                {t('auth.register_title')}
              </ResponsiveH1>
              <ResponsiveH6 className="mt-3 font-normal text-muted-foreground">
                {t('auth.register_desc')}
              </ResponsiveH6>
            </div>

            <div className="lg:col-span-3">
              <Card className="rounded-2xl border-border/60 bg-card py-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <FormProvider {...methods}>
                    <form
                      className="flex w-full flex-col gap-6"
                      onSubmit={methods.handleSubmit(handleSubmit)}
                    >
                      <div className="grid grid-cols-12 gap-5 sm:gap-6">
                        {inputs.map((input) => (
                          <div key={input.name} className={input.gridClass}>
                            <CustomInput
                              name={input.name}
                              type={input.type || 'text'}
                              label={input.label}
                              placeHolder={input.placeholder}
                              size={input.size || 'lg'}
                              rules={{ required: t('common.field_required') }}
                            />
                          </div>
                        ))}
                      </div>

                      <Button
                        size="lg"
                        disabled={isPending}
                        className="w-full rounded-xl"
                      >
                        {t('buttons.register')}
                      </Button>
                    </form>
                  </FormProvider>

                  <Separator className="my-8" />

                  <div className="flex flex-col items-center gap-2 text-center">
                    <ResponsiveH5 className="font-dm-serif-display font-bold text-foreground">
                      {t('auth.already_member')}
                    </ResponsiveH5>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.LOGIN)}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {t('buttons.login')}
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

export default RegisterPage;

