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
