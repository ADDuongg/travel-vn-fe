import React from 'react';

const FoodStory: React.FC = () => {
  return (
    <section id="story" className="mt-6">
      <h2 className="text-xl font-bold mb-4">A Taste of Hanoi's Culinary Soul</h2>

      <div className="mt-4 space-y-4 text-paleGray leading-relaxed">
        <p>
          Bún Chả is more than just a dish; it's a sensory experience that
          defines the bustling streets of Vietnam's capital. Originating from
          Hanoi, this beloved meal consists of grilled fatty pork (<em>chả</em>)
          served over a plate of white rice noodles (<em>bún</em>) and fresh
          herbs with a side dish of warm dipping sauce.
        </p>
        <p>
          The dish has been a staple of Hanoi cuisine for centuries, traditionally
          enjoyed at lunchtime when the aroma of charcoal-grilled pork fills the
          narrow alleyways of the Old Quarter. Vendors fan the flames of their
          small grills right on the sidewalk, creating an irresistible smoky
          fragrance that draws locals and travelers alike.
        </p>
      </div>

      {/* Obama Story Highlight */}
      <div className="mt-8 rounded-xl bg-paleGray-100 p-6 border border-border">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
            🇺🇸
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">
              The Obama Moment
            </h4>
            <p className="text-paleGray leading-relaxed">
              In 2016, Bún Chả gained worldwide fame when President Barack Obama
              and Chef Anthony Bourdain shared a $6 meal at{' '}
              <strong className="text-foreground">Bún Chả Hương Liên</strong> in
              Hanoi. The episode aired on CNN's "Parts Unknown" and the
              restaurant has since preserved the exact table and chairs — now
              known as the "Obama Combo" — drawing food lovers from around the
              globe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodStory;
