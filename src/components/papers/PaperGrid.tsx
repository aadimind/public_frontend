import type { Paper } from "@/types";
import { PaperCard } from "./PaperCard";
import { PaperCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

interface PaperGridProps {
  papers: Paper[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  columns?: 2 | 3;
}

export function PaperGrid({
  papers,
  isLoading,
  isError,
  errorMessage,
  emptyTitle = "No papers found",
  emptyDescription = "Try adjusting your filters or search query.",
  onRetry,
  columns = 3,
}: PaperGridProps) {
  if (isError) {
    return (
      <ErrorState
        title="Could not load papers"
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (isLoading && papers.length === 0) {
    return (
      <div
        className={`grid gap-5 ${
          columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <PaperCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!papers || papers.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div
      className={`grid gap-5 ${
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
      }`}
    >
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  );
}
