import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-0 shadow-[var(--shadow-card)]">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-7 w-11/12 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
      </div>
    </Card>
  );
}

