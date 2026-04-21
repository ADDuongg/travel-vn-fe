import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layout';
import Container from '@/components/Container';
import { useTourGuideQuery } from '@/features/tour-guide/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import {
  FaCircleCheck,
  FaLocationDot,
  FaLanguage,
  FaCertificate,
  FaStar,
  FaClock,
  FaUserGroup,
  FaFileLines,
  FaReply,
  FaRoute,
  FaRepeat,
} from 'react-icons/fa6';
import { Ratings } from '@/components/ui/rating';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fmtMoney } from '@/utils';
import GuideReviews from '@/sections/tour-guide/GuideReviews';
import type { TourGuide, ProvinceRef } from '@/features/tour-guide/types';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';

function getBio(guide: TourGuide, lang: string): string | undefined {
  const t =
    guide.translations?.[lang] ??
    guide.translations?.vi ??
    guide.translations?.en;
  return t?.bio ?? t?.shortBio;
}

function getShortBio(guide: TourGuide, lang: string): string | undefined {
  const t =
    guide.translations?.[lang] ??
    guide.translations?.vi ??
    guide.translations?.en;
  return t?.shortBio ?? t?.bio;
}

function getSpecialties(guide: TourGuide, lang: string): string | undefined {
  const t =
    guide.translations?.[lang] ??
    guide.translations?.vi ??
    guide.translations?.en;
  return t?.specialties;
}

function getSpecialtyItems(guide: TourGuide, lang: string): string[] {
  const t =
    guide.translations?.[lang] ??
    guide.translations?.vi ??
    guide.translations?.en;
  return t?.specialtyItems ?? [];
}

function getProvinceName(p: string | ProvinceRef, lang: string): string {
  if (typeof p === 'string') return p;
  const names = (p as ProvinceRef).name as
    | { vi?: string; en?: string }
    | undefined;
  return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? '';
}

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';

const TourGuideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: guide, isLoading, isError } = useTourGuideQuery(id);

  if (isLoading) {
    return (
      <MainLayout>
        <Container>
          <div className="mt-8 h-64 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
            <div className="h-80 rounded-xl bg-gray-100 animate-pulse" />
          </div>
        </Container>
      </MainLayout>
    );
  }

  if (isError || !guide) {
    return (
      <MainLayout>
        <Container>
          <div className="mt-20 py-16 text-center text-red-500">
            {t('tour_guide.not_found')}
          </div>
        </Container>
      </MainLayout>
    );
  }

  const name = guide.user?.fullName ?? t('tour_guide.defaultName');
  const avatar =
    guide.user?.avatar?.url ??
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400';
  const coverImage = avatar ?? DEFAULT_COVER;
  const shortBio = getShortBio(guide, language);
  const bio = getBio(guide, language);
  const specialties = getSpecialties(guide, language);
  const specialtyItems = getSpecialtyItems(guide, language);
  const rating = guide.ratingSummary?.average ?? 0;
  const reviewCount = guide.ratingSummary?.total ?? 0;
  const provinceNames = (guide.specializedProvinces ?? [])
    .map((p) => getProvinceName(p, language))
    .filter(Boolean);
  const languageCount = guide.languages?.length ?? 0;

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative h-[320px] md:h-[380px] w-full overflow-hidden bg-slate-800">
        <img
          src={coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-end px-4 pb-8 md:px-6 md:pb-10">
          <Container className="flex flex-col md:flex-row md:items-end md:gap-8">
            <img
              src={avatar}
              alt={name}
              className="h-24 w-24 shrink-0 rounded-2xl border-4 border-white object-cover shadow-xl md:h-32 md:w-32"
            />
            <div className="mt-4 md:mt-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  {name}
                </h1>
                <FavoriteButton
                  entityType={FavoriteEntityType.GUIDE}
                  entityId={guide._id}
                  initialIsFavorited={guide.isFavorited}
                  size="icon"
                  className="h-10 w-10 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/15"
                />
                {guide.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white">
                    <FaCircleCheck className="h-3.5 w-3.5" />
                    {t('tour_guide.verified')}
                  </span>
                )}
                <Badge
                  variant={guide.isAvailable ? 'default' : 'secondary'}
                  className={
                    guide.isAvailable
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-500'
                  }
                >
                  {guide.isAvailable
                    ? t('tour_guide.available')
                    : t('tour_guide.not_available')}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/95">
                {(rating > 0 || reviewCount > 0) && (
                  <div className="flex items-center gap-2">
                    <Ratings
                      rating={rating}
                      variant="yellow"
                      totalStars={5}
                      readOnly
                      size={18}
                    />
                    <span className="text-sm font-medium">
                      {rating.toFixed(1)} ({reviewCount}{' '}
                      {t('tour_guide.reviews_count')})
                    </span>
                  </div>
                )}
                {guide.yearsOfExperience != null &&
                  guide.yearsOfExperience > 0 && (
                    <span className="text-sm font-medium">
                      {guide.yearsOfExperience}{' '}
                      {t('tour_guide.years_experience')}
                    </span>
                  )}
              </div>
              {shortBio && (
                <p className="mt-2 max-w-2xl text-sm text-white/90 line-clamp-2 md:text-base">
                  {shortBio}
                </p>
              )}
            </div>
          </Container>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-white shadow-sm">
        <Container className="py-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {guide.yearsOfExperience != null && guide.yearsOfExperience > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FaClock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {guide.yearsOfExperience}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('tour_guide.years_experience')}
                  </p>
                </div>
              </div>
            )}
            {reviewCount > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <FaStar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {reviewCount} {t('tour_guide.reviews_count')}
                  </p>
                </div>
              </div>
            )}
            {languageCount > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FaLanguage className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {languageCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('tour_guide.language_label')}
                  </p>
                </div>
              </div>
            )}
            {provinceNames.length > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <FaLocationDot className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {provinceNames.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('tour_guide.area_label')}
                  </p>
                </div>
              </div>
            )}
            {guide.responseRate != null && guide.responseRate > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <FaReply className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {guide.responseRate}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('tour_guide.response_rate')}
                  </p>
                </div>
              </div>
            )}
            {guide.completedTripsCount != null &&
              guide.completedTripsCount > 0 && (
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <FaRoute className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {guide.completedTripsCount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('tour_guide.completed_trips')}
                    </p>
                  </div>
                </div>
              )}
            {guide.returningCustomerRate != null &&
              guide.returningCustomerRate > 0 && (
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                    <FaRepeat className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {guide.returningCustomerRate}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('tour_guide.returning_customers')}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 xl:gap-10">
          {/* Main content */}
          <div className="xl:col-span-2 space-y-8">
            {bio && (
              <Card className="overflow-hidden rounded-2xl border-0 p-6 shadow-md">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FaUserGroup className="h-5 w-5" />
                  </span>
                  {t('tour_guide.about')}
                </h2>
                <p className="whitespace-pre-line text-gray-600 leading-relaxed">
                  {bio}
                </p>
              </Card>
            )}

            {/* Hai block riêng: Ngôn ngữ + Khu vực hoạt động */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {guide.languages?.length > 0 && (
                <Card className="overflow-hidden rounded-2xl border-0 p-6 shadow-md">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FaLanguage className="h-5 w-5" />
                    </span>
                    {t('tour_guide.language_label')}
                  </h2>
                  <p className="text-gray-600">{guide.languages.join(', ')}</p>
                </Card>
              )}
              {provinceNames.length > 0 && (
                <Card className="overflow-hidden rounded-2xl border-0 p-6 shadow-md">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FaLocationDot className="h-5 w-5" />
                    </span>
                    {t('tour_guide.operating_areas')}
                  </h2>
                  <p className="text-gray-600">{provinceNames.join(', ')}</p>
                </Card>
              )}
            </div>

            {/* Một block gộp: Chuyên môn & Chứng chỉ */}
            {(specialtyItems.length > 0 ||
              specialties ||
              (guide.certifications?.length ?? 0) > 0) && (
              <Card className="overflow-hidden rounded-2xl border-0 p-6 shadow-md">
                <h2 className=" flex items-center gap-2 text-xl font-bold text-gray-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FaCertificate className="h-5 w-5" />
                  </span>
                  {t('tour_guide.specialties_and_certifications')}
                </h2>
                {specialtyItems.length > 0 && (
                  <div className=" flex flex-wrap gap-2">
                    {specialtyItems.map((item, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                )}
                {/* {specialties && (
                  <p
                    className={`text-gray-600 leading-relaxed ${specialtyItems.length > 0 ? 'mb-4' : ''}`}
                  >
                    {specialties}
                  </p>
                )} */}
                {guide.certifications && guide.certifications.length > 0 && (
                  <ul className="list-none space-y-2">
                    {guide.certifications.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {guide.licenseNumber && (
                  <p className="mt-4 text-sm text-gray-500">
                    {t('tour_guide.license_number')}:{' '}
                    <span className="font-medium text-gray-700">
                      {guide.licenseNumber}
                    </span>
                  </p>
                )}
              </Card>
            )}

            {guide.gallery && guide.gallery.length > 0 && (
              <Card className="overflow-hidden rounded-2xl border-0 p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  {t('tour_guide.gallery')}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {guide.gallery.map((img, i) => (
                    <a
                      key={i}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-xl ring-1 ring-black/5 transition hover:ring-2 hover:ring-primary/30"
                    >
                      <img
                        src={img.url}
                        alt={
                          img.alt ?? `${t('tour_guide.gallery_alt')} ${i + 1}`
                        }
                        className="aspect-square w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Contact info (không avatar) */}
          <div className="xl:col-span-1">
            <Card className="sticky top-28 overflow-hidden rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                {t('tour_guide.contact_info')}
              </h3>
              {((guide.responseRate ?? 0) > 0 ||
                (guide.completedTripsCount ?? 0) > 0 ||
                (guide.returningCustomerRate ?? 0) > 0) && (
                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="mb-3 text-sm font-semibold text-gray-700">
                    {t('tour_guide.activity_stats')}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {guide.responseRate != null && guide.responseRate > 0 && (
                      <li className="flex items-center gap-2">
                        <FaReply className="h-4 w-4 shrink-0 text-sky-500" />
                        <span>
                          {t('tour_guide.response_rate')}:{' '}
                          <strong className="text-gray-900">
                            {guide.responseRate}%
                          </strong>
                        </span>
                      </li>
                    )}
                    {guide.completedTripsCount != null &&
                      guide.completedTripsCount > 0 && (
                        <li className="flex items-center gap-2">
                          <FaRoute className="h-4 w-4 shrink-0 text-violet-500" />
                          <span>
                            {t('tour_guide.completed_trips')}:{' '}
                            <strong className="text-gray-900">
                              {guide.completedTripsCount}
                            </strong>
                          </span>
                        </li>
                      )}
                    {guide.returningCustomerRate != null &&
                      guide.returningCustomerRate > 0 && (
                        <li className="flex items-center gap-2">
                          <FaRepeat className="h-4 w-4 shrink-0 text-teal-500" />
                          <span>
                            {t('tour_guide.returning_customers')}:{' '}
                            <strong className="text-gray-900">
                              {guide.returningCustomerRate}%
                            </strong>
                          </span>
                        </li>
                      )}
                  </ul>
                </div>
              )}
              {guide.dailyRate != null && guide.dailyRate > 0 && (
                <div className="mb-5">
                  <p className="text-sm text-gray-500">
                    {t('tour_guide.daily_rate')}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {fmtMoney(guide.dailyRate, guide.currency)}
                  </p>
                  <p className="text-xs text-gray-400">
                    / {t('tour_guide.per_day')}
                  </p>
                </div>
              )}
              {guide.contactMethods?.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-sm text-gray-500">
                    {t('tour_guide.contact_via')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guide.contactMethods.map((m, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="capitalize bg-slate-100 px-3 py-1.5"
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {guide.cv?.url && (
                <a
                  href={guide.cv.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-5 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <FaFileLines className="h-4 w-4" />
                  {t('tour_guide.download_cv')}
                </a>
              )}
              <Button
                className="w-full"
                size="lg"
                disabled={!guide.isAvailable}
              >
                {t('tour_guide.contact_guide')}
              </Button>
              {!guide.dailyRate && guide.contactMethods?.length === 0 && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  {t('tour_guide.contact_for_booking')}
                </p>
              )}
            </Card>
          </div>
        </div>

        <Separator className="my-12" />
        <GuideReviews guide={guide} />
      </Container>
    </MainLayout>
  );
};

export default TourGuideDetailPage;
