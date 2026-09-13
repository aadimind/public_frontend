import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Paper } from "@/types";
import { CompactPaperCard } from "./CompactPaperCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

interface RelatedPapersProps {
  papers: Paper[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  title?: string;
 description?: string;
}

export function RelatedPapers({
  papers,
  isLoading,
  isError,
  title = "Continue exploring",
  description = "More research papers on related topics.",
}: RelatedPapersProps) {
  return (
    <section className="border-t border-border bg-bg-subtle py-12"
      aria-labelledby="related-papers-title"
    >
      <div className="container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              id="related-papers-title"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-fg-muted">{description}</p>
          </div>
          <Link
            to="/papers"
            className="hidden items-center gap-1 text-sm font-medium text-fg-muted transition-colors hover:text-fg sm:inline-flex"
          >
            Browse all papers
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 py-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Could not load related papers"
            description="Please try again later."
          />
        ) : !papers || papers.length === 0 ? (
          <EmptyState
            title="No related papers yet"
            description="Check back soon for more research explanations."
          />
        ) : (
          <div className="grid gap-0">
            {papers.map((paper) => (
              <CompactPaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
