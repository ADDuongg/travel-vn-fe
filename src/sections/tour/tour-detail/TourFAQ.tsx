import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@components/ui/accordion';
import { Minus, Plus } from 'lucide-react';

const FAQ_IDS = ['faq_1', 'faq_2', 'faq_3', 'faq_4', 'faq_5'] as const;

const TourFAQ: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="faq" className="scroll-mt-40">
      <Card className="border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2
          className="mb-4 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
          style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
        >
          {t('tour.detail.faq_title', 'Common questions')}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_IDS.map((id) => (
            <AccordionItem
              key={id}
              value={id}
              className="border-b border-[rgba(28,26,20,0.08)]"
            >
              <AccordionTrigger
                className="text-left text-base font-['Playfair_Display',serif] font-semibold text-[#1c1a14] hover:no-underline"
                style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
                iconOpen={<Minus className="size-4 text-[#1c1a14]/70" />}
                iconClosed={<Plus className="size-4 text-[#1c1a14]/70" />}
              >
                {t(`tour.detail.${id}_q` as never)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-[rgba(28,26,20,0.7)]">
                {t(`tour.detail.${id}_a` as never)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </section>
  );
};

export default TourFAQ;