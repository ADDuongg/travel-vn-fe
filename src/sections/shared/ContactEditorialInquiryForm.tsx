import { motion, useReducedMotion } from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { EDITORIAL_FIELD_CLASS, EDITORIAL_LABEL_CLASS } from '@/sections/shared/editorialFieldClasses';

const RESET_SENT_MS = 5200;

export type ContactEditorialConversationPick = {
  nonce: number;
  title: string;
};

type ContactEditorialInquiryFormProps = {
  /** Full card + hero copy on Contact page vs compact block inside room modal */
  mode: 'page' | 'embedded';
  className?: string;
  /** When guide deep-link resolves, prefill journey line once if field still empty */
  guideJourneyPrefill?: string;
  /** When user taps a conversation tile on the Contact page */
  conversationPick?: ContactEditorialConversationPick | null;
};

export function ContactEditorialInquiryForm({
  mode,
  className,
  guideJourneyPrefill,
  conversationPick,
}: ContactEditorialInquiryFormProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [journeyInterest, setJourneyInterest] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const guideAppliedFor = useRef<string | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!guideJourneyPrefill) {
      guideAppliedFor.current = undefined;
      return;
    }
    if (guideAppliedFor.current === guideJourneyPrefill) return;
    setJourneyInterest((prev) =>
      prev.trim() ? prev : guideJourneyPrefill,
    );
    guideAppliedFor.current = guideJourneyPrefill;
  }, [guideJourneyPrefill]);

  useEffect(() => {
    if (!conversationPick) return;
    setJourneyInterest(conversationPick.title);
  }, [conversationPick?.nonce, conversationPick?.title]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    setSent(true);
    resetTimer.current = window.setTimeout(() => {
      resetTimer.current = null;
      setSent(false);
      setName('');
      setEmail('');
      setJourneyInterest('');
      setMessage('');
    }, RESET_SENT_MS);
  }

  const fieldClass =
    mode === 'page'
      ? 'w-full rounded-2xl border border-charcoal/12 bg-sand-50/65 px-4 py-3 text-[0.95rem] text-charcoal shadow-inner outline-none ring-forest/0 transition placeholder:text-charcoal/35 focus:border-forest/35 focus:ring-2 focus:ring-forest/15'
      : EDITORIAL_FIELD_CLASS;

  const labelClass = mode === 'page' ? EDITORIAL_LABEL_CLASS : EDITORIAL_LABEL_CLASS;

  const inner = (
    <>
      {mode === 'page' ? (
        <>
          <p className="text-[11px] uppercase tracking-[0.3em] text-charcoal/45">
            {t('contact_editorial.form.eyebrow')}
          </p>
          <h3 className="mt-3 font-display text-3xl text-charcoal md:text-[2.35rem]">
            {t('contact_editorial.form.title')}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-mist md:text-[0.95rem]">
            {t('contact_editorial.form.intro')}
          </p>
        </>
      ) : (
        <div className="mb-6 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('room.editorial.modal_correspondence_kicker')}
          </p>
          <p className="font-display text-xl text-charcoal md:text-2xl">
            {t('room.editorial.modal_correspondence_title')}
          </p>
          <p className="text-sm text-mist">{t('room.editorial.modal_correspondence_lead')}</p>
        </div>
      )}

      <form
        className={mode === 'page' ? 'mt-10 space-y-6' : 'mt-2 space-y-6'}
        onSubmit={handleSubmit}
      >
        <label className="block space-y-2">
          <span className={labelClass}>{t('contact_editorial.form.label_name')}</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={fieldClass}
            placeholder={t('contact_editorial.form.placeholder_name')}
          />
        </label>
        <label className="block space-y-2">
          <span className={labelClass}>{t('contact_editorial.form.label_email')}</span>
          <input
            required
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={fieldClass}
            placeholder={t('contact_editorial.form.placeholder_email')}
          />
        </label>
        <label className="block space-y-2">
          <span className={labelClass}>{t('contact_editorial.form.label_journey')}</span>
          <input
            value={journeyInterest}
            onChange={(e) => setJourneyInterest(e.target.value)}
            className={fieldClass}
            placeholder={t('contact_editorial.form.placeholder_journey')}
          />
        </label>
        <label className="block space-y-2">
          <span className={labelClass}>{t('contact_editorial.form.label_message')}</span>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={mode === 'page' ? 5 : 4}
            className={`${fieldClass} resize-y leading-relaxed`}
            placeholder={t('contact_editorial.form.placeholder_message')}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            className="rounded-full bg-charcoal px-8 py-3 text-sm font-semibold text-sand-50 shadow-soft transition hover:bg-charcoal/90"
          >
            {t('contact_editorial.form.submit')}
          </button>
          {sent ? (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-forest"
            >
              {t('contact_editorial.form.sent_message')}
            </motion.p>
          ) : (
            <p className="text-xs leading-relaxed text-charcoal/45">
              {t('contact_editorial.form.helper')}
            </p>
          )}
        </div>
      </form>
    </>
  );

  if (mode === 'page') {
    return (
      <div
        className={
          className ??
          'rounded-[1.85rem] border border-charcoal/10 bg-sand-50/75 p-8 shadow-soft backdrop-blur-md md:p-10'
        }
      >
        {inner}
      </div>
    );
  }

  return <div className={className}>{inner}</div>;
}
