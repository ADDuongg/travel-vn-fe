import React from 'react';
import { GiMeat, GiNoodles, GiHerbsBundle } from 'react-icons/gi';
import { LuCupSoda } from 'react-icons/lu';

interface Ingredient {
  icon: React.ReactNode;
  name: string;
  nameVi: string;
  description: string;
}

const ingredients: Ingredient[] = [
  {
    icon: <GiMeat size={32} className="text-primary" />,
    name: 'The Chả (Pork)',
    nameVi: 'Chả Nướng',
    description:
      'Marinated pork neck and hand-shaped ground pork patties, grilled over fragrant charcoal until caramelized.',
  },
  {
    icon: <GiNoodles size={32} className="text-primary" />,
    name: 'The Bún (Noodles)',
    nameVi: 'Bún Tươi',
    description:
      'Fresh, thin rice vermicelli noodles — soft, slightly chewy, and perfectly tangled on the plate.',
  },
  {
    icon: <GiHerbsBundle size={32} className="text-primary" />,
    name: 'Fresh Herbs',
    nameVi: 'Rau Sống',
    description:
      'Thai basil, cilantro, perilla, mint, and lettuce — the essential crunch that balances the richness.',
  },
  {
    icon: <LuCupSoda size={32} className="text-primary" />,
    name: 'Dipping Sauce',
    nameVi: 'Nước Chấm',
    description:
      'A warm, sweet-sour blend of fish sauce, sugar, lime juice, vinegar, garlic, and chili with pickled green papaya.',
  },
];

const FoodIngredients: React.FC = () => {
  return (
    <section id="ingredients" className="mt-6">
      <h2 className="text-xl font-bold mb-6">Essential Ingredients</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ingredients.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 p-5 rounded-xl border border-border bg-background hover:shadow-md transition-shadow"
          >
            <div className="shrink-0 w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <h4 className="font-semibold text-base">{item.name}</h4>
              <span className="text-xs text-primary font-medium">
                {item.nameVi}
              </span>
              <p className="text-paleGray text-sm mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FoodIngredients;

