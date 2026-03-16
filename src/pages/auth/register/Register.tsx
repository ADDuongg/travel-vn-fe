import { ROUTES } from '@/constants/router';
import { useRegister, useSendOtpVerifyEmail, useVerifyOtpEmail } from '@/features/auth/hooks';
import { MainLayout } from '@/layout';
import Container from '@components/Container';
import CustomInput from '@components/CustomInput';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import {
  P,
  ResponsiveH1,
  ResponsiveH5,
  ResponsiveH6,
  SubTitle,
} from '@components/ui/typography';
import * as I from '@/interface/auth';
import * as IC from '@/interface/commons';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { t } = useTranslation();
  const methods = useForm<I.RegisterFormValues>();
  const navigate = useNavigate();
  const { register: registerMutation, isPending } = useRegister();
  const { sendOtpVerifyEmail, isPending: isSendingOtp, isSuccess: isOtpSent } =
    useSendOtpVerifyEmail();
  const {
    verifyOtpEmail,
    isPending: isVerifyingOtp,
    isSuccess: isOtpVerified,
    error: verifyOtpError,
  } = useVerifyOtpEmail();

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
      onSuccess: () => {
        navigate(ROUTES.DASHBOARD.INDEX);
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
      gridClass: 'col-span-12 md:col-span-6',
    },
    {
      name: 'email',
      label: t('input.field_label.email', {
        defaultValue: 'Email',
      }),
      placeholder: t('input.placeholder.email', {
        defaultValue: 'Enter Email',
      }),
      gridClass: 'col-span-12 md:col-span-6',
    },
    {
      name: 'fullName',
      label: t('input.field_label.full_name', {
        defaultValue: 'Full Name',
      }),
      placeholder: t('input.placeholder.full_name', {
        defaultValue: 'Enter Full Name',
      }),
      gridClass: 'col-span-12 md:col-span-6',
    },
    {
      name: 'password',
      label: t('input.field_label.password'),
      placeholder: t('input.placeholder.password'),
      gridClass: 'col-span-12 md:col-span-6',
    },
    {
      name: 'confirmPassword',
      label: t('input.field_label.confirm_password', {
        defaultValue: 'Confirm Password',
      }),
      placeholder: t('input.placeholder.confirm_password', {
        defaultValue: 'Enter Confirm Password',
      }),
      gridClass: 'col-span-12 md:col-span-6',
    },

    {
      name: 'phone',
      label: t('input.field_label.phone'),
      placeholder: t('input.placeholder.phone'),
      gridClass: 'col-span-12 md:col-span-4',
    },
    {
      name: 'dateOfBirth',
      label: t('input.field_label.birth'),
      placeholder: t('input.placeholder.birth'),
      type: 'date',
      gridClass: 'col-span-12 md:col-span-8',
    },
    {
      name: 'address',
      label: t('input.field_label.address'),
      placeholder: t('input.placeholder.address'),
      gridClass: 'col-span-12 md:col-span-12',
    },
  ];

  return (
    <MainLayout>
      <div className="bg-background_paleGray p-32 text-center space-y-3">
        <ResponsiveH1 className="font-dm-serif-display">{t('auth.register_title')}</ResponsiveH1>
      </div>
      <Container className="py-20 px-10 max-w-[1000px]">
        <div className="flex flex-col gap-6">
          <ResponsiveH6 className="text-paleGray font-normal">
            {t('auth.register_desc')}
          </ResponsiveH6>
          <FormProvider {...methods}>
            <form
              className="w-full flex flex-col gap-6"
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="grid grid-cols-12 gap-7">
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

              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <CustomInput
                      name="email"
                      type="email"
                      label={t('input.field_label.email')}
                      placeHolder={t('input.placeholder.email')}
                      size="lg"
                      rules={{ required: t('common.field_required') }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    loading={isSendingOtp}
                    onClick={() => {
                      const email = methods.getValues('email');
                      if (!email) {
                        methods.setError('email', {
                          type: 'required',
                          message: t('common.field_required'),
                        });
                        return;
                      }
                      sendOtpVerifyEmail({ target: email });
                    }}
                  >
                    {t('auth.verify_email_send_otp')}
                  </Button>
                </div>
                {isOtpSent && (
                  <P className="text-xs text-emerald-600">
                    {t('auth.verify_email_otp_sent')}
                  </P>
                )}
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <CustomInput
                      name="emailOtp"
                      type="text"
                      label={t('input.field_label.otp_code')}
                      placeHolder={t('input.placeholder.otp_code')}
                      size="lg"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    loading={isVerifyingOtp}
                    onClick={() => {
                      const email = methods.getValues('email');
                      const code = (methods.getValues() as any).emailOtp;
                      if (!email || !code) {
                        return;
                      }
                      verifyOtpEmail({ target: email, code });
                    }}
                  >
                    {t('auth.verify_email_verify_button')}
                  </Button>
                </div>
                {verifyOtpError && (
                  <P className="text-xs text-destructive">
                    {verifyOtpError.message || t('common.error')}
                  </P>
                )}
                {isOtpVerified && (
                  <P className="text-xs text-emerald-600">
                    {t('auth.verify_email_success')}
                  </P>
                )}
              </div>

              <Button size="lg" disabled={isPending || !isOtpVerified}>
                {t('buttons.register')}
              </Button>
            </form>
          </FormProvider>
        </div>

        <Separator className="my-16" />

        <div className="flex flex-col gap-3 items-center">
          <ResponsiveH5 className="font-dm-serif-display font-bold">
            {t('auth.already_member')}
          </ResponsiveH5>
          <P
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-primary text-sm font-bold cursor-pointer"
          >
            {t('buttons.login')}
          </P>
        </div>
      </Container>
    </MainLayout>
  );
};

export default RegisterPage;
