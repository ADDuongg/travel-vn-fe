import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import CustomInput from './CustomInput';
import { Ratings } from './ui/rating';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion';
import { FaSlidersH } from 'react-icons/fa';
import { Label } from './ui/label';
import {
  ResponsiveH3,
  ResponsiveH4,
  ResponsiveH5,
  ResponsiveH6,
} from './ui/typography';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineMinus } from 'react-icons/ai';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { ChevronDownIcon } from 'lucide-react';

const facilities = [
  { label: 'Air Conditioning', value: 'air_condition' },
  { label: 'Elevator', value: 'elevator' },
  { label: 'Parking', value: 'parking' },
  { label: 'Pool', value: 'pool' },
  { label: 'Restroom', value: 'restroom' },
  { label: 'Smoking Area', value: 'smoking_area' },
  { label: 'WiFi', value: 'wifi' },
  { label: 'Washroom', value: 'washroom' },
  { label: 'Wheelchair Accessible', value: 'wheelchair_accessible' },
];
const roomSize = [
  { label: '20 m²', value: '20' },
  { label: '25 m²', value: '25' },
  { label: '30 m²', value: '30' },
  { label: '35 m²', value: '35' },
  { label: '40 m²', value: '40' },
  { label: '45 m²', value: '45' },
];

export type FilterValues = {
  keyword: string;
  duration: string;
  date: string;
  month: string;
  minPrice: string;
  maxPrice: string;
  rating: number;
  facilities: string[];
  roomSize: string[];
  destinations: string[];
};

interface Props {
  onFilter?: (values: FilterValues) => void;
  onClear?: () => void;
}

const FilterRoomComponent: React.FC<Props> = ({ onFilter, onClear }) => {
  const [roomCount, setRoomCount] = useState(5);

  const handleChange = (val: number) => {
    setRoomCount(Math.max(1, val));
  };
  const methods = useForm<FilterValues>({
    defaultValues: {
      keyword: '',
      duration: '',
      date: '',
      month: '',
      minPrice: '',
      maxPrice: '',
      rating: 2,
      facilities: [],
      roomSize: [],
      destinations: [],
    },
  });

  const handleSubmit = methods.handleSubmit(onFilter || (() => {}));
  const [guests, setGuests] = useState({ adults: 1, children: 0 });

  const updateGuests = (key: 'adults' | 'children', value: number) => {
    setGuests((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <FormProvider {...methods}>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <ResponsiveH5>Check Availability</ResponsiveH5>
        <CustomInput name="check_in" type="date" label="Check in" />
        <CustomInput name="check_out" type="date" label="Check out" />
        <div className="flex gap-2 w-full">
          <CustomInput
            className="w-full"
            name="minPrice"
            type="text"
            label="Min Price"
          />
          <CustomInput
            className="w-full"
            name="maxPrice"
            type="text"
            label="Max Price"
          />
        </div>
        <CustomInput
          name="roomCount"
          type="custom-input"
          label="Room"
          render={({}) => {
            return (
              <Select>
                <SelectTrigger
                  classNameContainer="w-full"
                  className=" w-full flex items-center bg-white"
                >
                  {roomCount}
                </SelectTrigger>
                <SelectContent className="p-4 w-auto">
                  <div className="flex justify-between items-center gap-2">
                    <span className="uppercase text-sm tracking-wide font-semibold">
                      Room
                    </span>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChange(roomCount - 1)}
                      >
                        −
                      </Button>
                      <ResponsiveH6 className="font-medium">
                        {roomCount}
                      </ResponsiveH6>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChange(roomCount + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </SelectContent>
              </Select>
            );
          }}
        />
        <Select>
          <SelectTrigger
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
                      updateGuests('children', Math.max(0, guests.children - 1))
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
        <div>
          <label className="font-semibold">Rating</label>
          <Ratings
            rating={methods.watch('rating')}
            onRate={(r) => methods.setValue('rating', r)}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          className="text-blue-500 w-fit"
          onClick={onClear}
        >
          Clear Filter
        </Button>
        <hr />
        <Accordion type="single" collapsible defaultValue="tour-age">
          <AccordionItem value="tour-age">
            <AccordionTrigger
              iconOpen={<AiOutlinePlus />}
              iconClosed={<AiOutlineMinus />}
              className="font-semibold text-base py-2 flex items-center gap-2"
            >
              <ResponsiveH6>Facilities</ResponsiveH6>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 mt-3">
                {facilities.map((facilitie) => (
                  <CustomInput
                    key={facilitie.value}
                    name={`facilities.${facilitie.value}`}
                    type="checkbox"
                    label={facilitie.label}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible defaultValue="activity">
          <AccordionItem value="activity">
            <AccordionTrigger
              iconOpen={<AiOutlinePlus />}
              iconClosed={<AiOutlineMinus />}
              className="font-semibold text-base py-2 flex items-center gap-2"
            >
              <ResponsiveH6>Room Size</ResponsiveH6>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 mt-3">
                {roomSize.map((act) => (
                  <CustomInput
                    key={act.value}
                    name={`roomSize.${act.value}`}
                    type="checkbox"
                    label={act.label}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="link"
                className="text-blue-500 px-0"
              >
                More
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" className="mt-4 w-full bg-blue-500 text-white">
          SEARCH
        </Button>
      </form>
    </FormProvider>
  );
};

export default FilterRoomComponent;
