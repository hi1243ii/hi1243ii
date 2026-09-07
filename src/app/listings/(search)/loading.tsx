import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="mt-2 h-5 w-1/4" />
      </div>
    </Card>
  );
}

export default function ListingsSearchLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col gap-6 py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="hidden h-[calc(100vh-8.5rem)] border-l border-border lg:block">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
    </div>
  );
}
