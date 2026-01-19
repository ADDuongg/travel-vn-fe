import dayjs from 'dayjs';

export const caculateSalePrice = (price: number, salePercent: number) => {
  return price - (price * salePercent) / 100;
};

export function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}

export function compareByKey<T>(a: T, b: T, key: keyof T, desc: boolean) {
  const av = a[key];
  const bv = b[key];

  // number
  if (typeof av === 'number' && typeof bv === 'number') {
    return desc ? bv - av : av - bv;
  }

  // thử parse ISO date (travelDate)
  if (typeof av === 'string' && typeof bv === 'string') {
    const at = Date.parse(av);
    const bt = Date.parse(bv);
    if (!Number.isNaN(at) && !Number.isNaN(bt)) {
      return desc ? bt - at : at - bt;
    }
    // fallback string
    return desc ? bv.localeCompare(av) : av.localeCompare(bv);
  }

  return 0;
}

export function diffInNights(checkIn: Date, checkOut: Date): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function toDateOnly(value?: string | Date) {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value.toLocaleDateString('en-CA'); // YYYY-MM-DD
  }

  return value; // đã là string
}

export const fmtDate = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(iso))
    : '-';
export const formatDate = (
  date?: string | Date,
  format = 'DD/MM/YYYY',
): string => {
  if (!date) return '-';
  return dayjs(date).format(format);
};
export const fmtMoney = (amount: number, currency = 'VND') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);

const PAYMENT_EXPIRE_MINUTES = 60;

export function getPaymentExpireAt(createdAt: string) {
  return new Date(
    new Date(createdAt).getTime() + PAYMENT_EXPIRE_MINUTES * 60 * 1000,
  );
}

export function getRemainingTime(expireAt: Date) {
  const diff = expireAt.getTime() - Date.now();
  if (diff <= 0) return null;

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return { minutes, seconds };
}
