export const bookingKeys = {
  all: ['bookings'] as const,
  list: (filters: unknown) => [...bookingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};
