import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@components/ui/accordion';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const RoomFAQ: React.FC = () => {
  return (
    <section id="faq" className="mt-10">
      <h2 className="text-xl font-bold mb-4">FAQ</h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="faq-1" className="">
          <AccordionTrigger
            className="font-semibold text-base"
            iconOpen={<AiOutlineMinus className="text-gray-700" />}
            iconClosed={<AiOutlinePlus className="text-gray-700" />}
          >
            Can I get the refund?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed px-2 pb-4">
            We have you covered! We will email you as items in your order ship,
            or if there are updates on the status of your order. Can’t find the
            email? Click here to check the status of your order.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-2">
          <AccordionTrigger
            className="font-semibold text-base"
            iconOpen={<AiOutlineMinus className="text-gray-700" />}
            iconClosed={<AiOutlinePlus className="text-gray-700" />}
          >
            Can I change the travel date?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed px-2 pb-4">
            Yes, you can reschedule your travel date by contacting our support
            team at least 7 days in advance.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-3">
          <AccordionTrigger
            className="font-semibold text-base"
            iconOpen={<AiOutlineMinus className="text-gray-700" />}
            iconClosed={<AiOutlinePlus className="text-gray-700" />}
          >
            My discount code is not working, what do I do?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed px-2 pb-4">
            Please check the expiry date and terms of the discount code. If the
            issue persists, reach out to our support team for assistance.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-4">
          <AccordionTrigger
            className="font-semibold text-base"
            iconOpen={<AiOutlineMinus className="text-gray-700" />}
            iconClosed={<AiOutlinePlus className="text-gray-700" />}
          >
            Do I need to apply visa?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed px-2 pb-4">
            Depending on your nationality and destination, you may need a visa.
            Please check with your local embassy or our support team for
            guidance.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-5">
          <AccordionTrigger
            className="font-semibold text-base"
            iconOpen={<AiOutlineMinus className="text-gray-700" />}
            iconClosed={<AiOutlinePlus className="text-gray-700" />}
          >
            Do you have insurance covered?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed px-2 pb-4">
            Yes, travel insurance is included in our packages to provide you
            peace of mind during your journey.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default RoomFAQ;
