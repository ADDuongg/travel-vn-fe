import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import type { Room } from '@/features/rooms/types';

type Props = {
  room: Room;
};

export function RoomEditorialBookingPostureSection({ room }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const rules =
    room.translations?.[language]?.hotelRule ??
    room.translations?.vi?.hotelRule ??
    room.translations?.en?.hotelRule ??
    [];

  const minN = room.bookingConfig?.minNights ?? 1;
  const maxN = room.bookingConfig?.maxNights;

  return (
    <section
      id="rules"
      className="scroll-mt-28 border-y border-charcoal/10 bg-sand-100 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-12 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('room.editorial.rules_kicker', 'Booking posture')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t(
              'room.editorial.rules_title',
              'Nights, holds, and correspondence',
            )}
          </h2>
          <p className="max-w-2xl text-sm text-mist">
            {t(
              'room.editorial.rules_subtitle',
              'Minimum and maximum nights, instant vs correspondence-only holds, and how many keys sit in this category.',
            )}
          </p>
        </Reveal>
        <Stagger className="space-y-4">
          <RevealItem>
            <div className="rounded-2xl border border-charcoal/10 bg-sand-50 px-6 py-4 text-mist shadow-soft md:px-8">
              <p className="font-medium text-charcoal">
                {t('room.editorial.stay_length', 'Stay length')}
              </p>
              <p className="mt-2 text-sm">
                {t('room.editorial.min_nights_line', {
                  count: minN,
                  defaultValue: 'Minimum {{count}} night(s)',
                })}
                {maxN
                  ? t('room.editorial.max_nights_suffix', {
                      count: maxN,
                      defaultValue: ' · maximum {{count}} nights',
                    })
                  : ''}
                .
              </p>
              <p className="mt-2 text-sm">
                {room.bookingConfig?.allowInstantBooking
                  ? t(
                      'room.editorial.instant_copy',
                      'When slots allow, staff may offer a lighter correspondence hold (still not a cart checkout).',
                    )
                  : t(
                      'room.editorial.correspondence_copy',
                      'This category is correspondence-only: dates and party shape are confirmed before a hold is discussed.',
                    )}
              </p>
            </div>
          </RevealItem>
          {rules.length > 0 ? (
            <RevealItem>
              <div className="rounded-2xl border border-charcoal/10 bg-sand-50 px-6 py-4 text-mist shadow-soft md:px-8">
                <p className="font-medium text-charcoal">
                  {t('room.editorial.room_notes', 'Room notes')}
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {rules.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ) : null}
        </Stagger>
      </div>
    </section>
  );
}
