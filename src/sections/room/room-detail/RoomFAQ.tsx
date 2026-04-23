import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@components/ui/accordion';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import type { Room } from '@/features/rooms/types';

type RoomFAQProps = {
  room: Room;
};

const RoomFAQ = ({ room }: RoomFAQProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const faqs =
    room.translations?.[language]?.faq ??
    room.translations?.vi?.faq ??
    room.translations?.en?.faq ??
    [];
  if (!faqs.length) return null;

  return (
    <section id="faq" className="scroll-mt-40">
      <Card className="border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2
          className="mb-6 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
          style={{
            fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
          }}
        >
          {t('room.detail.faq_title', 'FAQ')}
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={idx.toString()}
              className="border-b border-[rgba(28,26,20,0.08)]"
            >
              <AccordionTrigger
                className="py-4 text-left font-semibold text-base hover:no-underline"
                iconOpen={<AiOutlineMinus className="text-[#2d6a4f]" />}
                iconClosed={<AiOutlinePlus className="text-[#2d6a4f]" />}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4 leading-relaxed text-[rgba(28,26,20,0.7)]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </section>
  );
};

export default RoomFAQ;
