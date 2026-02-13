import React, { createContext, useContext } from 'react';
import type { Tour } from '@/features/tours/catalog-types';

const TourDetailContext = createContext<Tour | null>(null);

export function TourDetailProvider({
  tour,
  children,
}: {
  tour: Tour | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <TourDetailContext.Provider value={tour ?? null}>
      {children}
    </TourDetailContext.Provider>
  );
}

export function useTourDetail() {
  return useContext(TourDetailContext);
}

export function useTourDetailRequired() {
  const tour = useTourDetail();
  if (!tour) throw new Error('useTourDetailRequired must be used within TourDetailProvider with a tour');
  return tour;
}
