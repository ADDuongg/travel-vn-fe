import React from 'react';
import { BsArrowReturnRight } from 'react-icons/bs';

const TourExpect: React.FC = () => {
  return (
    <section id="expect" className="mt-10">
      <h2 className="text-xl font-bold mb-4">What to Expect</h2>
      <div className="space-y-4 text-gray-700 leading-relaxed mb-6">
        <p>A wonderful serenity has taken possession of my entire soul...</p>
      </div>
      <ul className="space-y-3 text-gray-800">
        <li className="flex items-center gap-2">
          <BsArrowReturnRight size={20} className="text-green-600" /> View the
          City Walls
        </li>
        <li className="flex items-center gap-2">
          <BsArrowReturnRight size={20} className="text-green-600" /> Hiking in
          the forest
        </li>
        <li className="flex items-center gap-2">
          <BsArrowReturnRight size={20} className="text-green-600" /> Discover
          “The Lark”
        </li>
        <li className="flex items-center gap-2">
          <BsArrowReturnRight size={20} className="text-green-600" /> Sunset on
          the cruise
        </li>
      </ul>
    </section>
  );
};

export default TourExpect;
