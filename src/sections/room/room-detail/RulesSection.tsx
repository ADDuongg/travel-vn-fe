import React from 'react';
import { MdOutlineDoNotDisturbOn } from 'react-icons/md';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import type { Room } from '@/features/rooms/types';

type RulesSectionProps = {
  room: Room;
};

const RulesSection: React.FC<RulesSectionProps> = ({ room }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const rules =
    room.translations?.[language]?.hotelRule ??
    room.translations?.vi?.hotelRule ??
    room.translations?.en?.hotelRule ??
    [];
  if (!rules.length) return null;

  return (
    <section id="rules" className="scroll-mt-40">
      <Card className="border border-[rgba(201,146,42,0.25)] bg-[#f5e9d0]/40 p-6 shadow-sm sm:p-8">
        <h2
          className="mb-4 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
          style={{
            fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
          }}
        >
          {t('room.detail.rules_title', 'House rules')}
        </h2>
        <ul className="space-y-3 text-[rgba(28,26,20,0.8)]">
        {rules.map((rule, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 rounded-lg border border-[rgba(201,146,42,0.2)] bg-white/60 px-4 py-3 text-sm leading-relaxed"
          >
            <MdOutlineDoNotDisturbOn
              className="mt-0.5 shrink-0 text-[#c9922a]"
              size={18}
            />
            <span>{rule}</span>
          </li>
        ))}
        </ul>
      </Card>
    </section>
  );
};

export default RulesSection;
