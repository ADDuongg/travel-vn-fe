import React from 'react';
import { Link } from 'react-router-dom';

interface RelatedDish {
  name: string;
  nameVi: string;
  image: string;
  slug: string;
  location: string;
}

const relatedDishes: RelatedDish[] = [
  {
    name: 'Phở Hà Nội',
    nameVi: 'Phở Bò / Phở Gà',
    image:
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80',
    slug: 'pho-ha-noi',
    location: 'Hanoi',
  },
  {
    name: 'Nem Rán (Fried Spring Rolls)',
    nameVi: 'Nem Rán Hà Nội',
    image:
      'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=80',
    slug: 'nem-ran',
    location: 'Hanoi',
  },
  {
    name: 'Bánh Mì',
    nameVi: 'Bánh Mì Việt Nam',
    image:
      'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=400&q=80',
    slug: 'banh-mi',
    location: 'Ho Chi Minh City',
  },
  {
    name: 'Bún Bò Huế',
    nameVi: 'Bún Bò Huế',
    image:
      'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80',
    slug: 'bun-bo-hue',
    location: 'Hue',
  },
];

const FoodRelated: React.FC = () => {
  return (
    <section id="related" className="mt-6">
      <h2 className="text-xl font-bold mb-6">Related Vietnamese Dishes</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {relatedDishes.map((dish, index) => (
          <Link
            to={`/food/${dish.slug}`}
            key={index}
            className="group rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm font-dm-serif-display truncate">
                {dish.name}
              </h4>
              <p className="text-xs text-paleGray mt-0.5">{dish.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FoodRelated;

