import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CustomInput from '@components/CustomInput';
import { H3 } from '@components/ui/typography';

const schema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Xác nhận mật khẩu không khớp',
  });

type FormValues = z.infer<typeof schema>;

const ChangePasswordPage: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log('Change password payload:', values);
    form.reset({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="overflow-hidden rounded-2xl border-charcoal/10 bg-card shadow-soft">
          <CardHeader className="space-y-1 border-b border-charcoal/10 bg-sand-50/70 px-4 py-5 sm:px-6">
            <CardTitle className="sr-only">Đổi mật khẩu</CardTitle>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
              Bảo mật
            </p>
            <H3 className="font-display text-2xl font-semibold tracking-tight text-charcoal">
              Đổi mật khẩu
            </H3>
            <p className="text-sm leading-relaxed text-charcoal/60">
              Nhập mật khẩu hiện tại và mật khẩu mới bạn muốn sử dụng.
            </p>
          </CardHeader>

          <CardContent className="space-y-5 px-4 py-6 sm:px-6">
            <Row label="Mật khẩu hiện tại *">
              <CustomInput
                name="oldPassword"
                type="password"
                labelPosition="horizontal"
                rules={{ required: 'Vui lòng nhập mật khẩu cũ' }}
              />
            </Row>

            <Row label="Mật khẩu mới *">
              <CustomInput
                name="newPassword"
                type="password"
                labelPosition="horizontal"
                rules={{ required: 'Vui lòng nhập mật khẩu mới' }}
              />
            </Row>

            <Row label="Xác nhận mật khẩu *">
              <CustomInput
                name="confirmPassword"
                type="password"
                labelPosition="horizontal"
                rules={{ required: 'Vui lòng xác nhận mật khẩu' }}
              />
            </Row>

            <div className="flex justify-start pt-2 md:justify-center">
              <Button
                type="submit"
                className="min-w-[200px] rounded-full bg-forest px-8 font-semibold text-sand-50 shadow-soft transition-colors hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/35 focus-visible:ring-offset-2"
              >
                Cập nhật mật khẩu
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

const Row: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex items-start gap-6">
    <Label className="w-40 shrink-0 pt-2 text-sm text-charcoal/55">
      {label}
    </Label>
    <div className="flex-1">{children}</div>
  </div>
);

export default ChangePasswordPage;

