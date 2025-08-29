import { EnumDisplayItem } from '@/constants/commons';
import CustomInput from '@components/CustomInput';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AiOutlineAppstore, AiOutlineBars } from 'react-icons/ai';

const sortOptions = [
  { label: 'Descending', value: 'descending' },
  { label: 'Ascending', value: 'ascending' },
];

const sortByOptions = [
  { label: 'Realease Date', value: 'release_date' },
  { label: 'Duration', value: 'duration' },
  { label: 'Title', value: 'title' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price', value: 'price' },
  { label: 'Rating', value: 'rating' },
];
const DisplayItemType: React.FC<{
  displayType: EnumDisplayItem;
  setDisplayType: (type: EnumDisplayItem) => void;
}> = ({ displayType, setDisplayType }) => {
  const form = useForm({
    defaultValues: {
      sort: 'descending',
      sortBy: 'release_date',
    },
  });
  const handleSubmit = form.handleSubmit((data) => {
    console.log('data', data);
  });
  return (
    <div className="border border-[#e1e1e1] rounded-md p-4 flex justify-between items-center">
      <div className="flex gap-5 items-center ">
        <span>Sort by</span>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <CustomInput
              type="select"
              className="border-0"
              options={sortByOptions}
              name="sortBy"
            />
            <CustomInput
              type="select"
              className="border-0"
              options={sortOptions}
              name="sort"
            />
          </form>
        </FormProvider>
      </div>
      <div className="flex gap-2 items-center">
        <AiOutlineBars
          className={`cursor-pointer ${
            displayType === 'flex' ? 'text-blue-500' : 'text-gray-400'
          }`}
          size={24}
          onClick={() => setDisplayType(EnumDisplayItem.FLEX)}
        />
        <AiOutlineAppstore
          className={`cursor-pointer ${
            displayType === 'grid' ? 'text-blue-500' : 'text-gray-400'
          }`}
          size={24}
          onClick={() => setDisplayType(EnumDisplayItem.GRID)}
        />
      </div>
    </div>
  );
};

export default DisplayItemType;
