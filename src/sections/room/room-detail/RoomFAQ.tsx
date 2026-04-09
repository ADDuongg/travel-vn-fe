import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@components/ui/accordion';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import type { Room } from '@/features/rooms/types';
import { EnumLanguage } from '@/constants/commons';
import { useI18nStorage } from '@/hooks/useI18nStorage';

const RoomFAQ = ({ room }: { room: Room }) => {
  const [value] = useI18nStorage(EnumLanguage.DEFAULT);
  return (
    <section id="faq" className="mt-10">
      <h2 className="text-xl font-bold mb-4">FAQ</h2>

      <Accordion type="single" collapsible className="w-full">
        {room?.translations[value]?.faq?.map((faq, idx) => (
          <AccordionItem key={idx} value={idx.toString()} className="">
            <AccordionTrigger
              className="font-semibold text-base"
              iconOpen={<AiOutlineMinus className="text-gray-700" />}
              iconClosed={<AiOutlinePlus className="text-gray-700" />}
            >
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed px-2 pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default RoomFAQ;
