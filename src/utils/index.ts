export const caculateSalePrice = (price: number, salePercent: number) => {
  return price - (price * salePercent) / 100;
};

export function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}
