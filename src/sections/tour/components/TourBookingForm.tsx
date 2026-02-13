import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/CustomInput';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaUserGroup } from 'react-icons/fa6';
import { BsLightningFill } from 'react-icons/bs';
import type { Tour } from '@/features/tours/catalog-types';

type BookingFormValues = {
  date: string;
  people: string;
};

const TourBookingForm = ({ tour: _tour }: { tour?: Tour | null }) => {
  const methods = useForm<BookingFormValues>({
    defaultValues: {
      date: '',
      people: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: BookingFormValues) => {
    console.log('Booking form submitted:', data);
  };

  // component nhỏ để tái sử dụng cho icon + line
  const IconWithLine = ({ icon }: { icon: React.ReactNode }) => (
    <div className="relative flex justify-center text-blue-500">
      {/* line chạy từ trên xuống icon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[10px] bg-gray-300" />
      <div className="relative z-10 bg-white">{icon}</div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Date row */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-start">
          <IconWithLine icon={<AiOutlineCalendar size={24} />} />
          <div className="pl-3">
            <p className="text-gray-800 font-medium">February 1, 2030</p>
          </div>
        </div>

        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <div className="flex flex-col items-center text-blue-500"></div>
          <div className="pl-3">
            <p className="text-xs text-gray-400">Available: 0 seats</p>
          </div>
        </div>
        {/* People row */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<FaUserGroup size={24} />} />
          <div className="pl-3">
            <CustomInput
              name="people"
              type="select"
              className="w-full"
              size={'lg'}
              placeHolder="Select number of people"
              label=""
              options={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
              ]}
              rules={{ required: 'Please select number of people' }}
            />
          </div>
        </div>

        {/* Button row - Explore Vietnam yellow CTA */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<BsLightningFill size={24} />} />
          <div className="pl-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Proceed Booking'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default TourBookingForm;
