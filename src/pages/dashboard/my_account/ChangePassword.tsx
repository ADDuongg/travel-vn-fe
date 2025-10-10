// ChangePasswordPage.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="sr-only">Change Password</CardTitle>
            <H3>Change Password</H3>
          </CardHeader>

          <CardContent className="space-y-5">
            <Row label="Old Password *">
              <CustomInput
                name="oldPassword"
                type="password"
                labelPosition="horizontal"
                rules={{ required: 'Vui lòng nhập mật khẩu cũ' }}
              />
            </Row>

            <Row label="New Password *">
              <CustomInput
                name="newPassword"
                type="password"
                labelPosition="horizontal"
                rules={{ required: 'Vui lòng nhập mật khẩu cũ' }}
              />
            </Row>

            <Row label="Confirm Password *">
              <CustomInput
                name="confirmPassword"
                type="password"
                labelPosition="horizontal"
                rules={{ required: 'Vui lòng xác nhận mật khẩu' }}
              />
            </Row>

            <div className="flex justify-start md:justify-center pt-2">
              <Button type="submit" className="px-6">
                {'Update Password'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

/** Hàng form: nhãn cột trái (160px), input cột phải — giống design */
const Row: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex items-start gap-6">
    <Label className="w-40 shrink-0 text-sm text-muted-foreground pt-2">
      {label}
    </Label>
    <div className="flex-1">{children}</div>
  </div>
);

export default ChangePasswordPage;
