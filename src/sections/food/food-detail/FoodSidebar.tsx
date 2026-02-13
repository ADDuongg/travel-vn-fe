import React from 'react';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsClockHistory } from 'react-icons/bs';

const nutritionInfo = [
  { label: 'Calories', value: '~450 kcal' },
  { label: 'Protein', value: '28g' },
  { label: 'Carbs', value: '52g' },
  { label: 'Fat', value: '14g' },
];

const tourIncludes = [
  'Visit 3 famous Bún Chả spots',
  'Local guide with food expertise',
  'Taste test & comparison session',
  'Learn the recipe from a local chef',
  'Cold drinks & dessert included',
];

const FoodSidebar: React.FC = () => {
  return (
    <div className="sticky top-[180px] space-y-6">
      {/* Book a Food Tour Card */}
      <div className="rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MdOutlineRestaurantMenu size={24} className="text-primary" />
          <h3 className="font-bold text-lg font-dm-serif-display">
            Hanoi Food Tour
          </h3>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold">$29</span>
          <span className="text-paleGray text-sm line-through">$45</span>
          <span className="text-xs text-primary font-semibold">35% OFF</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-paleGray mb-4">
          <BsClockHistory size={16} />
          <span>4 Hours · Small Group (max 8)</span>
        </div>

        <Separator className="my-4" />

        <h4 className="font-semibold text-sm mb-3">Tour Includes</h4>
        <ul className="space-y-2 mb-6">
          {tourIncludes.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-paleGray"
            >
              <AiOutlineCheck className="text-green-600 shrink-0" size={16} />
              {item}
            </li>
          ))}
        </ul>

        <Button className="w-full" size="lg">
          Book a Food Tour
        </Button>
        <p className="text-xs text-paleGray text-center mt-2">
          Free cancellation up to 24 hours before
        </p>
      </div>

      {/* Nutrition Info Card */}
      <div className="rounded-xl border border-border p-6">
        <h3 className="font-bold text-base mb-4">Nutrition per Serving</h3>
        <div className="grid grid-cols-2 gap-3">
          {nutritionInfo.map((item, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-paleGray-100">
              <div className="text-lg font-bold">{item.value}</div>
              <div className="text-xs text-paleGray">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodSidebar;
