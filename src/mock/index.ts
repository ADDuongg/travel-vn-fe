import type { FreshlyTourItem } from '@components/CardWithRating';
import iconEarth from '/images/icon-earth.png';
import iconSupport from '/images/icon-like-money.png';
import iconCustomer from '/images/icon-customer.png';
import type { TourItem } from '@components/TourCard';
import destination1 from '/images/destination1.png';
import destination2 from '/images/destination2.png';
import destination3 from '/images/destination3.png';
import destination4 from '/images/destination4.png';
import destination5 from '/images/destination5.png';
import destination6 from '/images/destination6.png';

export const freshlyTours: FreshlyTourItem[] = [
  {
    id: 1,
    name: 'Africa – Amazing African Safari',
    image: '/images/destination1.png',
    price: 100,
    bestSeller: true,
    review_number: 1,
    rate: 5,
  },
  {
    id: 2,
    name: 'Dubai – All Stunning Places',
    image: '/images/destination2.png',
    price: 1200,
    bestSeller: true,
    review_number: 1,
    rate: 5,
  },
  {
    id: 3,
    name: 'Venice, Rome and Milan – 9 Days',
    image: '/images/destination3.png',
    price: 4300,
    sale_price: 3500,
    bestSeller: true,
    review_number: 1,
    rate: 5,
  },
  {
    id: 4,
    name: 'Enquiry Form Only – Paris – 6 Days',
    image: '/images/destination4.png',
    price: 3700,
    sale_price: 2000,
    bestSeller: true,
    review_number: 1,
    rate: 5,
  },
  {
    id: 1,
    name: 'Africa – Amazing African Safari',
    image: '/images/destination1.png',
    price: 100,
    bestSeller: true,
    review_number: 1,
    rate: 5,
  },
  {
    id: 1,
    name: 'Africa – Amazing African Safari',
    image: '/images/destination1.png',
    price: 100,
    bestSeller: true,
    review_number: 1,
    rate: 5,
  },
];

export const feedbacks = [
  {
    name: 'David Doe',
    role: 'Traveler',
    location: 'San Francisco',
    avatar: '/images/avatar1.png',
    rating: 5,
    feedback:
      'The tours in this website are great. I had been really enjoy with my family! The team is very professional and taking care of the customers. Will surely recommend to my freind to join this company!',
  },
  {
    name: 'Brittany Clark',
    role: 'San Francisco',
    location: 'San Francisco',
    avatar: '/images/avatar2.png',
    rating: 5,
    feedback:
      'The tours in this website are great. I had been really enjoy with my family! The team is very professional and taking care of the customers. Will surely recommend to my freind to join this company!',
  },
  {
    name: 'Frances Hill',
    role: 'San Francisco',
    location: 'San Francisco',
    avatar: '/images/avatar3.png',
    rating: 5,
    feedback:
      'The tours in this website are great. I had been really enjoy with my family! The team is very professional and taking care of the customers. Will surely recommend to my freind to join this company!',
  },
];

export const services = [
  {
    icon: iconEarth,
    title: '700 Destinations',
    desc: 'Our expert team handpicked all destinations in this site',
  },
  {
    icon: iconSupport,
    title: 'Best Price Gurantee',
    desc: 'Price match within 48 hours of order confirmation',
  },
  {
    icon: iconCustomer,
    title: 'Top Notch Support',
    desc: 'We are here to help, before, during, and even after your trip.',
  },
];

export const ToursItem: TourItem[] = [
  {
    id: 1,
    name: 'Western Europe',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination1,
    price: 1500,
    tour_number: 10,
    sale_percent: 10,
    duration: '10 days',
    bestSeller: true,
    hasSpecialOffer: true,
    review_number: 10,
    rate: 4.5,
  },
  {
    id: 2,
    name: 'Western Europe2',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination2,
    price: 1500,
    tour_number: 11,
    hasSpecialOffer: true,
    duration: '10 days',
    review_number: 10,
    rate: 4.5,
  },
  {
    id: 3,
    name: 'Western Europe',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination3,
    price: 1500,
    tour_number: 10,
    sale_percent: 10,
    duration: '10 days',
    review_number: 10,
    rate: 4.5,
  },
  {
    id: 4,
    name: 'Western Europe',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination4,
    price: 1500,
    tour_number: 10,
    sale_percent: 10,
    review_number: 10,
    rate: 4.5,
  },
  {
    id: 5,
    name: 'Western Europe',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination5,
    price: 1500,
    tour_number: 10,
    sale_percent: 10,
    bestSeller: true,
    duration: '10 days',
    hasSpecialOffer: true,
    review_number: 10,
    rate: 4.5,
  },
  {
    id: 6,
    name: 'Western Europe',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination6,
    price: 1500,
    tour_number: 10,
    sale_percent: 10,
    review_number: 10,
    rate: 4.5,
  },
];

export const DestinationItem = [
  {
    id: 1,
    name: 'Western Europe',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination1,
    tour_number: 10,
  },
  {
    id: 2,
    name: 'Western Europe1',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination2,
    tour_number: 20,
  },
  {
    id: 3,
    name: 'Western Europe2',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination3,
    tour_number: 30,
  },
  {
    id: 4,
    name: 'Western Europe3',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination4,
    tour_number: 40,
  },
  {
    id: 5,
    name: 'Western Europe4',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination5,
    tour_number: 50,
  },
  {
    id: 6,
    name: 'Western Europe5',
    description:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,…',
    image: destination6,
    tour_number: 60,
  },
];
