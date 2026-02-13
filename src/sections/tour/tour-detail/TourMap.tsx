import React from 'react';
import { Card } from '@/components/ui/card';

const TourMap: React.FC = () => {
  return (
    <section id="map" className="mt-10">
      <Card className="p-6 rounded-2xl overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Journey Route</h2>
        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=xxxx"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Journey route map"
          />
        </div>
      </Card>
    </section>
  );
};

export default TourMap;
