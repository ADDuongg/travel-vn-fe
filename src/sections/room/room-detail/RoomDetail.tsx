import React from 'react';
import { Separator } from '@components/ui/separator';

const RoomDetail: React.FC = () => {
  return (
    <section id="room-detail" className="mt-6">
      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl text-black">From</span>
          <span className="text-gray-400 line-through text-lg">€82.80</span>
          <span className="text-2xl font-bold text-black">€69.00</span>
        </div>
        <p className="text-gray-500 text-md">per night</p>
      </div>

      <Separator className="my-6" />

      {/* Description */}
      <div className="space-y-4 text-paleGray leading-relaxed">
        <p>
          Far far away, behind the word mountains, far from the countries
          Vokalia and Consonantia, there live the blind texts. Separated they
          live in Bookmarksgrove right at the coast of the Semantics, a large
          language ocean. A small river named Duden flows by their place and
          supplies it with the necessary regelialia. It is a paradisematic
          country, in which roasted parts of sentences fly into your mouth. Even
          the all-powerful Pointing has no control about the blind texts it is
          an almost unorthographic life One day however a small line of blind
          text by the name of Lorem Ipsum decided to leave for the far World of
          Grammar.
        </p>
        <p>
          The Big Oxmox advised her not to do so, because there were thousands
          of bad Commas, wild Question Marks and devious Semikoli, but the
          Little Blind Text didn’t listen. She packed her seven versalia, put
          her initial into the belt and made herself on the way. When she
          reached the first hills of the Italic Mountains, she had a last view
          back on the skyline of her hometown
        </p>
      </div>
    </section>
  );
};

export default RoomDetail;
