import React from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMe } from '@/features/auth/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { useProvincesQuery } from '@/features/provinces/hooks';
import {
  useTourGuidesQuery,
  useRegisterTourGuide,
} from '@/features/tour-guide/hooks';
import type {
  TourGuide,
  TourGuideRegisterPayload,
} from '@/features/tour-guide/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CustomInput from '@/components/CustomInput';
import { MultiSelect } from '@/components/ui/multiple-select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { StatusAlert } from '@/components/StatusAlert';
import { useStatusAlert } from '@/hooks/useStatusAlert';
import { H3, P } from '@/components/ui/typography';

type RegisterFormValues = {
  bio: string;
  shortBio?: string;
  specialtyItemsText?: string;
  languageCodes: string[];
  provinceIds: string[];
  certificationsText?: string;
  licenseNumber?: string;
  yearsOfExperience?: string;
  dailyRate?: string;
  contactPhone: boolean;
  contactZalo: boolean;
  contactEmail: boolean;
};

const LANGUAGE_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
];

function buildStatusBadge(guide: TourGuide, t: (key: string) => string) {
  if (!guide.isActive) {
    return (
      <Badge variant="destructive">{t('tour_guide.status_deactivated')}</Badge>
    );
  }
  if (!guide.isVerified) {
    return (
      <Badge variant="outline" className="border-amber-400 text-amber-700">
        {t('tour_guide.status_pending')}
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-600 text-white">
      {t('tour_guide.status_verified')}
    </Badge>
  );
}

const TourGuideRegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: me } = useMe();
  const userId = me?._id ?? me?.id;

  const { data: provinces } = useProvincesQuery();

  const {
    alertState,
    showError,
    showSuccess,
    clear: clearAlert,
  } = useStatusAlert({ position: 'top-right', duration: 3000 });

  const methods = useForm<RegisterFormValues>({
    defaultValues: {
      bio: '',
      shortBio: '',
      specialtyItemsText: '',
      languageCodes: language ? [language] : [],
      provinceIds: [],
      certificationsText: '',
      licenseNumber: '',
      yearsOfExperience: undefined,
      dailyRate: undefined,
      contactPhone: true,
      contactZalo: true,
      contactEmail: false,
    },
  });

  const isGuide = (me?.roles ?? []).some(
    (r) => String(r).toLowerCase() === 'guide',
  );

  const { data: myGuides, isLoading: isLoadingGuide } = useTourGuidesQuery(
    userId ? { userId, limit: 1 } : undefined,
    { enabled: !!userId && isGuide },
  );

  const existingGuide = myGuides?.items?.[0] ?? null;

  const { registerTourGuide, isPending } = useRegisterTourGuide();

  const onSubmit = (values: RegisterFormValues) => {
    if (isGuide) {
      showError(
        t('tour_guide.register_already_title'),
        t('tour_guide.register_already_desc'),
      );
      return;
    }

    const specialtyItems =
      values.specialtyItemsText
        ?.split('\n')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

    const certifications =
      values.certificationsText
        ?.split('\n')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

    const contactMethods: string[] = [];
    if (values.contactPhone) contactMethods.push('phone');
    if (values.contactZalo) contactMethods.push('zalo');
    if (values.contactEmail) contactMethods.push('email');

    const yearsOfExperience = values.yearsOfExperience
      ? Number(values.yearsOfExperience)
      : undefined;
    const dailyRate = values.dailyRate ? Number(values.dailyRate) : undefined;

    const translations = {
      [language || 'vi']: {
        bio: values.bio,
        shortBio: values.shortBio,
        specialtyItems,
      },
    };

    const payload: TourGuideRegisterPayload = {
      translations,
      languages: values.languageCodes,
      specializedProvinces: values.provinceIds,
      certifications,
      licenseNumber: values.licenseNumber,
      yearsOfExperience,
      dailyRate,
      currency: 'VND',
      contactMethods,
      isAvailable: true,
    };

    registerTourGuide(payload, {
      onSuccess: () => {
        showSuccess(
          t('tour_guide.register_success_title'),
          t('tour_guide.register_success_desc'),
        );
      },
      onError: (err) => {
        showError(
          t('tour_guide.register_error_title'),
          err.message ?? t('tour_guide.register_error_desc'),
        );
      },
    });
  };

  const loading = isGuide && isLoadingGuide;

  return (
    <div className="space-y-6">
      <LoadingOverlay visible={loading || isPending} />
      {alertState && (
        <StatusAlert
          variant={alertState.variant}
          title={alertState.title}
          description={alertState.description}
          position={alertState.position}
          onDismiss={clearAlert}
        />
      )}

      <div className="space-y-2">
        <H3>{t('tour_guide.register_title')}</H3>
        <P className="text-muted-foreground">
          {t('tour_guide.register_subtitle')}
        </P>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('tour_guide.register_status_title')}</CardTitle>
            <P className="mt-1 text-sm text-muted-foreground">
              {t('tour_guide.register_status_desc')}
            </P>
          </div>
          <div>
            {isGuide ? (
              existingGuide ? (
                buildStatusBadge(existingGuide, t)
              ) : (
                <Badge variant="outline">
                  {t('tour_guide.status_not_registered')}
                </Badge>
              )
            ) : (
              <Badge variant="outline">
                {t('tour_guide.status_not_registered')}
              </Badge>
            )}
          </div>
        </CardHeader>
        {isGuide &&
          existingGuide &&
          (
            <CardContent className="space-y-2">
              <P className="text-sm text-muted-foreground">
                {existingGuide.isVerified
                  ? t('tour_guide.register_status_verified_desc')
                  : t('tour_guide.register_status_pending_desc')}
              </P>
            </CardContent>
          )}
      </Card>

      {!isGuide && (
        <Card>
          <CardHeader>
            <CardTitle>{t('tour_guide.register_form_title')}</CardTitle>
            <P className="mt-1 text-sm text-muted-foreground">
              {t('tour_guide.register_form_desc')}
            </P>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form
                className="space-y-6"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('tour_guide.field_bio')}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...methods.register('bio', {
                        required: t('common.field_required'),
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('tour_guide.field_short_bio')}
                    </label>
                    <textarea
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...methods.register('shortBio')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('tour_guide.field_specialty_items')}
                    </label>
                    <textarea
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder={t(
                        'tour_guide.field_specialty_items_placeholder',
                      )}
                      {...methods.register('specialtyItemsText')}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('tour_guide.field_specialty_items_help')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="languageCodes"
                    control={methods.control}
                    rules={{ required: t('common.field_required') }}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t('tour_guide.field_languages')}
                          <span className="text-red-500">*</span>
                        </label>
                        <MultiSelect
                          options={LANGUAGE_OPTIONS}
                          placeholder={t(
                            'tour_guide.field_languages_placeholder',
                          )}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="provinceIds"
                    control={methods.control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t('tour_guide.field_provinces')}
                        </label>
                        <MultiSelect
                          options={(provinces ?? []).map((p) => ({
                            value: p._id,
                            label:
                              p.name?.[language as 'vi' | 'en'] ??
                              p.name?.vi ??
                              p.name?.en ??
                              p.slug ??
                              p._id,
                          }))}
                          placeholder={t(
                            'tour_guide.field_provinces_placeholder',
                          )}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        />
                      </div>
                    )}
                  />

                  <div className="space-y-2">
                    <CustomInput
                      name="yearsOfExperience"
                      label={t('tour_guide.field_years_experience')}
                      type="text"
                      placeHolder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <CustomInput
                      name="dailyRate"
                      label={t('tour_guide.field_daily_rate')}
                      type="text"
                      placeHolder="1500000"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('tour_guide.field_certifications')}
                    </label>
                    <textarea
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder={t(
                        'tour_guide.field_certifications_placeholder',
                      )}
                      {...methods.register('certificationsText')}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('tour_guide.field_certifications_help')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <CustomInput
                      name="licenseNumber"
                      label={t('tour_guide.field_license_number')}
                      type="text"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    {t('tour_guide.field_contact_methods')}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={methods.watch('contactPhone')}
                        onCheckedChange={(v) =>
                          methods.setValue('contactPhone', Boolean(v))
                        }
                      />
                      <span>{t('tour_guide.contact_phone')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={methods.watch('contactZalo')}
                        onCheckedChange={(v) =>
                          methods.setValue('contactZalo', Boolean(v))
                        }
                      />
                      <span>{t('tour_guide.contact_zalo')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={methods.watch('contactEmail')}
                        onCheckedChange={(v) =>
                          methods.setValue('contactEmail', Boolean(v))
                        }
                      />
                      <span>{t('tour_guide.contact_email')}</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isPending}>
                    {t('tour_guide.register_submit')}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TourGuideRegisterPage;
