import React from 'react';
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
import { ResponsiveH6 } from './ui/typography';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineMinus } from 'react-icons/ai';

const durations = [
  { label: 'Any', value: 'Any' },
  { label: '1-3 days', value: '1-3' },
  { label: '4-7 days', value: '4-7' },
  { label: '8+ days', value: '8+' },
];
const months = [
  { label: 'Any', value: 'Any' },
  { label: 'Jan', value: 'Jan' },
  { label: 'Feb', value: 'Feb' },
  { label: 'Mar', value: 'Mar' },
  { label: 'Apr', value: 'Apr' },
  { label: 'May', value: 'May' },
  { label: 'Jun', value: 'Jun' },
  { label: 'Jul', value: 'Jul' },
  { label: 'Aug', value: 'Aug' },
  { label: 'Sep', value: 'Sep' },
  { label: 'Oct', value: 'Oct' },
  { label: 'Nov', value: 'Nov' },
  { label: 'Dec', value: 'Dec' },
];
const ages = [
  { label: '10+', value: '10' },
  { label: '12+', value: '12' },
  { label: '15+', value: '15' },
];
const activities = [
  { label: 'City Tours', value: 'city' },
  { label: 'Cultural & Thematic Tours', value: 'cultural' },
  { label: 'Family Friendly Tours', value: 'family' },
  { label: 'Holiday & Seasonal Tours', value: 'holiday' },
  { label: 'Indulgence & Luxury Tours', value: 'luxury' },
];
const destinations = [
  { label: 'America', value: 'america' },
  { label: 'Asia', value: 'asia' },
  { label: 'Egypt', value: 'egypt' },
  { label: 'Scandinavia', value: 'scandinavia' },
  { label: 'South Africa', value: 'southafrica' },
];

export type FilterValues = {
  keyword: string;
  duration: string;
  date: string;
  month: string;
  minPrice: string;
  maxPrice: string;
  rating: number;
  ages: string[];
  activities: string[];
  destinations: string[];
};

interface Props {
  onFilter?: (values: FilterValues) => void;
  onClear?: () => void;
}

const FilterComponent: React.FC<Props> = ({ onFilter, onClear }) => {
  const methods = useForm<FilterValues>({
    defaultValues: {
      keyword: '',
      duration: '',
      date: '',
      month: '',
      minPrice: '',
      maxPrice: '',
      rating: 2,
      ages: [],
      activities: [],
      destinations: [],
    },
  });

  const handleSubmit = methods.handleSubmit(onFilter || (() => {}));

  return (
    <FormProvider {...methods}>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <CustomInput name="keyword" type="text" label="Keywords" />
        <CustomInput
          name="duration"
          type="select"
          className="w-full"
          label="Duration"
          options={durations}
        />
        <CustomInput name="date" type="date" label="Date" />
        <CustomInput
          name="month"
          type="select"
          classNameContainer="w-full"
          className="w-full"
          label="Month"
          options={months}
        />
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
              <ResponsiveH6>Tour Age</ResponsiveH6>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 mt-3">
                {ages.map((age) => (
                  <CustomInput
                    key={age.value}
                    name={`ages.${age.value}`}
                    type="checkbox"
                    label={age.label}
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
              <ResponsiveH6>Activity</ResponsiveH6>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 mt-3">
                {activities.map((act) => (
                  <CustomInput
                    key={act.value}
                    name={`activities.${act.value}`}
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

        <Accordion type="single" collapsible defaultValue="destination">
          <AccordionItem value="destination">
            <AccordionTrigger
              iconOpen={<AiOutlinePlus />}
              iconClosed={<AiOutlineMinus />}
              className="font-semibold text-base py-2 flex items-center gap-2"
            >
              <ResponsiveH6>Destination</ResponsiveH6>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 mt-3">
                {destinations.map((dest) => (
                  <CustomInput
                    key={dest.value}
                    name={`destinations.${dest.value}`}
                    type="checkbox"
                    label={dest.label}
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

export default FilterComponent;

