// ProfilePage.tsx
import React, { useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import CustomInput from '@/components/CustomInput';
import { H3, P } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';

type FormValues = {
  firstName: string;
  lastName: string;
  gender: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  email: string;
  phone: string;
  country: string;
  address: string;
};

const days = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((m) => ({ label: m, value: m }));
const years = Array.from({ length: 90 }, (_, i) => 2025 - i).map((y) => ({
  label: String(y),
  value: String(y),
}));
const countries = [
  { label: 'United States of America (USA)', value: 'USA' },
  { label: 'Viet Nam', value: 'VNM' },
  { label: 'Japan', value: 'JPN' },
  { label: 'Korea (South)', value: 'KOR' },
];

const ProfilePage: React.FC = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      firstName: 'nguyen',
      lastName: 'duong',
      gender: '',
      dobDay: '8',
      dobMonth: 'May',
      dobYear: '2002',
      email: 'monbedehp1@gmail.com',
      phone: '0312569666',
      country: 'USA',
      address: '',
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };
  const onSubmit = (data: FormValues) => {
    // TODO: call API update
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 mx-auto"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="sr-only">Edit Profile</CardTitle>
            <H3>Edit Profile</H3>
            <P className="mt-1">Cập nhật thông tin cá nhân của bạn</P>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Avatar + nút đổi ảnh */}
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={preview} alt="Avatar" />
                <AvatarFallback>DN</AvatarFallback>
              </Avatar>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  className="px-5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Profile Picture
                </Button>
              </div>
            </div>

            {/* Hàng form: label trái – input phải */}
            <div className="space-y-5">
              <Row label="First Name *">
                <CustomInput
                  name="firstName"
                  labelPosition="horizontal" // hỗ trợ bởi CustomInput
                  className="w-full"
                  rules={{ required: 'Vui lòng nhập First Name' }}
                />
              </Row>

              <Row label="Last Name *">
                <CustomInput
                  name="lastName"
                  labelPosition="horizontal"
                  className="w-full"
                  rules={{ required: 'Vui lòng nhập Last Name' }}
                />
              </Row>

              <Row label="Gender">
                <CustomInput
                  name="gender"
                  type="select"
                  labelPosition="horizontal"
                  className="w-56"
                  placeHolder="Chọn giới tính"
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ]}
                />
              </Row>

              <Row label="Birth Date *">
                <div className="flex items-center gap-4">
                  <CustomInput
                    name="dobDay"
                    type="select"
                    labelPosition="horizontal"
                    className="w-24"
                    options={days}
                    rules={{ required: 'Chọn ngày' }}
                  />
                  <CustomInput
                    name="dobMonth"
                    type="select"
                    labelPosition="horizontal"
                    className="w-36"
                    options={months}
                    rules={{ required: 'Chọn tháng' }}
                  />
                  <CustomInput
                    name="dobYear"
                    type="select"
                    labelPosition="horizontal"
                    className="w-28"
                    options={years}
                    rules={{ required: 'Chọn năm' }}
                  />
                </div>
              </Row>

              <Row label="Email *">
                <CustomInput
                  name="email"
                  labelPosition="horizontal"
                  className="w-full"
                  rules={{ required: 'Vui lòng nhập email' }}
                />
              </Row>

              <Row label="Phone *">
                <CustomInput
                  name="phone"
                  labelPosition="horizontal"
                  className="w-full"
                  rules={{ required: 'Vui lòng nhập số điện thoại' }}
                />
              </Row>

              <Row label="Country *">
                <CustomInput
                  name="country"
                  type="select"
                  labelPosition="horizontal"
                  className="w-full max-w-lg"
                  options={countries}
                  rules={{ required: 'Chọn quốc gia' }}
                />
              </Row>

              <Row label="Contact Address">
                <CustomInput
                  name="address"
                  labelPosition="horizontal"
                  className="w-full"
                />
              </Row>
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-2">
              <Button type="submit" className="px-6">
                Update Profile
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
    <div className="w-40 shrink-0 text-sm text-muted-foreground pt-2">
      {label}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

export default ProfilePage;
