import React from 'react';

const TourMap: React.FC = () => {
  return (
    <section id="map" className="mt-10">
      <h2 className="text-xl font-bold mb-4">Map</h2>
      <div className="w-full h-[500px]">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=xxxx"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
};

export default TourMap;
