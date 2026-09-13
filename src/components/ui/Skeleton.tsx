import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer bg-bg-muted",
        variant === "text" && "h-3 w-full rounded",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-md",
        className
      )}
      aria-hidden
    />
  );
}

export function PaperCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg p-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="h-5 w-5" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
