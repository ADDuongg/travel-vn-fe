import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/home-editorial/Reveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Headphones,
  Star,
  Globe,
} from 'lucide-react';
import { RoomBookingContactModal } from '@/sections/room/room-detail/RoomBookingContactModal';
import type { Room, HotelRef, ProvinceRef } from '@/features/rooms/types';
import { ROUTES } from '@/constants/router';
import { fmtMoney, caculateSalePrice } from '@/utils';

type Props = {
  room: Room;
  lang: string;
};

function isHotelRef(h: string | HotelRef | undefined): h is HotelRef {
  return Boolean(h && typeof h === 'object' && '_id' in h);
}

function provinceFromHotel(hotel: HotelRef): ProvinceRef | null {
  const p = hotel.provinceId;
  if (p && typeof p === 'object' && 'slug' in p) return p as ProvinceRef;
  return null;
}

function ConfidenceList() {
  const { t } = useTranslation();
  const items = [
    { icon: ShieldCheck, key: 'price' as const },
    { icon: Headphones, key: 'support' as const },
    { icon: Star, key: 'curated' as const },
    { icon: Globe, key: 'insurance' as const },
  ];
  return (
    <Card className="mt-2 rounded-2xl border border-charcoal/10 p-6 shadow-soft">
      <h3 className="mb-4 font-display text-lg text-charcoal">
        {t('room.confidence.title', 'Book with confidence')}
      </h3>
      <ul className="flex flex-col gap-3 text-sm text-mist">
        {items.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-center gap-2.5">
            <Icon className="size-4 shrink-0 text-forest" strokeWidth={2.25} />
            {t(`tour.confidence.${key}`)}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RoomEditorialPlanSection({ room, lang }: Props) {
  const { t } = useTranslation();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const hotel = isHotelRef(room.hotelId) ? room.hotelId : null;
  const province = hotel ? provinceFromHotel(hotel) : null;
  const contact = hotel?.contact;

  const basePrice = room.pricing?.basePrice ?? 0;
  const weekend = room.pricing?.weekendPrice;
  const currency = room.pricing?.currency ?? 'VND';
  let displayPrice = basePrice;
  if (room.sale?.isActive && room.sale.type === 'PERCENT') {
    displayPrice = caculateSalePrice(basePrice, room.sale.value);
  } else if (room.sale?.isActive && room.sale.type === 'FIXED') {
    displayPrice = Math.max(0, basePrice - room.sale.value);
  }

  const contactQuery =
    hotel != null
      ? `${ROUTES.CONTACT}?stay=${encodeURIComponent(hotel.slug)}&room=${encodeURIComponent(room.slug)}`
      : ROUTES.CONTACT;

  const roomName =
    room.translations?.[lang]?.name ??
    room.translations?.vi?.name ??
    room.translations?.en?.name ??
    room.code;
  const hotelTitle =
    hotel?.translations?.[lang]?.name ??
    hotel?.translations?.vi?.name ??
    hotel?.translations?.en?.name ??
    '';

  return (
    <section
      id="plan"
      className="scroll-mt-28 mx-auto max-w-6xl px-4 pb-12 md:px-10 md:pb-20"
    >
      <Reveal className="mb-10 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('room.editorial.plan_kicker', 'Correspondence')}
        </p>
        <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
          {t('room.editorial.plan_title', 'Hold this room in language')}
        </h2>
        <p className="max-w-2xl text-sm text-mist">
          {t(
            'room.editorial.plan_subtitle',
            'Share check-in intent, guest count, and pace. We confirm by message; nothing here pretends to be a payment rail.',
          )}
        </p>
      </Reveal>

      <Reveal className="mb-14">
        <div className="rounded-[2rem] border border-charcoal/10 bg-gradient-to-br from-sand-100 via-sand-50 to-sand-100 px-6 py-10 shadow-soft md:px-12 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('room.editorial.planning_posture', 'Planning posture')}
              </p>
              <p className="max-w-prose text-lg leading-relaxed text-mist">
                {t(
                  'room.editorial.plan_body',
                  'Pick check-in, check-out, room count, and guests per room. Validation follows min/max nights, inventory cap, and heads per room vs category capacity.',
                )}
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-4 rounded-[1.5rem] border border-charcoal/10 bg-sand-50/90 p-6 md:p-8 lg:mt-0">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
                  {t('room.editorial.indicative_from', 'Indicative from')}
                </p>
                <p className="mt-2 font-display text-4xl text-charcoal md:text-[2.75rem]">
                  {fmtMoney(displayPrice, currency)}
                </p>
                {weekend ? (
                  <p className="mt-1 text-sm text-mist">
                    {t('room.editorial.weekend_tier', 'Weekend tier')}{' '}
                    {fmtMoney(weekend, currency)}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-mist">
                  {t('room.editorial.plan_keys_line', {
                    inv: String(room.inventory?.totalRooms ?? 0),
                    guests: String(room.maxGuests),
                    defaultValue:
                      '{{inv}} keys in this category · up to {{guests}} guests per room',
                  })}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setBookingModalOpen(true)}
                className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-8 py-3.5 text-center text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-charcoal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                {t('room.editorial.modal_cta_open')}
              </Button>
              <Link
                to={contactQuery}
                className="text-center text-sm font-semibold text-forest underline-offset-4 hover:text-sunset-deep hover:underline"
              >
                {t('tour.journey.plan.cta_contact')}
              </Link>
              <ConfidenceList />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('room.editorial.direct_lines', 'Direct lines')}
        </p>
        <p className="mt-2 max-w-prose text-sm text-mist">
          {t(
            'room.editorial.direct_lines_body',
            'Call or mail the property, or write to us if you want the request on file.',
          )}
        </p>
      </Reveal>

      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-charcoal/10 bg-sand-50 p-8 shadow-soft md:flex-row md:flex-wrap md:items-center md:gap-6">
        {contact?.phone ? (
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className="rounded-full bg-forest px-6 py-3 text-center text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-forest-soft"
          >
            {t('room.editorial.call_property', 'Call property')}
          </a>
        ) : null}
        {contact?.email ? (
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(`Inquiry: ${roomName} · ${hotelTitle}`)}`}
            className="rounded-full border border-charcoal/20 px-6 py-3 text-center text-sm font-semibold text-charcoal transition hover:border-forest/40"
          >
            {t('room.editorial.email_property', 'Email property')}
          </a>
        ) : null}
        {contact?.website ? (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-charcoal/20 px-6 py-3 text-center text-sm font-semibold text-charcoal transition hover:border-forest/40"
          >
            {t('room.editorial.property_site', 'Property site ↗')}
          </a>
        ) : null}
        <Link
          to={contactQuery}
          className="rounded-full bg-charcoal px-6 py-3 text-center text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-charcoal/90"
        >
          {t('room.editorial.write_platform', 'Write to us')}
        </Link>
      </div>

      <Reveal className="mt-14 flex flex-wrap gap-4">
        <Link
          to={ROUTES.ROOM.INDEX}
          className="rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-forest/40"
        >
          {t('room.editorial.nav_all_rooms', 'All rooms')}
        </Link>
        {hotel ? (
          <Link
            to={ROUTES.HOTEL.DETAIL.replace(':id', hotel._id)}
            className="rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-forest/40"
          >
            {t('room.editorial.whole_property', 'Whole property')}
          </Link>
        ) : null}
        {province ? (
          <Link
            to={ROUTES.PROVINCE.DETAIL.replace(':slug', province.slug)}
            className="rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-forest/40"
          >
            {t('room.editorial.province_atlas', 'Province atlas')}
          </Link>
        ) : null}
      </Reveal>

      <RoomBookingContactModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        room={room}
        lang={lang}
        contactHref={contactQuery}
        defaultJourneyInterest={t('room.editorial.modal_journey_prefill', {
          room: roomName,
          hotel: hotelTitle || t('room.editorial.modal_journey_hotel_fallback', 'Property'),
        })}
      />
    </section>
  );
}

