import React, { useLayoutEffect, useRef, useState } from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useProvincesQuery } from '@/features/provinces/hooks';
import {
  useMyTourGuideQuery,
  useRegisterTourGuide,
  useUpdateMyTourGuide,
} from '@/features/tour-guide/hooks';
import type {
  TourGuide,
  TourGuideCv,
  TourGuideGalleryItem,
  TourGuideRegisterPayload,
  TourGuideUpdatePayload,
} from '@/features/tour-guide/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CustomInput from '@/components/CustomInput';
import { MultiSelect } from '@/components/ui/multiple-select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { H3, P } from '@/components/ui/typography';
import { CvUploadField, GalleryUploadField } from '@/sections/tour-guide/form';

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
  cv: TourGuideCv | null | undefined;
  gallery: TourGuideGalleryItem[];
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

function parseLines(text: string | undefined): string[] {
  return text?.split('\n').map((s) => s.trim()).filter(Boolean) ?? [];
}

function buildContactMethods(values: RegisterFormValues): string[] {
  const m: string[] = [];
  if (values.contactPhone) m.push('phone');
  if (values.contactZalo) m.push('zalo');
  if (values.contactEmail) m.push('email');
  return m;
}

function provinceIdsFromGuide(guide: TourGuide): string[] {
  return (guide.specializedProvinces ?? []).map((p) =>
    typeof p === 'string' ? p : p._id,
  );
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

const TourGuideRegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const langKey = language || 'vi';

  const [cvDirty, setCvDirty] = useState(false);
  const [galleryDirty, setGalleryDirty] = useState(false);
  const lastFormResetKey = useRef<string>('');

  const {
    data: myProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    isSuccess: isProfileSuccess,
    error: profileError,
    refetch: refetchProfile,
  } = useMyTourGuideQuery();

  const { data: provinces } = useProvincesQuery();

  const methods = useForm<RegisterFormValues>({
    defaultValues: {
      bio: '',
      shortBio: '',
      specialtyItemsText: '',
      languageCodes: language ? [language] : [],
      provinceIds: [],
      certificationsText: '',
      licenseNumber: '',
      yearsOfExperience: '',
      dailyRate: '',
      contactPhone: true,
      contactZalo: true,
      contactEmail: false,
      cv: undefined,
      gallery: [],
    },
  });

  const { reset, handleSubmit, watch } = methods;

  const hasProfile = myProfile != null;
  const formSyncKey = `${myProfile?._id ?? 'none'}:${langKey}`;

  useLayoutEffect(() => {
    if (!isProfileSuccess) return;

    const resetKey = formSyncKey;
    if (lastFormResetKey.current === resetKey) return;
    lastFormResetKey.current = resetKey;

    if (myProfile) {
      const g = myProfile;
      const tr =
        g.translations?.[langKey] ??
        g.translations?.vi ??
        g.translations?.en ??
        {};
      const specialtyText = (tr.specialtyItems ?? []).join('\n');
      const certs = (g.certifications ?? []).join('\n');

      reset({
        bio: tr.bio ?? '',
        shortBio: tr.shortBio ?? '',
        specialtyItemsText: specialtyText,
        languageCodes: [...(g.languages ?? [])],
        provinceIds: provinceIdsFromGuide(g),
        certificationsText: certs,
        licenseNumber: g.licenseNumber ?? '',
        yearsOfExperience:
          g.yearsOfExperience != null ? String(g.yearsOfExperience) : '',
        dailyRate: g.dailyRate != null ? String(g.dailyRate) : '',
        contactPhone: (g.contactMethods ?? []).includes('phone'),
        contactZalo: (g.contactMethods ?? []).includes('zalo'),
        contactEmail: (g.contactMethods ?? []).includes('email'),
        cv: g.cv ? { ...g.cv } : undefined,
        gallery: (g.gallery ?? []).map((it, i) => ({
          ...it,
          order: it.order ?? i,
        })),
      });
    } else {
      reset({
        bio: '',
        shortBio: '',
        specialtyItemsText: '',
        languageCodes: language ? [language] : [],
        provinceIds: [],
        certificationsText: '',
        licenseNumber: '',
        yearsOfExperience: '',
        dailyRate: '',
        contactPhone: true,
        contactZalo: true,
        contactEmail: false,
        cv: undefined,
        gallery: [],
      });
    }
    setCvDirty(false);
    setGalleryDirty(false);
  }, [isProfileSuccess, myProfile, langKey, language, reset, formSyncKey]);

  const { registerTourGuide, isPending: isRegisterPending } =
    useRegisterTourGuide();
  const { updateMyTourGuide, isPending: isUpdatePending } =
    useUpdateMyTourGuide();

  const onSubmitRegister = (values: RegisterFormValues) => {
    const specialtyItems = parseLines(values.specialtyItemsText);
    const certifications = parseLines(values.certificationsText);
    const contactMethods = buildContactMethods(values);

    const yearsOfExperience = values.yearsOfExperience?.trim()
      ? Number(values.yearsOfExperience)
      : undefined;
    const dailyRate = values.dailyRate?.trim()
      ? Number(values.dailyRate)
      : undefined;

    const translations = {
      [langKey]: {
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

    if (values.cv && values.cv.url) {
      payload.cv = values.cv;
    }
    if (values.gallery.length > 0) {
      payload.gallery = values.gallery.map((item, index) => ({
        ...item,
        order: index,
      }));
    }

    registerTourGuide(payload);
  };

  const onSubmitEdit = (values: RegisterFormValues) => {
    if (!myProfile) return;

    const specialtyItems = parseLines(values.specialtyItemsText);
    const certifications = parseLines(values.certificationsText);
    const contactMethods = buildContactMethods(values);

    const yearsOfExperience = values.yearsOfExperience?.trim()
      ? Number(values.yearsOfExperience)
      : undefined;
    const dailyRate = values.dailyRate?.trim()
      ? Number(values.dailyRate)
      : undefined;

    const translations = {
      ...myProfile.translations,
      [langKey]: {
        ...myProfile.translations[langKey],
        bio: values.bio,
        shortBio: values.shortBio,
        specialtyItems,
      },
    };

    const raw: TourGuideUpdatePayload = {
      translations,
    };

    const langsNext = [...values.languageCodes].sort().join(',');
    const langsPrev = [...(myProfile.languages ?? [])].sort().join(',');
    if (langsNext !== langsPrev) {
      raw.languages = values.languageCodes;
    }

    const provNext = [...values.provinceIds].sort().join(',');
    const provPrev = provinceIdsFromGuide(myProfile).sort().join(',');
    if (provNext !== provPrev) {
      raw.specializedProvinces = values.provinceIds;
    }

    const certsNext = [...certifications].sort().join(',');
    const certsPrev = [...(myProfile.certifications ?? [])].sort().join(',');
    if (certsNext !== certsPrev) {
      raw.certifications = certifications;
    }

    if ((values.licenseNumber ?? '') !== (myProfile.licenseNumber ?? '')) {
      raw.licenseNumber = values.licenseNumber ?? '';
    }

    if (yearsOfExperience !== myProfile.yearsOfExperience) {
      raw.yearsOfExperience = yearsOfExperience;
    }

    if (dailyRate !== myProfile.dailyRate) {
      raw.dailyRate = dailyRate;
    }

    const cmNext = [...contactMethods].sort().join(',');
    const cmPrev = [...(myProfile.contactMethods ?? [])].sort().join(',');
    if (cmNext !== cmPrev) {
      raw.contactMethods = contactMethods;
    }

    if (cvDirty) {
      raw.cv = values.cv ?? null;
    }

    if (galleryDirty) {
      raw.gallery = values.gallery.map((item, index) => ({
        ...item,
        order: index,
      }));
    }

    const payload = omitUndefined(
      raw as unknown as Record<string, unknown>,
    ) as TourGuideUpdatePayload;

    updateMyTourGuide(payload, {
      onSuccess: () => {
        setCvDirty(false);
        setGalleryDirty(false);
        lastFormResetKey.current = '';
      },
    });
  };

  const onSubmit = (values: RegisterFormValues) => {
    if (hasProfile) {
      onSubmitEdit(values);
    } else {
      onSubmitRegister(values);
    }
  };

  const busy =
    isProfileLoading ||
    (isRegisterPending && !hasProfile) ||
    (isUpdatePending && hasProfile);

  const profileErrMsg =
    profileError && typeof profileError === 'object' && 'message' in profileError
      ? String((profileError as { message: string }).message)
      : t('tour_guide.profile_load_error_desc');

  return (
    <div className="space-y-6">
      <LoadingOverlay visible={busy} />

      {isProfileError ? (
        <Card className="overflow-hidden rounded-2xl border-destructive/35 bg-card shadow-soft">
          <CardHeader className="space-y-3 border-b border-destructive/15 bg-destructive/5 px-4 py-5 sm:px-6">
            <CardTitle className="text-destructive text-base">
              {t('tour_guide.profile_load_error_title')}
            </CardTitle>
            <P className="text-sm text-muted-foreground">{profileErrMsg}</P>
            <Button
              type="button"
              variant="outline"
              className="border-charcoal/15 text-charcoal hover:bg-charcoal/4"
              onClick={() => void refetchProfile()}
            >
              {t('common.retry')}
            </Button>
          </CardHeader>
        </Card>
      ) : null}

      <div className="rounded-2xl border border-charcoal/10 bg-sand-50/70 px-5 py-6 shadow-soft sm:px-8 sm:py-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
          {t('tour_guide.page_eyebrow')}
        </p>
        <H3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-charcoal md:text-[1.75rem]">
          {hasProfile
            ? t('tour_guide.profile_title')
            : t('tour_guide.register_title')}
        </H3>
        <P className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60 sm:text-base">
          {hasProfile
            ? t('tour_guide.profile_subtitle')
            : t('tour_guide.register_subtitle')}
        </P>
      </div>

      <Card className="overflow-hidden rounded-2xl border-charcoal/10 bg-card shadow-soft">
        <CardHeader className="flex flex-col gap-3 border-b border-charcoal/10 bg-sand-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <CardTitle className="font-display text-lg text-charcoal">
              {t('tour_guide.register_status_title')}
            </CardTitle>
            <P className="mt-1 text-sm text-charcoal/55">
              {t('tour_guide.register_status_desc')}
            </P>
          </div>
          <div>
            {hasProfile && myProfile ? (
              buildStatusBadge(myProfile, t)
            ) : (
              <Badge variant="outline">
                {t('tour_guide.status_not_registered')}
              </Badge>
            )}
          </div>
        </CardHeader>
        {hasProfile && myProfile ? (
          <CardContent className="space-y-2 border-t border-charcoal/8 bg-sand-50/40 px-4 py-4 sm:px-6">
            <P className="text-sm text-charcoal/60">
              {myProfile.isVerified
                ? t('tour_guide.register_status_verified_desc')
                : t('tour_guide.register_status_pending_desc')}
            </P>
          </CardContent>
        ) : null}
      </Card>

      {isProfileSuccess && !isProfileError ? (
        <Card className="overflow-hidden rounded-2xl border-charcoal/10 bg-card shadow-soft">
          <CardHeader className="border-b border-charcoal/10 bg-sand-50/70 px-4 py-5 sm:px-6">
            <CardTitle className="font-display text-xl font-semibold tracking-tight text-charcoal">
              {hasProfile
                ? t('tour_guide.profile_form_title')
                : t('tour_guide.register_form_title')}
            </CardTitle>
            <P className="mt-2 text-sm leading-relaxed text-charcoal/60">
              {hasProfile
                ? t('tour_guide.profile_form_desc')
                : t('tour_guide.register_form_desc')}
            </P>
          </CardHeader>
          <CardContent className="px-4 py-6 sm:px-6">
            <FormProvider {...methods}>
              <form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
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

                <Separator className="bg-charcoal/10" />

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('tour_guide.field_cv')}
                  </label>
                  <P className="text-xs text-muted-foreground mb-2">
                    {t('tour_guide.field_cv_help')}
                  </P>
                  <CvUploadField
                    control={methods.control}
                    name="cv"
                    disabled={busy}
                    onDirtyChange={() => setCvDirty(true)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('tour_guide.field_gallery')}
                  </label>
                  <P className="text-xs text-muted-foreground mb-2">
                    {t('tour_guide.field_gallery_help')}
                  </P>
                  <GalleryUploadField
                    control={methods.control}
                    name="gallery"
                    disabled={busy}
                    onDirtyChange={() => setGalleryDirty(true)}
                  />
                </div>

                <Separator className="bg-charcoal/10" />

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
                          key={`${formSyncKey}-languages`}
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
                          key={`${formSyncKey}-provinces`}
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

                <Separator className="bg-charcoal/10" />

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

                <Separator className="bg-charcoal/10" />

                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    {t('tour_guide.field_contact_methods')}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={watch('contactPhone')}
                        onCheckedChange={(v) =>
                          methods.setValue('contactPhone', Boolean(v))
                        }
                      />
                      <span>{t('tour_guide.contact_phone')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={watch('contactZalo')}
                        onCheckedChange={(v) =>
                          methods.setValue('contactZalo', Boolean(v))
                        }
                      />
                      <span>{t('tour_guide.contact_zalo')}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={watch('contactEmail')}
                        onCheckedChange={(v) =>
                          methods.setValue('contactEmail', Boolean(v))
                        }
                      />
                      <span>{t('tour_guide.contact_email')}</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={busy}
                    className="rounded-full bg-forest px-8 font-semibold text-sand-50 shadow-soft transition-colors hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/35 focus-visible:ring-offset-2 disabled:opacity-60"
                  >
                    {hasProfile
                      ? t('tour_guide.update_submit')
                      : t('tour_guide.register_submit')}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default TourGuideRegisterPage;

