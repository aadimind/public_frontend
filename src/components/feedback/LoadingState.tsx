import { Skeleton, PaperCardSkeleton } from "@/components/ui/Skeleton";

export function LoadingState() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PaperCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
