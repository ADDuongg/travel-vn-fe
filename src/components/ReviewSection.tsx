import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import CustomInput from '@components/CustomInput';
import { Ratings } from '@components/ui/rating';
import { Separator } from '@components/ui/separator';

interface Review {
  id: number;
  name: string;
  role?: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewSectionProps {
  reviews: Review[];
}

const sortOptions = [
  { label: 'Rating (High → Low)', value: 'rating_desc' },
  { label: 'Rating (Low → High)', value: 'rating_asc' },
  { label: 'Date (Newest First)', value: 'date_desc' },
  { label: 'Date (Oldest First)', value: 'date_asc' },
];

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: '5 Stars', value: '5' },
  { label: '4 Stars', value: '4' },
  { label: '3 Stars', value: '3' },
  { label: '2 Stars', value: '2' },
  { label: '1 Star', value: '1' },
];

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  const methods = useForm({
    defaultValues: { sortBy: 'date_desc', filterBy: 'all' },
  });
  const { watch } = methods;
  const { sortBy, filterBy } = watch();

  // sort & filter logic (tạm local, chưa cần api)
  const sortedReviews = React.useMemo(() => {
    let data = [...reviews];

    if (filterBy !== 'all') {
      data = data.filter((r) => r.rating === Number(filterBy));
    }

    if (sortBy === 'rating_desc') data.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'rating_asc') data.sort((a, b) => a.rating - b.rating);
    if (sortBy === 'date_desc')
      data.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (sortBy === 'date_asc')
      data.sort((a, b) => +new Date(a.date) - +new Date(b.date));

    return data;
  }, [reviews, sortBy, filterBy]);

  return (
    <FormProvider {...methods}>
      <section className="mt-6">
        {/* Header Sort */}
        <div className="flex flex-wrap items-center justify-between border-b pb-3 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Ratings rating={4.8} readOnly size={16} variant="yellow" />
            <span className="text-gray-500">{reviews.length} Reviews</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span className="font-semibold">Sort By:</span>
            <CustomInput
              name="sortBy"
              type="select"
              options={sortOptions}
              className="w-44"
            />
            <CustomInput
              name="filterBy"
              type="select"
              options={filterOptions}
              className="w-28"
            />
          </div>
        </div>

        {/* Reviews */}
        {sortedReviews.map((r) => (
          <div key={r.id} className="py-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {r.avatarUrl ? (
                  <img
                    src={r.avatarUrl}
                    alt={r.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">👤</span>
                )}
              </div>

              {/* Nội dung */}
              <div className="flex-1">
                <div className="font-bold">{r.name}</div>
                <div className="text-sm text-gray-500">{r.role}</div>

                <p className="mt-3 text-gray-700 leading-relaxed">
                  {r.comment}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <Ratings
                    rating={r.rating}
                    readOnly
                    size={16}
                    variant="yellow"
                  />
                  <span className="text-gray-500 text-sm">{r.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </FormProvider>
  );
};
export default ReviewSection;
