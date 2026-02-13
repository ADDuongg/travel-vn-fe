import React from 'react';
import { MdOutlineLocationOn } from 'react-icons/md';
import { Ratings } from '@components/ui/rating';

interface Restaurant {
  name: string;
  address: string;
  description: string;
  rating: number;
  priceRange: string;
  highlight?: string;
  image: string;
}

const restaurants: Restaurant[] = [
  {
    name: 'Bún Chả Hương Liên',
    address: '24 Lê Văn Hưu, Hai Bà Trưng, Hanoi',
    description:
      'The legendary "Obama Bún Chả" — where President Obama and Anthony Bourdain dined in 2016. The original table is now preserved behind glass.',
    rating: 4.7,
    priceRange: '40,000 – 60,000 VND',
    highlight: 'Obama Combo',
    image:
      'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80',
  },
  {
    name: 'Bún Chả Đắc Kim',
    address: '1 Hàng Mành, Hoàn Kiếm, Hanoi',
    description:
      'A decades-old institution in the Old Quarter. Known for perfectly charred patties and a rich, balanced dipping sauce.',
    rating: 4.5,
    priceRange: '35,000 – 55,000 VND',
    image:
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
  },
  {
    name: 'Bún Chả Hàng Quạt',
    address: '74 Hàng Quạt, Hoàn Kiếm, Hanoi',
    description:
      'Tucked in a quiet alley, this spot is a local favorite for its generous portions and smoky, sweet dipping broth.',
    rating: 4.4,
    priceRange: '30,000 – 50,000 VND',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  },
];

const FoodWhereToTry: React.FC = () => {
  return (
    <section id="where-to-try" className="mt-6">
      <h2 className="text-xl font-bold mb-6">Where to Try in Hanoi</h2>

      <div className="space-y-5">
        {restaurants.map((restaurant, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-border hover:shadow-md transition-shadow"
          >
            <div className="shrink-0 w-full sm:w-40 h-32 rounded-lg overflow-hidden">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-base font-dm-serif-display">
                  {restaurant.name}
                </h4>
                {restaurant.highlight && (
                  <span className="shrink-0 inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold">
                    {restaurant.highlight}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Ratings
                  rating={restaurant.rating}
                  variant="yellow"
                  totalStars={5}
                  readOnly
                  size={12}
                />
                <span className="text-xs text-paleGray">
                  {restaurant.rating}
                </span>
              </div>
              <div className="flex items-center gap-1 text-paleGray text-xs mb-2">
                <MdOutlineLocationOn size={14} />
                <span>{restaurant.address}</span>
              </div>
              <p className="text-paleGray text-sm leading-relaxed">
                {restaurant.description}
              </p>
              <div className="mt-2 text-xs font-medium text-foreground">
                Price: {restaurant.priceRange}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FoodWhereToTry;
