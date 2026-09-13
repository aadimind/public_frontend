import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Paper } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { PaperMeta } from "./PaperMeta";
import { cn, truncate } from "@/lib/utils";
import { formatDifficulty } from "@/lib/format";

interface PaperCardProps {
  paper: Paper;
  variant?: "default" | "compact";
  className?: string;
}

export function PaperCard({ paper, variant = "default", className }: PaperCardProps) {
  return (
    <Link
      to={`/papers/${paper.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-border bg-bg p-5",
        "transition-all duration-200 hover:border-border-strong",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        variant === "compact" && "p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs text-fg-muted">
        <Badge variant="subtle" size="sm">
          {paper.category.name}
        </Badge>
        {paper.difficulty !== undefined && (
          <Badge variant="outline" size="sm">
            {formatDifficulty(paper.difficulty)}
          </Badge>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-fg group-hover:underline group-hover:underline-offset-4">
        {paper.title}
      </h3>

      {paper.subtitle && variant === "default" && (
        <p className="text-sm leading-relaxed text-fg-muted">
          {truncate(paper.subtitle, 140)}
        </p>
      )}

      {variant === "default" && (
        <p className="text-sm leading-relaxed text-fg-muted">
          {truncate(paper.description, 180)}
        </p>
      )}

      <PaperMeta
        paper={paper}
        showAuthors={variant === "default"}
        showDate
        showReadingTime
        showDifficulty={false}
      />

     <div className="mt-auto flex items-center justify-between pt-2">
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="outline" size="sm">
              {tag.name}
            </Badge>
          ))}
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-fg-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
          aria-hidden
        />
      </div>
    </Link>
  );
}
