import CustomInput from '@/components/CustomInput';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMe } from '@/features/auth/hooks';
import {
  useProvinceSelectOptions,
  useWardSelectOptions,
} from '@/hooks/useAddressSelectOptions';
import { H3, P } from '@/components/ui/typography';
import * as I from '@/types/auth';
import type { ProfileFormValues } from '@/pages/dashboard/my_account/types';
import { ADDRESS_NONE } from '@/utils/addressOptions';
import {
  DEFAULT_PROFILE_FORM_VALUES,
  DOB_DAYS,
  DOB_MONTHS,
  DOB_YEARS,
  mapUserToForm,
} from '@/utils/profileForm';
import type { Province } from '@/features/provinces/types';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useUpdateProfile } from '@/features/user/hooks';

const ProfilePage: React.FC = () => {
  const { data: me } = useMe();
  if (!me) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-muted-foreground">
        Đang tải...
      </div>
    );
  }
  return <ProfileFormContent key={String(me._id ?? me.id ?? 'me')} me={me} />;
};

interface ProfileFormContentProps {
  me: I.UserProfile;
}

const ProfileFormContent: React.FC<ProfileFormContentProps> = ({ me }) => {
  const { submitProfileForm, isPending } = useUpdateProfile();
  const { provinceOptions, provincesList } = useProvinceSelectOptions();
  const methods = useForm<ProfileFormValues>({
    defaultValues: { ...DEFAULT_PROFILE_FORM_VALUES, ...mapUserToForm(me) },
  });
  const provinceIdWatcher = methods.watch('provinceId');
  const { wardOptions, wards } = useWardSelectOptions(provinceIdWatcher);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(me.avatar?.url ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    setPreview(me.avatar?.url ?? '');
  }, [me.avatar?.url]);

  useEffect(() => {
    if (!provinceIdWatcher || provinceIdWatcher === ADDRESS_NONE) {
      methods.setValue('wardCode', ADDRESS_NONE);
      return;
    }
    const currentWardCode = methods.getValues('wardCode');
    const stillValid =
      currentWardCode !== ADDRESS_NONE &&
      wards.some((w) => String(w.code) === String(currentWardCode));
    if (!stillValid) {
      methods.setValue('wardCode', ADDRESS_NONE);
    }
  }, [provinceIdWatcher, wards, methods]);

  useEffect(() => {
    if (!provincesList?.length || !me?.address?.provinceId) return;
    const pid = String(me.address.provinceId);
    const exists = provincesList.some((p: Province) => String(p._id) === pid);
    if (exists) {
      methods.setValue('provinceId', pid);
      if (me.address.wardCode) {
        methods.setValue('wardCode', String(me.address.wardCode));
      }
    }
  }, [provincesList, me?.address?.provinceId, me?.address?.wardCode, methods]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProfileFormValues) => {
    await submitProfileForm(data, {
      avatarFile: avatarFile ?? undefined,
      clearPassword: () => methods.setValue('password', ''),
    });
    if (avatarFile && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <FormProvider {...methods}>
      <LoadingOverlay visible={isPending} />
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 mx-auto"
      >
        <Card className="overflow-hidden rounded-2xl border-charcoal/10 bg-card shadow-soft">
          <CardHeader className="space-y-1 border-b border-charcoal/10 bg-sand-50/70 px-4 py-5 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
              Tài khoản
            </p>
            <CardTitle className="sr-only">Chỉnh sửa hồ sơ</CardTitle>
            <H3 className="font-display text-2xl font-semibold tracking-tight text-charcoal">
              Chỉnh sửa hồ sơ
            </H3>
            <P className="text-sm leading-relaxed text-charcoal/60">
              Cập nhật thông tin cá nhân của bạn.
            </P>
          </CardHeader>

          <CardContent className="space-y-8 px-4 py-6 sm:px-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={preview} alt="Avatar" />
                <AvatarFallback>DN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              <Button
                type="button"
                variant="outline"
                className="border-charcoal/15 px-5 text-charcoal hover:bg-charcoal/4"
                onClick={() => fileInputRef.current?.click()}
              >
                Chọn ảnh đại diện
              </Button>
              <span className="text-xs text-charcoal/50">
                  JPG, PNG hoặc GIF. Ảnh sẽ gửi kèm khi bấm &quot;Cập nhật
                  profile&quot;.
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <Row label="First Name *">
                <CustomInput
                  name="firstName"
                  labelPosition="horizontal"
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

              <Row label="Username">
                <CustomInput
                  name="username"
                  labelPosition="horizontal"
                  className="w-full"
                />
              </Row>

              <Row label="Email *">
                <CustomInput
                  name="email"
                  labelPosition="horizontal"
                  className="w-full"
                  rules={{ required: 'Vui lòng nhập email' }}
                />
              </Row>

              <Row label="Mật khẩu mới">
                <CustomInput
                  name="password"
                  type="password"
                  labelPosition="horizontal"
                  className="w-full max-w-md"
                  placeHolder="Để trống nếu không đổi mật khẩu"
                />
              </Row>

              <Row label="Gender">
                <CustomInput
                  name="gender"
                  type="select"
                  labelPosition="horizontal"
                  className="w-56"
                  placeHolder="Chọn giới tính"
                  options={I.GENDER_OPTIONS}
                />
              </Row>

              <Row label="Birth Date *">
                <div className="flex items-center gap-4">
                  <CustomInput
                    name="dobDay"
                    type="select"
                    labelPosition="horizontal"
                    className="w-24"
                    options={DOB_DAYS}
                    rules={{ required: 'Chọn ngày' }}
                  />
                  <CustomInput
                    name="dobMonth"
                    type="select"
                    labelPosition="horizontal"
                    className="w-36"
                    options={DOB_MONTHS}
                    rules={{ required: 'Chọn tháng' }}
                  />
                  <CustomInput
                    name="dobYear"
                    type="select"
                    labelPosition="horizontal"
                    className="w-28"
                    options={DOB_YEARS}
                    rules={{ required: 'Chọn năm' }}
                  />
                </div>
              </Row>

              <Row label="Phone *">
                <CustomInput
                  name="phone"
                  labelPosition="horizontal"
                  className="w-full"
                  rules={{ required: 'Vui lòng nhập số điện thoại' }}
                />
              </Row>

              <Row label="Tỉnh/Thành phố">
                <CustomInput
                  name="provinceId"
                  type="select"
                  labelPosition="horizontal"
                  className="w-full max-w-md"
                  placeHolder="Chọn tỉnh/thành phố"
                  options={provinceOptions}
                />
              </Row>

              <Row label="Phường/Xã">
                <CustomInput
                  name="wardCode"
                  type="select"
                  labelPosition="horizontal"
                  className="w-full max-w-md"
                  placeHolder={
                    wardOptions.length > 1
                      ? 'Chọn phường/xã'
                      : 'Chọn tỉnh trước'
                  }
                  options={wardOptions}
                />
              </Row>

              <Row label="Địa chỉ chi tiết">
                <CustomInput
                  name="detail"
                  labelPosition="horizontal"
                  className="w-full"
                />
              </Row>
            </div>

            <div className="flex flex-col items-center gap-3 pt-2">
              <Button
                type="submit"
                className="min-w-[200px] rounded-full bg-forest px-8 font-semibold text-sand-50 shadow-soft transition-colors hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/35 focus-visible:ring-offset-2"
                disabled={isPending}
              >
                {isPending ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

const Row: React.FC<{
  label: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="flex items-start gap-6">
    <div className="w-40 shrink-0 pt-2 text-sm text-charcoal/55">{label}</div>
    <div className="flex-1">{children}</div>
  </div>
);

export default ProfilePage;

