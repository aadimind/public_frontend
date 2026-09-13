import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface LoadMoreProps {
  hasMore?: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function LoadMore({
  isLoading,
  onLoadMore,
  className,
}: LoadMoreProps) {
  return (
    <div className={className}>
      <Button
        variant="outline"
        size="lg"
        fullWidth
        onClick={onLoadMore}
        isLoading={isLoading}
        rightIcon={<ChevronRight className="h-4 w-4" />}
      >
        Load more
      </Button>
    </div>
  );
}

interface PageNavigationProps {
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  className?: string;
}

export function PageNavigation({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  className,
}: PageNavigationProps) {
  return (
    <div className={`flex items-center justify-between gap-2 ${className ?? ""}`}>
      <Button
        variant="outline"
        size="md"
        onClick={onPrev}
        disabled={!canPrev}
        leftIcon={<ChevronLeft className="h-4 w-4" />}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="md"
        onClick={onNext}
        disabled={!canNext}
        rightIcon={<ChevronRight className="h-4 w-4" />}
      >
        Next
      </Button>
    </div>
  );
}
