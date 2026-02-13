import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Dip, Don't Pour",
    description:
      "Don't pour the sauce over the noodles. Instead, take a small bundle of bún (noodles) with your chopsticks and dip them into the bowl of warm broth with grilled meat.",
  },
  {
    number: 2,
    title: 'Add Fresh Herbs',
    description:
      'Tear the fresh herbs and lettuce into bite-sized pieces, then add them into the dipping bowl. The combination of grilled meat, herbs, and savory broth is the key to the authentic experience.',
  },
  {
    number: 3,
    title: 'Customize Your Spice',
    description:
      'Add fresh garlic slices and chili to the dipping sauce to customize the spice level to your liking. Many locals also add a dash of vinegar for extra tang.',
  },
  {
    number: 4,
    title: 'Enjoy with Nem (Optional)',
    description:
      'Order a side of Nem Rán (fried spring rolls) — the crispy texture pairs beautifully with the soft noodles and smoky pork. Dip them in the same sauce!',
  },
];

const FoodHowToEat: React.FC = () => {
  return (
    <section id="how-to-eat" className="mt-6">
      <h2 className="text-xl font-bold mb-6">How to Eat Like a Local</h2>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-5">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              {step.number}
            </div>
            <div className="pt-1">
              <h4 className="font-semibold text-base mb-1">{step.title}</h4>
              <p className="text-paleGray text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FoodHowToEat;
