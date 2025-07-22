import React from 'react';
import CustomInput from '@/components/CustomInput';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@components/ui/button';
import { AiOutlineSend } from 'react-icons/ai';
import Container from '@/layout/Container';
export const DiscoverDeal: React.FC = () => {
  const methods = useForm();

  const onSubmit = (data: any) => {
    // handle subscribe logic here
    alert(`Subscribed: ${data.email}`);
  };

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Left: Special Deals */}
        <div className="relative rounded-xl overflow-hidden flex flex-col justify-center min-h-[320px] bg-gray-100">
          <img
            src="/images/destination5.png"
            alt="Special Deals"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ filter: 'brightness(0.7)' }}
          />
          <div className="relative z-10 py-8 px-12 flex flex-col items-start justify-center h-full text-center">
            <h2 className="font-dm-serif-display text-white text-3xl md:text-4xl font-bold mb-4">
              Discover Special Deals!
            </h2>
            <p className="text-white text-lg mb-6">
              Make sure to check out these special promotions
            </p>
            <Button className=" text-white font-semibold px-6 py-2 shadow transition">
              See Tours
            </Button>
          </div>
        </div>
        {/* Right: Newsletter */}
        <div className="bg-gray-100 rounded-xl flex flex-col justify-center p-8 min-h-[320px]">
          <h2 className="font-dm-serif-display text-gray-900 text-2xl md:text-3xl font-bold mb-4">
            Don’t miss a thing
          </h2>
          <p className="text-gray-600 mb-2">
            Get update to special deals and exclusive offers.
            <br />
            Sign up to our newsletter!
          </p>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mt-4"
            >
              <div className="flex items-center bg-white rounded-full pl-4 pr-0 py-0 h-[50px] shadow w-full">
                <span className="text-gray-400 flex items-center justify-center mr-2">
                  <AiOutlineSend className="cursor-pointer" />
                </span>
                <CustomInput
                  name="email"
                  type="text"
                  placeholder="Your Email Address"
                  className="flex-1 border-none justify-center shadow-none bg-transparent p-0 text-base focus:ring-0 focus:outline-none"
                  style={{ minWidth: 0 }}
                />
                <Button
                  type="submit"
                  className=" text-white px-8 py-2 rounded-full transition text-[12px]"
                >
                  SUBSCRIBE
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Container>
  );
};
