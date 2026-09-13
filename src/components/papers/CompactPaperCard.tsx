import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Paper } from "@/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CompactPaperCardProps {
  paper: Paper;
  className?: string;
}

export function CompactPaperCard({ paper, className }: CompactPaperCardProps) {
  return (
    <Link
      to={`/papers/${paper.slug}`}
      className={cn(
        "group flex items-start gap-4 border-b border-border py-4 last:border-b-0",
        "transition-colors hover:bg-bg-subtle",
        className
      )}
    >
      <div className="flex-1 space-y-1.5">
        <h4 className="font-display text-base font-semibold leading-snug tracking-tight text-fg group-hover:underline group-hover:underline-offset-4">
          {paper.title}
        </h4>
        <p className="text-sm text-fg-muted line-clamp-2">
          {paper.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-fg-subtle">
          <span>{paper.category.name}</span>
          <span>•</span>
          <time dateTime={paper.publishedAt}>
            {formatDate(paper.publishedAt, { year: "numeric", month: "short", day: "numeric" })}
          </time>
          <span>•</span>
          <span>{paper.readingTime} min</span>
        </div>
      </div>
      <ArrowUpRight
        className="mt-1 h-4 w-4 flex-shrink-0 text-fg-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
        aria-hidden
      />
    </Link>
  );
}
