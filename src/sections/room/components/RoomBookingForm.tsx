import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaDoorOpen, FaUserFriends } from 'react-icons/fa';
import { BsLightningFill } from 'react-icons/bs';
import React, { useState } from 'react';
import CustomInput from '@/components/CustomInput';
import { Select, SelectTrigger, SelectContent } from '@components/ui/select';

type RoomBookingValues = {
  checkIn: string;
  checkOut: string;
  room: string;
  guests: string;
};

const RoomBookingForm: React.FC = () => {
  const methods = useForm<RoomBookingValues>({
    defaultValues: {
      checkIn: '',
      checkOut: '',
      room: '1',
      guests: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [guests, setGuests] = useState({ adults: 1, children: 0 });

  const updateGuests = (key: 'adults' | 'children', value: number) => {
    setGuests((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (data: RoomBookingValues) => {
    console.log('Room booking submitted:', {
      ...data,
      guests,
    });
  };

  const IconWithLine = ({ icon }: { icon: React.ReactNode }) => (
    <div className="relative flex justify-center text-blue-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[10px] bg-gray-300" />
      <div className="relative z-10 bg-white">{icon}</div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Check In */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<AiOutlineCalendar size={22} />} />
          <CustomInput
            name="checkIn"
            type="date"
            className="w-full"
            size="lg"
            label="Check In"
            rules={{ required: 'Please select check-in date' }}
          />
        </div>

        {/* Check Out */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<AiOutlineCalendar size={22} />} />
          <CustomInput
            name="checkOut"
            type="date"
            className="w-full"
            size="lg"
            label="Check Out"
            rules={{ required: 'Please select check-out date' }}
          />
        </div>

        {/* Room */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<FaDoorOpen size={20} />} />
          <CustomInput
            name="room"
            type="select"
            className="w-full"
            size="lg"
            label="Room"
            options={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
            ]}
            rules={{ required: 'Please select room number' }}
          />
        </div>

        {/* Guests (custom) */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-start">
          <IconWithLine icon={<FaUserFriends size={20} />} />

          <Select>
            <SelectTrigger
              size={'lg'}
              label={'Guests'}
              required
              className="w-full border rounded-md px-3 py-2 text-sm text-left"
            >
              <span className="text-sm font-medium">
                Adult {guests.adults} - Children {guests.children}
              </span>
            </SelectTrigger>
            <SelectContent className="!p-0 w-[--radix-select-trigger-width]">
              <div className="p-4 space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Adults</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateGuests('adults', Math.max(1, guests.adults - 1))
                      }
                    >
                      −
                    </Button>
                    <span className="w-6 text-center">{guests.adults}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateGuests('adults', guests.adults + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <hr />
                {/* Children */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Children</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateGuests(
                          'children',
                          Math.max(0, guests.children - 1),
                        )
                      }
                    >
                      −
                    </Button>
                    <span className="w-6 text-center">{guests.children}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateGuests('children', guests.children + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <div className="grid grid-cols-[32px_1fr] gap-3 items-center">
          <IconWithLine icon={<BsLightningFill size={20} />} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Book Now'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RoomBookingForm;
