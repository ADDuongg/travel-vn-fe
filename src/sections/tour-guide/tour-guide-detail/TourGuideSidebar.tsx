import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { TourGuide } from '@/features/tour-guide/types';
import { fmtMoney } from '@/utils';
import { FaFileLines, FaRepeat, FaReply, FaRoute } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

type TourGuideSidebarProps = {
  guide: TourGuide;
};

export function TourGuideSidebar({ guide }: TourGuideSidebarProps) {
  const { t } = useTranslation();

  const hasStats =
    (guide.responseRate ?? 0) > 0 ||
    (guide.completedTripsCount ?? 0) > 0 ||
    (guide.returningCustomerRate ?? 0) > 0;

  return (
    <Card
      id="contact"
      className="sticky top-28 overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-50/95 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm md:p-8"
    >
        <p className="text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
          {t('tour_guide.sidebar_folio_kicker', 'Folio')}
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-charcoal md:text-2xl">
          {t('tour_guide.contact_info')}
        </h2>

        {hasStats ? (
          <div className="mt-8 space-y-4 border-t border-charcoal/10 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50">
              {t('tour_guide.activity_stats')}
            </p>
            <ul className="space-y-4 text-sm leading-relaxed text-mist">
              {guide.responseRate != null && guide.responseRate > 0 && (
                <li className="flex gap-3">
                  <FaReply className="mt-0.5 h-4 w-4 shrink-0 text-forest/90" aria-hidden />
                  <span>
                    {t('tour_guide.response_rate')}{' '}
                    <span className="font-medium text-charcoal/90">{guide.responseRate}%</span>
                  </span>
                </li>
              )}
              {guide.completedTripsCount != null && guide.completedTripsCount > 0 && (
                <li className="flex gap-3">
                  <FaRoute className="mt-0.5 h-4 w-4 shrink-0 text-sunset-deep/90" aria-hidden />
                  <span>
                    {t('tour_guide.completed_trips')}{' '}
                    <span className="font-medium text-charcoal/90">
                      {guide.completedTripsCount}
                    </span>
                  </span>
                </li>
              )}
              {guide.returningCustomerRate != null && guide.returningCustomerRate > 0 && (
                <li className="flex gap-3">
                  <FaRepeat className="mt-0.5 h-4 w-4 shrink-0 text-forest/90" aria-hidden />
                  <span>
                    {t('tour_guide.returning_customers')}{' '}
                    <span className="font-medium text-charcoal/90">
                      {guide.returningCustomerRate}%
                    </span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        ) : null}

        {guide.dailyRate != null && guide.dailyRate > 0 && (
          <div className={hasStats ? 'mt-8 border-t border-charcoal/10 pt-8' : 'mt-8'}>
            <p className="text-sm text-mist">{t('tour_guide.daily_rate')}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-sunset-deep">
              {fmtMoney(guide.dailyRate, guide.currency)}
            </p>
            <p className="text-xs text-charcoal/45">/ {t('tour_guide.per_day')}</p>
          </div>
        )}

        {guide.contactMethods && guide.contactMethods.length > 0 && (
          <div className="mt-8 border-t border-charcoal/10 pt-8">
            <p className="mb-3 text-sm text-mist">{t('tour_guide.contact_via')}</p>
            <div className="flex flex-wrap gap-2">
              {guide.contactMethods.map((method) => (
                <Badge
                  key={method}
                  variant="secondary"
                  className="border border-charcoal/10 bg-sand-100/90 px-3 py-1.5 capitalize text-charcoal"
                >
                  {method}
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
            className="mt-8 flex items-center gap-2 border-t border-charcoal/10 pt-8 text-sm font-semibold text-forest transition hover:text-sunset-deep"
          >
            <FaFileLines className="h-4 w-4" aria-hidden />
            {t('tour_guide.download_cv')}
          </a>
        )}

        <Button
          className="mt-10 w-full bg-forest text-sand-50 hover:bg-forest/92"
          size="lg"
          disabled={!guide.isAvailable}
        >
          {t('tour_guide.contact_guide')}
        </Button>
    </Card>
  );
}
